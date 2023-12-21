<?php
/**
 * Тест для класса DatatypeStrategy
 */
namespace RAAS;

use stdClass;
use Exception;
use InvalidArgumentException;

class DatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    use WithTempTablesTrait;

    /**
     * Тестирует методы register/get/unregister/clear
     */
    public function testRegisterGetUnregisterClear()
    {
        CheckboxDatatypeStrategy::register('foocheckbox');
        SelectDatatypeStrategy::register('fooselect');

        $this->assertEquals(CheckboxDatatypeStrategy::class, DatatypeStrategy::get('foocheckbox'));
        $this->assertEquals(SelectDatatypeStrategy::class, DatatypeStrategy::get('fooselect'));

        SelectDatatypeStrategy::unregister('foocheckbox');
        DatatypeStrategy::unregister('fooselect');


        $result = DatatypeStrategy::get();
        $this->assertNull($result['foocheckbox'] ?? null);
        $this->assertNull($result['fooselect'] ?? null);

        $this->assertEquals(SelectDatatypeStrategy::class, DatatypeStrategy::get('select'));

        DatatypeStrategy::clear();

        $this->assertEmpty(DatatypeStrategy::get());

        foreach ($result as $key => $classname) {
            $classname::register($key);
        }
        $result2 = DatatypeStrategy::get();

        $this->assertEquals($result, $result2);
    }


    /**
     * Провайдер данных для метода testGetPostData
     * @return array <pre><code>array<
     *     array Данные поля,
     *     bool Приводить к массиву,
     *     array POST-данные,
     *     array Ожидаемое значение,
     * ></code></pre>
     */
    public function getPostDataDataProvider()
    {
        return [
            [
                ['name' => 'test', 'multiple' => false],
                false,
                ['aaa' => 'abc', 'test' => 'xyz'],
                'xyz',
            ],
            [
                ['name' => 'test', 'multiple' => false],
                true,
                ['aaa' => 'abc', 'test' => 'xyz'],
                ['xyz'],
            ],
            [
                ['name' => 'test', 'multiple' => false],
                false,
                ['aaa' => 'abc', 'test' => ['xyz']],
                ['xyz'],
            ],
            [
                ['name' => 'test', 'multiple' => false],
                true,
                ['aaa' => 'abc', 'test' => ['aaa' => 'xyz']],
                ['aaa' => 'xyz'],
            ],
            [
                ['name' => 'test', 'multiple' => false],
                false,
                ['aaa' => 'abc'],
                null,
            ],
            [
                ['name' => 'test', 'multiple' => false],
                true,
                ['aaa' => 'abc'],
                [],
            ],
            [
                ['name' => 'test', 'multiple' => true],
                false,
                ['aaa' => 'abc', 'test' => 'xyz'],
                'xyz',
            ],
            [
                ['name' => 'test', 'multiple' => true],
                true,
                ['aaa' => 'abc', 'test' => 'xyz'],
                ['xyz'],
            ],
            [
                ['name' => 'test', 'multiple' => true],
                false,
                ['aaa' => 'abc', 'test' => ['xyz']],
                ['xyz'],
            ],
            [
                ['name' => 'test', 'multiple' => true],
                true,
                ['aaa' => 'abc', 'test' => ['xyz']],
                ['xyz'],
            ],
            [
                ['name' => 'test', 'multiple' => true],
                false,
                ['aaa' => 'abc'],
                null,
            ],
            [
                ['name' => 'test', 'multiple' => true],
                true,
                ['aaa' => 'abc'],
                [],
            ],
        ];
    }


    /**
     * Тест метода getPostData
     * @dataProvider getPostDataDataProvider
     * @param array $fieldData Данные поля
     * @param bool $forceArray Приводить к массиву
     * @param array $postData POST-данные
     * @param mixed $expected Ожидаемое значение
     */
    public function testGetPostData(array $fieldData, bool $forceArray, array $postData, $expected)
    {
        $field = new Field($fieldData);
        $oldPost = $_POST;
        $_POST = $postData;
        $datatypeStrategy = DatatypeStrategy::spawn('text');

        $result = $datatypeStrategy->getPostData($field, $forceArray);
        $result2 = $datatypeStrategy->getPostData(new TestField(['urn' => $fieldData['name']]), $forceArray);
        $result3 = $datatypeStrategy->getPostData($fieldData['name'], $forceArray);

        $this->assertEquals($expected, $result);
        $this->assertEquals($expected, $result2);
        $this->assertEquals($expected, $result3);

        $_POST = $oldPost;
    }


    /**
     * Тест метода getPostData с неправильным типом $field
     */
    public function testGetPostDataWithException()
    {
        $this->expectException(InvalidArgumentException::class);
        $datatypeStrategy = DatatypeStrategy::spawn('text');

        $result = $datatypeStrategy->getPostData(new stdClass());
    }


    /**
     * Тестирует исключение метода register() - вызов у корневого класса без указания конкретного
     */
    public function testRegisterWithExceptionParentClass()
    {
        $this->expectException(Exception::class);
        DatatypeStrategy::register('foo');
    }


    /**
     * Тестирует исключение метода unregister() - вызов у несуществующего типа данных
     */
    public function testUnregisterWithNotExistent()
    {
        $this->expectException(Exception::class);
        DatatypeStrategy::unregister('bar');
    }


    /**
     * Тестирует исключение метода get() - вызов у несуществующего типа данных
     */
    public function testGetWithNotExistent()
    {
        $this->expectException(Exception::class);
        DatatypeStrategy::get('bar');
    }


    /**
     * Тестирует метод spawn() с несуществующим типом - возврат TextDatatypeStrategy
     */
    public function testSpawnWithNotExistent()
    {
        $result = DatatypeStrategy::spawn('bar');

        $this->assertInstanceOf(TextDatatypeStrategy::class, $result);
    }


    /**
     * Провайдер данных для метода testIsFilled
     * @return array <pre><code>array<[
     *     mixed Проверяемое значение
     *     bool Ожидаемый результат
     * ]></code></pre>
     */
    public function isFilledDataProvider(): array
    {
        $result = [
            ['aaa', true],
            ['', false],
            [['aaa'], true],
            [[], false],
        ];
        return $result;
    }


    /**
     * Проверка метода isFilled()
     * @dataProvider isFilledDataProvider
     * @param mixed $value Проверяемое значение
     * @param bool $expected Ожидаемое значение
     */
    public function testIsFilled($value, bool $expected)
    {
        $strategy = DatatypeStrategy::spawn();

        $result = $strategy->isFilled($value);

        $this->assertEquals($expected, $result);
    }


    public function validateDataProvider(): array
    {
        $result = [
            [['type' => 'text'], ' ', true],
            [['type' => 'text'], ['aaa' => 'bbb'], true],
            [['type' => 'text', 'pattern' => '^\\d+$'], '123', true],
            [['type' => 'text', 'pattern' => '^\\d+$'], 'aaa', DatatypePatternMismatchException::class],
        ];
        return $result;
    }


    /**
     * Проверяет стратегию на медиа-поле
     */
    public function testIsMedia()
    {
        $strategy = DatatypeStrategy::spawn();

        $result = $strategy->isMedia();

        $this->assertFalse($result);
    }


    /**
     * Провайдер данных для метода testExport
     * @return array <pre><code>array<[
     *     mixed Проверяемое значение
     *     string Ожидаемый результат
     * ]></code></pre>
     */
    public function exportDataProvider(): array
    {
        $result = [
            [' aaa ', 'aaa'],
        ];
        return $result;
    }


    /**
     * Проверка метода export()
     * @dataProvider exportDataProvider
     * @param mixed $value Проверяемое значение
     * @param string $expected Ожидаемое значение
     */
    public function testExport(string $value, string $expected)
    {
        $strategy = DatatypeStrategy::spawn('text');

        $result = $strategy->export($value);

        $this->assertEquals($expected, $result);
    }


    /**
     * Провайдер данных для метода testImport
     * @return array <pre><code>array<[
     *     mixed Проверяемое значение
     *     string Ожидаемый результат
     * ]></code></pre>
     */
    public function importDataProvider(): array
    {
        $result = [
            [' aaa ', ' aaa '],
        ];
        return $result;
    }


    /**
     * Проверка метода import()
     * @dataProvider importDataProvider
     * @param mixed $value Проверяемое значение
     * @param string $expected Ожидаемое значение
     */
    public function testImport(string $value, string $expected)
    {
        $strategy = DatatypeStrategy::spawn('text');

        $result = $strategy->import($value);

        $this->assertEquals($expected, $result);
    }


    /**
     * Проверка метода batchImport()
     */
    public function testBatchExport()
    {
        $strategy = DatatypeStrategy::spawn('text');

        $result = $strategy->batchExport([' aaa ', ' bbb', null, ' ccc', ]);

        $this->assertEquals(['aaa', 'bbb', '', 'ccc'], $result);
    }


    /**
     * Проверка метода batchImport()
     */
    public function testBatchImport()
    {
        $strategy = DatatypeStrategy::spawn('text');

        $result = $strategy->batchImport([' aaa ', ' bbb', null, ' ccc']);

        $this->assertEquals([' aaa ', ' bbb', ' ccc'], $result);
    }
}
