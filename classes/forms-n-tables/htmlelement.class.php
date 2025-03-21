<?php
/**
 * @package RAAS
 */
namespace RAAS;

use ArrayObject;

/**
 * HTML-элемент
 * @property IAbstract_Context_View $view Представление текущего контекста приложения
 * @property string $caption Человеко-читаемое название элемента
 * @property-read StringCollection $attrs Массив дополнительных HTML-атрибутов опции для вывода
 * @property-write StringCollection|array(string)|ArrayObject(string) $attrs Массив дополнительных HTML-атрибутов опции для вывода
 * @property-read ArrayObject $meta Массив дополнительных данных об объекте в произвольной форме
 * @property-write ArrayObject|array $meta Массив дополнительных данных об объекте в произвольной форме
 * @property string $template Шаблон для отображения элемента в формате шаблонов RAAS
 */
abstract class HTMLElement
{
    /**
     * Тип поля $children
     * Должен наследоваться от ArrayObject
     */
    const CHILDREN_TYPE = ArrayObject::class;

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
     * @var ArrayObject
     */
    protected $meta;

    /**
     * Шаблон для отображения элемента в формате шаблонов RAAS
     * @var string|callable
     */
    protected $template;

    /**
     * Кэш строки атрибутов
     * @var string|null;
     */
    protected $attrsStringCache = null;

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
                } elseif (($val instanceof ArrayObject) || is_array($val)) {
                    foreach ((array)$val as $key => $row) {
                        $this->$var[$key] = $row;
                    }
                }
                break;
            case 'meta':
                if (($val instanceof ArrayObject) || is_array($val)) {
                    foreach ((array)$val as $key => $row) {
                        $this->meta[$key] = $row;
                    }
                }
                break;
            case 'template':
                $this->$var = $val;
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
        $this->meta = new ArrayObject();
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

    /**
     * Возвращает набор атрибутов
     * @param array $additional Дополнительные атрибуты
     * @return array
     */
    public function getAttrs(array $additional = []): array
    {
        $result = (array)$this->attrs;
        foreach ((array)$additional as $key => $val) {
            if (($val === false) || (in_array($key, ['checked', 'selected', 'multiple', 'required']) && !$val)) {
                unset($result[$key]);
            } else {
                if (in_array($key, ['class', 'data-role'])) {
                    if (!isset($result[$key])) {
                        $result[$key] = '';
                    }
                    $result[$key] .= ' ' . $val;
                } else {
                    $result[$key] = $val;
                }
            }
        }
        foreach ($result as $key => $val) {
            $result[$key] = trim((string)$val);
        }
        if (!(isset($result['id']) && $result['id']) && !$this->multiple && isset($result['name']) && $result['name']) {
            $result['id'] = $result['name'];
        } elseif ($this->multiple) {
            unset($result['id']);
        }
        if (isset($result['name']) && $this->multiple && !strstr($result['name'], '[')) {
            $result['name'] .= '[]';
        }
        if ($this->type != 'select') {
            //unset($result['multiple'], $result['placeholder']); 2013-08-19 - Зачем??? // AVS
        }
        if ($this->type == 'password') {
            unset($result['confirm']);
        }
        unset($result['unit']);
        if (!isset($result['disabled']) || !$result['disabled']) {
            unset($result['disabled']);
        }
        if (!isset($result['selected']) || !$result['selected']) {
            unset($result['selected']);
        }
        if (!isset($result['readonly']) || !$result['readonly']) {
            unset($result['readonly']);
        }
        if (!isset($result['multiple']) || !$result['multiple']) {
            unset($result['multiple']);
        }
        if (isset($result['required']) && $result['required']) {
            $result['data-required'] = 'required';
        }
        unset($result['required']); // временно
        return $result;
    }


    /**
     * Возвращает строку атрибутов
     * @param array $additional Дополнительные атрибуты
     * @return string
     */
    public function getAttrsString(array $additional = []): string
    {
        if ($this->attrsStringCache === null) {
            $attrs = $this->getAttrs($additional);
            $renderer = new HTMLRenderer();
            $text = $renderer->getAttributesString($attrs);
            if ($text) {
                $text = ' ' . $text;
            }
            $this->attrsStringCache = $text;
        }
        return $this->attrsStringCache;
    }
}
