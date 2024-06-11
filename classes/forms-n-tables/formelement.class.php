<?php
/**
 * Файл класса элемента формы
 * @package RAAS
 * @version 4.2
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2013, Volume Networks
 */
namespace RAAS;

/**
 * Класс элемента формы
 * @package RAAS
 * @property-read {static::CHILDREN_TYPE} $children Массив дочерних элементов
 * @property-write {static::CHILDREN_TYPE} $children Массив дочерних элементов
 * @property-read Form $Form Рабочая форма
 * @property FormElement $Parent Родительский элемент
 */
abstract class FormElement extends HTMLElement
{
    /**
     * Тип поля $children
     * Должен наследоваться от \ArrayObject
     */
    const CHILDREN_TYPE = '\ArrayObject';

    /**
     * Массив дочерних элементов
     * @var {static::CHILDREN_TYPE}
     */
    protected $children;

    /**
     * Родительский элемент
     * @var Form
     */
    protected $Parent;

    public function __get($var)
    {
        switch ($var) {
            case 'Form':
                if ($this->Parent) {
                    return $this->Parent->__get('Form');
                }
                break;
            default:
                return parent::__get($var);
                break;
        }
    }

    public function __set($var, $val)
    {
        switch ($var) {
            case 'Form':
                if ($val instanceof FormElement) {
                    $this->Parent = $val;
                }
                break;
            case 'Parent':
                if ($val instanceof FormElement) {
                    $this->$var = $val;
                }
                break;
            case 'children':
                $classname = static::CHILDREN_TYPE;
                $this->$var->Parent = $this;
                if ($val instanceof $classname) {
                    $this->$var = $val;
                } elseif (($val instanceof \ArrayObject) || is_array($val)) {
                    foreach ((array)$val as $key => $row) {
                        if (!($row instanceof self)) {
                            if ($this instanceof FieldContainer) {
                                $row = new Field($row);
                            } else {
                                $row = new Option($row);
                            }
                        }
                        $row->Parent = $this;
                        $this->children[$key] = $row;
                    }
                }
                break;
            default:
                parent::__set($var, $val);
                break;
        }
    }


    /**
     * Конструктор класса
     * @param array([[имя параметра] => mixed]) $params массив дополнительных свойств, доступных для установки
     */
    public function __construct(array $params = [])
    {
        $classname = static::CHILDREN_TYPE;
        $this->children = new $classname();
        $this->children->Parent = $this;
        parent::__construct($params);
    }
}
