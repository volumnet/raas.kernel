<?php
/**
 * Тест класса Field
 */
namespace RAAS;

use SOME\BaseTest;
use SOME\SOME;

/**
 * Тест класса Field
 * @covers \RAAS\Field
 */
class FieldTest extends BaseTest
{
    use WithTempTablesTrait;

    /**
     * Провайдер данных для метода testIsFilled
     * @return array <pre><code>array<[
     *     array Данные поля,
     *     array POST-данные,
     *     array FILES-данные,
     *     bool Ожидаемый результат,
     *     array? Данные объекта
     * ]></code></pre>
     */
    public function isFilledDataProvider(): array
    {
        static::installTables();
        $result = [
            [
                ['name' => 'test', 'type' => 'text'],
                ['test' => 'aaa'],
                [],
                true,
            ],
            [
                ['name' => 'test', 'type' => 'text', 'multiple' => true],
                ['test' => ['aaa']],
                [],
                true,
            ],
            [
                ['name' => 'test', 'type' => 'text', 'multiple' => true],
                ['test' => ['', 'aaa']],
                [],
                true,
            ],
            [
                ['name' => 'test', 'type' => 'text'],
                ['test' => ''],
                [],
                false,
            ],
            [
                ['name' => 'test', 'type' => 'text', 'multiple' => true],
                ['test' => []],
                [],
                false,
            ],
            [
                ['name' => 'test', 'type' => 'text'],
                ['test' => ['aaa']],
                [],
                true,
            ],
            [
                ['name' => 'test', 'type' => 'text'],
                ['test' => []],
                [],
                false,
            ],
            [
                ['name' => 'test', 'type' => 'date'],
                ['test' => '2023-11-12'],
                [],
                true,
            ],
            [
                ['name' => 'test', 'type' => 'date', 'multiple' => true],
                ['test' => ['2023-11-12']],
                [],
                true,
            ],
            [
                ['name' => 'test', 'type' => 'date'],
                ['test' => '0000-00-00'],
                [],
                false,
            ],
            [
                ['name' => 'test', 'type' => 'date', 'multiple' => true],
                ['test' => ['0000-00-00']],
                [],
                false,
            ],
            [
                ['name' => 'test', 'type' => 'datetime'],
                ['test' => '2023-11-12T14:14'],
                [],
                true,
            ],
            [
                ['name' => 'test', 'type' => 'datetime', 'multiple' => true],
                ['test' => ['2023-11-12T14:14']],
                [],
                true,
            ],
            [
                ['name' => 'test', 'type' => 'datetime'],
                ['test' => '0000-00-00T00:00'],
                [],
                false,
            ],
            [
                ['name' => 'test', 'type' => 'datetime', 'multiple' => true],
                ['test' => ['0000-00-00T00:00']],
                [],
                false,
            ],
            [
                ['name' => 'test', 'type' => 'month'],
                ['test' => '2023-11'],
                [],
                true,
            ],
            [
                ['name' => 'test', 'type' => 'month', 'multiple' => true],
                ['test' => ['2023-11']],
                [],
                true,
            ],
            [
                ['name' => 'test', 'type' => 'month'],
                ['test' => '0000-00'],
                [],
                false,
            ],
            [
                ['name' => 'test', 'type' => 'month', 'multiple' => true],
                ['test' => ['0000-00']],
                [],
                false,
            ],
            [
                ['name' => 'test', 'type' => 'week'],
                ['test' => '2023-W11'],
                [],
                true,
            ],
            [
                ['name' => 'test', 'type' => 'week', 'multiple' => true],
                ['test' => ['2023-W11']],
                [],
                true
            ],
            [
                ['name' => 'test', 'type' => 'week'],
                ['test' => '0000-W00'],
                [],
                false,
            ],
            [
                ['name' => 'test', 'type' => 'week', 'multiple' => true],
                ['test' => ['0000-W00']],
                [],
                false,
            ],
            [
                ['name' => 'test', 'type' => 'number'],
                ['test' => '123'],
                [],
                true,
            ],
            [
                ['name' => 'test', 'type' => 'number', 'multiple' => true],
                ['test' => ['123']],
                [],
                true,
            ],
            [
                ['name' => 'test', 'type' => 'number'],
                ['test' => '0.0'],
                [],
                false,
            ],
            [
                ['name' => 'test', 'type' => 'number', 'multiple' => true],
                ['test' => ['0.0']],
                [],
                false,
            ],
            [
                ['name' => 'test', 'type' => 'number'],
                ['test' => '0,00'],
                [],
                false,
            ],
            [
                ['name' => 'test', 'type' => 'number', 'multiple' => true],
                ['test' => ['0,00']],
                [],
                false,
            ],
            [
                ['name' => 'test', 'type' => 'image'],
                [],
                ['test' => [
                    'tmp_name' => [$this->getResourcesDir() . '/nophoto.jpg'],
                    'name' => ['nophoto.jpg'],
                    'type' => ['image/jpeg'],
                ]],
                true,
            ],
            [
                ['name' => 'test', 'type' => 'image', 'multiple' => true],
                [],
                ['test' => [
                    'tmp_name' => [$this->getResourcesDir() . '/nophoto.jpg'],
                    'name' => ['nophoto.jpg'],
                    'type' => ['image/jpeg'],
                ]],
                true,
            ],
            [
                ['name' => 'test', 'type' => 'image'],
                [],
                ['test' => [
                    'tmp_name' => $this->getResourcesDir() . '/aaa.jpg',
                    'name' => 'aaa.jpg',
                    'type' => 'image/jpeg',
                ]],
                false,
            ],
            [
                ['name' => 'test', 'type' => 'image', 'multiple' => true],
                [],
                ['test' => [
                    'tmp_name' => [$this->getResourcesDir() . '/aaa.jpg'],
                    'name' => ['aaa.jpg'],
                    'type' => ['image/jpeg'],
                ]],
                false,
            ],
            [
                ['name' => 'test', 'caption' => 'Тест', 'type' => 'image', 'required' => true],
                [],
                [],
                true,
                ['id' => 123, 'attachments' => new Attachment(['id' => 123])],
            ],
            [
                [
                    'name' => 'test',
                    'caption' => 'Тест',
                    'type' => 'image',
                    'required' => true,
                    'meta' => ['attachmentVar' => 'testAttachment'],
                ],
                [],
                [],
                true,
                ['id' => 123, 'testAttachment' => new Attachment(['id' => 123])],
            ],
            [
                [
                    'name' => 'test',
                    'caption' => 'Тест',
                    'type' => 'image',
                    'required' => true,
                    'isMediaFilled' => function () {
                        return true;
                    },
                ],
                [],
                [],
                true,
            ],
        ];
        return $result;
    }


    /**
     * Проверка атрибута isFilled / метода _isFilled()
     * @dataProvider isFilledDataProvider
     * @param array $fieldData Данные поля
     * @param array $postData POST-данные
     * @param array $filesData FILES-данные
     * @param bool $expected Ожидаемое значение
     * @param array? $itemData Данные объекта
     */
    public function testIsFilled(
        array $fieldData,
        array $postData,
        array $filesData,
        bool $expected,
        array $itemData = []
    ) {
        $item = new CustomEntity($itemData);
        $form = new Form(['Item' => $item]);
        $field = new Field($fieldData);
        $field->Parent = $form;

        $oldPost = $_POST;
        $oldFiles = $_FILES;
        $_POST = $postData;
        $_FILES = $filesData;

        $result = $field->isFilled;

        $this->assertEquals($expected, $result);

        $_POST = $oldPost;
        $_FILES = $oldFiles;
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
            [['type' => 'color'], '#abcdef', true],
            [['type' => 'color'], '#zzzzzz', false],
            [['type' => 'date'], '2023-11-12', true],
            [['type' => 'date'], 'abc', false],
            [['type' => 'datetime'], '2023-11-12T14:26', true],
            [['type' => 'datetime'], '2023-11-12 14:26', true],
            [['type' => 'datetime'], '2023-99-99 14:26', false],
            [['type' => 'datetime'], '2023-11-12T99:99', false],
            [['type' => 'datetime'], 'aaa', false],
            [['type' => 'month'], '2023-11', true],
            [['type' => 'month'], '2023-99', false],
            [['type' => 'week'], '2023-W01', true],
            [['type' => 'week'], '2023-01', true],
            [['type' => 'email'], 'info@volumnet.ru', true],
            [['type' => 'email'], 'aaa', false],
            [['type' => 'url'], 'https://volumnet.ru', true],
            [['type' => 'url'], 'aaa', false],
            [['type' => 'number'], 'aaa', false],
            [['type' => 'number', 'min' => 10], 9, false],
            [['type' => 'number', 'max' => 999], 1000, false],
            [['type' => 'number', 'min' => 10, 'max' => 999], 100, true],
            [['type' => 'time'], '14:28', true],
            [['type' => 'time'], '99:99', false],
            [['type' => 'time'], '23:99', false],
            [['type' => 'time'], '23:59:99', false],
            [['type' => 'time'], 'aaa', false],
            [['type' => 'image'], $this->getResourcesDir() . '/nophoto.jpg', true],
            [['type' => 'image'], $this->getResourcesDir() . '/favicon.svg', true],
            [['type' => 'image'], __FILE__, false],
            [['type' => 'image'], '', true],
        ];
        return $result;
    }


    /**
     * Проверка атрибута validate / метода _validate()
     * @dataProvider validateDataProvider
     * @param array $fieldData Установочные данные для поля
     * @param mixed $value Проверяемое значение
     * @param bool $expected Ожидаемое значение
     */
    public function testValidate(array $fieldData, $value, bool $expected)
    {
        $field = new Field(array_merge($fieldData, ['name' => 'test', 'multiple' => false]));
        $field2 = new Field(array_merge($fieldData, ['name' => 'test2', 'multiple' => true]));

        if (in_array($fieldData['type'] ?? null, ['file', 'image'])) {
            $_FILES['test']['tmp_name'] = $value;
            $_FILES['test2']['tmp_name'] = [$value];
        } else {
            $_POST['test'] = $value;
            $_POST['test2'] = $value ? (array)$value : [];
        }

        $result = $field->validate;
        $result2 = $field2->validate;

        $this->assertEquals($expected, $result);
        $this->assertEquals($expected ? true : [0], $result2);

        $_POST = $_FILES = [];
    }


    /**
     * Провайдер данных для метода testSetGet
     * @return array <pre><code>array<[
     *     string Свойство для установки,
     *     mixed Значение для установки/проверки
     * ]></code></pre>
     */
    public function setGetDataProvider(): array
    {
        return [
            ['errorEmptyString', 'aaa'],
            ['errorInvalidString', 'bbb'],
            ['errorEmptyFileString', 'ccc'],
            ['errorInvalidFileString', 'ddd'],
            ['errorInvalidFileWithExtensionsString', 'eee'],
            ['errorInvalidImageString', 'fff'],
            ['errorDoesntMatch', 'ggg'],
            ['datatypeStrategyURN', 'cms.field'],
            ['default', '123'],
            ['check', 'is_null'],
            ['export', 'intval'],
            ['import', 'floatval'],
            ['oncommit', 'trim'],
        ];
    }


    /**
     * Проверка методов __set()/__get()
     * @dataProvider setGetDataProvider
     * @param string $var Свойство для установки
     * @param mixed $val Значение для установки/проверки
     */
    public function testSetGet(string $var, $val)
    {
        $field = new Field();

        $field->{$var} = $val;

        $result = $field->{$var};

        $this->assertEquals($val, $result);
    }


    /**
     * Проверка методов __get() для наследования из формы
     */
    public function testGetWithForm()
    {
        $field = new Field();
        $form = new Form();
        $field->Parent = $form;

        $result = $field->errorEmptyString;

        $this->assertEquals($form->errorEmptyString, $result);
    }


    /**
     * Проверка методов __get() без наследования из формы
     */
    public function testGetWithoutForm()
    {
        $field = new Field();

        $result = $field->errorEmptyString;

        $this->assertEquals('', $result);
    }


    /**
     * Провайдер данных для метода testMatchConfirm()
     * @return array <pre><code>array<[
     *     array Данные поля,
     *     array POST-данные,
     *     bool Ожидаемое значение
     * ]></code></pre>
     */
    public function matchConfirmDataProvider(): array
    {
        return [
            [
                ['type' => 'password', 'name' => 'password'],
                ['password' => 'pass', 'password@confirm' => 'pass'],
                true,
            ],
            [
                ['type' => 'password', 'name' => 'password'],
                ['password' => 'pass', 'password@confirm' => 'pass1'],
                false,
            ],
            [
                ['type' => 'text', 'name' => 'aaa'],
                ['password' => 'pass', 'password@confirm' => 'pass1'],
                true,
            ],
        ];
    }


    /**
     * Проверка атрибута matchConfirm
     * @dataProvider matchConfirmDataProvider
     * @param array $fieldData Данные поля
     * @param array $postData POST-данные
     * @param bool $expected Ожидаемое значение
     */
    public function testMatchConfirm(array $fieldData, array $postData, bool $expected)
    {
        $field = new Field($fieldData);
        $oldPost = $_POST;
        $_POST = $postData;

        $result = $field->matchConfirm;

        $this->assertEquals($expected, $result);

        $_POST = $oldPost;
    }


    /**
     * Провайдер данных для метода testIsMediaFilledDefault()
     * @return array <pre><code>array<[
     *     string Тип данных,
     *     bool Ожидаемый результат,
     *     array? Данные объекта
     * ]></code></pre>
     */
    public function isMediaFilledDefaultDataProvider(): array
    {
        static::installTables();
        return [
            [
                ['name' => 'test', 'type' => 'text'],
                false,
                ['id' => 123, 'attachments' => new Attachment(['id' => 123])],
            ],
            [
                ['name' => 'test', 'type' => 'image'],
                false,
            ],
            [
                ['name' => 'test', 'caption' => 'Тест', 'type' => 'image', 'required' => true],
                true,
                ['id' => 123, 'attachments' => new Attachment(['id' => 123])],
            ],
            [
                ['name' => 'test', 'caption' => 'Тест', 'type' => 'image', 'required' => true],
                false,
                ['id' => 123, 'testAttachment' => new Attachment(['id' => 123])],
            ],
            [
                [
                    'name' => 'test',
                    'type' => 'image',
                    'meta' => ['attachmentVar' => 'testAttachment'],
                ],
                true,
                ['id' => 123, 'testAttachment' => new Attachment(['id' => 123])],
            ],
            [
                [
                    'name' => 'test',
                    'type' => 'image',
                    'meta' => ['attachmentVar' => 'testAttachment'],
                ],
                true,
                ['id' => 123, 'testAttachment' => [new Attachment(['id' => 123])]],
            ],
        ];
    }


    /**
     * Проверка метода isMediaFilledDefault
     * @dataProvider isMediaFilledDefaultDataProvider
     * @param array $fieldData Данные поля
     * @param bool $expected Ожидаемое значение
     * @param array $itemData Данные объекта
     */
    public function testIsMediaFilledDefault(array $fieldData, bool $expected, array $itemData = [])
    {
        $field = new Field($fieldData);
        if ($itemData) {
            $item = new CustomEntity($itemData);
            $form = new Form(['Item' => $item]);
            $field->Parent = $form;
        }

        $result = $field->isMediaFilledDefault();

        $this->assertEquals($expected, $result);
    }


    /**
     * Провайдер данных для метода testGetErrors
     * @return array <pre><code>array<>
     *     array Данные поля,
     *     array POST-данные,
     *     array FILES-данные,
     *     array Ожидаемый набор ошибок,
     *     array? Данные объекта
     * </code></pre>
     */
    public function getErrorsDataProvider(): array
    {
        static::installTables();
        return [
            [
                ['name' => 'test', 'caption' => 'Тест'],
                ['test' => 'aaa'],
                [],
                [],
            ],
            [
                ['name' => 'test', 'caption' => 'Тест', 'required' => true],
                ['aaa' => 'bbb'],
                [],
                [['name' => 'MISSED', 'value' => 'test', 'description' => 'empty Тест']],
            ],
            [
                ['name' => 'test', 'caption' => 'Тест', 'pattern' => '^\\d+$'],
                ['test' => 'aaa'],
                [],
                [['name' => 'INVALID', 'value' => 'test', 'description' => 'invalid Тест']],
            ],
            [
                ['name' => 'test', 'caption' => 'Тест', 'multiple' => true, 'pattern' => '^\\d+$'],
                ['test' => ['10', 'aaa', '12', 'bbb']],
                [],
                [['name' => 'INVALID', 'value' => 'test', 'description' => 'invalid Тест', 'indexes' => [1, 3]]],
            ],
            [
                ['name' => 'test', 'caption' => 'Тест', 'type' => 'image', 'required' => true],
                [],
                ['test' => [
                    'tmp_name' => $this->getResourcesDir() . '/nophoto.jpg',
                    'name' => 'nophoto.jpg',
                    'type' => 'image/jpeg',
                ]],
                [],
            ],
            [
                ['name' => 'test', 'caption' => 'Тест', 'type' => 'image', 'required' => true],
                [],
                [],
                [['name' => 'MISSED', 'value' => 'test', 'description' => 'emptyFile Тест']],
            ],
            [
                ['name' => 'test', 'caption' => 'Тест', 'type' => 'image', 'required' => true],
                [],
                [],
                [],
                ['attachments' => new Attachment(['id' => 123])],
            ],
            [
                [
                    'name' => 'test',
                    'caption' => 'Тест',
                    'type' => 'image',
                    'required' => true,
                    'meta' => ['attachmentVar' => 'testAttachment'],
                ],
                [],
                [],
                [],
                ['testAttachment' => new Attachment(['id' => 123])],
            ],
            [
                [
                    'name' => 'test',
                    'caption' => 'Тест',
                    'type' => 'image',
                    'required' => true,
                    'isMediaFilled' => function () {
                        return true;
                    },
                ],
                [],
                [],
                [],
            ],
            [
                ['name' => 'test', 'caption' => 'Тест', 'type' => 'image', 'required' => true, 'pattern' => '2022'],
                [],
                ['test' => [
                    'tmp_name' => $this->getResourcesDir() . '/nophoto.jpg',
                    'name' => 'nophoto.jpg',
                    'type' => 'image/jpeg',
                ]],
                [['name' => 'INVALID', 'value' => 'test', 'description' => 'invalid Тест']],
            ],
            [
                [
                    'name' => 'test',
                    'caption' => 'Тест',
                    'type' => 'image',
                    'required' => true,
                    'accept' => 'image/png,.gif'
                ],
                [],
                ['test' => [
                    'tmp_name' => $this->getResourcesDir() . '/nophoto.jpg',
                    'name' => 'nophoto.jpg',
                    'type' => 'image/jpeg',
                ]],
                [[
                    'name' => 'INVALID',
                    'value' => 'test',
                    'description' => 'invalidFileWithExtensions Тест IMAGE/PNG, GIF'
                ]],
            ],
            [
                ['name' => 'test', 'caption' => 'Тест', 'type' => 'image'],
                [],
                ['test' => [
                    'tmp_name' => __FILE__,
                    'name' => basename(__FILE__),
                    'type' => 'application/php',
                ]],
                [['name' => 'INVALID', 'value' => 'test', 'description' => 'invalidImage Тест']],
            ],
            [
                ['name' => 'test', 'caption' => 'Тест', 'type' => 'image', 'multiple' => true, 'pattern' => 'favicon'],
                [],
                ['test' => [
                    'tmp_name' => [
                        $this->getResourcesDir() . '/favicon.txt',
                        __FILE__,
                        $this->getResourcesDir() . '/nophoto.jpg',
                        $this->getResourcesDir() . '/favicon.svg',
                    ],
                    'name' => [
                        'favicon.txt',
                        basename(__FILE__),
                        'nophoto.jpg',
                        'favicon.svg',
                    ],
                    'type' => [
                        'text/plain',
                        'text/php',
                        'image/jpeg',
                        'application/xml+svg',
                    ],

                ]],
                [
                    ['name' => 'INVALID', 'value' => 'test', 'description' => 'invalidImage Тест', 'indexes' => [0]],
                    ['name' => 'INVALID', 'value' => 'test', 'description' => 'invalid Тест', 'indexes' => [1, 2]],
                ],
            ],
            [
                ['name' => 'test', 'caption' => 'Тест', 'type' => 'password'],
                ['test' => 'pass', 'test@confirm' => 'pass'],
                [],
                [],
            ],
            [
                ['name' => 'test', 'caption' => 'Тест', 'type' => 'password', 'confirm' => true],
                ['test' => 'pass', 'test@confirm' => 'pass1'],
                [],
                [['name' => 'INVALID', 'value' => 'test', 'description' => 'doesntMatch Тест']],
            ],
        ];
    }


    /**
     * Проверка метода getErrors
     * @dataProvider getErrorsDataProvider
     * @param array $fieldData Данные поля
     * @param array $postData POST-данные
     * @param array $filesData FILES-данные
     * @param array $expected Ожидаемый набор ошибок
     * @param array $itemData Данные объекта
     */
    public function testGetErrors(
        array $fieldData,
        array $postData,
        array $filesData,
        array $expected,
        array $itemData = []
    ) {
        $item = new CustomEntity($itemData);
        $form = new Form(['Item' => $item]);
        $field = new Field($fieldData);
        $field->Parent = $form;
        $field->errorEmptyString = 'empty %s';
        $field->errorInvalidString = 'invalid %s';
        $field->errorEmptyFileString = 'emptyFile %s';
        $field->errorInvalidFileString = 'invalidFile %s';
        $field->errorInvalidFileWithExtensionsString = 'invalidFileWithExtensions %s %s';
        $field->errorInvalidImageString = 'invalidImage %s';
        $field->errorDoesntMatch = 'doesntMatch %s';
        $oldPost = $_POST;
        $oldFiles = $_FILES;
        $_POST = $postData;
        $_FILES = $filesData;

        $result = $field->getErrors();

        $this->assertEquals($expected, $result);

        $_POST = $oldPost;
        $_FILES = $oldFiles;
    }


    /**
     * Проверка метода parseSet()
     */
    public function testParseSet()
    {
        $sqlArr = [
            ['id' => 1, 'pid' => 0, 'name' => 'Category 1', 'description' => 'Description 1', 'priority' => 1],
            ['id' => 11, 'pid' => 1, 'name' => 'Category 11', 'description' => 'Description 11', 'priority' => 2],
            ['id' => 111, 'pid' => 11, 'name' => 'Category 111', 'description' => 'Description 111', 'priority' => 3],
            ['id' => 112, 'pid' => 11, 'name' => 'Category 112', 'description' => 'Description 112', 'priority' => 4],
            ['id' => 113, 'pid' => 11, 'name' => 'Category 113', 'description' => 'Description 113', 'priority' => 5],
            ['id' => 12, 'pid' => 1, 'name' => 'Category 12', 'description' => 'Description 12', 'priority' => 6],
            ['id' => 13, 'pid' => 1, 'name' => 'Category 13', 'description' => 'Description 13', 'priority' => 7],
            ['id' => 2, 'pid' => 0, 'name' => 'Category 2', 'description' => 'Description 2', 'priority' => 8],
            ['id' => 3, 'pid' => 0, 'name' => 'Category 3', 'description' => 'Description 3', 'priority' => 9],
        ];
        Application::i()->SQL->add('tmp_entities', $sqlArr);
        $set = CustomEntity::getSet(['where' => "NOT pid"]);
        $field = new Field();

        $children = $field->parseSet($set);

        $this->assertInstanceOf(Option::class, $children[0]);
        $this->assertEquals(1, $children[0]->value);
        $this->assertEquals('Category 1', $children[0]->caption);
        $this->assertInstanceOf(Option::class, $children[1]);
        $this->assertEquals(2, $children[1]->value);
        $this->assertEquals('Category 2', $children[1]->caption);
        $this->assertInstanceOf(Option::class, $children[2]);
        $this->assertEquals(3, $children[2]->value);
        $this->assertEquals('Category 3', $children[2]->caption);
        $this->assertInstanceOf(Option::class, $children[0]->children[0]);
        $this->assertEquals(11, $children[0]->children[0]->value);
        $this->assertEquals('Category 11', $children[0]->children[0]->caption);
        $this->assertInstanceOf(Option::class, $children[0]->children[1]);
        $this->assertEquals(12, $children[0]->children[1]->value);
        $this->assertEquals('Category 12', $children[0]->children[1]->caption);
        $this->assertInstanceOf(Option::class, $children[0]->children[2]);
        $this->assertEquals(13, $children[0]->children[2]->value);
        $this->assertEquals('Category 13', $children[0]->children[2]->caption);
        $this->assertInstanceOf(Option::class, $children[0]->children[0]->children[0]);
        $this->assertEquals(111, $children[0]->children[0]->children[0]->value);
        $this->assertEquals('Category 111', $children[0]->children[0]->children[0]->caption);
        $this->assertInstanceOf(Option::class, $children[0]->children[0]->children[1]);
        $this->assertEquals(112, $children[0]->children[0]->children[1]->value);
        $this->assertEquals('Category 112', $children[0]->children[0]->children[1]->caption);
        $this->assertInstanceOf(Option::class, $children[0]->children[0]->children[2]);
        $this->assertEquals(113, $children[0]->children[0]->children[2]->value);
        $this->assertEquals('Category 113', $children[0]->children[0]->children[2]->caption);

        $children = $field->parseSet(
            $set,
            'description',
            2,
            'children2',
            function (SOME $item) {
                return [
                    'data-priority' => $item->priority,
                ];
            },
            true,
            function (SOME $item) {
                return $item->id != 12;
            },
        );

        $this->assertInstanceOf(OptGroup::class, $children[0]);
        $this->assertEquals(1, $children[0]->value);
        $this->assertEquals('Description 1', $children[0]->caption);
        $this->assertEquals(1, $children[0]->{'data-priority'});
        $this->assertInstanceOf(Option::class, $children[1]);
        $this->assertEquals(2, $children[1]->value);
        $this->assertEquals('Description 2', $children[1]->caption);
        $this->assertEquals(8, $children[1]->{'data-priority'});
        $this->assertInstanceOf(Option::class, $children[2]);
        $this->assertEquals(3, $children[2]->value);
        $this->assertEquals('Description 3', $children[2]->caption);
        $this->assertEquals(9, $children[2]->{'data-priority'});
        $this->assertInstanceOf(Option::class, $children[0]->children[0]);
        $this->assertEquals(11, $children[0]->children[0]->value);
        $this->assertEquals('Description 11', $children[0]->children[0]->caption);
        $this->assertEquals(2, $children[0]->children[0]->{'data-priority'});
        $this->assertInstanceOf(Option::class, $children[0]->children[1]);
        $this->assertEquals(13, $children[0]->children[1]->value);
        $this->assertEquals('Description 13', $children[0]->children[1]->caption);
        $this->assertEquals(7, $children[0]->children[1]->{'data-priority'});
        $this->assertCount(2, $children[0]->children);
        $this->assertEmpty($children[0]->children[0]->children);
    }


    /**
     * Тест установки / получения дочерних элементов
     */
    public function testGetSetChildren()
    {
        $field = new Field(['type' => 'select', 'children' => [
            ['caption' => 'AAA', 'value' => 'aaa'],
            ['caption' => 'BBB', 'value' => 'bbb'],
        ]]);
        $field2 = new Field(['type' => 'select', 'children' => ['Set' => [
            new CustomEntity(['id' => 111, 'name' => 'AAA']),
            new CustomEntity(['id' => 222, 'name' => 'BBB']),
        ]]]);


        $this->assertEquals('AAA', $field->children[0]->caption);
        $this->assertEquals('aaa', $field->children[0]->value);
        $this->assertEquals('BBB', $field->children[1]->caption);
        $this->assertEquals('bbb', $field->children[1]->value);
        $this->assertEquals('AAA', $field2->children[0]->caption);
        $this->assertEquals(111, $field2->children[0]->value);
        $this->assertEquals('BBB', $field2->children[1]->caption);
        $this->assertEquals(222, $field2->children[1]->value);
    }


    /**
     * Провайдер данных для метода testExportDefault
     * @return array <pre><code>array<[
     *     array Установочные данные для поля
     *     mixed Входное значение
     *     mixed Ожидаемый результат
     * ]></code></pre>
     */
    public function exportDefaultDataProvider(): array
    {
        $result = [
            [
                ['type' => 'date', 'multiple' => true],
                ['2023-11-12', '1900-01-01', 'aaa', '', '0000-00-00', '0001-01-01'],
                ['2023-11-12', '1900-01-01', '0000-00-00', '0000-00-00', '0000-00-00', '0001-01-01']
            ],
            [
                ['type' => 'datetime', 'multiple' => true],
                ['2023-11-12T16:05', '1900-01-01T10:00', 'aaa', '', '0001-01-01 12:30'],
                ['2023-11-12 16:05:00', '1900-01-01 10:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0001-01-01 12:30:00']
            ],
            [['type' => 'year'], '2023-01-01', '2023'],
            [['type' => 'number'], '123,5', 123.5],
            [['type' => 'time'], '12:05', '12:05:00'],
            [['type' => 'time'], 'aaa', '00:00:00'],
            [['type' => 'time'], '', '00:00:00'],
            [['type' => 'month'], '2023-11', '2023-11-01'],
            [['type' => 'month'], 'aaa', '0000-00-00'],
            [['type' => 'month'], '0000-00', '0000-00-00'],
            [['type' => 'month'], '0001-01', '0001-01-01'],
            [['type' => 'week'], '2023-W01', '2023-01-02'], // Хз почему так, но вроде так
            [['type' => 'week'], '0000-W00', '0000-00-00'],
            [['type' => 'week'], 'aaa', '0000-00-00'],
            [['type' => 'checkbox'], 'aaa ', 'aaa'],
            [['type' => 'checkbox', 'multiple' => true], ['aaa', 'bbb '], ['aaa', 'bbb']],
            [['type' => 'image'], 'aaa', null]
        ];
        return $result;
    }


    /**
     * Проверка метода exportDefault()
     * @dataProvider exportDefaultDataProvider
     * @param array $fieldData Установочные данные для поля
     * @param mixed $value Проверяемое значение
     * @param mixed $exp'ected Ожидаемое значение
     */
    public function testExportDefault(array $fieldData, $value, $expected)
    {
        $item = new CustomEntity();
        $form = new Form([
            'Item' => $item,
            'children' => [
                'test' => array_merge(['name' => 'test'], $fieldData),
            ],
        ]);
        $field = $form->children['test'];

        if (in_array($fieldData['type'] ?? null, ['file', 'image'])) {
            $_FILES['test']['tmp_name'] = $value;
        } else {
            $_POST['test'] = $value;
        }

        $field->exportDefault();
        $result = $item->test;

        $this->assertEquals($expected, $result);

        $_POST = $_FILES = [];
    }


    /**
     * Провайдер данных для метода testImportDefault
     * @return array <pre><code>array<[
     *     array Установочные данные для поля
     *     mixed Входное значение
     *     mixed Ожидаемый результат
     * ]></code></pre>
     */
    public function importDefaultDataProvider(): array
    {
        $result = [
            [['type' => 'image'], 'aaa', null],
            [['type' => 'date', 'multiple' => true], ['2023-11-12', '1900-01-01'], ['2023-11-12', '1900-01-01']],
            [['type' => 'date'], '0000-00-00', ''],
            [
                ['type' => 'datetime', 'multiple' => true],
                ['2023-11-12 16:05:00', '1900-01-01 10:00:00'],
                ['2023-11-12 16:05', '1900-01-01 10:00'],
            ],
            [
                ['type' => 'datetime-local', 'multiple' => true],
                ['2023-11-12 16:05:00', '1900-01-01 10:00:00'],
                ['2023-11-12 16:05', '1900-01-01 10:00'],
            ],
            [['type' => 'time'], '12:05:00', '12:05'],
            [['type' => 'number', 'multiple' => true], ['0,25 ', 'bbb '], [0.25, 0]],
        ];
        return $result;
    }


    /**
     * Проверка метода importDefault()
     * @dataProvider importDefaultDataProvider
     * @param array $fieldData Установочные данные для поля
     * @param mixed $value Проверяемое значение
     * @param mixed $expected Ожидаемое значение
     */
    public function testImportDefault(array $fieldData, $value, $expected)
    {
        $item = new User(['test' => $value]);
        $form = new Form([
            'Item' => $item,
            'children' => [
                'test' => array_merge(['name' => 'test'], $fieldData),
            ],
        ]);
        $field = $form->children['test'];

        $result = $field->importDefault();

        $this->assertEquals($expected, $result);
    }


    /**
     * Проверка метода oncommitDefault()
     */
    public function testOncommitDefault()
    {
        $item = new CustomEntity(['name' => 'test']);
        $item->commit();
        $form = new Form(['Item' => $item]);
        $field = new Field(['name' => 'test', 'type' => 'file', 'meta' => ['attachmentVar' => 'customAttachments']]);
        $field->Parent = $form;
        $oldPost = $_POST;
        $oldFiles = $_FILES;
        $_FILES = ['test' => [
            'tmp_name' => $this->getResourcesDir() . '/nophoto.jpg',
            'name' => 'nophoto.jpg',
            'type' => 'image/jpeg',
        ]];
        $_POST = [];

        $result = $field->oncommitDefault();

        $this->assertNotEmpty($item->test);
        $attachment = new Attachment($item->test);
        $this->assertEquals('nophoto.jpg', $attachment->filename);
        $this->assertEquals('image/jpeg', $attachment->mime);
        $attachmentId = $attachment->id;

        $item->customAttachments = [$attachment];
        $_FILES = ['test' => [
            'tmp_name' => $this->getResourcesDir() . '/favicon.svg',
            'name' => 'favicon.svg',
            'type' => 'application/xml+svg',
        ]];
        $_POST = ['test' => $attachmentId];

        $result = $field->oncommitDefault();
        $this->assertNotEmpty($item->test);
        $attachment = new Attachment($item->test);
        $this->assertEquals($attachmentId, $attachment->id);
        $this->assertEquals('favicon.svg', $attachment->filename);
        $this->assertEquals('application/xml+svg', $attachment->mime);

        Attachment::delete($attachment);
        CustomEntity::delete($item);
        $_FILES = $oldFiles;
        $_POST = $oldPost;
    }





    /**
     * Проверка метода oncommitDefault() - случай с несуществующим файлом
     */
    public function testOncommitDefaultWithNotExist()
    {
        $item = new CustomEntity(['name' => 'test']);
        $item->commit();
        $form = new Form(['Item' => $item]);
        $field = new Field(['name' => 'test', 'type' => 'file', 'meta' => ['attachmentVar' => 'customAttachments']]);
        $field->Parent = $form;
        $oldPost = $_POST;
        $oldFiles = $_FILES;
        $_FILES = ['test' => [
            'tmp_name' => $this->getResourcesDir() . '/doesntexist.jpg',
            'name' => 'doesntexist.jpg',
            'type' => 'image/jpeg',
        ]];
        $_POST = [];

        $result = $field->oncommitDefault();

        $this->assertNull($item->test);

        CustomEntity::delete($item);
        $_FILES = $oldFiles;
        $_POST = $oldPost;
    }


    /**
     * Проверка метода oncommitDefault() (множественное поле)
     */
    public function testOncommitDefaultWithMultiple()
    {
        $item = new CustomEntity(['name' => 'test']);
        $item->commit();
        $form = new Form(['Item' => $item]);
        $field = new Field(['name' => 'test', 'type' => 'file', 'multiple' => true]);
        $field->Parent = $form;
        $oldFiles = $_FILES;
        $_FILES = ['test' => [
            'tmp_name' => [
                $this->getResourcesDir() . '/nophoto.jpg',
                $this->getResourcesDir() . '/favicon.svg',
            ],
            'name' => [
                'nophoto.jpg',
                'favicon.svg',
            ],
            'type' => [
                'image/jpeg',
                'application/xml+svg',
            ],

        ]];

        $result = $field->oncommitDefault();

        $this->assertIsArray($item->test);
        $this->assertNotEmpty($item->test[0]);
        $this->assertEquals($item->test[0] + 1, $item->test[1]);
        $attachment1 = new Attachment($item->test[0]);
        $this->assertEquals('nophoto.jpg', $attachment1->filename);
        $this->assertEquals('image/jpeg', $attachment1->mime);
        $attachment2 = new Attachment($item->test[1]);
        $this->assertEquals('favicon.svg', $attachment2->filename);
        $this->assertEquals('application/xml+svg', $attachment2->mime);

        Attachment::delete($attachment1);
        Attachment::delete($attachment2);
        CustomEntity::delete($item);
        $_FILES = $oldFiles;
    }


    /**
     * Проверка метода oncommitDefault() (не медиа-поле)
     */
    public function testOncommitDefaultWithNotMedia()
    {
        $item = new CustomEntity(['name' => 'test']);
        $item->commit();
        $form = new Form(['Item' => $item]);
        $field = new Field(['name' => 'test', 'type' => 'text']);
        $field->Parent = $form;
        $oldFiles = $_FILES;
        $_FILES = ['test' => [
            'tmp_name' => [
                $this->getResourcesDir() . '/nophoto.jpg',
                $this->getResourcesDir() . '/favicon.svg',
            ],
            'name' => [
                'nophoto.jpg',
                'favicon.svg',
            ],
            'type' => [
                'image/jpeg',
                'application/xml+svg',
            ],

        ]];

        $result = $field->oncommitDefault();

        $this->assertEmpty($item->test);

        CustomEntity::delete($item);
        $_FILES = $oldFiles;
    }
}
