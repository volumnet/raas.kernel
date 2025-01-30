<?php
/**
 * Тест класса XMLSourceStrategy
 */
namespace RAAS;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestWith;
use SOME\BaseTest;

/**
 * Тест класса XMLSourceStrategy
 */
#[CoversClass(XMLSourceStrategy::class)]
class XMLSourceStrategyTest extends BaseTest
{
    /**
     * Тестирует разбор
     */
    public function testParse()
    {
        $source = ' <element title="Category1" id="cat1">
                      <Category11 value="cat11">
                        <cat111 />
                        <Category112 id="cat112" />
                        <element name="Category113" value="cat113" />
                      </Category11>
                      <Category12 id="cat12" />
                      <Category13 value="cat13" />
                    </element>
                    <Category2 id="cat2" />
                    <Category3 value="cat3" />';

        $result = XMLSourceStrategy::i()->parse($source);
        $expected = [
            'cat1' => [
                'name' => 'Category1',
                'children' => [
                    'cat11' => [
                        'name' => 'Category11',
                        'children' => [
                            'cat111' => ['name' => 'cat111'],
                            'cat112' => ['name' => 'Category112'],
                            'cat113' => ['name' => 'Category113'],
                        ],
                    ],
                    'cat12' => ['name' => 'Category12'],
                    'cat13' => ['name' => 'Category13'],
                ],
            ],
            'cat2' => ['name' => 'Category2'],
            'cat3' => ['name' => 'Category3'],
        ];

        $this->assertEquals($expected, $result);
    }


    /**
     * Проверка метода parse() с ошибкой
     */
    public function testParseWithError()
    {
        $source = ' <abc> ';

        $result = XMLSourceStrategy::i()->parse($source);
        $expected = [];

        $this->assertEquals($expected, $result);
    }
}
