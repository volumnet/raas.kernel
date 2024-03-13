<?php
/**
 * Тест класса PHPSourceStrategy
 */
namespace RAAS;

use SOME\BaseTest;

/**
 * Тест класса PHPSourceStrategy
 * @covers \RAAS\PHPSourceStrategy
 */
class PHPSourceStrategyTest extends BaseTest
{
    /**
     * Тестирует разбор
     */
    public function testParse()
    {
        $source = "return [
            'cat1' => [
                'name' => 'Category1',
                'children' => [
                    'cat11' => [
                        'name' => 'Category11',
                        'children' => [
                            'cat111' => 'cat111',
                            'cat112' => 'Category112',
                            'cat113' => 'Category113',
                        ],
                    ],
                    'cat12' => ['name' => 'Category12'],
                    'cat13' => ['name' => 'Category13'],
                ],
            ],
            'cat2' => ['name' => 'Category2'],
            'cat3' => ['name' => 'Category3'],
        ];";

        $result = PHPSourceStrategy::i()->parse($source);
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
}
