<?php
/**
 * Тест класса Dictionary
 */
namespace RAAS;

use SOME\BaseTest;
use RAAS\CMS\Dictionary as CMSDictionary;

class DictionaryTest extends BaseTest
{
    public static $tables = ['cms_dictionaries'];

    protected function setUp(): void
    {
        $sqlQuery = "TRUNCATE TABLE cms_dictionaries";
        Application::i()->SQL->query($sqlQuery);
        Application::i()->SQL->add('cms_dictionaries', ['id' => 1, 'name' => 'Test', 'urn' => 'test']);
    }


    protected function tearDown(): void
    {
        $sqlQuery = "TRUNCATE TABLE cms_dictionaries";
        Application::i()->SQL->query($sqlQuery);
    }


    /**
     * Проверка метода parseCSV()
     */
    public function testParseStdSource()
    {
        $source = [
            'cat1' => [
                'name' => 'Category 1',
                'children' => [
                    'cat11' => [
                        'name' => 'Category 11',
                        'children' => [
                            'cat111' => ['name' => 'Category 111'],
                            'cat112' => ['name' => 'Category 112'],
                            'cat113' => ['name' => 'Category 113'],
                        ],
                    ],
                    'cat12' => ['name' => 'Category 12'],
                    'cat13' => ['name' => 'Category 13'],
                ],
            ],
            'cat2' => ['name' => 'Category 2'],
            'cat3' => ['name' => 'Category 3'],
        ];

        $dictionary = new CMSDictionary(1);
        $dictionary->parseStdSource($source);

        $this->assertEquals('Category 1', $dictionary->children[0]->name);
        $this->assertEquals('cat1', $dictionary->children[0]->urn);
        $this->assertEquals('Category 11', $dictionary->children[0]->children[0]->name);
        $this->assertEquals('cat11', $dictionary->children[0]->children[0]->urn);
        $this->assertEquals('Category 111', $dictionary->children[0]->children[0]->children[0]->name);
        $this->assertEquals('cat111', $dictionary->children[0]->children[0]->children[0]->urn);
        $this->assertEquals('Category 112', $dictionary->children[0]->children[0]->children[1]->name);
        $this->assertEquals('cat112', $dictionary->children[0]->children[0]->children[1]->urn);
        $this->assertEquals('Category 113', $dictionary->children[0]->children[0]->children[2]->name);
        $this->assertEquals('cat113', $dictionary->children[0]->children[0]->children[2]->urn);
        $this->assertEquals('Category 12', $dictionary->children[0]->children[1]->name);
        $this->assertEquals('cat12', $dictionary->children[0]->children[1]->urn);
        $this->assertEquals('Category 13', $dictionary->children[0]->children[2]->name);
        $this->assertEquals('cat13', $dictionary->children[0]->children[2]->urn);
        $this->assertEquals('Category 2', $dictionary->children[1]->name);
        $this->assertEquals('cat2', $dictionary->children[1]->urn);
        $this->assertEquals('Category 3', $dictionary->children[2]->name);
        $this->assertEquals('cat3', $dictionary->children[2]->urn);
    }


    /**
     * Проверка метода parseCSV()
     */
    public function testParseCSV()
    {
        $source = "Category 1;cat1\n"
                . ";Category 11;cat11\n"
                . ";;Category 111;cat111\n"
                . ";;Category 112;cat112\n"
                . ";;Category 113;cat113\n"
                . ";Category 12;cat12\n"
                . ";Category 13;cat13\n"
                . "Category 2;cat2\n"
                . "Category 3;cat3\n";

        $dictionary = new CMSDictionary(1);
        $dictionary->parseCSV($source);

        $this->assertEquals('Category 1', $dictionary->children[0]->name);
        $this->assertEquals('cat1', $dictionary->children[0]->urn);
        $this->assertEquals('Category 11', $dictionary->children[0]->children[0]->name);
        $this->assertEquals('cat11', $dictionary->children[0]->children[0]->urn);
        $this->assertEquals('Category 111', $dictionary->children[0]->children[0]->children[0]->name);
        $this->assertEquals('cat111', $dictionary->children[0]->children[0]->children[0]->urn);
        $this->assertEquals('Category 112', $dictionary->children[0]->children[0]->children[1]->name);
        $this->assertEquals('cat112', $dictionary->children[0]->children[0]->children[1]->urn);
        $this->assertEquals('Category 113', $dictionary->children[0]->children[0]->children[2]->name);
        $this->assertEquals('cat113', $dictionary->children[0]->children[0]->children[2]->urn);
        $this->assertEquals('Category 12', $dictionary->children[0]->children[1]->name);
        $this->assertEquals('cat12', $dictionary->children[0]->children[1]->urn);
        $this->assertEquals('Category 13', $dictionary->children[0]->children[2]->name);
        $this->assertEquals('cat13', $dictionary->children[0]->children[2]->urn);
        $this->assertEquals('Category 2', $dictionary->children[1]->name);
        $this->assertEquals('cat2', $dictionary->children[1]->urn);
        $this->assertEquals('Category 3', $dictionary->children[2]->name);
        $this->assertEquals('cat3', $dictionary->children[2]->urn);
    }


    /**
     * Проверка метода parseXML()
     */
    public function testParseXML()
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
                    // $source = '';

        $dictionary = new CMSDictionary(1);
        $dictionary->parseXML($source);

        $this->assertEquals('Category1', $dictionary->children[0]->name);
        $this->assertEquals('cat1', $dictionary->children[0]->urn);
        $this->assertEquals('Category11', $dictionary->children[0]->children[0]->name);
        $this->assertEquals('cat11', $dictionary->children[0]->children[0]->urn);
        $this->assertEquals('cat111', $dictionary->children[0]->children[0]->children[0]->name);
        $this->assertEquals('cat111', $dictionary->children[0]->children[0]->children[0]->urn);
        $this->assertEquals('Category112', $dictionary->children[0]->children[0]->children[1]->name);
        $this->assertEquals('cat112', $dictionary->children[0]->children[0]->children[1]->urn);
        $this->assertEquals('Category113', $dictionary->children[0]->children[0]->children[2]->name);
        $this->assertEquals('cat113', $dictionary->children[0]->children[0]->children[2]->urn);
        $this->assertEquals('Category12', $dictionary->children[0]->children[1]->name);
        $this->assertEquals('cat12', $dictionary->children[0]->children[1]->urn);
        $this->assertEquals('Category13', $dictionary->children[0]->children[2]->name);
        $this->assertEquals('cat13', $dictionary->children[0]->children[2]->urn);
        $this->assertEquals('Category2', $dictionary->children[1]->name);
        $this->assertEquals('cat2', $dictionary->children[1]->urn);
        $this->assertEquals('Category3', $dictionary->children[2]->name);
        $this->assertEquals('cat3', $dictionary->children[2]->urn);
    }


    /**
     * Проверка метода parseXML() с ошибкой
     */
    public function testParseXMLWithError()
    {
        $source = ' <abc> ';

        $dictionary = new CMSDictionary(1);
        $dictionary->parseXML($source);

        $this->assertEmpty($dictionary->children);
    }


    /**
     * Проверка метода parseSQL()
     */
    public function testParseSQL()
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

        $dictionary = new CMSDictionary(1);
        $dictionary->parseSQL($source);

        $this->assertEquals('Category1', $dictionary->children[0]->name);
        $this->assertEquals('1', $dictionary->children[0]->urn);
        $this->assertEquals('Category11', $dictionary->children[0]->children[0]->name);
        $this->assertEquals('11', $dictionary->children[0]->children[0]->urn);
        $this->assertEquals('Category111', $dictionary->children[0]->children[0]->children[0]->name);
        $this->assertEquals('111', $dictionary->children[0]->children[0]->children[0]->urn);
        $this->assertEquals('Category112', $dictionary->children[0]->children[0]->children[1]->name);
        $this->assertEquals('112', $dictionary->children[0]->children[0]->children[1]->urn);
        $this->assertEquals('Category113', $dictionary->children[0]->children[0]->children[2]->name);
        $this->assertEquals('113', $dictionary->children[0]->children[0]->children[2]->urn);
        $this->assertEquals('Category12', $dictionary->children[0]->children[1]->name);
        $this->assertEquals('12', $dictionary->children[0]->children[1]->urn);
        $this->assertEquals('Category13', $dictionary->children[0]->children[2]->name);
        $this->assertEquals('13', $dictionary->children[0]->children[2]->urn);
        $this->assertEquals('Category2', $dictionary->children[1]->name);
        $this->assertEquals('2', $dictionary->children[1]->urn);
        $this->assertEquals('Category3', $dictionary->children[2]->name);
        $this->assertEquals('3', $dictionary->children[2]->urn);

        $sqlQuery = "DROP TABLE IF EXISTS tmp_testparsesql";
        Application::i()->SQL->query($sqlQuery);
    }


    /**
     * Проверка метода parseSQL() с одной колонкой
     */
    public function testParseSQLWithOneColumn()
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

        $dictionary = new CMSDictionary(1);
        $dictionary->parseSQL($source);

        $this->assertEquals('1', $dictionary->children[0]->name);
        $this->assertEquals('1', $dictionary->children[0]->urn);
        $this->assertEquals('11', $dictionary->children[0]->children[0]->name);
        $this->assertEquals('11', $dictionary->children[0]->children[0]->urn);
        $this->assertEquals('111', $dictionary->children[0]->children[0]->children[0]->name);
        $this->assertEquals('111', $dictionary->children[0]->children[0]->children[0]->urn);
        $this->assertEquals('112', $dictionary->children[0]->children[0]->children[1]->name);
        $this->assertEquals('112', $dictionary->children[0]->children[0]->children[1]->urn);
        $this->assertEquals('113', $dictionary->children[0]->children[0]->children[2]->name);
        $this->assertEquals('113', $dictionary->children[0]->children[0]->children[2]->urn);
        $this->assertEquals('12', $dictionary->children[0]->children[1]->name);
        $this->assertEquals('12', $dictionary->children[0]->children[1]->urn);
        $this->assertEquals('13', $dictionary->children[0]->children[2]->name);
        $this->assertEquals('13', $dictionary->children[0]->children[2]->urn);
        $this->assertEquals('2', $dictionary->children[1]->name);
        $this->assertEquals('2', $dictionary->children[1]->urn);
        $this->assertEquals('3', $dictionary->children[2]->name);
        $this->assertEquals('3', $dictionary->children[2]->urn);

        $sqlQuery = "DROP TABLE IF EXISTS tmp_testparsesql";
        Application::i()->SQL->query($sqlQuery);
    }


    /**
     * Проверка метода parseSQL() с опасным запросом
     */
    public function testParseSQLWithDangerousQuery()
    {
        $source = "DROP TABLE IF NOT EXISTS tmp_testparsesql1;";

        $dictionary = new CMSDictionary(1);
        $dictionary->parseSQL($source);

        $this->assertEmpty($dictionary->children);

        $sqlQuery = "DROP TABLE IF EXISTS tmp_testparsesql";
        Application::i()->SQL->query($sqlQuery);
    }


    /**
     * Проверка метода parseINI()
     */
    public function testParseINI()
    {
        $source = 'cat1="Category 1"' . "\n"
                . 'cat2="Category 2"' . "\n"
                . 'cat3="Category 3"' . "\n";

        $dictionary = new CMSDictionary(1);
        $dictionary->parseINI($source);

        $this->assertEquals('Category 1', $dictionary->children[0]->name);
        $this->assertEquals('cat1', $dictionary->children[0]->urn);
        $this->assertEquals('Category 2', $dictionary->children[1]->name);
        $this->assertEquals('cat2', $dictionary->children[1]->urn);
        $this->assertEquals('Category 3', $dictionary->children[2]->name);
        $this->assertEquals('cat3', $dictionary->children[2]->urn);
    }
}
