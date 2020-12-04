<?php
/**
 * Абстрактный рендерер HTML для сайта
 */
namespace RAAS;

/**
 * Класс абстрактного рендерера HTML для сайта
 */
class HTMLRenderer
{
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
                $attrVal = implode(' ', $attrVal);
            }
            $attrText = ' ' . htmlspecialchars($attrKey)
                      . '="' . htmlspecialchars($attrVal) . '"';
            $result .= $attrText;
        }
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
        $selfClosing = (
            ($content === null) ||
            in_array($name, ['img', 'br', 'input', 'meta', 'hr'])
        );
        $result = '<' . htmlspecialchars($name) . $this->getAttributesString($attrs);
        if (!$selfClosing) {
            $result .= '>' . $content . '</' . htmlspecialchars($name) . '>';
        } else {
            $result .= ' />';
        }
        return $result;
    }

    /**
     * Возвращает HTML-код
     * @return string
     */
    public function render()
    {
        return '';
    }
}
