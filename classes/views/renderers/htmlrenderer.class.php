<?php
/**
 * Рендерер HTML
 */
namespace RAAS;

/**
 * Класс рендерера HTML
 */
class HTMLRenderer
{
    /**
     * Самозакрывающиеся элементы
     * @var string[]
     */
    public static $selfClosingElements = ['img', 'br', 'input', 'meta', 'hr'];

    /**
     * Получает строку атрибутов
     * @param array $attrs <pre>array<
     *     string[] URN атрибута => string|string[] Значение атрибута
     * ></pre>
     * @return string
     */
    public function getAttributesString(array $attrs = [])
    {
        $result = '';
        foreach ($attrs as $attrKey => $attrVal) {
            if (is_array($attrVal)) {
                if ($attrKey == 'style') {
                    $attrVal = $this->joinCSSStyles($attrVal);
                } elseif ($attrKey == 'class') {
                    $attrVal = $this->joinCSSClasses($attrVal);
                } else {
                    $attrVal = implode(' ', $attrVal);
                }
            }
            if ($attrVal === null) {
                continue;
            }
            $attrText = ' ' . htmlspecialchars($attrKey);
            if (trim($attrVal) !== '') {
                $attrText .= '="' . htmlspecialchars($attrVal) . '"';
            }
            $result .= $attrText;
        }
        $result = trim($result);
        return $result;
    }


    /**
     * Возвращает HTML-код элемента
     * @param string $name Имя тега элемента
     * @param array $attrs <pre>array<
     *     string[] URN атрибута => string|string[] Значение атрибута
     * ></pre>
     * @param string|null $content Содержимое элемента, либо null,
     *     если элемент самозакрывающийся
     * @return string
     */
    public function getElement($name, array $attrs = [], $content = '')
    {
        $result = '<' . htmlspecialchars($name);
        $attributesString = $this->getAttributesString($attrs);
        if ($attributesString) {
            $result .= ' ' . $attributesString;
        }
        if (($content === null) ||
            in_array($name, static::$selfClosingElements)
        ) {
            $result .= ' />';
        } else {
            $result .= '>' . $content . '</' . htmlspecialchars($name) . '>';
        }
        return $result;
    }

    /**
     * Возвращает HTML-код
     * @return string
     */
    public function render($additionalData = [])
    {
        return '';
    }


    /**
     * Получает дополнительные атрибуты
     * @param array|callable $additionalData Дополнительные данные,
     *     либо callback($this), их возвращающий
     * @return array <pre>array<
     *     string[] Наименование атрибута => string Значение
     * ></pre>
     */
    public function getAdditionalAttributes($additionalData = [])
    {
        $result = [];
        if ($additionalData) {
            if (is_callable($additionalData)) {
                $result = (array)$additionalData($this);
            } elseif (is_array($additionalData)) {
                $result = $additionalData;
            }
        }
        $result = array_filter($result, function ($x) {
            return $x[0] != '_';
        }, ARRAY_FILTER_USE_KEY);
        return $result;
    }


    /**
     * Склеивает два массива атрибутов
     * @param array $attrs1 description
     */
    public function mergeAttributes($attrs1 = [], $attrs2 = [])
    {
        $result = array_merge($attrs1, $attrs2);
        $attrsSet = [$attrs1, $attrs2];
        foreach (['class', 'style'] as $attrName) {
            $subresult = [[], []];
            foreach ($attrsSet as $i => $attrs) {
                if (isset($attrs[$attrName])) {
                    $attrVal = $attrs[$attrName];
                    if ($attrName == 'class') {
                        $subresult[$i] = $this->parseCSSClasses($attrVal);
                    } elseif ($attrName == 'style') {
                        $subresult[$i] = $this->parseCSSStyles($attrVal);
                    }
                }
            }
            $subresult = array_reduce($subresult, 'array_merge', []);
            if ($subresult) {
                $result[$attrName] = $subresult;
            } else {
                unset($result[$attrName]);
            }
        }
        return $result;
    }


    /**
     * Разбирает класс CSS
     * @param mixed $value <pre>string Строка классов|array<
     *     (string[] Имя класса => bool Присутствие)|string Имя класса
     * ></pre>
     * @return array <pre>array<
     *     string[] Имя класса => bool Присутствие
     * ></pre>
     */
    public function parseCSSClasses($value)
    {
        $result = [];
        if (!is_array($value)) {
            $value = array_filter(explode(' ', trim($value)), 'trim');
            $value = array_values($value);
        }
        foreach ($value as $key => $val) {
            if (is_numeric($key)) {
                $className = $val;
                $classValue = true;
            } else {
                $className = $key;
                $classValue = $val;
            }
            $className = trim($className);
            $classValue = (bool)$classValue;
            if ($className !== '') {
                $result[$className] = $classValue;
            }
        }
        return $result;
    }


    /**
     * Склеивает класс CSS в строку
     * @param mixed $value <pre>string Строка классов|array<
     *     (string[] Имя класса => bool Присутствие)|string Имя класса
     * ></pre>
     * @return string
     */
    public function joinCSSClasses($value)
    {
        $value = $this->parseCSSClasses($value);
        $result = [];
        foreach ($value as $key => $val) {
            if ($val) {
                $result[$key] = trim($key);
            }
        }
        return implode(' ', $result);
    }


    /**
     * Разбирает стили CSS
     * @param mixed $value <pre>string Строка стилей|array<
     *     (string[] Имя свойства => string Значение)|
     *     string Свойство с значением
     * ></pre>
     * @return array <pre>array<
     *     string[] Имя свойства => string Значение
     * ></pre>
     */
    public function parseCSSStyles($value)
    {
        $result = [];
        if (!is_array($value)) {
            $value = explode(';', $value);
        }
        foreach ($value as $key => $val) {
            if (is_numeric($key)) {
                list($cssProp, $cssValue) = explode(':', $val);
            } else {
                $cssProp = $key;
                $cssValue = $val;
            }
            $cssProp = trim($cssProp, ' :;');
            if (!is_bool($cssValue)) {
                $cssValue = trim($cssValue, ' :;');
            }
            if (($cssProp !== '') && ($cssValue !== '')) {
                $result[$cssProp] = $cssValue;
            }
        }
        return $result;
    }


    /**
     * Склеивает стили CSS в строку
     * @param mixed $value <pre>string Строка стилей|array<
     *     (string[] Имя свойства => string Значение)|
     *     string Свойство с значением
     * ></pre>
     * @return string
     */
    public function joinCSSStyles($value)
    {
        $value = $this->parseCSSStyles($value);
        $result = [];
        foreach ($value as $key => $val) {
            $val = trim($val);
            if ($val !== '') {
                $val = trim($key) . ': ' . trim($val);
                $result[trim($val)] = trim($val);
            }
        }
        return implode('; ', $result);
    }
}
