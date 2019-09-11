<?php
/**
 * Файл абстрактного пакета RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */
namespace RAAS;

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
 * @property Updater $updater мастер обновлений
 */
abstract class Package extends Singleton implements IRightsContext
{
    /**
     * Контроллер пакета
     * @var Abstract_Package_Controller
     */
    protected $controller = [];

    /**
     * Массив загруженных модулей пакета
     * @var array
     */
    protected $modules = [];

    /**
     * Массив наименований требуемых расширений
     * @var array
     */
    protected static $requiredExtensions = [];

    /**
     * Экземпляр класса
     * @var Package
     */
    protected static $instance;

    public function __get($var)
    {
        switch ($var) {
            // MVC
            case 'application':
            case 'parent':
                return Application::i();
                break;
            case 'controller':
                return $this->controller;
                break;
            case 'view':
                return $this->controller->view;
                break;
            case 'modules':
            case 'activeModule':
                return isset($this->$var) ? $this->$var : null;
                break;
            case 'updater':
                $ns = Namespaces::getNS($this);
                $classname = $ns . '\\Updater';
                if (class_exists($classname)) {
                    $u = new $classname($this);
                    return $u;
                }
                break;

            // Файлы и директории
            case 'baseDir':
                return $this->application->modulesDir . '/' . $this->alias;
                break;
            case 'systemDir':
                return $this->baseDir . '/common';
                break;
            case 'classesDir':
                return $this->systemDir . '/classes';
                break;
            case 'languagesDir':
                return $this->systemDir . '/languages';
                break;
            case 'publicDir':
                return $this->systemDir . '/public';
                break;
            case 'baseFilesDir':
                $dir = $this->application->baseFilesDir . '/' . $this->alias;
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
                return $this->parent->baseFilesURL . '/' . $this->alias;
                break;
            case 'filesURL':
                return $this->baseFilesURL . '/common';
                break;
            case 'includeDir':
                return $this->systemDir . '/include';
                break;
            case 'resourcesDir':
                return $this->systemDir . '/resources';
                break;
            case 'installFile':
                return $this->resourcesDir . '/install.' .
                       (string)$this->application->dbtype . '.sql';
                break;
            case 'uninstallFile':
                return $this->resourcesDir . '/uninstall.' .
                       (string)$this->application->dbtype . '.sql';
                break;

            // Модель
            case 'Mid':
                $ns = Namespaces::getNSArray(static::class);
                return $ns[1];
                break;
            case 'mid':
                return strtolower($this->Mid);
                break;
            case 'alias':
                $ns = Namespaces::getNSArray(static::class);
                return strtolower($ns[1]);
                break;
            case 'phpVersionCompatible':
                $versionCompare = version_compare(
                    static::requiredPHPVersion,
                    phpversion()
                );
                return ($versionCompare <= 0);
                break;
            case 'missedExt':
                $extLoaded = array_map('trim', get_loaded_extensions());
                $extLoaded = array_values($extLoaded);
                $extDiff = array_diff(static::$requiredExtensions, $extLoaded);
                return array_values($extDiff);
                break;
            case 'isCompatible':
                return $this->phpVersionCompatible && !$this->missedExt;
                break;
            case 'version':
                if (defined('static::version')) {
                    $date = static::version;
                } else {
                    $t = filemtime($this->classesDir . '/package.class.php');
                    $date = date('Y-m-d', $t);
                }
                return $date;
                break;
            case 'versionTime':
                if (defined('static::version')) {
                    $t = strtotime(static::version);
                } else {
                    $t = filemtime($this->classesDir . '/package.class.php');
                }
                return $t;
                break;
            case 'levels':
                return Level::getSet(['where' => [["m = ?", $this->mid]]]);
                break;
            case 'defaultLevel':
                $l = $this->registryGet('defaultLevel');
                $L = new Level((int)$l);
                if (($L instanceof Level) &&
                    (get_class($L->Context) == get_class($this))
                ) {
                    return $L;
                } else {
                    return (int)$l;
                }
                break;
            case 'hasRights':
                return method_exists($this->controller, 'rights');
                break;
            default:
                if ($this->parent->$var) {
                    return $this->parent->$var;
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
        spl_autoload_register([$this, 'autoload']);
        $classname = Namespaces::getNS(static::class) . '\\'
                   . Namespaces::getClass($this->application->controller);
        if (class_exists($classname)) {
            $this->controller = $classname::i();
            if ($this->SQL) {
                $this->install();
            }
            $this->initModules();
        } else {
            return false;
            //throw new Exception($this->application->view->_('INVALID_CONTROLLER_FOR_PACKAGE'));
        }
    }


    public function run()
    {
        if ($this->controller) {
            $this->controller->run();
        }
    }


    public function registryGet($var)
    {
        return $this->parent->registryGet($var, $this);
    }


    public function registrySet($var, $val)
    {
        return $this->parent->registrySet($var, $val, $this);
    }


    public function install()
    {
        if (!$this->registryGet('installDate')) {
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
            if ($this->application->debug) {
                $this->registrySet('isActive', 1);
            }
        }
    }


    public function uninstall($deleteFiles = false)
    {
        if ($this->registryGet('installDate')) {
            foreach ($this->modules as $module) {
                $module->uninstall($deleteFiles);
            }
            $sqlQuery = "DELETE FROM " . $this->dbprefix . "registry
                          WHERE m = ? \r\n";
            $this->SQL->query([$sqlQuery, $this->mid]);

            if (is_file($this->uninstallFile)) {
                $sqlQuery = file_get_contents($this->uninstallFile);
                if ($sqlQuery) {
                    $this->SQL->query($this->prepareSQL($sqlQuery));
                }
            }
            if ($deleteFiles) {
                File::unlink($this->baseDir);
            }
            $this->registrySet('installDate', null);
            $this->registrySet('isActive', null);
        }
    }

    public function prepareSQL($sqlQuery)
    {
        $sqlQuery = str_replace('{$DBPREFIX$}', $this->dbprefix, $sqlQuery);
        $sqlQuery = str_replace('{$PACKAGENAME$}', $this->alias, $sqlQuery);
        return $sqlQuery;
    }


    /**
     * Инициализация загруженных модулей
     */
    public function initModules()
    {
        $p = $this;
        $callback = function ($x) use ($p) {
            if ($x[0] == '.') {
                return false;
            }
            if ($x == 'common') {
                return true;
            }
            if (!is_dir($p->baseDir . '/' . $x)) {
                return false;
            }
            return true;
        };
        $modules = File::scandir($this->baseDir, $callback);
        foreach ($modules as $module) {
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
            $Owner = $this->application->user;
        }
        $ns = Namespaces::getNSArray(static::class);
        $classname = implode('\\', $ns) . '\\Access';
        if (class_exists($classname)) {
            return new $classname($Owner);
        }
        return null;
    }


    /**
     * Функция автозагрузки классов
     * @param string $class наименование класса с пространством имен
     */
    public function autoload($class)
    {
        $myNS = Namespaces::getNSArray(static::class);
        $ns = Namespaces::getNSArray($class);
        $classname = Namespaces::getClass($class);
        if (array_slice($ns, 0, count($myNS)) == $myNS) {
            if (isset($ns[2])) {
                $m = $ns[2];
                $filename = $this->baseDir . '/' . strtolower($m)
                          . '/classes/module.class.php';
                if (is_file($filename)) {
                    require_once $filename;
                    $classname = implode('\\', $ns) . '\\Module';
                    $classname::i();
                }
            } else {
                $rdi = new RecursiveDirectoryIterator($this->classesDir);
                $rii = new RecursiveIteratorIterator($rdi);
                $possibleFilenames = [
                    strtolower($classname) . '.class.php',
                    strtolower($classname) . '.interface.php',
                    strtolower($classname) . '.trait.php',
                ];
                foreach ($rii as $f) {
                    $currentFileName = $f->getFileName();
                    if (in_array($currentFileName, $possibleFilenames)) {
                        require_once $f->getPathName();
                        break;
                    }
                }
                if (!class_exists($class, false) &&
                    !interface_exists($class, false)
                ) {
                    if ($classname == 'Access') {
                        $callback = 'namespace %s; '
                                  . 'class %s extends \\RAAS\\Access {}';
                        $callback = sprintf(
                            $callback,
                            implode('\\', $ns),
                            $classname
                        );
                        eval($callback);
                    } elseif (preg_match('/^Controller_(.*?)?$/i', $classname)) {
                        $callback = 'namespace %s; '
                                  . 'class %s extends \%s\Abstract_Controller { '
                                  . '    protected static $instance; '
                                  . '    public function __call($name, $args) '
                                  . '    {'
                                  . '    } '
                                  . '}';
                        $callback = sprintf(
                            $callback,
                            implode('\\', $ns),
                            $classname,
                            implode('\\', $ns)
                        );
                        eval($callback);
                    } elseif (preg_match('/^View_Chunk?$/i', $classname, $regs)) {
                        $callback = 'namespace %s; '
                                  . 'class View_Chunk extends \\RAAS\\Package_View_Chunk { '
                                  . '    protected static $instance; '
                                  . '    public function __call($name, $args) '
                                  . '    { '
                                  . '        $this->assignVars(isset($args[0]) ? $args[0] : []); '
                                  . '        $this->template = $name; '
                                  . '    } '
                                  . '}';
                        $callback = sprintf($callback, implode('\\', $ns));
                        eval($callback);
                    } elseif (preg_match('/^View_(.*?)?$/i', $classname, $regs)) {
                        $callback = 'namespace %s; '
                                  . 'class %s extends \RAAS\Package_View_%s { '
                                  . '    protected static $instance; '
                                  . '    public function __call($name, $args) { '
                                  . '        $this->assignVars(isset($args[0]) ? $args[0] : []); '
                                  . '    } '
                                  . '}';
                        $callback = sprintf(
                            $callback,
                            implode('\\', $ns),
                            $classname,
                            $regs[1]
                        );
                        eval($callback);
                    }
                }
            }
        }
    }
}
