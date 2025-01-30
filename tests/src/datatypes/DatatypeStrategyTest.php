<?php
/**
 * Тест для класса DatatypeStrategy
 */
namespace RAAS;

use stdClass;
use Exception;
use InvalidArgumentException;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestWith;

/**
 * Тест для класса DatatypeStrategy
 */
#[CoversClass(DatatypeStrategy::class)]
class DatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    use WithTempTablesTrait;

    const DATATYPE = 'text';

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
     * Тест метода getPostData
     * @param array $fieldData Данные поля
     * @param bool $forceArray Приводить к массиву
     * @param array $postData POST-данные
     * @param mixed $expected Ожидаемое значение
     */
    #[TestWith([
        ['name' => 'test', 'multiple' => false],
        false,
        ['aaa' => 'abc', 'test' => 'xyz'],
        'xyz',
    ])]
    #[TestWith([
        ['name' => 'test', 'multiple' => false],
        true,
        ['aaa' => 'abc', 'test' => 'xyz'],
        ['xyz'],
    ])]
    #[TestWith([
        ['name' => 'test', 'multiple' => false],
        false,
        ['aaa' => 'abc', 'test' => ['xyz']],
        ['xyz'],
    ])]
    #[TestWith([
        ['name' => 'test', 'multiple' => false],
        true,
        ['aaa' => 'abc', 'test' => ['aaa' => 'xyz']],
        ['aaa' => 'xyz'],
    ])]
    #[TestWith([
        ['name' => 'test', 'multiple' => false],
        false,
        ['aaa' => 'abc'],
        null,
    ])]
    #[TestWith([
        ['name' => 'test', 'multiple' => false],
        true,
        ['aaa' => 'abc'],
        [],
    ])]
    #[TestWith([
        ['name' => 'test', 'multiple' => true],
        false,
        ['aaa' => 'abc', 'test' => 'xyz'],
        'xyz',
    ])]
    #[TestWith([
        ['name' => 'test', 'multiple' => true],
        true,
        ['aaa' => 'abc', 'test' => 'xyz'],
        ['xyz'],
    ])]
    #[TestWith([
        ['name' => 'test', 'multiple' => true],
        false,
        ['aaa' => 'abc', 'test' => ['xyz']],
        ['xyz'],
    ])]
    #[TestWith([
        ['name' => 'test', 'multiple' => true],
        true,
        ['aaa' => 'abc', 'test' => ['xyz']],
        ['xyz'],
    ])]
    #[TestWith([
        ['name' => 'test', 'multiple' => true],
        false,
        ['aaa' => 'abc'],
        null,
    ])]
    #[TestWith([
        ['name' => 'test', 'multiple' => true],
        true,
        ['aaa' => 'abc'],
        [],
    ])]
    public function testGetPostData(array $fieldData, bool $forceArray, array $postData, $expected)
    {
        $field = new Field($fieldData);
        $oldPost = $_POST;
        $_POST = $postData;
        $datatypeStrategy = DatatypeStrategy::spawn(self::DATATYPE);

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
        $datatypeStrategy = DatatypeStrategy::spawn(self::DATATYPE);

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
     * Проверка метода isFilled()
     * @param mixed $value Проверяемое значение
     * @param bool $expected Ожидаемое значение
     */
    #[TestWith(['aaa', true])]
    #[TestWith(['', false])]
    #[TestWith([['aaa'], true])]
    #[TestWith([[], false])]
    public function testIsFilled($value, bool $expected)
    {
        $this->checkIsFilled($value, $expected);
    }


    /**
     * Проверка метода validate()
     * @param mixed $value Проверяемое значение
     * @param mixed $expected Ожидаемое значение
     */
    #[TestWith([['type' => self::DATATYPE], ' ', true])]
    #[TestWith([['type' => self::DATATYPE], ['aaa' => 'bbb'], true])]
    #[TestWith([['type' => self::DATATYPE, 'pattern' => '^\\d+$'], '123', true])]
    #[TestWith([['type' => self::DATATYPE, 'pattern' => '^\\d+$'], 'aaa', DatatypePatternMismatchException::class])]
    public function testValidate(array $fieldData, $value, $expected)
    {
        $this->checkValidate($fieldData, $value, $expected);
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
     * Проверка метода export()
     * @param mixed $value Проверяемое значение
     * @param string $expected Ожидаемое значение
     */
    #[TestWith([' aaa ', 'aaa'])]
    public function testExport(string $value, string $expected)
    {
        $this->checkExport($value, $expected);
    }


    /**
     * Проверка метода import()
     * @param mixed $value Проверяемое значение
     * @param string $expected Ожидаемое значение
     */
    #[TestWith([' aaa ', ' aaa '])]
    public function testImport(string $value, string $expected)
    {
        $this->checkImport($value, $expected);
    }


    /**
     * Проверка метода batchImport()
     */
    public function testBatchExport()
    {
        $strategy = DatatypeStrategy::spawn(self::DATATYPE);
        $result = $strategy->batchExport([' aaa ', ' bbb', null, ' ccc', ]);
        $this->assertEquals(['aaa', 'bbb', '', 'ccc'], $result);
    }


    /**
     * Проверка метода batchImport()
     */
    public function testBatchImport()
    {
        $strategy = DatatypeStrategy::spawn(self::DATATYPE);
        $result = $strategy->batchImport([' aaa ', ' bbb', null, ' ccc']);
        $this->assertEquals([' aaa ', ' bbb', ' ccc'], $result);
    }
}
