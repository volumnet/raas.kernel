<?php
/**
 * @package RAAS
 */
namespace RAAS;

/**
 * Абстрактный контроллер подмодуля RAAS
 * @property-read \RAAS\Module $module ссылка на экземпляр модуля
 * @property-read \RAAS\Package $package ссылка на экземпляр пакета
 * @property-read \RAAS\Module|\RAAS\Package $model ссылка на экземпляр текущего пакета или модуля
 * @property-read \RAAS\Abstract_Module_Controller|\RAAS\Abstract_Package_Controller $parent ссылка на экземпляр активного контроллера пакета или модуля
 * @property \RAAS\Abstract_Sub_View $view ссылка на экземпляр текущего представления подмодуля
 */
abstract class Abstract_Sub_Controller extends \SOME\Singleton
{
    /**
     * Ссылка на экземпляр текущего представления подмодуля
     * @var \RAAS\Abstract_Sub_View
     */
    protected $_view;

    /**
     * Экземпляр класса
     * @var \RAAS\Abstract_Sub_Controller
     */
    protected static $instance;

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
            case 'parent':
                return $this->model->controller;
                break;
            case 'view':
                if (!$this->_view) {
                    $classname = \SOME\Namespaces::getNS($this) . '\\View' . \SOME\Namespaces::getClass($this);
                    if (class_exists($classname)) {
                        $this->_view = $classname::i();
                    }
                }
                return $this->_view;
                break;

            case 'mid': case 'alias':
                $classname = \SOME\Namespaces::getClass(\get_called_class());
                $classname = str_ireplace('Sub_', '', $classname);
                return strtolower($classname);
                break;
            case 'url':
                return $this->parent->url . '&sub=' . $this->mid;
                break;
            default:
                return $this->parent->$var;
                break;
        }
    }


    public function __set($var, $val)
    {
        switch ($var) {
            case 'view':
                if ($val instanceof Abstract_Sub_View) {
                    $this->_view = $val;
                }
                break;
            default:
                $this->parent->__set($var, $val);
                break;
        }
    }


    public function __call($f, $args)
    {
        return call_user_func_array(array($this->parent, $f), $args);
    }
}
