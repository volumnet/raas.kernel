<?php
/**
 * Файл web-представления абстрактного модуля RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */
namespace RAAS;

/**
 * Класс web-представления абстрактного модуля RAAS
 * @package RAAS
 */
class Module_View_Web extends Abstract_Module_View implements IRightsContext_View_Web
{
    /**
     * Экземпляр класса
     * @var \RAAS\Module_View_Web
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
            case 'publicURL':
                return $this->parent->modulesURL . '/' . $this->model->parent->alias . '/' . $this->model->alias . '/public';
                break;
            case 'stdView':
                if (!$this->_stdView) {
                    $this->_stdView = new View_StdSub($this);
                }
                return $this->_stdView;
                break;
            default:
                return parent::__get($var);
                break;
        }
    }

    public function __set($var, $val)
    {
        if ($var == 'template' && !strstr($val, '/')) {
            $val = $this->package->alias . '/' . $this->module->alias . '/' . $val;
        }
        parent::__set($var, $val);
    }


    public function tmp($file)
    {
        if (!strstr($file, '/')) {
            $file = $this->package->alias . '/' . $this->module->alias . '/' . $file;
        }
        return $this->parent->parent->tmp($file);
    }


    public function header()
    {
        $this->menu[] = array('href' => '?p=' . $this->package->alias . '&m=' . $this->module->alias, 'name' => $this->_('__NAME'));
    }
}
