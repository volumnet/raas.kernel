<?php
/**
 * Файл класса HTML-элемента
 * @package RAAS
 * @version 4.2
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2013, Volume Networks
 */       
namespace RAAS;

/**
 * Класс HTML-элемента
 * @package RAAS
 * @property IAbstract_Context_View $view Представление текущего контекста приложения
 * @property string $caption Человеко-читаемое название элемента
 * @property-read StringCollection $attrs Массив дополнительных HTML-атрибутов опции для вывода
 * @property-write StringCollection|array(string)|\ArrayObject(string) $attrs Массив дополнительных HTML-атрибутов опции для вывода
 * @property-read \ArrayObject $meta Массив дополнительных данных об объекте в произвольной форме
 * @property-write \ArrayObject|array $meta Массив дополнительных данных об объекте в произвольной форме
 * @property string $template Шаблон для отображения элемента в формате шаблонов RAAS
 */       
abstract class HTMLElement
{
    /**
     * Тип поля $children
     * Должен наследоваться от \ArrayObject
     */
    const childrenType = '\ArrayObject';

    /**
     * Человеко-читаемое название элемента
     * @var string
     */
    protected $caption = '';
    
    /**
     * Массив дополнительных HTML-атрибутов опции для вывода
     * @var \RAAS\StringCollection
     */
    protected $attrs;

    /**
     * Массив дополнительных данных об объекте в произвольной форме
     * @var \ArrayObject
     */
    protected $meta;

    /**
     * Шаблон для отображения элемента в формате шаблонов RAAS
     * @var string
     */
    protected $template;

    public function __get($var)
    {
        switch($var) {
            case 'view':
                return \RAAS\Application::i()->context->view;
                break;
            default:
                if (isset($this->$var)) {
                    return $this->$var;
                } elseif (isset($this->attrs[$var])) {
                    return $this->attrs[$var];
                }
                break;
        }
    }

    public function __set($var, $val)
    {
        switch ($var){
            case 'caption':
                $this->$var = (string)$val;
                break;
            case 'attrs':
                if ($val instanceof StringCollection) {
                    $this->$var = $val;
                } elseif (($val instanceof \ArrayObject) || is_array($val)) {
                    foreach ((array)$val as $key => $row) {
                        $this->$var[$key] = $row;
                    }
                }
                break;
            case 'meta':
                if (($val instanceof \ArrayObject) || is_array($val)) {
                    foreach ((array)$val as $key => $row) {
                        $this->meta[$key] = $row;
                    }
                }
                break;
            case 'template':
                $this->$var = (string)$val;
                break;
            default:
                $this->attrs[$var] = (string)$val;
                break;
        }

    }

    
    /**
     * Конструктор класса
     * @param array([[имя параметра] => mixed]) $params массив дополнительных свойств, доступных для установки
     */
    public function __construct(array $params = array())
    {
        $this->attrs = new StringCollection();
        $this->meta = new \ArrayObject();
        foreach ($params as $key => $val) {
            $this->__set($key, $val);
        }
    }
}