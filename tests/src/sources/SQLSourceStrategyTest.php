<?php
/**
 * Тест класса SQLSourceStrategy
 */
namespace RAAS;

class SQLSourceStrategyTest extends BaseTest
{
    /**
     * Тестирует разбор
     */
    public function testParse()
    {
        $sqlQuery = "CREATE TEMPORARY TABLE IF NOT EXISTS tmp_testparsesql (
                        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                        pid INT UNSIGNED NOT NULL DEFAULT 0,
                        name VARCHAR(255) NOT NULL DEFAULT '',

                        PRIMARY KEY (id),
                        KEY (pid)
                    );";
        Application::i()->SQL->query($sqlQuery);
        Application::i()->SQL->add('tmp_testparsesql', [
            ['id' => 1, 'pid' => 0, 'name' => 'Category1'],
            ['id' => 11, 'pid' => 1, 'name' => 'Category11'],
            ['id' => 111, 'pid' => 11, 'name' => 'Category111'],
            ['id' => 112, 'pid' => 11, 'name' => 'Category112'],
            ['id' => 113, 'pid' => 11, 'name' => 'Category113'],
            ['id' => 12, 'pid' => 1, 'name' => 'Category12'],
            ['id' => 13, 'pid' => 1, 'name' => 'Category13'],
            ['id' => 2, 'pid' => 0, 'name' => 'Category2'],
            ['id' => 3, 'pid' => 0, 'name' => 'Category3'],
        ]);


        $source = "SELECT id AS val, pid, name FROM tmp_testparsesql";

        $result = SQLSourceStrategy::i()->parse($source);
        $expected = [
            '1' => [
                'name' => 'Category1',
                'children' => [
                    '11' => [
                        'name' => 'Category11',
                        'children' => [
                            '111' => ['name' => 'Category111'],
                            '112' => ['name' => 'Category112'],
                            '113' => ['name' => 'Category113'],
                        ],
                    ],
                    '12' => ['name' => 'Category12'],
                    '13' => ['name' => 'Category13'],
                ],
            ],
            '2' => ['name' => 'Category2'],
            '3' => ['name' => 'Category3'],
        ];

        $this->assertEquals($expected, $result);

        $sqlQuery = "DROP TABLE IF EXISTS tmp_testparsesql";
        Application::i()->SQL->query($sqlQuery);
    }


    /**
     * Проверка метода parse() с одной колонкой
     */
    public function testParseWithOneColumn()
    {
        $sqlQuery = "CREATE TEMPORARY TABLE IF NOT EXISTS tmp_testparsesql (
                        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                        pid INT UNSIGNED NOT NULL DEFAULT 0,
                        name VARCHAR(255) NOT NULL DEFAULT '',

                        PRIMARY KEY (id),
                        KEY (pid)
                    );";
        Application::i()->SQL->query($sqlQuery);
        Application::i()->SQL->add('tmp_testparsesql', [
            ['id' => 1, 'pid' => 0, 'name' => 'Category1'],
            ['id' => 11, 'pid' => 1, 'name' => 'Category11'],
            ['id' => 111, 'pid' => 11, 'name' => 'Category111'],
            ['id' => 112, 'pid' => 11, 'name' => 'Category112'],
            ['id' => 113, 'pid' => 11, 'name' => 'Category113'],
            ['id' => 12, 'pid' => 1, 'name' => 'Category12'],
            ['id' => 13, 'pid' => 1, 'name' => 'Category13'],
            ['id' => 2, 'pid' => 0, 'name' => 'Category2'],
            ['id' => 3, 'pid' => 0, 'name' => 'Category3'],
        ]);


        $source = "SELECT id AS foo, pid FROM tmp_testparsesql";

        $result = SQLSourceStrategy::i()->parse($source);
        $expected = [
            '1' => [
                'name' => '1',
                'children' => [
                    '11' => [
                        'name' => '11',
                        'children' => [
                            '111' => ['name' => '111'],
                            '112' => ['name' => '112'],
                            '113' => ['name' => '113'],
                        ],
                    ],
                    '12' => ['name' => '12'],
                    '13' => ['name' => '13'],
                ],
            ],
            '2' => ['name' => '2'],
            '3' => ['name' => '3'],
        ];

        $this->assertEquals($expected, $result);

        $sqlQuery = "DROP TABLE IF EXISTS tmp_testparsesql";
        Application::i()->SQL->query($sqlQuery);
    }


    /**
     * Проверка метода parse() с опасным запросом
     */
    public function testParseWithDangerousQuery()
    {
        $source = "DROP TABLE IF EXISTS tmp_testparsesql1;";

        $result = SQLSourceStrategy::i()->parse($source);
        $expected = [];

        $this->assertEquals($expected, $result);
    }
}
