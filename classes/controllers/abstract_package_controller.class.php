<?php
/**
 * Файл абстрактного контроллера пакета RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */
namespace RAAS;

use SOME\Namespaces;
use SOME\Singleton;

/**
 * Класс абстрактного контроллера пакета RAAS
 * @package RAAS
 * @property-read Package $model ссылка на экземпляр пакета
 * @property-read Abstract_Controller $parent ссылка на экземпляр
 *                                            активного контроллера ядра
 * @property-read Abstract_Package_View $view ссылка на экземпляр
 *                                            текущего представления пакета
 */
abstract class Abstract_Package_Controller extends Singleton implements IAbstract_Context_Controller
{
    /**
     * Ссылка на экземпляр текущего представления пакета
     * @var Abstract_Package_View
     */
    protected $view;

    /**
     * Экземпляр класса
     * @var Abstract_Package_Controller
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
            case 'model':
                $NS = Namespaces::getNS($this);
                $classname = $NS . '\\Package';
                return $classname::i();
                break;
            case 'parent':
                return $this->application->controller;
                break;
            case 'view':
                return $this->view;
                break;
            case 'url':
                return '?p=' . $this->model->alias;
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
            $this->view = $classname::i();
        }
    }


    public function run()
    {
        if ($this->checkCompatibility()) {
            $this->execute();
            if ($this->model->activeModule) {
                $this->model->activeModule->run();
            }
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
        return [];
    }


    protected function checkCompatibility()
    {
        $arr = [];
        if (!$this->model->phpVersionCompatible) {
            $arr['PHP_VERSION_INCOMPATIBLE'] = Application::i()->requiredPHPVersion;
        }
        if ($missedExt = $this->model->missedExt) {
            $arr['PHP_EXTENSION_REQUIRED'] = $missedExt;
        }
        if ($arr) {
            $this->application->view->checkCompatibility($arr);
            return false;
        }
        return true;
    }
}
