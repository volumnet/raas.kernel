<?php
/**
 * Файл абстрактного модуля RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */
namespace RAAS;

use ReflectionClass;
use SOME\File;
use SOME\Namespaces;
use SOME\Singleton;
use RAAS\Application;
use RAAS\Abstract_Module_Controller;
use RAAS\Abstract_Module_View;
use RAAS\Package;
use RAAS\Updater;

/**
 * Класс абстрактного модуля RAAS
 * @package RAAS
 * @property-read Package $parent объект родительского пакета
 * @property-read Abstract_Module_Controller $controller контроллер модуля
 * @property-read Abstract_Module_View $view представление модуля
 * @property-read Updater $updater мастер обновлений
 * @property-read array $composer Содержимое файла composer.json
 */
abstract class Module extends Singleton implements IRightsContext
{
    use ContextTrait;

    /**
     * Экземпляр класса
     * @var Module
     */
    protected static $instance;

    public function __get($var)
    {
        switch ($var) {
            // MVC
            case 'package':
            case 'parent':
                $classname = Namespaces::getNS(static::class, 0, -1)
                           . '\\Package';
                return $classname::i();
                break;

            // Файлы и директории
            case 'baseDir':
                return $this->systemDir;
                break;
            case 'baseFilesDir':
            case 'filesDir':
                $dir = $this->parent->baseFilesDir . '/' . $this->alias;
                if (!is_dir($dir)) {
                    @mkdir($dir, 0777, true);
                }
                return $dir;
                break;
            case 'baseFilesURL':
            case 'filesURL':
                return $this->parent->baseFilesURL . '/' . $this->alias;
                break;

            // Модель
            case 'alias':
                $ns = Namespaces::getNSArray(static::class);
                return strtolower($ns[2]);
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
            default:
                if ($val = $this->parent->$var) {
                    return $val;
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
                    $sqlQuery = $this->prepareSQL($sqlQuery);
                    $this->SQL->query($sqlQuery);
                }
            }
            if ($u) {
                $u->postInstall();
            }
            $this->SQL->add($this->dbprefix . "registry", [
                'm' => $this->mid,
                'name' => 'installDate',
                'value' => date('Y-m-d H:i:s'),
                'locked' => 1
            ]);
            $this->registrySet('baseVersion', $this->version);
            $this->registrySet('isActive', 1);
        }
    }


    public function prepareSQL($sqlQuery)
    {
        $sqlQuery = strtr($sqlQuery, [
            '{$DBPREFIX$}' => $this->dbprefix,
            '{$PACKAGENAME$}' => $this->package->alias,
            '{$MODULENAME$}' => $this->alias,
        ]);
        return $sqlQuery;
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
                } elseif (preg_match('/^Controller_(.*?)?$/i', $classname, $regs)) {
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
                } elseif (preg_match('/^View_Chunk?$/i', $classname, $regs)) {
                    eval('
                        namespace ' . $ns . ';

                        class View_Chunk extends \\RAAS\\Module_View_Chunk
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

                        class ' . $classname . ' extends \RAAS\Module_' . $classname . '
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
}
