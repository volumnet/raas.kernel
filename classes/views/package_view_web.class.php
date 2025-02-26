<?php
/**
 * @package RAAS
 */
namespace RAAS;

/**
 * Web-представление абстрактного пакета RAAS
 */
class Package_View_Web extends Abstract_Package_View implements IRightsContext_View_Web
{
    use WidgetTrait;

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
                if (stristr($this->model->publicDir, Application::i()->baseDir)) {
                    return mb_substr(
                        $this->model->publicDir,
                        mb_strlen(Application::i()->baseDir)
                    );
                } elseif ($this->model->composer['name']) {
                    return '/vendor/' . $this->model->composer['name'] . '/public';
                }
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
