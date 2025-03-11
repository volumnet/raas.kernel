<?php
/**
 * Тест для класса NumberDatatypeStrategy
 */
namespace RAAS;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestWith;

/**
 * Тест для класса NumberDatatypeStrategy
 */
#[CoversClass(NumberDatatypeStrategy::class)]
class NumberDatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    const DATATYPE = 'number';

    /**
     * Проверка метода isFilled()
     * @param mixed $value Проверяемое значение
     * @param bool $expected Ожидаемое значение
     */
    #[TestWith(['', false])]
    #[TestWith(['123', true])]
    #[TestWith(['0.0', false])]
    #[TestWith(['0,00', false])]
    public function testIsFilled($value, bool $expected)
    {
        $this->checkIsFilled($value, $expected);
    }


    /**
     * Проверка метода validate()
     * @param mixed $value Проверяемое значение
     * @param mixed $expected Ожидаемое значение
     */
    #[TestWith([['type' => self::DATATYPE], '', true])]
    #[TestWith([['type' => self::DATATYPE], '0', true])]
    #[TestWith([['type' => self::DATATYPE], 'aaa', DatatypeInvalidValueException::class])]
    #[TestWith([['type' => self::DATATYPE, 'min' => 10], 9, DatatypeOutOfRangeException::class])]
    #[TestWith([['type' => self::DATATYPE, 'max' => 999], 1000, DatatypeOutOfRangeException::class])]
    #[TestWith([['type' => self::DATATYPE, 'min' => 10, 'max' => 999], 100, true])]
    #[TestWith([['type' => self::DATATYPE, 'pattern' => '2022'], '2023', DatatypePatternMismatchException::class])]
    public function testValidate(array $fieldData, $value, $expected)
    {
        $this->checkValidate($fieldData, $value, $expected);
    }


    /**
     * Проверка метода export()
     * @param mixed $value Проверяемое значение
     * @param float $expected Ожидаемое значение
     */
    #[TestWith([' aaa ', 0])]
    #[TestWith([' 1,52 ', 1.52])]
    #[TestWith(['123,5 ', 123.5])]
    public function testExport(string $value, float $expected)
    {
        $this->checkExport($value, $expected);
    }


    /**
     * Проверка метода import()
     * @param mixed $value Проверяемое значение
     * @param string $expected Ожидаемое значение
     */
    #[TestWith(['0', 0])]
    #[TestWith([' 1,52 ', 1.52])]
    #[TestWith([123.5, 123.5])]
    public function testImport($value, $expected)
    {
        $this->checkImport($value, $expected);
    }
}
