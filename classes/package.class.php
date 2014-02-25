<?php
/**
 * Файл абстрактного пакета RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */       
namespace RAAS;

/**
 * Класс абстрактного пакета RAAS
 * @package RAAS
 * @property-read \RAAS\Application $parent объект приложения
 * @property-read \RAAS\Abstract_Package_Controller $controller контроллер пакета
 * @property-read \RAAS\Abstract_Package_View $view представление пакета
 * @property-read array(\RAAS\Module) $modules массив загруженных модулей
 * @property \RAAS\Module $activeModule активный модуль
 * @property \RAAS\Updater $updater мастер обновлений
 */       
abstract class Package extends \SOME\Singleton implements IRightsContext
{
    /**
     * Контроллер пакета
     * @var \RAAS\Abstract_Package_Controller     
     */         
    protected $controller = array();
    
    /**
     * Массив загруженных модулей пакета
     * @var array
     */
    protected $modules = array();
    
    /**
     * Массив наименований требуемых расширений
     * @var array
     */              
    protected static $requiredExtensions = array();
    
    /**
     * Экземпляр класса
     * @var \RAAS\Package     
     */         
    protected static $instance;
    
    public function __get($var)
    {
        switch ($var) {
            // MVC
            case 'application': case 'parent':
                return Application::i();
                break;
            case 'controller':
                return $this->controller;
                break;
            case 'view':
                return $this->controller->view;
                break;
            case 'modules': case 'activeModule':
                return isset($this->$var) ? $this->$var : null;
                break;
            case 'updater':
                $NS = \SOME\Namespaces::getNS($this);
                $classname = $NS . '\\Updater';
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
                return $this->resourcesDir . '/install.' . (string)$this->application->dbtype . '.sql';
                break;
            case 'uninstallFile':
                return $this->resourcesDir . '/uninstall.' . (string)$this->application->dbtype . '.sql';
                break;
            
            // Модель
            case 'Mid':
                $NS = \SOME\Namespaces::getNSArray(\get_called_class());
                return $NS[1];
                break;
            case 'mid':
                return strtolower($this->Mid);
                break;
            case 'alias':
                $NS = \SOME\Namespaces::getNSArray(\get_called_class());
                return strtolower($NS[1]);
                break;
            case 'phpVersionCompatible':
                return (version_compare(static::requiredPHPVersion, phpversion()) <= 0);
                break;
            case 'missedExt':
                $ext_loaded = array_values(array_map('trim', get_loaded_extensions()));
                return array_values(array_diff(static::$requiredExtensions, $ext_loaded));
                break;
            case 'isCompatible':
                return $this->phpVersionCompatible && !$this->missedExt;
                break;
            case 'version':
                return defined('static::version') ? static::version : date('Y-m-d', filemtime($this->classesDir . '/package.class.php'));
                break;
            case 'versionTime':
                return defined('static::version') ? strtotime($this->version) : filemtime($this->classesDir . '/package.class.php');
                break;
            case 'levels':
                return Level::getSet(array('where' => array(array("m = ?", $this->mid))));
                break;
            case 'defaultLevel':
                $l = $this->registryGet('defaultLevel');
                $L = new Level((int)$l);
                if (($L instanceof Level) && (get_class($L->Context) == get_class($this))) {
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
        spl_autoload_register(array($this, 'autoload'));
        $classname = \SOME\Namespaces::getNS(\get_called_class()) . '\\' . \SOME\Namespaces::getClass($this->application->controller);
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
            $this->updater;
            $SQL_query = (is_file($this->installFile) ? file_get_contents($this->installFile) : "");
            if ($SQL_query) {
                $this->SQL->query($this->prepareSQL($SQL_query));
            }
            $this->SQL->add($this->dbprefix . "registry", array('m' => $this->mid, 'name' => 'installDate', 'value' => date('Y-m-d H:i:s'), 'locked' => 1));
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
            $SQL_query = "DELETE FROM " . $this->dbprefix . "registry WHERE m = ? \r\n";
            $this->SQL->query(array($SQL_query, $this->mid));
            if ($SQL_query = (is_file($this->uninstallFile) ? (file_get_contents($this->uninstallFile) . "\r\n") : "")) {
                $this->SQL->query($this->prepareSQL($SQL_query));
            }
            if ($deleteFiles) {
                \SOME\File::unlink($this->baseDir);
            }
            $this->registrySet('installDate', null);
            $this->registrySet('isActive', null);
        }
    }

    public function prepareSQL($SQL_query)
    {
        $SQL_query = str_replace('{$DBPREFIX$}', $this->dbprefix, $SQL_query);
        $SQL_query = str_replace('{$PACKAGENAME$}', $this->alias, $SQL_query);
        return $SQL_query;
    }


    /**
     * Инициализация загруженных модулей
     */
    public function initModules()
    {
        $p = $this;
        $callback = function($x) use ($p) { return $x[0] != '.' && ($x != 'common') && is_dir($p->baseDir . '/' . $x); };
        $modules = \SOME\File::scandir($this->baseDir, $callback);
        foreach ($modules as $module) {
            if (class_exists($classname = \SOME\Namespaces::getNS(\get_called_class()) . '\\' . ucfirst($module) . '\\Module')) {
                $this->modules[$module] = $classname::i();
            }
        }
    }
    
    
    public function access(IOwner $Owner = null)
    {
        if ($Owner === null) {
            $Owner = $this->application->user;
        }
        $NS = \SOME\Namespaces::getNSArray(\get_called_class());
        $classname = implode('\\', $NS) . '\\Access';
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
        $myNS = \SOME\Namespaces::getNSArray(\get_called_class());
        $NS = \SOME\Namespaces::getNSArray($class);
        $classname = \SOME\Namespaces::getClass($class);
        if (array_slice($NS, 0, count($myNS)) == $myNS) {
            if (isset($NS[2])) {
                $m = $NS[2];
                if (is_file($this->baseDir . '/' . strtolower($m) . '/classes/module.class.php')) {
                    require_once ($this->baseDir . '/' . strtolower($m) . '/classes/module.class.php');
                    $classname = implode('\\', $NS) . '\\Module';
                    $classname::i();
                }
            } else {
                $rdi = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($this->classesDir));
                foreach ($rdi as $f) {
                    if (($f->getFileName() == strtolower($classname) . '.class.php') || ($f->getFileName() == strtolower($classname) . '.interface.php')) {
                        require_once $f->getPathName();
                        break;
                    }
                }
                if (!class_exists($class, false) && !interface_exists($class, false)) {
                    if ($classname == 'Access') {
                        $callback = 'namespace %s; class %s extends \\RAAS\\Access {}';
                        eval(sprintf($callback, implode('\\', $NS), $classname));
                    } elseif (preg_match('/^Controller_(.*?)?$/i', $classname)) {
                        $callback = 'namespace %s; class %s extends \%s\Abstract_Controller { protected static $instance; public function __call($name, $args){} }';
                        eval(sprintf($callback, implode('\\', $NS), $classname, implode('\\', $NS)));
                    } elseif (preg_match('/^View_Chunk?$/i', $classname, $regs)) {
                        $callback = ' namespace %s;
                                      class View_Chunk extends \\RAAS\\Package_View_Chunk {
                                          protected static $instance; 
                                          public function __call($name, $args) { 
                                              $this->assignVars(isset($args[0]) ? $args[0] : array());
                                              $this->template = $name; 
                                          }
                                      }';
                        eval(sprintf($callback, implode('\\', $NS)));
                    } elseif (preg_match('/^View_(.*?)?$/i', $classname, $regs)) {
                        $callback = ' namespace %s;
                                      class %s extends \RAAS\Package_View_%s {
                                          protected static $instance; public function __call($name, $args) { $this->assignVars(isset($args[0]) ? $args[0] : array()); }
                                      }';
                        eval(sprintf($callback, implode('\\', $NS), $classname, $regs[1]));
                    }
                }
            }
        }
    }
}