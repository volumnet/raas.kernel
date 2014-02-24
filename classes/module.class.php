<?php
/**
 * Файл абстрактного модуля RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */       
namespace RAAS;

/**
 * Класс абстрактного модуля RAAS
 * @package RAAS
 * @property-read \RAAS\Package $parent объект родительского пакета
 * @property-read \RAAS\Abstract_Module_Controller $controller контроллер модуля
 * @property-read \RAAS\Abstract_Module_View $view представление модуля
 * @property \RAAS\Updater $updater мастер обновлений
 */       
abstract class Module extends \SOME\Singleton implements IRightsContext
{
    /**
     * Контроллер модуля
     * @var \RAAS\Abstract_Module_Controller     
     */         
    protected $controller;
    
    /**
     * Массив наименований требуемых расширений
     * @var array
     */              
    protected static $requiredExtensions = array();
    
    /**
     * Экземпляр класса
     * @var \RAAS\Module     
     */         
    protected static $instance;
    
    public function __get($var)
    {
        switch ($var) {
            // MVC
            case 'application':
                return $this->package->application;
                break;
            case 'package': case 'parent':
                $classname = implode('\\', array_slice(\SOME\Namespaces::getNSArray(\get_called_class()), 0, -1)) . '\\Package';
                return $classname::i();
                break;
            case 'controller':
                return $this->controller;
                break;
            case 'view':
                return $this->controller->view;
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
            case 'baseDir': case 'systemDir':
                return $this->package->baseDir . '/' . $this->alias;
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
            case 'baseFilesDir': case 'filesDir':
                $dir = $this->parent->baseFilesDir . '/' . $this->alias;
                if (!is_dir($dir)) {
                    @mkdir($dir, 0777, true);
                }
                return $dir;
                break;
            case 'baseFilesURL': case 'filesURL':
                return $this->parent->baseFilesURL . '/' . $this->alias;
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
                return $NS[1] . '.' . $NS[2];
                break;
            case 'mid':
                return strtolower($this->Mid);
                break;
            case 'alias':
                $NS = \SOME\Namespaces::getNSArray(\get_called_class());
                return strtolower($NS[2]);
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
                return defined('static::version') ? static::version : date('Y-m-d', filemtime($this->classesDir . '/module.class.php'));
                break;
            case 'versionTime':
                return defined('static::version') ? strtotime($this->version) : filemtime($this->classesDir . '/module.class.php');
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
    
    
    public function init()
    {
        spl_autoload_register(array($this, 'autoload'));
        $classname = \SOME\Namespaces::getNS(\get_called_class()) . '\\' . \SOME\Namespaces::getClass($this->application->controller);
        if (class_exists($classname)) {
            $this->controller = $classname::i();
            $this->install();
        } else {
            return false;
            //throw new Exception($this->application->view->_('INVALID_CONTROLLER_FOR_MODULE'));
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
        return $this->application->registryGet($var, $this);
    }


    public function registrySet($var, $val)
    {
        return $this->application->registrySet($var, $val, $this);
    }


    public function install()
    {
        if (!$this->registryGet('installDate')) {
            $u = $this->updater;
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
        $SQL_query = str_replace('{$PACKAGENAME$}', $this->package->alias, $SQL_query);
        $SQL_query = str_replace('{$MODULENAME$}', $this->alias, $SQL_query);
        return $SQL_query;
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
        if ($myNS == $NS) {
            $rdi = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($this->classesDir));
            foreach ($rdi as $f) {
                if (($f->getFileName() == strtolower($classname) . '.class.php') || ($f->getFileName() == strtolower($classname) . '.interface.php')) {
                    require_once $f->getPathName();
                    break;
                }
            }
            if (!class_exists($class, false) && !interface_exists($class, false)) {
                if (is_file($this->classesDir . '/' . strtolower($classname) . '.class.php')) {
                    require_once ($this->classesDir . '/' . strtolower($classname) . '.class.php');
                } elseif (is_file($this->classesDir . '/' . strtolower($classname) . '.interface.php')) {
                    require_once ($this->classesDir . '/' . strtolower($classname) . '.interface.php');
                } elseif ($classname == 'Access') {
                    $callback = 'namespace %s; class %s extends \\RAAS\\Access {}';
                    eval(sprintf($callback, implode('\\', $NS), $classname));
                } elseif (preg_match('/^Controller_(.*?)?$/i', $classname, $regs)) {
                    $callback = 'namespace %s; class %s extends \%s\Abstract_Controller { protected static $instance; public function __call($name, $args){} }';
                    eval(sprintf($callback, implode('\\', $NS), $classname, implode('\\', $NS)));
                } elseif (preg_match('/^View_Chunk?$/i', $classname, $regs)) {
                    $callback = ' namespace %s;
                                  class View_Chunk extends \\RAAS\\Module_View_Chunk {
                                      protected static $instance; 
                                      public function __call($name, $args) { 
                                          $this->assignVars(isset($args[0]) ? $args[0] : array());
                                          $this->template = $name; 
                                      }
                                  }';
                    eval(sprintf($callback, implode('\\', $NS)));
                } elseif (preg_match('/^View_(.*?)?$/i', $classname, $regs)) {
                    $callback = ' namespace %s;
                                  class %s extends \RAAS\Module_View_%s {
                                      protected static $instance; public function __call($name, $args) { $this->assignVars(isset($args[0]) ? $args[0] : array()); }
                                  }';
                    eval(sprintf($callback, implode('\\', $NS), $classname, $regs[1]));
                }
            }
        }
    }
}