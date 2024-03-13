<?php
/**
 * Тест класса DictionarySourceStrategy
 */
namespace RAAS;

use InvalidArgumentException;
use SOME\BaseTest;

/**
 * Тест класса DictionarySourceStrategy
 * @covers \RAAS\DictionarySourceStrategy
 */
class DictionarySourceStrategyTest extends BaseTest
{
    use WithTempTablesTrait;

    /**
     * Тестирует разбор
     */
    public function testParse()
    {
        $sqlQuery = "TRUNCATE TABLE tmp_dictionaries";
        Application::i()->SQL->query($sqlQuery);

        Application::i()->SQL->add('tmp_dictionaries', [
            ['id' => 1, 'pid' => 0, 'name' => 'Dictionary', 'urn' => 'test', 'priority' => 0],
            ['id' => 11, 'pid' => 1, 'name' => 'Category1', 'urn' => 'cat1', 'priority' => 1],
            ['id' => 111, 'pid' => 11, 'name' => 'Category11', 'urn' => 'cat11', 'priority' => 2],
            ['id' => 1111, 'pid' => 111, 'name' => 'Category111', 'urn' => 'cat111', 'priority' => 3],
            ['id' => 1112, 'pid' => 111, 'name' => 'Category112', 'urn' => 'cat112', 'priority' => 4],
            ['id' => 1113, 'pid' => 111, 'name' => 'Category113', 'urn' => 'cat113', 'priority' => 5],
            ['id' => 112, 'pid' => 11, 'name' => 'Category12', 'urn' => 'cat12', 'priority' => 6],
            ['id' => 113, 'pid' => 11, 'name' => 'Category13', 'urn' => 'cat13', 'priority' => 7],
            ['id' => 12, 'pid' => 1, 'name' => 'Category2', 'urn' => 'cat2', 'priority' => 8],
            ['id' => 13, 'pid' => 1, 'name' => 'Category3', 'urn' => 'cat3', 'priority' => 9],
        ]);

        $result = DictionarySourceStrategy::i()->parse(new CustomDictionary(1));
        $expected = [
            'cat1' => [
                'name' => 'Category1',
                'children' => [
                    'cat11' => [
                        'name' => 'Category11',
                        'children' => [
                            'cat111' => ['name' => 'Category111'],
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

        $sqlQuery = "TRUNCATE TABLE tmp_dictionaries";
        Application::i()->SQL->query($sqlQuery);
    }


    /**
     * Проверка метода parse() с источником - не справочником
     */
    public function testParseWithNonDictionary()
    {
        $this->expectException(InvalidArgumentException::class);
        $result = DictionarySourceStrategy::i()->parse(123);
    }
}
