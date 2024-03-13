<?php
/**
 * Тест класса INISourceStrategy
 */
namespace RAAS;

use SOME\BaseTest;

/**
 * Тест класса INISourceStrategy
 * @covers \RAAS\INISourceStrategy
 */
class INISourceStrategyTest extends BaseTest
{
    /**
     * Тестирует разбор
     */
    public function testParse()
    {
        $source = 'cat1="Category 1"' . "\n"
                . 'cat2="Category 2"' . "\n"
                . 'cat3="Category 3"' . "\n";

        $result = INISourceStrategy::i()->parse($source);
        $expected = [
            'cat1' => ['name' => 'Category 1'],
            'cat2' => ['name' => 'Category 2'],
            'cat3' => ['name' => 'Category 3'],
        ];

        $this->assertEquals($expected, $result);
    }
}
