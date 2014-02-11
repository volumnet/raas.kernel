<?php
/**
 * Файл абстрактного представления абстрактного подмодуля RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */       
namespace RAAS;

/**
 * Класс абстрактного представления абстрактного подмодуля RAAS
 * @package RAAS
 * @property-read \RAAS\Sub $module ссылка на экземпляр подмодуля
 * @property-read \RAAS\Sub $model ссылка на экземпляр подмодуля
 * @property-read \RAAS\Abstract_Package_View $parent ссылка на экземпляр активного представления пакета
 */       
abstract class Abstract_Sub_View extends \SOME\Singleton
{
    /**
     * Экземпляр класса
     * @var \RAAS\Abstract_Sub_View     
     */         
    protected static $instance;
    
    /**
     * Экземпляр стандартного модуля представления
     * @var \RAAS\View_StdSub
     */
    protected $_stdView;
    
    public function __get($var)
    {
        switch ($var) {
            // MVC
            case 'module':
                $NSArray = \SOME\Namespaces::getNSArray($this);
                if (count($NSArray) >= 3) {
                    $classname = implode('\\', array_slice($NSArray, 0, 3)) . '\\Module';
                    return $classname::i();
                }
                break;
            case 'package':
                $NSArray = \SOME\Namespaces::getNSArray($this);
                if (count($NSArray) >= 2) {
                    $classname = implode('\\', array_slice($NSArray, 0, 2)) . '\\Package';
                    return $classname::i();
                }
                break;
            case 'model':
                if ($this->module) {
                    return $this->module;
                } elseif ($this->package) {
                    return $this->package;
                }
                break;
            case 'url':
                return $this->model->controller->url . '&sub=' . $this->sub;
                break;
            case 'parent':
                return $this->model->view;
                break;
            case 'stdView':
                if (!$this->_stdView) {
                    $this->_stdView = new View_StdSub($this);
                }
                return $this->_stdView;
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


    public function __call($f, $args)
    {
        return call_user_func_array(array($this->parent, $f), $args);
    }
}