<?php
/**
 * Файл абстрактного пакета RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */
namespace RAAS;

use ReflectionClass;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SOME\File;
use SOME\Namespaces;
use SOME\Singleton;

/**
 * Класс абстрактного пакета RAAS
 * @package RAAS
 * @property-read Application $parent объект приложения
 * @property-read Abstract_Package_Controller $controller контроллер пакета
 * @property-read Abstract_Package_View $view представление пакета
 * @property-read [Module] $modules массив загруженных модулей
 * @property Module $activeModule активный модуль
 * @property-read Updater $updater мастер обновлений
 * @property-read array $composer Содержимое файла composer.json
 */
abstract class Package extends Singleton implements IRightsContext
{
    use ContextTrait;

    /**
     * Массив загруженных модулей пакета
     * @var array
     */
    protected $modules = [];

    /**
     * Активный модуль
     * @var Module
     */
    protected $activeModule = null;

    /**
     * Экземпляр класса
     * @var Package
     */
    protected static $instance;

    public function __get($var)
    {
        switch ($var) {
            // MVC
            case 'parent':
                return Application::i();
                break;

            // Файлы и директории
            case 'baseDir':
                return realpath($this->systemDir . '/..');
                break;
            case 'baseFilesDir':
                $dir = Application::i()->baseFilesDir . '/' . $this->alias;
                if (!is_dir($dir)) {
                    @mkdir($dir, 0777, true);
                }
                return $dir;
                break;
            case 'filesDir':
                $dir = $this->baseFilesDir . '/common';
                if (!is_dir($dir)) {
                    @mkdir($dir, 0777, true);
                }
                return $dir;
                break;
            case 'baseFilesURL':
                return Application::i()->baseFilesURL . '/' . $this->alias;
                break;
            case 'filesURL':
                return $this->baseFilesURL . '/common';
                break;

            // Модель
            case 'alias':
                return $this->mid;
                break;
            case 'application':
            case 'composer':
            case 'requiredPHPVersion':
            case 'phpVersionCompatible':
            case 'requiredExtensions':
            case 'missedExt':
            case 'missedExtensions':
            case 'isCompatible':
            case 'version':
            case 'versionName':
            case 'systemDir':
            case 'classesDir':
            case 'languagesDir':
            case 'publicDir':
            case 'resourcesDir':
            case 'installFile':
            case 'levels':
            case 'defaultLevel':
            case 'hasRights':
            case 'mid':
            case 'updater':
            case 'controller':
            case 'view':
                return $this->getCommonContextVar($var);
                break;
            case 'modules':
            case 'activeModule':
                return isset($this->$var) ? $this->$var : null;
                break;
            default:
                if ($val = Application::i()->$var) {
                    return $val;
                }
                break;
        }
    }


    public function __set($var, $val)
    {
        switch ($var) {
            case 'activeModule':
                if ($val instanceof Module) {
                    $this->$var = $val;
                }
                break;
        }
    }


    public function init()
    {
        $this->registerDatatypes();
        $this->registerSources();
        spl_autoload_register([$this, 'autoload']);
        if ($this->SQL) {
            $this->install();
        }
        $this->initModules();
    }


    public function run()
    {
        $this->controller->run();
    }


    public function registryGet($var)
    {
        return Application::i()->registryGet($var, $this);
    }


    public function registrySet($var, $val)
    {
        return Application::i()->registrySet($var, $val, $this);
    }


    public function install()
    {
        if (!$this->registryGet('installDate') ||
            !$this->registryGet('baseVersion') ||
            ($this->registryGet('baseVersion') != $this->version)
        ) {
            $u = $this->updater;
            if ($u) {
                $u->preInstall();
            }
            if (is_file($this->installFile)) {
                $sqlQuery = file_get_contents($this->installFile);
                if ($sqlQuery) {
                    $this->SQL->query($this->prepareSQL($sqlQuery));
                }
            }
            if ($u) {
                $u->postInstall();
            }
            $this->SQL->add($this->dbprefix . "registry", [
                'm' => $this->mid,
                'name' => 'installDate',
                'value' => date('Y-m-d H:i:s'),
                'locked' => 1,
            ]);
            $this->registrySet('baseVersion', $this->version);
            $this->registrySet('isActive', 1);
        }
    }


    public function prepareSQL($sqlQuery)
    {
        $sqlQuery = strtr($sqlQuery, [
            '{$DBPREFIX$}' => $this->dbprefix,
            '{$PACKAGENAME$}' => $this->alias,
        ]);
        return $sqlQuery;
    }


    /**
     * Инициализация загруженных модулей
     */
    public function initModules()
    {
        $rxNamespace = '/^' . preg_quote(Namespaces::getNS(static::class), '/')
                     . '\\\\(\\w+)$/umi';
        $rxModule = '/^' . preg_quote(Namespaces::getNS(static::class), '/')
                  . '\\\\(\\w+)\\\\Module$/umi';

        // Ищем среди существующих классов
        foreach (get_declared_classes() as $classname) {
            if (preg_match($rxModule, $classname, $regs)) {
                $module = mb_strtolower($regs[1]);
                if (!isset($this->modules[$module])
                ) {
                    $this->modules[$module] = $classname::i();
                }
            }
        }

        // Ищем среди карты классов
        $classMapFile = Application::i()->baseDir
                      . '/vendor/composer/autoload_classmap.php';
        if (is_file($classMapFile)) {
            $classnames = include $classMapFile;
            $classnames = array_keys((array)$classnames);
            foreach ($classnames as $classname) {
                if (preg_match($rxModule, $classname, $regs)) {
                    $module = mb_strtolower($regs[1]);
                    if (!isset($this->modules[$module])) {
                        $this->modules[$module] = $classname::i();
                    }
                }
            }
        }

        // Ищем среди пространств имен
        $namespacesFiles = ['autoload_namespaces.php', 'autoload_psr4.php'];
        foreach ($namespacesFiles as $namespacesFile) {
            $namespacesFile = Application::i()->baseDir . '/vendor/composer/'
                            . $namespacesFile;
            if (is_file($namespacesFile)) {
                $namespaces = include $namespacesFile;
                $namespaces = array_keys((array)$namespaces);
                foreach ($namespaces as $namespace) {
                    $namespace = trim($namespace, '\\');
                    if (preg_match($rxNamespace, $namespace, $regs)) {
                        $classname = $namespace . '\\Module';
                        if (class_exists($classname)) {
                            $module = mb_strtolower($regs[1]);
                            if (!isset($this->modules[$module])) {
                                $this->modules[$module] = $classname::i();
                            }
                        }
                    }
                }
            }
        }

        // Старый вариант - для совместимости
        $modules = File::scandir($this->baseDir, function ($x) {
            return (
                ($x[0] != '.') &&
                ($x != 'common') &&
                is_dir($this->baseDir . '/' . $x)
            );
        });
        foreach ((array)$modules as $module) {
            $classname = Namespaces::getNS(static::class) . '\\'
                       . ucfirst($module) . '\\Module';
            if (class_exists($classname)) {
                $this->modules[$module] = $classname::i();
            }
        }
    }


    public function access(IOwner $Owner = null)
    {
        if ($Owner === null) {
            $Owner = Application::i()->user;
        }
        $classname = Namespaces::getNS(static::class) . '\\Access';
        return new $classname($Owner);
    }


    /**
     * Функция автозагрузки классов, чтобы не было необходимости переопределять
     * ключевые классы
     * @param string $class наименование класса с пространством имен
     */
    public function autoload($class)
    {
        $ns = Namespaces::getNS($class);
        if ($ns == Namespaces::getNS(static::class)) {
            if (!class_exists($class)) {
                $classname = Namespaces::getClass($class);
                if ($classname == 'Access') {
                    eval('
                        namespace ' . $ns . ';

                        class Access extends \\RAAS\\Access
                        {
                        }
                    ');
                } elseif (preg_match('/^Controller_(.*?)?$/umi', $classname)) {
                    eval('
                        namespace ' . $ns . ';

                        class ' . $classname . ' extends \\' . $ns . '\\Abstract_Controller
                        {
                            protected static $instance;

                            public function __call($name, $args)
                            {
                            }
                        }
                    ');
                } elseif (preg_match('/^View_Chunk$/i', $classname, $regs)) {
                    eval('
                        namespace ' . $ns . ';

                        class View_Chunk extends \\RAAS\\Package_View_Chunk
                        {
                            protected static $instance;

                            public function __call($name, $args)
                            {
                                $this->assignVars(isset($args[0]) ? $args[0] : []);
                                $this->template = $name;
                            }
                        }
                    ');
                } elseif (preg_match('/^View_(.*?)?$/i', $classname, $regs)) {
                    eval('
                        namespace ' . $ns . ';

                        class ' . $classname . ' extends \RAAS\Package_' . $classname . '
                        {
                            protected static $instance;

                            public function __call($name, $args)
                            {
                                $this->assignVars(isset($args[0]) ? $args[0] : []);
                            }
                        }
                    ');
                }
            }
        }
    }


    /**
     * Устанавливает порядки отображения для сущностей
     * @param string $classname Класс сущности
     * @param array<
     *            (int|string)[] ID# сущности => int Порядок отображения
     *        > $priorities Порядки отображения
     */
    public function setEntitiesPriority($classname, array $priorities = [])
    {
        foreach ($priorities as $key => $val) {
            $this->SQL->update($classname::_tablename(), "id = " . (int)$key, ['priority' => (int)$val]);
        }
    }
}
