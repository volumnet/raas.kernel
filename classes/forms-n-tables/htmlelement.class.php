<?php
/**
 * @package RAAS
 */
namespace RAAS;

/**
 * HTML-элемент
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
    const CHILDREN_TYPE = '\ArrayObject';

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
        switch ($var) {
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
        switch ($var) {
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
                if (is_scalar($val)) {
                    $this->attrs[$var] = (string)$val;
                }
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


    /**
     * Возвращает представление поля в виде JSON-сериализуемого массива
     * @param bool $extended Развернутое представление
     * @return array
     */
    public function getArrayCopy($extended = false)
    {
        $result = ['@type' => static::class];
        $attrs = array_map(function ($x) {
            return $this->asJSONValue($x);
        }, (array)$this->attrs);
        if ($attrs) {
            if ($extended) {
                $result['attrs'] = $attrs;
            } else {
                $result = array_merge($result, $attrs);
            }
        }
        if ($extended) {
            $meta = array_map(function ($x) {
                return $this->asJSONValue($x);
            }, (array)$this->meta);
            if ($meta) {
                $result['meta'] = $meta;
            }
        }
        if ($caption = $this->asJSONValue($this->caption)) {
            $result['caption'] = $caption;
        }
        if ($this->children) {
            foreach ($this->children as $key => $val) {
                if ($val = $val->getArrayCopy($extended)) {
                    $result['children'][$key] = $val;
                }
            }
        }
        return $result;
    }


    /**
     * Возвращает представление значения в виде JSON-сериализуемого значения
     * @return array
     */
    public function asJSONValue($val)
    {
        if (is_scalar($val)) {
            return $val;
        } elseif (is_array($val)) {
            return array_map(function ($x) {
                return $this->asJSONValue($x);
            }, $val);
        } elseif ($val instanceof static) {
            return $val->getArrayCopy();
        }
        return null;
    }
}
