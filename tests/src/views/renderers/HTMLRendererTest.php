<?php
/**
 * Файл теста рендерера HTML
 */
namespace RAAS;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestWith;
use SOME\BaseTest;

/**
 * Класс теста рендерера HTML
 */
#[CoversClass(HTMLRenderer::class)]
class HTMLRendererTest extends BaseTest
{
    /**
     * Тест разбора CSS-классов
     */
    public function testParseCSSClasses()
    {
        $renderer = new HTMLRenderer();

        $result = $renderer->parseCSSClasses('aaa bbb ccc-ddd');

        $this->assertEquals(
            ['aaa' => true, 'bbb' => true, 'ccc-ddd' => true],
            $result
        );
    }


    /**
     * Тест разбора CSS-классов - случай с массивом классов
     */
    public function testParseCSSClassesWithArray()
    {
        $renderer = new HTMLRenderer();

        $result = $renderer->parseCSSClasses([
            'aaa' => true,
            'bbb' => '',
            'ccc-ddd',
            ' ',
        ]);

        $this->assertEquals(
            ['aaa' => true, 'bbb' => false, 'ccc-ddd' => true],
            $result
        );
    }


    /**
     * Тест разбора CSS-стилей
     */
    public function testParseCSSStyles()
    {
        $renderer = new HTMLRenderer();

        $result = $renderer->parseCSSStyles('background: red; padding: 0px; :;');

        $this->assertEquals(
            ['background' => 'red', 'padding' => '0px'],
            $result
        );
    }


    /**
     * Тест разбора CSS-стилей - случай с массивом стилей
     */
    public function testParseCSSStylesWithArray()
    {
        $renderer = new HTMLRenderer();

        $result = $renderer->parseCSSStyles([
            'background: red;',
            ' padding' => ' 0px',
            ' ' => ' ',
        ]);

        $this->assertEquals(
            ['background' => 'red', 'padding' => '0px'],
            $result
        );
    }


    /**
     * Тест склеивания CSS-классов
     */
    public function testJoinCSSClasses()
    {
        $renderer = new HTMLRenderer();

        $result = $renderer->joinCSSClasses('aaa bbb   ccc-ddd ');

        $this->assertEquals('aaa bbb ccc-ddd', $result);
    }


    /**
     * Тест склеивания CSS-классов - случай с массивами
     */
    public function testJoinCSSClassesWithArray()
    {
        $renderer = new HTMLRenderer();

        $result = $renderer->joinCSSClasses([
            'aaa' => true,
            'bbb' => '',
            'ccc-ddd',
            ' ',
        ]);

        $this->assertEquals('aaa ccc-ddd', $result);
    }


    /**
     * Тест склеивания CSS-стилей
     */
    public function testJoinCSSStyles()
    {
        $renderer = new HTMLRenderer();

        $result = $renderer->joinCSSStyles('background: red; padding: 0px; :;');

        $this->assertEquals('background: red; padding: 0px', $result);
    }


    /**
     * Тест склеивания CSS-стилей
     */
    public function testJoinCSSStylesWithArray()
    {
        $renderer = new HTMLRenderer();

        $result = $renderer->joinCSSStyles([
            'background: red;',
            ' padding' => ' 0px',
            'margin' => 0,
            'border' => false,
            ' ' => ' ',
        ]);

        $this->assertEquals('background: red; padding: 0px; margin: 0', $result);
    }


    /**
     * Тест склеивания атрибутов
     */
    public function testMergeAttributes()
    {
        $renderer = new HTMLRenderer();

        $attrs1 = [
            'class' => 'aaa bbb ccc',
            'default' => 1,
            'value' => 'abc',
            'style' => 'background: red; padding-top: 0px; opacity: 1',
        ];

        $attrs2 = [
            'class' => [
                'bbb' => false,
                'ddd' => true,
            ],
            'style' => 'margin: 0; background: blue;',
            'value' => 'def',
        ];

        $result = $renderer->mergeAttributes($attrs1, $attrs2);

        $this->assertEquals([
            'class' => [
                'aaa' => true,
                'bbb' => false,
                'ccc' => true,
                'ddd' => true
            ],
            'default' => 1,
            'value' => 'def',
            'style' => [
                'background' => 'blue',
                'padding-top' => '0px',
                'opacity' => '1',
                'margin' => '0',
            ],
        ], $result);
    }


    /**
     * Тест склеивания атрибутов - случай без слияния стилей и с пустым классом
     */
    public function testMergeAttributesWithoutStylesAndWithEmptyClass()
    {
        $renderer = new HTMLRenderer();

        $attrs1 = [
            'class' => '',
            'default' => 1,
            'value' => 'abc',
        ];

        $attrs2 = [
            'value' => 'def',
        ];

        $result = $renderer->mergeAttributes($attrs1, $attrs2);

        $this->assertEquals([
            'default' => 1,
            'value' => 'def',
        ], $result);
    }


    /**
     * Проверка получения строки атрибутов
     */
    public function testGetAttributesString()
    {
        $renderer = new HTMLRenderer();

        $result = $renderer->getAttributesString([
            'class' => [
                'aaa' => true,
                'bbb' => false,
                'ccc' => true,
                'ddd' => true
            ],
            'data-class' => [
                'aaa',
                'bbb',
                'ccc',
            ],
            'default' => 1,
            'value' => 'def',
            'style' => [
                'background' => 'blue',
                'padding-top' => '0px',
                'opacity' => '1',
                'margin' => '0',
            ],
            'aaa' => null,
            'disabled' => '',
        ]);

        $this->assertEquals(
            'class="aaa ccc ddd" data-class="aaa bbb ccc" default="1" value="def" style="background: blue; padding-top: 0px; opacity: 1; margin: 0" disabled',
            $result
        );
    }


    /**
     * Проверка получения элемента
     */
    public function testGetElement()
    {
        $renderer = new HTMLRenderer();

        $result = $renderer->getElement(
            'div',
            ['class' => ['aaa' => true], 'disabled' => ''],
            'abc"'
        );

        $this->assertEquals('<div class="aaa" disabled>abc"</div>', $result);
    }


    /**
     * Проверка получения элемента - случай с самозакрывающимся тегом
     */
    public function testGetElementWithSelfClosing()
    {
        $renderer = new HTMLRenderer();

        $result = $renderer->getElement(
            'img',
            ['class' => ['aaa' => true]],
            'abc"'
        );

        $this->assertEquals('<img class="aaa" />', $result);
    }


    /**
     * Проверка получения элемента - случай с пустым контентом
     */
    public function testGetElementWithNoContent()
    {
        $renderer = new HTMLRenderer();

        $result = $renderer->getElement(
            'div',
            ['class' => ['aaa' => true]],
            null
        );

        $this->assertEquals('<div class="aaa" />', $result);
    }


    /**
     * Проверка рендера
     */
    public function testRender()
    {
        $renderer = new HTMLRenderer();

        $result = $renderer->render();

        $this->assertEquals('', $result);
    }
}
