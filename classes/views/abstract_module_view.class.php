<?php
/**
 * Файл абстрактного представления абстрактного модуля RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */       
namespace RAAS;

/**
 * Класс абстрактного представления абстрактного модуля RAAS
 * @package RAAS
 * @property-read \RAAS\Module $module ссылка на экземпляр модуля
 * @property-read \RAAS\Module $model ссылка на экземпляр модуля
 * @property-read \RAAS\Abstract_Package_View $parent ссылка на экземпляр активного представления пакета
 */       
abstract class Abstract_Module_View extends \SOME\Singleton implements IAbstract_Context_View
{
    /**
     * Ссылка на папку переводов
     */         
    const langDir = 'languages';
    
    /**
     * Массив переводов
     * @var array     
     */         
    protected $translations;
    
    /**
     * Экземпляр класса
     * @var \RAAS\Abstract_Module_View     
     */         
    protected static $instance;
    
    public function __get($var)
    {
        switch ($var) {
            // MVC
            case 'application':
                return $this->package->application;
                break;
            case 'package':
                return $this->module->package;
                break;
            case 'module': case 'model':
                $classname = \SOME\Namespaces::getNS($this) . '\\Module';
                return $classname::i();
                break;
            case 'parent':
                return $this->package->view;
                break;
            
            // Файлы и папки
            case 'languagesDir':
                return realpath(__DIR__ . '/../../languages');
                break;
            
            case 'versionName':
                return ($this->_('__VERSION') && ($this->_('__VERSION') != '__VERSION')) ? $this->_('__VERSION') : '';
                break;

            case 'url':
                return '?p=' . $this->package->alias . '&m=' . $this->module->alias;
                break;
            default:
                return $this->parent->$var;
                break;
        }
    }
    
    public function __set($var, $val)
    {
        switch ($var) {
            default:
                $this->parent->$var = $val;
                break;
        }
    }
    
    
    /**
     * Конструктор класса
     */         
    protected function init()
    {
        if (is_file($this->module->languagesDir . '/' . $this->language . '.ini')) {
            $this->translations = parse_ini_file($this->module->languagesDir . '/' . $this->language . '.ini');
        }
    }
    
    
    public function _($var)
    {
        if (isset($this->translations[$var])) {
            return $this->translations[$var];
        } else {
            return $this->parent->_($var);
        }
    }
    
    
    public function exportLang()
    {
        foreach ((array)$this->translations as $key => $val) {
            $name = implode('\\', array_slice(\SOME\Namespaces::getNSArray($this), 1)) . '\\' . $key;
            if (!defined($name)) {
                define($name, $val);
            }
        }
    }
    
    
    public function assignVars(array $IN)
    {
        return $this->parent->assignVars($IN);
    }
}