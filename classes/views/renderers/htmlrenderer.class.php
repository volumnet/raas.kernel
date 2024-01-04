<?php
/**
 * Рендерер HTML
 */
declare(strict_types=1);

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
    public static $selfClosingElements = [
        'img',
        'br',
        'input',
        'meta',
        'hr',
        'link'
    ];

    /**
     * Получает строку атрибутов
     * @param array $attrs <pre>array<
     *     string[] URN атрибута => string|string[] Значение атрибута
     * ></pre>
     * @return string
     */
    public function getAttributesString(array $attrs = []): string
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
            $attrText = ' ' . htmlspecialchars((string)$attrKey);
            if (trim((string)$attrVal) !== '') {
                $attrText .= '="' . htmlspecialchars((string)$attrVal) . '"';
            }
            $result .= $attrText;
        }
        $result = trim((string)$result);
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
    public function getElement($name, array $attrs = [], $content = ''): string
    {
        $result = '<' . htmlspecialchars((string)$name);
        $attributesString = $this->getAttributesString($attrs);
        if ($attributesString) {
            $result .= ' ' . $attributesString;
        }
        if (($content === null) ||
            in_array($name, static::$selfClosingElements)
        ) {
            $result .= ' />';
        } else {
            $result .= '>' . $content . '</' . htmlspecialchars((string)$name) . '>';
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
     * Склеивает два массива атрибутов
     * @param array $attrs1 <pre>array<
     *     string[] Наименование атрибута => mixed Значение
     * ></pre> Первый массив атрибутов
     * @param array $attrs2 <pre>array<
     *     string[] Наименование атрибута => mixed Значение
     * ></pre> Второй массив атрибутов
     * @return array <pre>array<
     *     string[] Наименование атрибута => mixed Значение
     * ></pre>
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
            $value = array_filter(explode(' ', trim((string)$value)), 'trim');
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
            $className = trim((string)$className);
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
                $result[$key] = trim((string)$key);
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
    public function parseCSSStyles($value): array
    {
        $result = [];
        if (!is_array($value)) {
            $value = explode(';', $value);
        }
        foreach ($value as $key => $val) {
            if (is_numeric($key)) {
                $valArr = explode(':', $val);
                $cssProp = $valArr[0] ?? null;
                $cssValue = $valArr[1] ?? null;
            } else {
                $cssProp = $key;
                $cssValue = $val;
            }
            $cssProp = trim((string)$cssProp, ' :;');
            if (!is_bool($cssValue)) {
                $cssValue = trim((string)$cssValue, ' :;');
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
            $val = trim((string)$val);
            if ($val !== '') {
                $val = trim((string)$key) . ': ' . trim((string)$val);
                $result[trim((string)$val)] = trim((string)$val);
            }
        }
        return implode('; ', $result);
    }
}
