<?php
/**
 * Тест класса CustomField
 */
namespace RAAS;

use SOME\BaseTest;
use SOME\SOME;

class CustomFieldTest extends BaseTest
{
    public static $tables = ['attachments', 'cms_data'];

    use WithTempTablesTrait;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        static::setUpBeforeClassMethod();
    }


    /**
     * Проверка получения владельца
     */
    public function testOwner()
    {
        $item = new CustomEntity(['id' => 123, 'name' => 'Custom entity 123']);

        $field = new TestField();
        $field->Owner = $item;

        $this->assertInstanceOf(CustomEntity::class, $field->Owner);
        $this->assertEquals(123, $field->Owner->id);
        $this->assertEquals('Custom entity 123', $field->Owner->name);
    }

    /**
     * Проверка получения стратегии типа данных
     */
    public function testDatatypeStrategy()
    {
        $field = new TestField(['datatype' => 'select']);

        $result = $field->datatypeStrategy;

        $this->assertInstanceOf(SelectDatatypeStrategy::class, $result);
    }

    /**
     * Проверка получения стратегии источника
     */
    public function testSourceStrategy()
    {
        $field = new TestField(['name' => 'select', 'source_type' => 'csv']);

        $result = $field->sourceStrategy;

        $this->assertInstanceOf(CSVSourceStrategy::class, $result);
    }

    /**
     * Проверка получения стратегии источника
     */
    public function testSourceStrategyNull()
    {
        $field = new TestField(['name' => 'text']);

        $result = $field->sourceStrategy;

        $this->assertNull($result);
    }


    public function testStdSource()
    {
        $field = new TestField([
            'id' => 1,
            'urn' => 'test',
            'datatype' => 'select',
            'source_type' => 'ini',
            'source' => 'aaa="Test AAA"' . "\n" .
                        'bbb="Test BBB"' . "\n" .
                        'ccc="Test CCC"',
        ]);
        $expected = [
            'aaa' => ['name' => 'Test AAA'],
            'bbb' => ['name' => 'Test BBB'],
            'ccc' => ['name' => 'Test CCC'],
        ];

        $result = $field->stdSource;

        $this->assertEquals($expected, $result);

        $field2 = new TestField([
            'id' => 1,
            'urn' => 'test',
            'datatype' => 'select',
            'source_type' => 'ini',
            'source' => 'aaa="Test AAA"' . "\n" .
                        'bbb="Test BBB"' . "\n" .
                        'ccc="Test CCC"',
        ]);
        $result = $field2->stdSource; // Получает из кэша (с таким же ID#)

        $this->assertEquals($expected, $result);
    }


    /**
     * Провайдер данных для метода testField()
     * @return array <pre><code>array<[
     *     array<string[] => mixed> Набор полей для установки CustomField,
     *     array<string[] => mixed> Набор полей для проверки RAAS-поля
     * ]></code></pre>
     */
    public function fieldDataProvider(): array
    {
        return [
            [
                [
                    'datatype' => 'number',
                    'urn' => 'test',
                    'name' => 'Test',
                    'required' => '1',
                    'maxlength' => '4',
                    'defval' => '2',
                    'min_val' => '1',
                    'max_val' => '9999',
                    'step' => '2',
                    'placeholder' => 'Test field',
                    'pattern' => '\d+',
                ],
                [
                    'type' => 'number',
                    'name' => 'test',
                    'caption' => 'Test',
                    'required' => true,
                    'maxlength' => 4,
                    'default' => '2',
                    'min' => 1,
                    'max' => 9999,
                    'step' => 2,
                    'placeholder' => 'Test field',
                    'pattern' => '\d+',
                    'export' => 'is_null',
                ],
            ],
            [
                [
                    'datatype' => 'file',
                    'source' => 'image/jpeg, doc, docx, pdf, xls, xlsx',
                ],
                [
                    'type' => 'file',
                    'accept' => 'image/jpeg,.doc,.docx,.pdf,.xls,.xlsx',
                ],
            ],
        ];
    }


    /**
     * Проверка получения RAAS-поля
     * @dataProvider fieldDataProvider
     * @param array $fieldData <pre><code>array<string[] => mixed></code></pre> Набор полей для установки CustomField,
     * @param array $expected <pre><code>array<string[] => mixed></code></pre> Набор полей для проверки RAAS-поля
     */
    public function testField(array $fieldData, array $expected)
    {
        $field = new TestField($fieldData);

        $result = $field->Field;

        foreach ($expected as $key => $val) {
            $this->assertEquals($val, $result->$key);
        }
        $this->assertEquals($field, $result->meta['CustomField']);
    }


    /**
     * Проверка получения RAAS-поля с дочерними элементами
     */
    public function testFieldWithChildren()
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
        $field = new TestField(['name' => 'select', 'source_type' => 'csv', 'source' => $source]);

        $raasField = $field->Field;
        $children = $raasField->children;

        $this->assertInstanceOf(Option::class, $children[0]);
        $this->assertEquals('cat1', $children[0]->value);
        $this->assertEquals('Category 1', $children[0]->caption);
        $this->assertInstanceOf(Option::class, $children[1]);
        $this->assertEquals('cat2', $children[1]->value);
        $this->assertEquals('Category 2', $children[1]->caption);
        $this->assertInstanceOf(Option::class, $children[2]);
        $this->assertEquals('cat3', $children[2]->value);
        $this->assertEquals('Category 3', $children[2]->caption);
        $this->assertInstanceOf(Option::class, $children[0]->children[0]);
        $this->assertEquals('cat11', $children[0]->children[0]->value);
        $this->assertEquals('Category 11', $children[0]->children[0]->caption);
        $this->assertInstanceOf(Option::class, $children[0]->children[1]);
        $this->assertEquals('cat12', $children[0]->children[1]->value);
        $this->assertEquals('Category 12', $children[0]->children[1]->caption);
        $this->assertInstanceOf(Option::class, $children[0]->children[2]);
        $this->assertEquals('cat13', $children[0]->children[2]->value);
        $this->assertEquals('Category 13', $children[0]->children[2]->caption);
        $this->assertInstanceOf(Option::class, $children[0]->children[0]->children[0]);
        $this->assertEquals('cat111', $children[0]->children[0]->children[0]->value);
        $this->assertEquals('Category 111', $children[0]->children[0]->children[0]->caption);
        $this->assertInstanceOf(Option::class, $children[0]->children[0]->children[1]);
        $this->assertEquals('cat112', $children[0]->children[0]->children[1]->value);
        $this->assertEquals('Category 112', $children[0]->children[0]->children[1]->caption);
        $this->assertInstanceOf(Option::class, $children[0]->children[0]->children[2]);
        $this->assertEquals('cat113', $children[0]->children[0]->children[2]->value);
        $this->assertEquals('Category 113', $children[0]->children[0]->children[2]->caption);
    }


    /**
     * Провайдер данных для метода testInherited()
     * @return array <pre><code>array<[
     *     int ID# сущности,
     *     array Набор значений inherited полей,
     *     bool Ожидаемое значение,
     * ]></code></pre>
     */
    public function inheritedDataProvider(): array
    {
        return [
            [0, [], false],
            [1, [1, 1, 1], true],
            [2, [1, 0], false],
            [3, [1], true],
            [4, [0], false],
        ];
    }


    /**
     * Проверка получения наследования
     * @dataProvider inheritedDataProvider
     * @param int $itemId ID# сущности
     * @param array $inheritedVals Набор значений inherited полей
     * @param bool $expected Ожидаемое значение
     */
    public function testInherited(int $itemId, array $inheritedVals, bool $expected)
    {
        $field = new TestField(['id' => 1, 'urn' => 'test', 'type' => 'text', 'name' => 'Custom field']);
        if ($itemId) {
            $item = new CustomEntity(['id' => $itemId, 'name' => 'Custom entity ' . $itemId]);
            $field->Owner = $item;
        }

        $sqlArr = [];
        foreach ($inheritedVals as $i => $val) {
            $sqlArr[] = ['fid' => 1, 'pid' => $itemId, 'fii' => $i, 'value' => 'aaa', 'inherited' => $val];
        }
        Application::i()->SQL->add('tmp_data', $sqlArr);

        $result = $field->inherited;

        $this->assertEquals($expected, $result);
    }


    /**
     * Провайдер данных для метода testIsMediaFilled
     * @return array <pre><code>array<>
     *     array Данные поля,
     *     array POST-данные,
     *     bool Ожидаемое значение,
     * </code></pre>
     */
    public function isMediaFilledDataProvider(): array
    {
        return [
            [
                ['urn' => 'test', 'name' => 'Тест', 'datatype' => 'text', 'required' => true],
                ['test' => 'aaa'],
                false,
            ],
            [
                ['urn' => 'test', 'name' => 'Тест', 'datatype' => 'image', 'required' => true],
                [],
                false,
            ],
            [
                ['urn' => 'test', 'name' => 'Тест', 'datatype' => 'image', 'required' => true],
                ['test' => '123'],
                true,
            ],
            [
                ['urn' => 'test', 'name' => 'Тест', 'datatype' => 'image', 'multiple' => true, 'pattern' => 'favicon'],
                ['test' => [123, '456']],
                true,
            ],
            [
                ['urn' => 'test', 'name' => 'Тест', 'datatype' => 'image', 'multiple' => true, 'pattern' => 'favicon'],
                ['test' => ['aaa', 'bbb']],
                false,
            ],

        ];
    }


    /**
     * Проверяет поле на ошибки (с использованием метода $this->Field->check)
     * @dataProvider isMediaFilledDataProvider
     * @param array $fieldData Данные поля
     * @param array $postData POST-данные
     * @param bool $expected Ожидаемое значение
     */
    public function testIsMediaFilled(array $fieldData, array $postData, bool $expected)
    {
        $field = new TestField($fieldData);
        $form = new Form(['Item' => new CustomEntity()]);
        $raasField = $field->Field;
        $checkFunction = $raasField->isMediaFilled;
        $oldPost = $_POST;
        $_POST = $postData;

        $result = $checkFunction($raasField);

        $this->assertEquals($expected, $result);

        $_POST = $oldPost;
    }


    /**
     * Провайдер данных для метода testOnCommitWithScalar
     * @return array <pre><code>array<[
     *     array Установочные данные для поля
     *     mixed Входное значение
     *     array Список ожидаемых значение
     * ]></code></pre>
     */
    public function onCommitDataProvider(): array
    {
        $result = [
            [
                ['datatype' => 'date', 'multiple' => true],
                ['2023-11-12', '1900-01-01', 'aaa', '', '0000-00-00', '0001-01-01'],
                ['2023-11-12', '1900-01-01', '0000-00-00', '0000-00-00', '0000-00-00', '0001-01-01']
            ],
            [
                ['datatype' => 'datetime', 'multiple' => true],
                ['2023-11-12T16:05', '1900-01-01T10:00', 'aaa', '', '0001-01-01 12:30'],
                ['2023-11-12 16:05:00', '1900-01-01 10:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0001-01-01 12:30:00']
            ],
            [['datatype' => 'year'], '2023-01-01', ['2023']],
            [['datatype' => 'number'], '123,5', [123.5]],
            [['datatype' => 'time'], '12:05', ['12:05:00']],
            [['datatype' => 'time'], 'aaa', ['00:00:00']],
            [['datatype' => 'time'], '', ['00:00:00']],
            [['datatype' => 'month'], '2023-11', ['2023-11-01']],
            [['datatype' => 'month'], 'aaa', ['0000-00-00']],
            [['datatype' => 'month'], '0000-00', ['0000-00-00']],
            [['datatype' => 'month'], '0001-01', ['0001-01-01']],
            [['datatype' => 'week'], '2023-W01', ['2023-01-02']], // Хз почему так, но вроде так
            [['datatype' => 'week'], '0000-W00', ['0000-00-00']],
            [['datatype' => 'week'], 'aaa', ['0000-00-00']],
            [['datatype' => 'checkbox'], 'aaa ', ['aaa']],
            [['datatype' => 'checkbox', 'multiple' => true], ['aaa', 'bbb '], ['aaa', 'bbb']],
        ];
        return $result;
    }


    /**
     * Тест коммита (случай со скалярными значениями)
     * @dataProvider onCommitDataProvider
     * @param array $fieldData Установочные данные для поля
     * @param mixed $value Проверяемое значение
     * @param array $expected Список ожидаемых значение
     */
    public function testOnCommitWithScalar(array $fieldData, $value, $expected)
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(array_merge(['id' => 1, 'urn' => 'test'], $fieldData));
        $field->Owner = $item;
        $form = new Form(['Item' => $item]);
        $raasField = $field->Field;
        $onCommit = $raasField->oncommit;
        $oldPost = $_POST;
        $_POST = ['test' => $value];

        $onCommit($raasField);

        $sqlQuery = "SELECT value FROM tmp_data WHERE fid = 1 AND pid = 10 ORDER BY fii";
        $sqlResult = Application::i()->SQL->getcol($sqlQuery);

        $this->assertEquals($expected, $sqlResult);

        $_POST = $oldPost;
    }


    /**
     * Тест коммита (случай со медиа-полем)
     */
    public function testOnCommitWithMedia()
    {
        Application::i()->registrySet('maxsize', 1024);
        Application::i()->registrySet('tnsize', 128);
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'image', 'multiple' => true]);
        $field->Owner = $item;
        $form = new Form(['Item' => $item]);
        $raasField = $field->Field;
        $onCommit = $raasField->oncommit;

        $oldPost = $_POST;
        $oldFiles = $_FILES;
        $_POST = ['test' => [
            null, null, 20, null
        ]];
        $_FILES = ['test' => [
            'tmp_name' => [
                $this->getResourcesDir() . '/nophoto.jpg',
                $this->getResourcesDir() . '/notexist.jpg',
                null,
                $this->getResourcesDir() . '/favicon.svg',
            ],
            'name' => [
                'nophoto.jpg',
                'notexist.jpg',
                null,
                'favicon.svg',
            ],
            'type' => [
                'image/jpeg',
                'image/jpeg',
                null,
                'application/xml+svg',
            ],

        ]];

        $onCommit($raasField);

        $sqlQuery = "SELECT value FROM tmp_data WHERE fid = 1 AND pid = 10 ORDER BY fii";
        $sqlResult = Application::i()->SQL->getcol($sqlQuery);

        $this->assertIsArray($sqlResult);
        $this->assertNotEmpty($sqlResult[0]);
        $this->assertEquals(20, $sqlResult[1]);
        $this->assertNotEmpty($sqlResult[2]);

        $attachment1 = new Attachment($sqlResult[0]);
        $attachment2 = new Attachment($sqlResult[2]);
        $this->assertEquals('nophoto.jpg', $attachment1->filename);
        $this->assertEquals('image/jpeg', $attachment1->mime);
        $this->assertEquals(TestField::class, $attachment1->classname);
        $this->assertEquals(1, $attachment1->pid);
        $this->assertFileExists($attachment1->file);
        $this->assertEquals(true, $attachment1->image); // Вообще строка "1" - берется из базы

        $this->assertFileExists($attachment1->file);
        $this->assertInstanceOf(Attachment::class, $attachment2);
        $this->assertEquals($attachment1->id + 1, $attachment2->id);
        $this->assertEquals('favicon.svg', $attachment2->filename);
        $this->assertEquals('application/xml+svg', $attachment2->mime);
        $this->assertEquals(TestField::class, $attachment2->classname);
        $this->assertEquals(1, $attachment2->pid);
        $this->assertFileExists($attachment2->file);
        $this->assertEquals(true, $attachment2->image); // Вообще строка "1" - берется из базы

        $_POST = $oldPost;
        $_FILES = $oldFiles;

        Attachment::delete($attachment1);
        Attachment::delete($attachment2);
        Application::i()->registrySet('maxsize', null);
        Application::i()->registrySet('tnsize', null);
    }


    /**
     * Проверка метода import() у поля
     */
    public function testImport()
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text', 'multiple' => true]);
        $field->Owner = $item;
        $form = new Form(['Item' => $item]);
        $raasField = $field->Field;
        $import = $raasField->import;
        TestField::clearCache();
        $sqlArr = [
            ['pid' => 10, 'fid' => 1, 'fii' => 0, 'value' => 'aaa'],
            ['pid' => 10, 'fid' => 1, 'fii' => 1, 'value' => 'bbb'],
            ['pid' => 10, 'fid' => 1, 'fii' => 2, 'value' => 'ccc'],
        ];
        Application::i()->SQL->add('tmp_data', $sqlArr);

        $result = $import($raasField);

        $this->assertEquals(['aaa', 'bbb', 'ccc'], $result);
    }


    /**
     * Проверка метода prefetch()
     */
    public function testPrefetch()
    {
        $sqlArr = [
            ['pid' => 10, 'fid' => 1, 'fii' => 0, 'value' => 'aaa'],
            ['pid' => 10, 'fid' => 1, 'fii' => 1, 'value' => 'bbb'],
            ['pid' => 10, 'fid' => 1, 'fii' => 2, 'value' => 'ccc'],
            ['pid' => 10, 'fid' => 2, 'fii' => 0, 'value' => 'ddd'],
            ['pid' => 10, 'fid' => 2, 'fii' => 1, 'value' => 'eee'],
            ['pid' => 10, 'fid' => 3, 'fii' => 0, 'value' => 'fff'],

            ['pid' => 20, 'fid' => 1, 'fii' => 0, 'value' => 'ggg'],
            ['pid' => 20, 'fid' => 1, 'fii' => 1, 'value' => 'hhh'],
            ['pid' => 20, 'fid' => 1, 'fii' => 2, 'value' => 'iii'],
            ['pid' => 20, 'fid' => 2, 'fii' => 0, 'value' => 'jjj'],
            ['pid' => 20, 'fid' => 2, 'fii' => 1, 'value' => 'kkk'],
            ['pid' => 20, 'fid' => 3, 'fii' => 0, 'value' => 'lll'],

            ['pid' => 30, 'fid' => 1, 'fii' => 0, 'value' => 'mmm'],
            ['pid' => 30, 'fid' => 1, 'fii' => 1, 'value' => 'nnn'],
            ['pid' => 30, 'fid' => 1, 'fii' => 2, 'value' => 'ooo'],
            ['pid' => 30, 'fid' => 2, 'fii' => 0, 'value' => 'ppp'],
            ['pid' => 30, 'fid' => 2, 'fii' => 1, 'value' => 'qqq'],
            ['pid' => 30, 'fid' => 3, 'fii' => 0, 'value' => 'rrr'],
        ];
        Application::i()->SQL->add('tmp_data', $sqlArr);
        TestField::clearCache();

        $this->assertEmpty(TestField::$cache);

        TestField::prefetch([
            new CustomEntity(['id' => 10]),
            20
        ], [
            new TestField(['id' => 1]),
            2
        ]);

        $this->assertEquals([
            '10' => ['1' => ['aaa', 'bbb', 'ccc'], '2' => ['ddd', 'eee']],
            '20' => ['1' => ['ggg', 'hhh', 'iii'], '2' => ['jjj', 'kkk']],
        ], TestField::$cache);
    }


    /**
     * Проверка метода prefetch() (случай без указания родительских объектов и полей)
     */
    public function testPrefetchWithEmpty()
    {
        TestField::clearCache();

        $this->assertEmpty(TestField::$cache);

        TestField::prefetch();

        $this->assertEmpty(TestField::$cache);
    }


    /**
     * Проверка метода prefetchIfNotExists()
     */
    public function testPrefetchIfNotExists()
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text', 'multiple' => true]);
        $field->Owner = $item;
        $this->seedOneField();

        $this->assertEmpty(TestField::$cache);

        $field->prefetchIfNotExists();

        $this->assertEquals([
            '10' => ['1' => ['aaa', 'bbb', 'ccc']],
        ], TestField::$cache);

        $sqlArr = [
            ['pid' => 10, 'fid' => 1, 'fii' => 0, 'value' => 'ddd'],
            ['pid' => 10, 'fid' => 1, 'fii' => 1, 'value' => 'eee'],
            ['pid' => 10, 'fid' => 1, 'fii' => 2, 'value' => 'fff'],
        ];
        Application::i()->SQL->add('tmp_data', $sqlArr);

        $field->prefetchIfNotExists();

        $this->assertEquals([
            '10' => ['1' => ['aaa', 'bbb', 'ccc']],
        ], TestField::$cache);
    }


    /**
     * Проверка метода clearCache()
     */
    public function testClearCache()
    {
        $testCache = ['10' => ['1' => ['aaa', 'bbb', 'ccc']]];
        $testSourceCache = ['20' => ['1' => ['aaa', 'bbb', 'ccc']]];
        $testSourceAssocCache = ['30' => ['1' => ['aaa', 'bbb', 'ccc']]];
        $testSourceAssocReverse = ['40' => ['1' => ['aaa', 'bbb', 'ccc']]];
        TestField::$cache = $testCache;
        TestField::$sourceCache = $testSourceCache;
        TestField::$sourceAssocCache = $testSourceAssocCache;
        TestField::$sourceAssocCacheReverse = $testSourceAssocReverse;

        $this->assertEquals($testCache, TestField::$cache);
        $this->assertEquals($testSourceCache, TestField::$sourceCache);
        $this->assertEquals($testSourceAssocCache, TestField::$sourceAssocCache);
        $this->assertEquals($testSourceAssocReverse, TestField::$sourceAssocCacheReverse);

        TestField::clearCache();

        $this->assertEmpty(TestField::$cache);
        $this->assertEmpty(TestField::$sourceCache);
        $this->assertEmpty(TestField::$sourceAssocCache);
        $this->assertEmpty(TestField::$sourceAssocCacheReverse);
    }


    /**
     * Проверка метода commit()
     */
    public function testCommit()
    {
        $field = new TestField2(['type' => 'text', 'name' => 'Тест']);
        $field->commit();

        $this->assertEquals(1, $field->priority);
        $this->assertEquals('test', $field->urn);
        $this->assertEquals(CustomEntity::class, $field->classname);

        $field->commit();
        $this->assertEquals('test', $field->urn);

        $field2 = new TestField(['type' => 'text', 'name' => 'Тест']);
        $field2->commit();

        $this->assertEquals(2, $field2->priority);
        $this->assertEquals('test', $field2->urn);
        $this->assertEquals(SOME::class, $field2->classname);

        $field3 = new TestField2(['type' => 'text', 'name' => 'Тест', 'classname' => Attachment::class]);
        $field3->commit();

        $this->assertEquals(3, $field3->priority);
        $this->assertEquals('test', $field3->urn);
        $this->assertEquals(Attachment::class, $field3->classname);

        $field4 = new TestField2(['type' => 'text', 'name' => 'Тест', 'classname' => Attachment::class]);
        $field4->commit();

        $this->assertEquals(4, $field4->priority);
        $this->assertEquals('_test_', $field4->urn);
        $this->assertEquals(Attachment::class, $field4->classname);

        $field5 = new TestField2(['type' => 'text', 'name' => 'Тест', 'classname' => Attachment::class]);
        $field5->commit();

        $this->assertEquals(5, $field5->priority);
        $this->assertEquals('__test__', $field5->urn);
        $this->assertEquals(Attachment::class, $field5->classname);
    }


    /**
     * Провайдер данных для метода testIsFilled
     * @return array <pre><code>array<[
     *     array Данные поля,
     *     mixed Данные для проверки
     *     bool Ожидаемый результат,
     * ]></code></pre>
     */
    public function isFilledDataProvider(): array
    {
        $result = [
            [
                ['urn' => 'test', 'datatype' => 'text'],
                'aaa',
                true,
            ],
            [
                ['urn' => 'test', 'datatype' => 'text'],
                '',
                false,
            ],
            [
                ['urn' => 'test', 'datatype' => 'date'],
                '2023-11-12',
                true,
            ],
            [
                ['urn' => 'test', 'datatype' => 'date'],
                '0000-00-00',
                false,
            ],
            [
                ['urn' => 'test', 'datatype' => 'datetime'],
                '2023-11-12T14:14',
                true,
            ],
            [
                ['urn' => 'test', 'datatype' => 'datetime'],
                '0000-00-00T00:00',
                false,
            ],
            [
                ['urn' => 'test', 'datatype' => 'month'],
                '2023-11',
                true,
            ],
            [
                ['urn' => 'test', 'datatype' => 'month'],
                '0000-00',
                false,
            ],
            [
                ['urn' => 'test', 'datatype' => 'week'],
                '2023-W11',
                true,
            ],
            [
                ['urn' => 'test', 'datatype' => 'week'],
                '0000-W00',
                false,
            ],
            [
                ['urn' => 'test', 'datatype' => 'number'],
                '123',
                true,
            ],
            [
                ['urn' => 'test', 'datatype' => 'number'],
                '0.0',
                false,
            ],
            [
                ['urn' => 'test', 'datatype' => 'number'],
                '0,00',
                false,
            ],
            [
                ['urn' => 'test', 'datatype' => 'image'],
                $this->getResourcesDir() . '/nophoto.jpg',
                true,
            ],
            [
                ['urn' => 'test', 'datatype' => 'image'],
                $this->getResourcesDir() . '/aaa.jpg',
                false,
            ],
            [
                ['urn' => 'test', 'caption' => 'Тест', 'datatype' => 'image', 'required' => true],
                '',
                false,
            ],

        ];
        return $result;
    }


    /**
     * Проверка метода isFilled()
     * @dataProvider isFilledDataProvider
     * @param array $fieldData Данные поля
     * @param mixed $value Данные для проверки
     * @param bool $expected Ожидаемое значение
     */
    public function testIsFilled(array $fieldData, $value, bool $expected)
    {
        $field = new TestField($fieldData);

        $result = $field->isFilled($value);

        $this->assertEquals($expected, $result);
    }


    /**
     * Провайдер данных для метода testValidate
     * @return array <pre><code>array<[
     *     array Установочные данные для поля
     *     mixed Проверяемое значение
     *     bool Ожидаемый результат
     * ]></code></pre>
     */
    public function validateDataProvider(): array
    {
        $result = [
            [[], ' ', true],
            [[], ['aaa' => 'bbb'], true],
            [['pattern' => '^\\d+$'], '123', true],
            [['pattern' => '^\\d+$'], 'aaa', false],
            [['datatype' => 'color'], '#abcdef', true],
            [['datatype' => 'color'], '#zzzzzz', false],
            [['datatype' => 'date'], '2023-11-12', true],
            [['datatype' => 'date'], 'abc', false],
            [['datatype' => 'datetime'], '2023-11-12T14:26', true],
            [['datatype' => 'datetime'], '2023-11-12 14:26', true],
            [['datatype' => 'datetime'], '2023-99-99 14:26', false],
            [['datatype' => 'datetime'], '2023-11-12T99:99', false],
            [['datatype' => 'datetime'], 'aaa', false],
            [['datatype' => 'month'], '2023-11', true],
            [['datatype' => 'month'], '2023-99', false],
            [['datatype' => 'week'], '2023-W01', true],
            [['datatype' => 'week'], '2023-01', true],
            [['datatype' => 'email'], 'info@volumnet.ru', true],
            [['datatype' => 'email'], 'aaa', false],
            [['datatype' => 'url'], 'https://volumnet.ru', true],
            [['datatype' => 'url'], 'aaa', false],
            [['datatype' => 'number'], 'aaa', false],
            [['datatype' => 'number', 'min_val' => 10], 9, false],
            [['datatype' => 'number', 'max_val' => 999], 1000, false],
            [['datatype' => 'number', 'min_val' => 10, 'max_val' => 999], 100, true],
            [['datatype' => 'time'], '14:28', true],
            [['datatype' => 'time'], '99:99', false],
            [['datatype' => 'time'], '23:99', false],
            [['datatype' => 'time'], '23:59:99', false],
            [['datatype' => 'time'], 'aaa', false],
            [
                ['datatype' => 'image'],
                [
                    'tmp_name' => $this->getResourcesDir() . '/nophoto.jpg',
                    'name' => 'nophoto.jpg',
                    'type' => 'image/jpeg',
                ],
                true],
            [
                ['datatype' => 'image'],
                [
                    'tmp_name' => $this->getResourcesDir() . '/favicon.svg',
                    'name' => 'favicon.svg',
                    'type' => 'application/xml+svg',
                ],
                true],
            [
                ['datatype' => 'image'],
                [
                    'tmp_name' => __FILE__,
                    'name' => basename(__FILE__),
                    'type' => 'text/php',
                ],
                false],
            [
                ['datatype' => 'image'],
                [
                    'tmp_name' => '',
                    'name' => '',
                    'type' => '',
                ],
                true],
        ];
        return $result;
    }


    /**
     * Проверка метода validate()
     * @dataProvider validateDataProvider
     * @param array $fieldData Установочные данные для поля
     * @param mixed $value Проверяемое значение
     * @param bool $expected Ожидаемое значение
     */
    public function testValidate(array $fieldData, $value, bool $expected)
    {
        $field = new TestField($fieldData);

        $result = $field->validate($value);

        $this->assertEquals($expected, $result);
    }


    /**
     * Записать данные для одного поля и одной сущности, подготовить кэш поля
     */
    public function seedOneField()
    {
        $sqlArr = [
            ['pid' => 10, 'fid' => 1, 'fii' => 0, 'value' => 'aaa'],
            ['pid' => 10, 'fid' => 1, 'fii' => 1, 'value' => 'bbb'],
            ['pid' => 10, 'fid' => 1, 'fii' => 2, 'value' => 'ccc'],
        ];
        Application::i()->SQL->add('tmp_data', $sqlArr);
        TestField::clearCache();
    }


    /**
     * Проверка метода getRawValue()
     */
    public function testGetRawValue()
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'number']);
        $field->Owner = $item;
        $sqlArr = [
            ['pid' => 10, 'fid' => 1, 'fii' => 0, 'value' => '1,42'],
        ];
        Application::i()->SQL->add('tmp_data', $sqlArr);
        TestField::clearCache();

        $result = $field->getRawValue();

        $this->assertEquals('1,42', $result);
        $this->assertEquals('1,42', TestField::$cache[10][1][0]);
    }


    /**
     * Проверка метода getRawValue() (случай без владельца)
     */
    public function testGetRawValueWithoutOwner()
    {
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text', 'multiple' => true]);
        $this->seedOneField();

        $result = $field->getRawValue(1);

        $this->assertNull($result);
        $this->assertFalse(isset(TestField::$cache[10][1][1]));
    }


    /**
     * Проверка метода getValue()
     */
    public function testGetValue()
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text', 'multiple' => true]);
        $field->Owner = $item;
        $this->seedOneField();

        $result = $field->getValue(1);

        $this->assertEquals('bbb', $result);
        $this->assertEquals('bbb', TestField::$cache[10][1][1]);
    }


    /**
     * Проверка метода getValue() - случай с числовым значением
     */
    public function testGetValueWithNumber()
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'number']);
        $field->Owner = $item;
        $sqlArr = [
            ['pid' => 10, 'fid' => 1, 'fii' => 0, 'value' => '1,42'],
        ];
        Application::i()->SQL->add('tmp_data', $sqlArr);
        TestField::clearCache();

        $result = $field->getValue();

        $this->assertEquals('1.42', $result);
        $this->assertEquals('1,42', TestField::$cache[10][1][0]);
    }


    /**
     * Проверка метода getValue()
     */
    public function testGetValueWithMedia()
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'file', 'multiple' => true]);
        $field->Owner = $item;
        $attachment = new Attachment();
        $attachment->filename = 'aaa.txt';
        $attachment->touchFile = true;
        $attachment->commit();
        $attachmentId = (int)$attachment->id;
        $sqlArr = [
            ['pid' => 10, 'fid' => 1, 'fii' => 0, 'value' => $attachmentId],

        ];
        Application::i()->SQL->add('tmp_data', $sqlArr);
        TestField::clearCache();

        $result = $field->getValue();

        $this->assertInstanceOf(Attachment::class, $result);
        $this->assertEquals($attachmentId, $result->id);
        $this->assertEquals($attachmentId, TestField::$cache[10][1][0]);
        Attachment::delete($attachment);
    }


    /**
     * Проверка метода getValue() (случай без владельца)
     */
    public function testGetValueWithoutOwner()
    {
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text', 'multiple' => true]);
        $this->seedOneField();

        $result = $field->getValue(1);

        $this->assertNull($result);
        $this->assertFalse(isset(TestField::$cache[10][1][1]));
    }


    /**
     * Проверка метода getRawValues()
     */
    public function testGetRawValues()
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text']);
        $field->Owner = $item;
        $this->seedOneField();

        $result = $field->getRawValues();

        $this->assertEquals('aaa', $result);
        $this->assertEquals(['aaa', 'bbb', 'ccc'], TestField::$cache[10][1]);
    }


    /**
     * Проверка метода getRawValues() (отсутствие владельца)
     */
    public function testGetRawValuesWithoutOwner()
    {
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text']);
        $this->seedOneField();

        $result = $field->getRawValues();

        $this->assertNull($result);
        $this->assertFalse(isset(TestField::$cache[10][1]));
    }

    /**
     * Проверка метода getRawValues() (множественное поле)
     */
    public function testGetRawValuesWithMultiple()
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text', 'multiple' => true]);
        $field->Owner = $item;
        $this->seedOneField();

        $result = $field->getRawValues();

        $this->assertEquals(['aaa', 'bbb', 'ccc'], $result);
        $this->assertEquals(['aaa', 'bbb', 'ccc'], TestField::$cache[10][1]);
    }


    /**
     * Проверка метода getRawValues() (принудительное приведение к массиву)
     */
    public function testGetRawValuesWithForceArray()
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text']);
        $field->Owner = $item;
        $this->seedOneField();

        $result = $field->getRawValues(true);

        $this->assertEquals(['aaa', 'bbb', 'ccc'], $result);
        $this->assertEquals(['aaa', 'bbb', 'ccc'], TestField::$cache[10][1]);
    }


    /**
     * Проверка метода getValues()
     */
    public function testGetValues()
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text']);
        $field->Owner = $item;
        $this->seedOneField();

        $result = $field->getValues();

        $this->assertEquals('aaa', $result);
        $this->assertEquals(['aaa', 'bbb', 'ccc'], TestField::$cache[10][1]);
    }


    /**
     * 2023-12-05: Проверка метода getValues() с множественным полем и пустыми данными
     */
    public function testGetValuesWithMultipleFieldEmptyData()
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text', 'multiple' => true]);
        $field->Owner = $item;
        TestField::clearCache();

        $result = $field->getValues(false);

        $this->assertEmpty($result);
    }


    /**
     * Проверка метода getValues() (отсутствие владельца)
     */
    public function testGetValuesWithoutOwner()
    {
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text']);
        $this->seedOneField();

        $result = $field->getValues();

        $this->assertNull($result);
        $this->assertFalse(isset(TestField::$cache[10][1]));
    }


    /**
     * Проверка метода getValues() (множественное поле)
     */
    public function testGetValuesWithMultiple()
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text', 'multiple' => true]);
        $field->Owner = $item;
        $this->seedOneField();

        $result = $field->getValues();

        $this->assertEquals(['aaa', 'bbb', 'ccc'], $result);
        $this->assertEquals(['aaa', 'bbb', 'ccc'], TestField::$cache[10][1]);
    }


    /**
     * Проверка метода getValues() (принудительное приведение к массиву)
     */
    public function testGetValuesWithForceArray()
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text']);
        $field->Owner = $item;
        $this->seedOneField();

        $result = $field->getValues(true);

        $this->assertEquals(['aaa', 'bbb', 'ccc'], $result);
        $this->assertEquals(['aaa', 'bbb', 'ccc'], TestField::$cache[10][1]);
    }


    /**
     * Проверка метода countValues()
     */
    public function testCountValues()
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text']);
        $field->Owner = $item;
        $this->seedOneField();

        $result = $field->countValues();

        $this->assertEquals(3, $result);
    }


    /**
     * Проверка метода countValues() - случай без владельца
     */
    public function testCountValuesWithoutOwner()
    {
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text']);
        $this->seedOneField();

        $result = $field->countValues();

        $this->assertNull($result);
    }


    /**
     * Проверка метода setValue()
     */
    public function testSetValue()
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text']);
        $field->Owner = $item;
        $this->seedOneField();

        $sqlQuery = "SELECT fii, value FROM tmp_data WHERE pid = 10 AND fid = 1 ORDER BY fii";
        $sqlResult = Application::i()->SQL->get($sqlQuery);

        $value = $field->getValue(1);

        $this->assertEquals('bbb', $value);
        $this->assertEquals([
            ['fii' => 0, 'value' => 'aaa'],
            ['fii' => 1, 'value' => 'bbb'],
            ['fii' => 2, 'value' => 'ccc'],
        ], $sqlResult);
        $this->assertEquals(['aaa', 'bbb', 'ccc'], TestField::$cache[10][1]);

        $result = $field->setValue('ddd', 1);

        $sqlQuery = "SELECT fii, value FROM tmp_data WHERE pid = 10 AND fid = 1 ORDER BY fii";
        $sqlResult = Application::i()->SQL->get($sqlQuery);

        $this->assertEquals('ddd', $result);
        $this->assertEquals([
            ['fii' => 0, 'value' => 'aaa'],
            ['fii' => 1, 'value' => 'ddd'],
            ['fii' => 2, 'value' => 'ccc'],
        ], $sqlResult);
        $this->assertEquals(['aaa', 'ddd', 'ccc'], TestField::$cache[10][1]);
    }


    /**
     * Проверка метода setValue() - случай без владельца
     */
    public function testSetValueWithoutOwner()
    {
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text']);
        $this->seedOneField();

        $result = $field->setValue(2);

        $this->assertNull($result);
    }


    /**
     * Проверка метода addValue()
     */
    public function testAddValue()
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text']);
        $field->Owner = $item;
        $this->seedOneField();

        $sqlQuery = "SELECT fii, value FROM tmp_data WHERE pid = 10 AND fid = 1 ORDER BY fii";
        $sqlResult = Application::i()->SQL->get($sqlQuery);

        $value = $field->getValue(1);

        $this->assertEquals('bbb', $value);
        $this->assertEquals([
            ['fii' => 0, 'value' => 'aaa'],
            ['fii' => 1, 'value' => 'bbb'],
            ['fii' => 2, 'value' => 'ccc'],
        ], $sqlResult);
        $this->assertEquals(['aaa', 'bbb', 'ccc'], TestField::$cache[10][1]);

        $result = $field->addValue('ddd', 1);

        $sqlQuery = "SELECT fii, value FROM tmp_data WHERE pid = 10 AND fid = 1 ORDER BY fii";
        $sqlResult = Application::i()->SQL->get($sqlQuery);

        $this->assertEquals('ddd', $result);
        $this->assertEquals([
            ['fii' => 0, 'value' => 'aaa'],
            ['fii' => 1, 'value' => 'ddd'],
            ['fii' => 2, 'value' => 'bbb'],
            ['fii' => 3, 'value' => 'ccc'],
        ], $sqlResult);
        $this->assertEquals(['aaa', 'ddd', 'bbb', 'ccc'], TestField::$cache[10][1]);
    }


    /**
     * Проверка метода addValue() - случай без владельца
     */
    public function testAddValueWithoutOwner()
    {
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text']);
        $this->seedOneField();

        $result = $field->addValue(1);

        $this->assertNull($result);
    }


    /**
     * Проверка метода deleteValue()
     */
    public function testDeleteValue()
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text']);
        $field->Owner = $item;
        $this->seedOneField();

        $sqlQuery = "SELECT fii, value FROM tmp_data WHERE pid = 10 AND fid = 1 ORDER BY fii";
        $sqlResult = Application::i()->SQL->get($sqlQuery);

        $field->getValues();

        $this->assertEquals([
            ['fii' => 0, 'value' => 'aaa'],
            ['fii' => 1, 'value' => 'bbb'],
            ['fii' => 2, 'value' => 'ccc'],
        ], $sqlResult);
        $this->assertEquals(['aaa', 'bbb', 'ccc'], TestField::$cache[10][1]);

        $field->deleteValue(1);

        $sqlQuery = "SELECT fii, value FROM tmp_data WHERE pid = 10 AND fid = 1 ORDER BY fii";
        $sqlResult = Application::i()->SQL->get($sqlQuery);

        $this->assertEquals([
            ['fii' => 0, 'value' => 'aaa'],
            ['fii' => 1, 'value' => 'ccc'],
        ], $sqlResult);
        $this->assertEquals(['aaa', 'ccc'], TestField::$cache[10][1]);
    }


    /**
     * Проверка метода deleteValue() - случай без владельца
     */
    public function testDeleteValueWithoutOwner()
    {
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text']);
        $this->seedOneField();

        $result = $field->deleteValue(1);

        $this->assertNull($result);
    }


    /**
     * Проверка метода deleteValues()
     */
    public function testDeleteValues()
    {
        $item = new CustomEntity(['id' => 10]);
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text']);
        $field->Owner = $item;
        $this->seedOneField();

        $sqlQuery = "SELECT fii, value FROM tmp_data WHERE pid = 10 AND fid = 1 ORDER BY fii";
        $sqlResult = Application::i()->SQL->get($sqlQuery);

        $field->getValues();

        $this->assertEquals([
            ['fii' => 0, 'value' => 'aaa'],
            ['fii' => 1, 'value' => 'bbb'],
            ['fii' => 2, 'value' => 'ccc'],
        ], $sqlResult);
        $this->assertEquals(['aaa', 'bbb', 'ccc'], TestField::$cache[10][1]);

        $field->deleteValues();

        $sqlQuery = "SELECT fii, value FROM tmp_data WHERE pid = 10 AND fid = 1 ORDER BY fii";
        $sqlResult = Application::i()->SQL->get($sqlQuery);

        $this->assertEmpty($sqlResult);
        $this->assertFalse(isset(TestField::$cache[10][1]));
    }


    public function testClearLostAttachments()
    {
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'image']);
        $attachment1 = new Attachment();
        $attachment1->filename = 'aaa.txt';
        $attachment1->touchFile = true;
        $attachment1->parent = $field;
        $attachment1->commit();
        $attachment1Id = (int)$attachment1->id;

        $attachment2 = new Attachment();
        $attachment2->filename = 'bbb.txt';
        $attachment2->touchFile = true;
        $attachment2->parent = $field;
        $attachment2->commit();
        $attachment2Id = (int)$attachment2->id;

        $attachment3 = new Attachment();
        $attachment3->filename = 'ccc.txt';
        $attachment3->touchFile = true;
        $attachment3->parent = $field;
        $attachment3->commit();
        $attachment3Id = (int)$attachment3->id;
        $sqlArr = [
            ['pid' => 10, 'fid' => 1, 'fii' => 0, 'value' => $attachment3Id],
        ];
        Application::i()->SQL->add('tmp_data', $sqlArr);
        TestField::clearCache();

        $ids = [$attachment1Id, $attachment2Id, $attachment3Id];
        $sqlQuery = "SELECT id FROM " . Attachment::_tablename() . " WHERE id IN (" . implode(", ", $ids) . ") ORDER BY id";
        $sqlResult = Application::i()->SQL->getcol($sqlQuery);

        $this->assertEquals($ids, $sqlResult);
        $this->assertFileExists($attachment1->file);
        $this->assertFileExists($attachment2->file);
        $this->assertFileExists($attachment3->file);

        $field->clearLostAttachments();

        $sqlResult = Application::i()->SQL->getcol($sqlQuery);

        $this->assertEquals([$attachment3Id], $sqlResult);
        $this->assertFileDoesNotExist($attachment1->file);
        $this->assertFileDoesNotExist($attachment2->file);
        $this->assertFileExists($attachment3->file);

        Attachment::delete($attachment3);
    }


    /**
     * Проверка метода inheritValues()
     */
    public function testInheritValues()
    {
        $sqlArr = [
            ['id' => 10, 'pid' => 0],
            ['id' => 20, 'pid' => 10],
            ['id' => 30, 'pid' => 20],
        ];
        Application::i()->SQL->add('tmp_entities', $sqlArr);
        $sqlArr = [
            ['pid' => 10, 'fid' => 1, 'fii' => 0, 'value' => 'aaa', 'inherited' => 0],
            ['pid' => 10, 'fid' => 1, 'fii' => 1, 'value' => 'bbb', 'inherited' => 0],
            ['pid' => 10, 'fid' => 1, 'fii' => 2, 'value' => 'ccc', 'inherited' => 0],
            ['pid' => 20, 'fid' => 1, 'fii' => 0, 'value' => 'ddd', 'inherited' => 0],
            ['pid' => 20, 'fid' => 1, 'fii' => 1, 'value' => 'eee', 'inherited' => 0],
            ['pid' => 20, 'fid' => 1, 'fii' => 2, 'value' => 'fff', 'inherited' => 0],
            ['pid' => 30, 'fid' => 1, 'fii' => 0, 'value' => 'ggg', 'inherited' => 0],
            ['pid' => 30, 'fid' => 1, 'fii' => 1, 'value' => 'hhh', 'inherited' => 0],
            ['pid' => 30, 'fid' => 1, 'fii' => 2, 'value' => 'jjj', 'inherited' => 0],
        ];
        Application::i()->SQL->add('tmp_data', $sqlArr);

        $field = new TestField(['id' => 1]);
        $entity = new CustomEntity(['id' => 10]);
        $field->Owner = $entity;

        $field->inheritValues();

        $sqlQuery = "SELECT pid, fid, fii, value, inherited FROM tmp_data ORDER BY pid, fii";
        $expected = [
            ['pid' => 10, 'fid' => 1, 'fii' => 0, 'value' => 'aaa', 'inherited' => 1],
            ['pid' => 10, 'fid' => 1, 'fii' => 1, 'value' => 'bbb', 'inherited' => 1],
            ['pid' => 10, 'fid' => 1, 'fii' => 2, 'value' => 'ccc', 'inherited' => 1],
            ['pid' => 20, 'fid' => 1, 'fii' => 0, 'value' => 'aaa', 'inherited' => 1],
            ['pid' => 20, 'fid' => 1, 'fii' => 1, 'value' => 'bbb', 'inherited' => 1],
            ['pid' => 20, 'fid' => 1, 'fii' => 2, 'value' => 'ccc', 'inherited' => 1],
            ['pid' => 30, 'fid' => 1, 'fii' => 0, 'value' => 'aaa', 'inherited' => 1],
            ['pid' => 30, 'fid' => 1, 'fii' => 1, 'value' => 'bbb', 'inherited' => 1],
            ['pid' => 30, 'fid' => 1, 'fii' => 2, 'value' => 'ccc', 'inherited' => 1],
        ];
        $sqlResult = Application::i()->SQL->get($sqlQuery);

        $this->assertEquals($expected, $sqlResult);
    }


    /**
     * Проверка метода deleteValues() - случай без владельца
     */
    public function testDeleteValuesWithoutOwner()
    {
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'text']);
        $this->seedOneField();

        $result = $field->deleteValues();

        $this->assertNull($result);
    }


    /**
     * Провайдер данных для метода testDoRich()
     * @return array <pre><code>array<[
     *     array Данные поля,
     *     mixed Ожидаемое значение,
     *     mixed? Проверяемое значение,
     *     array? Данные сущности
     * ]></code></pre>
     */
    public function doRichDataProvider(): array
    {
        $attachment = new Attachment(['id' => 123]);
        return [
            [
                [
                    'id' => 1,
                    'urn' => 'test',
                    'datatype' => 'select',
                    'source_type' => 'ini',
                    'source' => 'aaa="Test AAA"' . "\n" .
                                'bbb="Test BBB"' . "\n" .
                                'ccc="Test CCC"',
                ],
                'Test AAA',
                null,
                ['id' => 10],
            ],
            [
                [
                    'id' => 1,
                    'urn' => 'test',
                    'datatype' => 'select',
                    'source_type' => 'ini',
                    'source' => 'aaa="Test AAA"' . "\n" .
                                'bbb="Test BBB"' . "\n" .
                                'ccc="Test CCC"',
                ],
                'Test BBB',
                'bbb',
            ],
            [
                [
                    'id' => 1,
                    'urn' => 'test',
                    'datatype' => 'file',
                    'source' => 'PNG, GIF',
                ],
                'bbb',
                'bbb',
            ],
            [
                [
                    'id' => 1,
                    'urn' => 'test',
                    'datatype' => 'checkbox',
                ],
                true,
                'bbb',
            ],
            [
                [
                    'id' => 1,
                    'urn' => 'test',
                    'datatype' => 'select',
                    'source_type' => 'ini',
                    'source' => 'aaa="Test AAA"' . "\n" .
                                'bbb="Test BBB"' . "\n" .
                                'ccc="Test CCC"',
                ],
                null,
                '',
            ],
            [
                [
                    'id' => 1,
                    'urn' => 'test',
                    'type' => 'image',
                ],
                $attachment,
                $attachment,
            ],
        ];
    }


    /**
     * Проверка метода doRich()
     * @dataProvider doRichDataProvider
     * @param $fieldData  Данные поля,
     * @param $expected Ожидаемое значение,
     * @param $value  Проверяемое значение,
     * @param $itemData Данные сущности
     */
    public function testDoRich($fieldData, $expected, $value = null, $itemData = [])
    {
        $field = new TestField($fieldData);
        if ($itemData) {
            $item = new CustomEntity($itemData);
            $field->Owner = $item;
            $this->seedOneField();
        } else {
            TestField::clearCache();
        }

        $result = $field->doRich($value);

        $this->assertEquals($expected, $result);
    }


    /**
     * Проверка метода getRichValue()
     */
    public function testGetRichValue()
    {
        $field = new TestField([
            'id' => 1,
            'urn' => 'test',
            'datatype' => 'select',
            'source_type' => 'ini',
            'source' => 'aaa="Test AAA"' . "\n" .
                        'bbb="Test BBB"' . "\n" .
                        'ccc="Test CCC"',
        ]);
        $item = new CustomEntity(['id' => 10]);
        $field->Owner = $item;
        $this->seedOneField();

        $result = $field->getRichValue(1);

        $this->assertEquals('Test BBB', $result);
    }


    /**
     * Провайдер данных для метода testGetRichValues
     * @return array <pre><code>array<[
     *     array Данные поля,
     *     bool $forceArray Привести к массиву,
     *     array $expected Ожидаемое значение
     * ]></code></pre>
     */
    public function getRichValuesDataProvider(): array
    {
        return [
            [
                [
                    'id' => 1,
                    'urn' => 'test',
                    'datatype' => 'select',
                    'source_type' => 'ini',
                    'source' => 'aaa="Test AAA"' . "\n" .
                                'bbb="Test BBB"' . "\n" .
                                'ccc="Test CCC"',
                ],
                false,
                'Test AAA'
            ],
            [
                [
                    'id' => 1,
                    'urn' => 'test',
                    'datatype' => 'select',
                    'source_type' => 'ini',
                    'source' => 'aaa="Test AAA"' . "\n" .
                                'bbb="Test BBB"' . "\n" .
                                'ccc="Test CCC"',
                ],
                true,
                ['Test AAA', 'Test BBB', 'Test CCC']
            ],
            [
                [
                    'id' => 1,
                    'multiple' => true,
                    'urn' => 'test',
                    'datatype' => 'select',
                    'source_type' => 'ini',
                    'source' => 'aaa="Test AAA"' . "\n" .
                                'bbb="Test BBB"' . "\n" .
                                'ccc="Test CCC"',
                ],
                false,
                ['Test AAA', 'Test BBB', 'Test CCC']
            ],
        ];
    }


    /**
     * Проверка метода getRichValues()
     * @dataProvider getRichValuesDataProvider
     * @param array $fieldData Данные поля
     * @param bool $forceArray Привести к массиву
     * @param mixed expected Ожидаемое значение
     */
    public function testGetRichValues(array $fieldData, bool $forceArray, $expected)
    {
        $field = new TestField($fieldData);
        $item = new CustomEntity(['id' => 10]);
        $field->Owner = $item;
        $this->seedOneField();

        $result = $field->getRichValues($forceArray);

        $this->assertEquals($expected, $result);
    }


    /**
     * Проверка метода getRichString()
     */
    public function testGetRichString()
    {
        $field = new TestField([
            'id' => 1,
            'multiple' => true,
            'urn' => 'test',
            'datatype' => 'select',
            'source_type' => 'ini',
            'source' => 'aaa="Test AAA"' . "\n" .
                        'bbb="Test BBB"' . "\n" .
                        'ccc="Test CCC"',
        ]);
        $item = new CustomEntity(['id' => 10]);
        $field->Owner = $item;
        $this->seedOneField();

        $result = $field->getRichString();

        $this->assertEquals('Test AAA, Test BBB, Test CCC', $result);
    }


    /**
     * Проверка метода getRichString() - случай с объектами
     */
    public function testGetRichStringWithObjects()
    {
        $field = new TestFieldMockObjectGetValues([
            'id' => 1,
            'multiple' => true,
            'urn' => 'test',
            'datatype' => 'image',
        ]);

        $result = $field->getRichString();

        $this->assertEquals('Entity 1, Entity 2, Entity 3', $result);
    }


    /**
     * Провайдер данных для метода testFromRich()
     * @return array <pre><code>array<[
     *     array Данные поля,
     *     mixed? Проверяемое значение,
     *     mixed Ожидаемое значение,
     * ]></code></pre>
     */
    public function fromRichDataProvider(): array
    {
        $attachment = new Attachment(['id' => 123]);
        return [
            [
                [
                    'id' => 1,
                    'urn' => 'test',
                    'datatype' => 'select',
                    'source_type' => 'ini',
                    'source' => 'aaa="Test AAA"' . "\n" .
                                'bbb="Test BBB"' . "\n" .
                                'ccc="Test CCC"',
                ],
                'Test AAA',
                'aaa',
            ],
            [
                [
                    'id' => 1,
                    'urn' => 'test',
                    'datatype' => 'file',
                    'source' => 'PNG, GIF',
                ],
                'bbb',
                'bbb',
            ],
            [
                [
                    'id' => 1,
                    'urn' => 'test',
                    'datatype' => 'select',
                    'source_type' => 'ini',
                    'source' => 'aaa="Test AAA"' . "\n" .
                                'bbb="Test BBB"' . "\n" .
                                'ccc="Test CCC"',
                ],
                '',
                null,
            ],
            [
                [
                    'id' => 1,
                    'urn' => 'test',
                    'datatype' => 'checkbox',
                ],
                'Test BBB',
                true,
            ],
            [
                [
                    'id' => 1,
                    'urn' => 'test',
                    'type' => 'image',
                ],
                $attachment,
                $attachment,
            ],
        ];
    }


    /**
     * Проверка метода fromRich()
     * @dataProvider fromRichDataProvider
     * @param $fieldData  Данные поля,
     * @param $expected Ожидаемое значение,
     * @param $value  Проверяемое значение,
     * @param $itemData Данные сущности
     */
    public function testFromRich($fieldData, $value, $expected)
    {
        $field = new TestField($fieldData);
        TestField::clearCache();

        $result = $field->fromRich($value);

        $this->assertEquals($expected, $result);
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
        $field = new TestField(['name' => 'select', 'source_type' => 'csv', 'source' => $source]);

        $result = $field->stdSource;
        $expected = [
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

        $this->assertEquals($expected, $result);
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
        $field = new TestField(['name' => 'select', 'source_type' => 'xml', 'source' => $source]);

        $result = $field->stdSource;
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
     * Проверка метода parseXML() с ошибкой
     */
    public function testParseXMLWithError()
    {
        $source = ' <abc> ';
        $field = new TestField(['name' => 'select', 'source_type' => 'xml', 'source' => $source]);

        $result = $field->stdSource;
        $expected = [];

        $this->assertEquals($expected, $result);
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
        $field = new TestField(['name' => 'select', 'source_type' => 'sql', 'source' => $source]);

        $result = $field->stdSource;
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
        $field = new TestField(['name' => 'select', 'source_type' => 'sql', 'source' => $source]);

        $result = $field->stdSource;
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
     * Проверка метода parseSQL() с опасным запросом
     */
    public function testParseSQLWithDangerousQuery()
    {
        $source = "DROP TABLE IF NOT EXISTS tmp_testparsesql1;";
        $field = new TestField(['name' => 'select', 'source_type' => 'sql', 'source' => $source]);

        $result = $field->stdSource;
        $expected = [];

        $this->assertEquals($expected, $result);

        $sqlQuery = "DROP TABLE IF EXISTS tmp_testparsesql";
        Application::i()->SQL->query($sqlQuery);
    }


    /**
     * Проверка метода parsePHP() с одной колонкой
     */
    public function testParsePHP()
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
        $field = new TestField(['name' => 'select', 'source_type' => 'php', 'source' => $source]);

        $result = $field->stdSource;
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
     * Проверка метода parseINI()
     */
    public function testParseINI()
    {
        $source = 'cat1="Category 1"' . "\n"
                . 'cat2="Category 2"' . "\n"
                . 'cat3="Category 3"' . "\n";
        $field = new TestField(['name' => 'select', 'source_type' => 'ini', 'source' => $source]);

        $result = $field->stdSource;
        $expected = [
            'cat1' => ['name' => 'Category 1'],
            'cat2' => ['name' => 'Category 2'],
            'cat3' => ['name' => 'Category 3'],
        ];

        $this->assertEquals($expected, $result);
    }


    /**
     * Проверка метода parseDictionary()
     */
    public function testParseDictionary()
    {
        $sqlQuery = "TRUNCATE TABLE cms_dictionaries";
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

        $field = new TestField(['name' => 'select', 'source_type' => 'dictionary', 'source' => 1]);

        $result = $field->stdSource;
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

        $sqlQuery = "TRUNCATE TABLE cms_dictionaries";
        Application::i()->SQL->query($sqlQuery);
    }


    /**
     * Проверка метода getSet()
     */
    public function testGetSet()
    {
        $sqlArr = [
            ['id' => 1, 'datatype' => 'text', 'classname' => CustomEntity::class, 'pid' => 1, 'priority' => 1],
            ['id' => 2, 'datatype' => 'text', 'classname' => Attachment::class, 'pid' => 1, 'priority' => 2],
            ['id' => 3, 'datatype' => 'text', 'classname' => CustomEntity::class, 'pid' => 1, 'priority' => 3],
            ['id' => 4, 'datatype' => 'text', 'classname' => Attachment::class, 'pid' => 1, 'priority' => 4],
            ['id' => 5, 'datatype' => 'text', 'classname' => CustomEntity::class, 'pid' => 1, 'priority' => 5],
            ['id' => 6, 'datatype' => 'text', 'classname' => Attachment::class, 'pid' => 1, 'priority' => 6],
        ];
        Application::i()->SQL->add('tmp_fields', $sqlArr);

        $result = TestField2::getSet();

        $this->assertCount(3, $result);
        $this->assertInstanceOf(TestField2::class, $result[0]);
        $this->assertInstanceOf(TestField2::class, $result[1]);
        $this->assertInstanceOf(TestField2::class, $result[2]);
        $this->assertEquals(1, $result[0]->id);
        $this->assertEquals(3, $result[1]->id);
        $this->assertEquals(5, $result[2]->id);
    }


    /**
     * Проверка метода getSet() - с ограничивающим условием
     */
    public function testGetSetWithWhere()
    {
        $sqlArr = [
            ['id' => 1, 'datatype' => 'text', 'classname' => CustomEntity::class, 'pid' => 1, 'priority' => 1],
            ['id' => 2, 'datatype' => 'text', 'classname' => Attachment::class, 'pid' => 1, 'priority' => 2],
            ['id' => 3, 'datatype' => 'text', 'classname' => CustomEntity::class, 'pid' => 1, 'priority' => 3],
            ['id' => 4, 'datatype' => 'text', 'classname' => Attachment::class, 'pid' => 1, 'priority' => 4],
            ['id' => 5, 'datatype' => 'text', 'classname' => CustomEntity::class, 'pid' => 1, 'priority' => 5],
            ['id' => 6, 'datatype' => 'text', 'classname' => Attachment::class, 'pid' => 1, 'priority' => 6],
        ];
        Application::i()->SQL->add('tmp_fields', $sqlArr);

        $result = TestField2::getSet(['where' => "id > 1"]);

        $this->assertCount(2, $result);
        $this->assertInstanceOf(TestField2::class, $result[0]);
        $this->assertInstanceOf(TestField2::class, $result[1]);
        $this->assertEquals(3, $result[0]->id);
        $this->assertEquals(5, $result[1]->id);
    }


    /**
     * Проверка метода reorder()
     */
    public function testReorder()
    {
        $sqlArr = [
            ['id' => 1, 'datatype' => 'text', 'classname' => CustomEntity::class, 'pid' => 1, 'priority' => 30],
            ['id' => 2, 'datatype' => 'text', 'classname' => Attachment::class, 'pid' => 1, 'priority' => 2],
            ['id' => 3, 'datatype' => 'text', 'classname' => CustomEntity::class, 'pid' => 1, 'priority' => 20],
            ['id' => 4, 'datatype' => 'text', 'classname' => Attachment::class, 'pid' => 1, 'priority' => 4],
            ['id' => 5, 'datatype' => 'text', 'classname' => CustomEntity::class, 'pid' => 1, 'priority' => 10],
            ['id' => 6, 'datatype' => 'text', 'classname' => Attachment::class, 'pid' => 1, 'priority' => 6],
        ];
        Application::i()->SQL->add('tmp_fields', $sqlArr);

        $field = new TestField(1);
        $field->reorder(-1, ["1"]);

        $sqlQuery = "SELECT id, priority FROM tmp_fields ORDER BY priority, id";
        $sqlResult = Application::i()->SQL->get($sqlQuery);

        $expected = [
            ['id' => 2, 'priority' => 2],
            ['id' => 4, 'priority' => 4],
            ['id' => 6, 'priority' => 6],
            ['id' => 5, 'priority' => 10],
            ['id' => 1, 'priority' => 20],
            ['id' => 3, 'priority' => 30],
        ];
        $this->assertEquals($expected, $sqlResult);
    }


    /**
     * Проверка метода required()
     */
    public function testRequired()
    {
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'image', 'multiple' => true]);
        $field->commit();

        $this->assertFalse((bool)$field->required);

        $field = new TestField(1);

        $this->assertFalse((bool)$field->required);

        $field->required();

        $this->assertTrue((bool)$field->required);

        $field = new TestField(1);

        $this->assertTrue((bool)$field->required);

        $field->required();

        $this->assertFalse((bool)$field->required);

        $field = new TestField(1);

        $this->assertFalse((bool)$field->required);
    }


    /**
     * Проверка метода delete()
     */
    public function testDelete()
    {
        $field = new TestField(['id' => 1, 'urn' => 'test', 'datatype' => 'image', 'multiple' => true]);
        $field->commit();
        $sqlArr = [
            ['pid' => 10, 'fid' => 1, 'fii' => 0, 'value' => '111'],
            ['pid' => 10, 'fid' => 1, 'fii' => 1, 'value' => '222'],
            ['pid' => 10, 'fid' => 1, 'fii' => 2, 'value' => '333'],
        ];
        Application::i()->SQL->add('tmp_data', $sqlArr);
        TestField::clearCache();
        TestField::prefetch([], [1]);
        $sqlQuery = "SELECT COUNT(*) FROM tmp_data WHERE fid = 1";

        $sqlResult = Application::i()->SQL->getvalue($sqlQuery);
        $this->assertEquals(3, $sqlResult);
        $this->assertEquals([
            '10' => ['1' => ['111', '222', '333']],
        ], TestField::$cache);

        TestField::delete($field);

        $sqlResult = Application::i()->SQL->getvalue($sqlQuery);
        $this->assertEquals(0, $sqlResult);
        $this->assertEquals([
            '10' => [],
        ], TestField::$cache);
    }
}
