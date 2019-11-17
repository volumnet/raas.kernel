<?php
/**
 * Файл web-представления абстрактного пакета RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */
namespace RAAS;

/**
 * Класс web-представления абстрактного пакета RAAS
 * @package RAAS
 */
class Package_View_Web extends Abstract_Package_View implements IRightsContext_View_Web
{
    /**
     * Экземпляр класса
     * @var \RAAS\Package_View_Web
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
                return mb_substr(
                    $this->model->publicDir,
                    mb_strlen(Application::i()->baseDir)
                );
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
            $val = $this->package->alias . '/' . $val;
        }
        parent::__set($var, $val);
    }

    public function tmp($file)
    {
        if (!strstr($file, '/')) {
            $file = $this->package->alias . '/' . $file;
        }
        return $this->parent->tmp($file);
    }

    public function header()
    {
    }
}
