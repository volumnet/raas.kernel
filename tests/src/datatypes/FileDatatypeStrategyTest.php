<?php
/**
 * Тест для класса FileDatatypeStrategy
 *
 * <pre><code>
 * Предустановленные типы данных:
 * <ФАЙЛ> => [
 *     'tmp_name' => string Путь к файлу,
 *     'name' => string Названия файлов,
 *     'type' => string MIME-типы файлов,
 * ]
 * </code></pre>
 */
namespace RAAS;

use stdClass;
use Exception;
use InvalidArgumentException;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestWith;

/**
 * Класс теста класса FileDatatypeStrategy
 */
#[CoversClass(FileDatatypeStrategy::class)]
class FileDatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    const DATATYPE = 'file';

    public static $tables = ['attachments'];

    /**
     * Провайдер данных для метода testGetFilesData
     * @return array <pre><code>[
     *     array Данные поля,
     *     [
     *         'tmp_name' => string|array<string|рекурсивно> Пути к файлам,
     *         'name' => string|array<string|рекурсивно> Названия файлов,
     *         'type' => string|array<string|рекурсивно> MIME-типы файлов,
     *     ] Данные файла(ов),
     *     array $_POST-данные
     *     bool Использовать мета-данные
     *     bool Приводить результат к массиву
     *     <ФАЙЛ>|array<string[]|int[] Ключ массива => <ФАЙЛ>|рекурсивно> Ожидаемое значение
     * ]</code></pre>
     */
    public static function getFilesDataDataProvider(): array
    {
        return [
            [
                [
                    'type' => 'image',
                    'multiple' => 1,
                    'name' => 'image',
                    'required' => true,
                    'accept' => '.gif,.jpg,.png',
                ],
                ['image' => [
                    'tmp_name' => ['/resources/noname.gif'],
                    'name' => ['noname.gif'],
                    'type' => ['image/gif'],
                ]],
                [],
                true,
                true,
                [[
                    'tmp_name' => '/resources/noname.gif',
                    'name' => 'noname.gif',
                    'type' => 'image/gif',
                ]],
            ],
            [
                ['name' => 'test', 'type' => 'image', 'multiple' => false],
                ['test' => [
                    'tmp_name' => 'tmpname',
                    'name' => 'filename',
                    'type' => 'filetype',
                ]],
                [
                    'test' => '123',
                ],
                true,
                true,
                [[
                    'tmp_name' => 'tmpname',
                    'name' => 'filename',
                    'type' => 'filetype',
                    'meta' => [
                        'attachment' => '123',
                    ],
                ]],
            ],
            [
                ['name' => 'test', 'type' => 'image', 'multiple' => true],
                ['test' => [
                    'tmp_name' => [static::getResourcesDir() . '/nophoto.jpg'],
                    'name' => ['nophoto.jpg'],
                    'type' => ['image/jpeg'],
                ]],
                [],
                true,
                true,
                [
                    [
                        'tmp_name' => static::getResourcesDir() . '/nophoto.jpg',
                        'name' => 'nophoto.jpg',
                        'type' => 'image/jpeg',
                    ],
                ],
            ],

            [ // 2023-12-04 01:20, AVS: ошибка в CustomFieldTest - множественное значение attachment
                ['name' => 'test', 'type' => 'image', 'multiple' => true],
                [],
                ['test' => 123],
                true,
                true,
                [
                    [
                        'meta' => ['attachment' => 123],
                    ],
                ],
            ],
            [ // 2023-12-04 01:20, AVS: ошибка в CustomFieldTest - множественное значение attachment
                ['name' => 'test', 'type' => 'image', 'multiple' => true],
                [],
                ['test' => [123, '456']],
                true,
                true,
                [
                    [
                        'meta' => ['attachment' => 123],
                    ],
                    [
                        'meta' => ['attachment' => 456],
                    ],
                ],
            ],
            [ // 2023-12-03 22:47, AVS: ошибка в CustomFieldTest - не определяется ['meta']['attachment']
                ['name' => 'test', 'type' => 'image', 'multiple' => true],
                ['test' => [
                    'tmp_name' => [
                        null,
                    ],
                    'name' => [
                        null,
                    ],
                    'type' => [
                        null,
                    ],
                ]],
                ['test' => [20]],
                true,
                true,
                [
                    [
                        'tmp_name' => null,
                        'name' => null,
                        'type' => null,
                        'meta' => ['attachment' => 20],
                    ],
                ],
            ],
            [ // 2023-12-03 22:47, AVS: ошибка в CustomFieldTest - не определяется ['meta']['attachment']
                ['name' => 'test', 'type' => 'image', 'multiple' => true],
                ['test' => [
                    'tmp_name' => [
                        static::getResourcesDir() . '/nophoto.jpg',
                    ],
                    'name' => [
                        'nophoto.jpg',
                    ],
                    'type' => [
                        'image/jpeg',
                    ],
                ]],
                ['test' => [null]],
                true,
                true,
                [
                    [
                        'tmp_name' => static::getResourcesDir() . '/nophoto.jpg',
                        'name' => 'nophoto.jpg',
                        'type' => 'image/jpeg',
                        'meta' => ['attachment' => 0],
                    ],
                ],
            ],
            [ // 2023-12-03 22:47, AVS: ошибка в CustomFieldTest - не определяется ['meta']['attachment']
                ['name' => 'test', 'type' => 'image', 'multiple' => true],
                ['test' => [
                    'tmp_name' => [
                        static::getResourcesDir() . '/nophoto.jpg',
                        static::getResourcesDir() . '/notexist.jpg',
                        null,
                        static::getResourcesDir() . '/favicon.svg',
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
                ]],
                ['test' => [null, null, 20, null]],
                true,
                true,
                [
                    [
                        'tmp_name' => static::getResourcesDir() . '/nophoto.jpg',
                        'name' => 'nophoto.jpg',
                        'type' => 'image/jpeg',
                        'meta' => ['attachment' => 0],
                    ],
                    [
                        'tmp_name' => static::getResourcesDir() . '/notexist.jpg',
                        'name' => 'notexist.jpg',
                        'type' => 'image/jpeg',
                        'meta' => ['attachment' => 0],
                    ],
                    [
                        'tmp_name' => null,
                        'name' => null,
                        'type' => null,
                        'meta' => ['attachment' => 20],
                    ],

                    [
                        'tmp_name' => static::getResourcesDir() . '/favicon.svg',
                        'name' => 'favicon.svg',
                        'type' => 'application/xml+svg',
                        'meta' => ['attachment' => 0],
                    ],
                ],
            ],
            [
                ['name' => 'test', 'multiple' => false],
                ['test' => [
                    'tmp_name' => 'tmpname',
                    'name' => 'filename',
                    'type' => 'filetype',
                ]],
                [],
                false,
                false,
                [
                    'tmp_name' => 'tmpname',
                    'name' => 'filename',
                    'type' => 'filetype',
                ],
            ],
            [
                ['name' => 'test', 'multiple' => false],
                ['test' => [
                    'tmp_name' => ['tmpname1', 'tmpname2', 'tmpname3'],
                    'name' => ['filename1', 'filename2', 'filename3'],
                    'type' => ['filetype1', 'filetype2', 'filetype3'],
                ]],
                [],
                false,
                false,
                [
                    [
                        'tmp_name' => 'tmpname1',
                        'name' => 'filename1',
                        'type' => 'filetype1',
                    ],
                    [
                        'tmp_name' => 'tmpname2',
                        'name' => 'filename2',
                        'type' => 'filetype2',
                    ],
                    [
                        'tmp_name' => 'tmpname3',
                        'name' => 'filename3',
                        'type' => 'filetype3',
                    ],
                ],
            ],
            [
                ['name' => 'test', 'multiple' => false],
                ['test' => [
                    'tmp_name' => ['aaa' => ['bbb' => ['ccc' => 'tmpname']]],
                    'name' => ['aaa' => ['bbb' => ['ccc' => 'filename']]],
                    'type' => ['aaa' => ['bbb' => ['ccc' => 'filetype']]],
                ]],
                [],
                false,
                false,
                [
                    'aaa' => [
                        'bbb' => [
                            'ccc' => [
                                'tmp_name' => 'tmpname',
                                'name' => 'filename',
                                'type' => 'filetype',
                            ],
                        ],
                    ],
                ],
            ],

            [
                ['name' => 'test', 'multiple' => false],
                ['test' => [
                    'tmp_name' => 'tmpname',
                    'name' => 'filename',
                    'type' => 'filetype',
                ]],
                [],
                false,
                true,
                [[
                    'tmp_name' => 'tmpname',
                    'name' => 'filename',
                    'type' => 'filetype',
                ]],
            ],
            [
                ['name' => 'test', 'multiple' => false],
                ['test' => [
                    'tmp_name' => ['tmpname1', 'tmpname2', 'tmpname3'],
                    'name' => ['filename1', 'filename2', 'filename3'],
                    'type' => ['filetype1', 'filetype2', 'filetype3'],
                ]],
                [],
                false,
                true,
                [
                    [
                        'tmp_name' => 'tmpname1',
                        'name' => 'filename1',
                        'type' => 'filetype1',
                    ],
                    [
                        'tmp_name' => 'tmpname2',
                        'name' => 'filename2',
                        'type' => 'filetype2',
                    ],
                    [
                        'tmp_name' => 'tmpname3',
                        'name' => 'filename3',
                        'type' => 'filetype3',
                    ],
                ],
            ],
            [
                ['name' => 'test', 'multiple' => false],
                ['test' => [
                    'tmp_name' => ['aaa' => ['bbb' => ['ccc' => 'tmpname']]],
                    'name' => ['aaa' => ['bbb' => ['ccc' => 'filename']]],
                    'type' => ['aaa' => ['bbb' => ['ccc' => 'filetype']]],
                ]],
                ['test' => ['aaa' => ['bbb' => ['ccc' => '123']]]],
                false,
                true,
                [
                    'aaa' => [
                        'bbb' => [
                            'ccc' => [
                                'tmp_name' => 'tmpname',
                                'name' => 'filename',
                                'type' => 'filetype',
                            ],
                        ],
                    ],
                ],
            ],
            [
                ['name' => 'test', 'multiple' => false],
                ['test' => [
                    'tmp_name' => ['aaa' => ['bbb' => ['ccc' => 'tmpname']]],
                    'name' => ['aaa' => ['bbb' => ['ccc' => 'filename']]],
                    'type' => ['aaa' => ['bbb' => ['ccc' => 'filetype']]],
                ]],
                ['test' => ['aaa' => ['bbb' => ['ccc' => '123']]]],
                true,
                true,
                [
                    'aaa' => [
                        'bbb' => [
                            'ccc' => [
                                'tmp_name' => 'tmpname',
                                'name' => 'filename',
                                'type' => 'filetype',
                                'meta' => ['attachment' => 123],
                            ],
                        ],
                    ],
                ],
            ],
            [
                ['name' => 'test', 'multiple' => true],
                ['test' => [
                    'tmp_name' => 'tmpname',
                    'name' => 'filename',
                    'type' => 'filetype',
                ]],
                [],
                false,
                false,
                [
                    'tmp_name' => 'tmpname',
                    'name' => 'filename',
                    'type' => 'filetype',
                ],
            ],
            [
                ['name' => 'test', 'multiple' => true],
                ['test' => [
                    'tmp_name' => ['tmpname1', 'tmpname2', 'tmpname3'],
                    'name' => ['filename1', 'filename2', 'filename3'],
                    'type' => ['filetype1', 'filetype2', 'filetype3'],
                ]],
                [],
                false,
                false,
                [
                    [
                        'tmp_name' => 'tmpname1',
                        'name' => 'filename1',
                        'type' => 'filetype1',
                    ],
                    [
                        'tmp_name' => 'tmpname2',
                        'name' => 'filename2',
                        'type' => 'filetype2',
                    ],
                    [
                        'tmp_name' => 'tmpname3',
                        'name' => 'filename3',
                        'type' => 'filetype3',
                    ],
                ],
            ],
            [
                ['name' => 'test', 'multiple' => true],
                ['test' => [
                    'tmp_name' => ['aaa' => ['bbb' => ['ccc' => 'tmpname']]],
                    'name' => ['aaa' => ['bbb' => ['ccc' => 'filename']]],
                    'type' => ['aaa' => ['bbb' => ['ccc' => 'filetype']]],
                ]],
                [],
                false,
                false,
                [
                    'aaa' => [
                        'bbb' => [
                            'ccc' => [
                                'tmp_name' => 'tmpname',
                                'name' => 'filename',
                                'type' => 'filetype',
                            ],
                        ],
                    ],
                ],
            ],

            [
                ['name' => 'test', 'multiple' => true],
                ['test' => [
                    'tmp_name' => 'tmpname',
                    'name' => 'filename',
                    'type' => 'filetype',
                ]],
                [],
                false,
                true,
                [[
                    'tmp_name' => 'tmpname',
                    'name' => 'filename',
                    'type' => 'filetype',
                ]],
            ],
            [
                ['name' => 'test', 'multiple' => true],
                ['test' => [
                    'tmp_name' => ['tmpname1', 'tmpname2', 'tmpname3'],
                    'name' => ['filename1', 'filename2', 'filename3'],
                    'type' => ['filetype1', 'filetype2', 'filetype3'],
                ]],
                [],
                false,
                true,
                [
                    [
                        'tmp_name' => 'tmpname1',
                        'name' => 'filename1',
                        'type' => 'filetype1',
                    ],
                    [
                        'tmp_name' => 'tmpname2',
                        'name' => 'filename2',
                        'type' => 'filetype2',
                    ],
                    [
                        'tmp_name' => 'tmpname3',
                        'name' => 'filename3',
                        'type' => 'filetype3',
                    ],
                ],
            ],
            [
                ['name' => 'test', 'multiple' => true],
                ['test' => [
                    'tmp_name' => ['aaa' => ['bbb' => ['ccc' => 'tmpname']]],
                    'name' => ['aaa' => ['bbb' => ['ccc' => 'filename']]],
                    'type' => ['aaa' => ['bbb' => ['ccc' => 'filetype']]],
                ]],
                [],
                false,
                true,
                [
                    'aaa' => [
                        'bbb' => [
                            'ccc' => [
                                'tmp_name' => 'tmpname',
                                'name' => 'filename',
                                'type' => 'filetype',
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }


    /**
     * Проверка метода getFilesData()
     * @param array $fieldData Данные поля,
     * @param bool $forceArray Приводить результат к массиву
     * @param array $filesData <pre><code>[
     *     'tmp_name' => string|array<string|рекурсивно> Пути к файлам,
     *     'name' => string|array<string|рекурсивно> Названия файлов,
     *     'type' => string|array<string|рекурсивно> MIME-типы файлов,
     * ]</code></pre> Данные файла(ов),
     * @param array $expected <pre><code>
     *     <ФАЙЛ>|array<string[]|int[] Ключ массива => <ФАЙЛ>|рекурсивно>
     * </code></pre> Ожидаемое значение
     */
    #[DataProvider('getFilesDataDataProvider')]
    public function testGetFilesData(
        array $fieldData,
        array $filesData,
        array $postData,
        bool $useMetaData,
        bool $forceArray,
        array $expected
    ) {
        $field = new Field(array_merge(['name' => 'test', 'type' => self::DATATYPE], $fieldData));
        $strategy = DatatypeStrategy::spawn(self::DATATYPE);
        $oldFiles = $_FILES;
        $oldPost = $_POST;
        $_FILES = $filesData;
        $_POST = $postData;

        $result = $strategy->getFilesData($field, $forceArray, $useMetaData);
        $result2 = $strategy->getFilesData(new TestField(['urn' => $fieldData['name']]), $forceArray, $useMetaData);
        $result3 = $strategy->getFilesData($fieldData['name'], $forceArray, $useMetaData);

        $this->assertEquals($expected, $result);
        $this->assertEquals($expected, $result2);
        $this->assertEquals($expected, $result3);

        $_FILES = $oldFiles;
        $_POST = $oldPost;
    }


    /**
     * Тест метода getPostData с неправильным типом $field
     */
    public function testGetPostDataWithException()
    {
        $this->expectException(InvalidArgumentException::class);
        $datatypeStrategy = DatatypeStrategy::spawn(self::DATATYPE);

        $result = $datatypeStrategy->getFilesData(new stdClass());
    }


    /**
     * Провайдер данных для метода testIsFileLoaded
     * @return array <pre><code>array<[
     *     string Имя файла,
     *     bool Режим отладки,
     *     bool Ожидаемое значение,
     * ]></code></pre>
     */
    public static function isFileLoadedDataProvider(): array
    {
        return [
            [static::getResourcesDir() . '/nophoto.jpg', true, true],
            [static::getResourcesDir() . '/nophoto.jpg', false, false],
            [static::getResourcesDir() . '/aaa.bbb', true, false],
        ];
    }


    /**
     * Тест метода isFileLoaded
     * @param string $filename Файл для проверки
     * @param bool $debug Режим отладки
     * @param bool $expected Ожидаемое значение
     */
    #[DataProvider('isFileLoadedDataProvider')]
    public function testIsFileLoaded($filename, $debug, $expected)
    {
        $strategy = DatatypeStrategy::spawn(self::DATATYPE);
        $result = $strategy->isFileLoaded($filename, $debug);
        $this->assertEquals($expected, $result);
    }


    /**
     * Провайдер данных для метода testIsFilled
     * @return array <pre><code>array<[
     *     mixed Проверяемое значение
     *     bool Ожидаемый результат
     * ]></code></pre>
     */
    public static function isFilledDataProvider(): array
    {
        $result = [
            ['', false],
            [static::getResourcesDir() . '/nophoto.jpg', true],
            [static::getResourcesDir() . '/aaa.jpg', false],
        ];
        return $result;
    }


    /**
     * Проверка метода isFilled()
     * @param mixed $value Проверяемое значение
     * @param bool $expected Ожидаемое значение
     */
    #[DataProvider('isFilledDataProvider')]
    public function testIsFilled($value, bool $expected)
    {
        $strategy = DatatypeStrategy::spawn(self::DATATYPE);
        $result = $strategy->isFilled($value, true);
        $this->assertEquals($expected, $result);
    }


    public static function validateDataProvider(): array
    {
        $result = [
            [
                ['type' => self::DATATYPE],
                '',
                true,
            ],
            [
                ['type' => self::DATATYPE],
                [],
                true,
            ],
            [
                ['type' => self::DATATYPE],
                [
                    'tmp_name' => static::getResourcesDir() . '/nophoto.jpg',
                    'name' => 'nophoto.jpg',
                    'type' => 'image/jpeg',
                ],
                true
            ],
            [
                ['type' => self::DATATYPE, 'accept' => 'image/jpeg,.svg'],
                [
                    'tmp_name' => static::getResourcesDir() . '/nophoto.jpg',
                    'name' => 'nophoto.jpg',
                    'type' => 'image/jpeg',
                ],
                true
            ],
            [
                ['type' => self::DATATYPE, 'accept' => 'image/*,.svg'],
                [
                    'tmp_name' => static::getResourcesDir() . '/nophoto.jpg',
                    'name' => 'nophoto.jpg',
                    'type' => 'image/jpeg',
                ],
                true
            ],
            [
                ['type' => self::DATATYPE, 'accept' => '.svg'],
                [
                    'tmp_name' => static::getResourcesDir() . '/nophoto.jpg',
                    'name' => 'nophoto.jpg',
                    'type' => 'image/jpeg',
                ],
                DatatypeFileTypeMismatchException::class
            ],
            [
                ['type' => self::DATATYPE, 'accept' => '.jpg,.svg'],
                [
                    'tmp_name' => static::getResourcesDir() . '/nophoto.jpg',
                    'name' => 'nophoto.jpg',
                    'type' => 'image/jpeg',
                ],
                true
            ],
            [
                ['type' => self::DATATYPE],
                [
                    'tmp_name' => static::getResourcesDir() . '/favicon.svg',
                    'name' => 'favicon.svg',
                    'type' => 'application/xml+svg',
                ],
                true
            ],
            [
                ['type' => self::DATATYPE, 'pattern' => 'favicon'],
                [
                    'tmp_name' => static::getResourcesDir() . '/favicon.svg',
                    'name' => 'favicon.svg',
                    'type' => 'application/xml+svg',
                ],
                true
            ],
            [
                ['type' => self::DATATYPE, 'pattern' => 'image'],
                [
                    'tmp_name' => static::getResourcesDir() . '/favicon.svg',
                    'name' => 'favicon.svg',
                    'type' => 'application/svg+xml',
                ],
                DatatypePatternMismatchException::class
            ],
            [
                ['type' => self::DATATYPE],
                [
                    'tmp_name' => __FILE__,
                    'name' => basename(__FILE__),
                    'type' => 'text/php',
                ],
                true
            ],
        ];
        return $result;
    }


    /**
     * Проверка метода validate()
     * @param mixed $value Проверяемое значение
     * @param mixed $expected Ожидаемое значение
     */
    #[DataProvider('validateDataProvider')]
    public function testValidate(array $fieldData, $value, $expected)
    {
        $this->checkValidate($fieldData, $value, $expected);
    }


    /**
     * Провайдер данных для метода testExport
     * @return array <pre><code>array<[
     *     mixed Входное значение,
     *     mixed Ожидаемое значение
     *     string? Ожидается исключение класса
     * ]></code></pre>
     */
    public static function exportDataProvider(): array
    {
        static::installTables();
        return [
            [new Attachment(['id' => 1]), 1],
            ['abc', null, InvalidArgumentException::class],
        ];
    }


    /**
     * Проверка метода export()
     * @param mixed $inputValue Входное значение
     * @param mixed $expected Ожидаемое значение
     * @param string $expectedException Ожидается исключение класса
     */
    #[DataProvider('exportDataProvider')]
    public function testExport($inputValue, $expected, $expectedException = null)
    {
        $strategy = DatatypeStrategy::spawn(self::DATATYPE);

        if ($expectedException) {
            $this->expectException($expectedException);
        }

        $result = $strategy->export($inputValue);

        if (!$expectedException) {
            $this->assertEquals(1, $result);
        }
    }


    /**
     * Проверка метода import()
     */
    public function testImport()
    {
        $attachment = new Attachment();
        $attachment->filename = 'aaa.txt';
        $attachment->touchFile = true;
        $attachment->commit();
        $attachmentId = (int)$attachment->id;

        $strategy = DatatypeStrategy::spawn(self::DATATYPE);

        $result = $strategy->import($attachmentId);

        $this->assertInstanceOf(Attachment::class, $result);
        $this->assertEquals($attachmentId, $result->id);

        Attachment::delete($attachment);
    }



    /**
     * Проверка метода import()
     */
    public function testBatchImportAttachmentsIds()
    {
        $strategy = DatatypeStrategy::spawn(self::DATATYPE);

        $result = $strategy->batchImportAttachmentsIds([1, 2, 'aaa', 3, 2, 1, 'bbb' => 4, 4]);

        $this->assertEquals([1, 2, 3, 4], $result);
    }

    /**
     * Проверка метода import()
     */
    public function testBatchImport()
    {
        $attachment1 = new Attachment();
        $attachment1->filename = 'aaa.txt';
        $attachment1->touchFile = true;
        $attachment1->commit();
        $attachment1Id = (int)$attachment1->id;
        $attachment2 = new Attachment();
        $attachment2->filename = 'bbb.txt';
        $attachment2->touchFile = true;
        $attachment2->commit();
        $attachment2Id = (int)$attachment2->id;
        $attachment3 = new Attachment();
        $attachment3->filename = 'ccc.txt';
        $attachment3->touchFile = true;
        $attachment3->commit();
        $attachment3Id = (int)$attachment3->id;
        $ids = [$attachment1Id, $attachment2Id, $attachment3Id];

        $strategy = DatatypeStrategy::spawn(self::DATATYPE);

        $result = $strategy->batchImport($ids);

        $this->assertIsArray($result);
        $this->assertCount(3, $result);
        $this->assertInstanceOf(Attachment::class, $result[0]);
        $this->assertEquals($attachment1Id, $result[0]->id);
        $this->assertInstanceOf(Attachment::class, $result[1]);
        $this->assertEquals($attachment2Id, $result[1]->id);
        $this->assertInstanceOf(Attachment::class, $result[2]);
        $this->assertEquals($attachment3Id, $result[2]->id);

        Attachment::delete($attachment1);
        Attachment::delete($attachment2);
        Attachment::delete($attachment3);
    }


    /**
     * Проверка метода import() с пустым значением
     */
    public function testImportWithEmpty()
    {
        $strategy = DatatypeStrategy::spawn(self::DATATYPE);

        $result = $strategy->import('');

        $this->assertNull($result);
    }


    /**
     * Проверяет стратегию на медиа-поле
     */
    public function testIsMedia()
    {
        $strategy = DatatypeStrategy::spawn(self::DATATYPE);
        $result = $strategy->isMedia();
        $this->assertTrue($result);
    }
}
