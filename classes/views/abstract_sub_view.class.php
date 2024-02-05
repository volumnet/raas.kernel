<?php
/**
 * Файл абстрактного представления абстрактного подмодуля RAAS
 */
declare(strict_types=1);

namespace RAAS;

use SOME\Namespaces;
use SOME\Singleton;

/**
 * Класс абстрактного представления абстрактного подмодуля RAAS
 * @property-read IRightsContext $module ссылка на экземпляр подмодуля
 * @property-read IRightsContext $model ссылка на экземпляр подмодуля
 * @property-read Abstract_Package_View $parent ссылка на экземпляр активного представления пакета
 */       
abstract class Abstract_Sub_View extends Singleton
{
    /**
     * Экземпляр класса
     * @var Abstract_Sub_View
     */         
    protected static $instance;
    
    /**
     * Экземпляр стандартного модуля представления
     * @var View_StdSub
     */
    protected $_stdView;
    
    public function __get($var)
    {
        switch ($var) {
            // MVC
            case 'module':
                $NSArray = Namespaces::getNSArray($this);
                if (count($NSArray) >= 3) {
                    $classname = implode('\\', array_slice($NSArray, 0, 3)) . '\\Module';
                    return $classname::i();
                }
                break;
            case 'package':
                $NSArray = Namespaces::getNSArray($this);
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
