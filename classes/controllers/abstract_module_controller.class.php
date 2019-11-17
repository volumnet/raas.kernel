<?php
/**
 * Файл абстрактного контроллера модуля RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */
namespace RAAS;

use SOME\Namespaces;
use SOME\Singleton;

/**
 * Класс абстрактного контроллера модуля RAAS
 * @package RAAS
 * @property-read \RAAS\Module $module ссылка на экземпляр модуля
 * @property-read \RAAS\Module $model ссылка на экземпляр модуля
 * @property-read \RAAS\Abstract_Package_Controller $parent ссылка на экземпляр активного контроллера пакета
 * @property-read \RAAS\Abstract_Module_View $view ссылка на экземпляр текущего представления модуля
 */
abstract class Abstract_Module_Controller extends Singleton implements IAbstract_Context_Controller
{
    /**
     * Ссылка на экземпляр текущего представления модуля
     * @var \RAAS\Abstract_Module_View
     */
    protected $view;

    /**
     * Экземпляр класса
     * @var \RAAS\Abstract_Module_Controller
     */
    protected static $instance;

    public function __get($var)
    {
        switch ($var) {
            // MVC
            case 'application':
                return $this->module->application;
                break;
            case 'package':
                return $this->module->package;
                break;
            case 'module':
            case 'model':
                $NS = Namespaces::getNS($this);
                $classname = $NS . '\\Module';
                return $classname::i();
                break;
            case 'parent':
                return $this->package->controller;
                break;
            case 'view':
                return $this->view;
                break;

            case 'url':
                return $this->parent->url . '&m=' . $this->model->alias;
                break;
            default:
                return $this->parent->$var;
                break;
        }
    }


    /**
     * Конструктор класса
     */
    protected function init()
    {
        if ($this->parent->view) {
            $classname = Namespaces::getClass($this->parent->view);
            $NS = Namespaces::getNS($this);
            $classname = $NS . '\\' . $classname;
            if (class_exists($classname)) {
                $this->view = $classname::i();
            } else {
                throw new Exception($this->application->view->_('INVALID_VIEW_FOR_MODULE'));
            }
        }
    }


    public function run()
    {
        if ($this->checkCompatibility()) {
            $this->execute();
        }
    }


    protected function execute()
    {
        if ($this->sub) {
            $NS = Namespaces::getNS($this);
            $classname = $NS . '\\Sub_' . ucfirst($this->sub);
            if (class_exists($classname)) {
                return $classname::i()->run();
            }
        }
    }


    public function config()
    {
        return array();
    }


    protected function checkCompatibility()
    {
        $arr = array();
        if (!$this->model->phpVersionCompatible) {
            $arr['PHP_VERSION_INCOMPATIBLE'] = Application::requiredPHPVersion;
        }
        if ($missedExt = $this->model->missedExt) {
            $arr['PHP_EXTENSION_REQUIRED'] = $missedExt;
        }
        if ($arr) {
            $this->view->checkCompatibility($arr);
            return false;
        }
        return true;
    }
}
