<?php
/**
 * Тест для класса DateDatatypeStrategy
 */
namespace RAAS;

use InvalidArgumentException;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestWith;

/**
 * Тест для класса DateDatatypeStrategy
 */
#[CoversClass(DateDatatypeStrategy::class)]
class DateDatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    const DATATYPE = 'date';

    /**
     * Проверка метода isFilled()
     * @param mixed $value Проверяемое значение
     * @param bool $expected Ожидаемое значение
     */
    #[TestWith(['', false])]
    #[TestWith(['2023-12-06', true])]
    #[TestWith(['2023-12-06 11:08:01', true])]
    #[TestWith(['2023-12-06T11:08:01', true])]
    #[TestWith(['2023-11-12', true])]
    #[TestWith(['0000-00-00', false])]
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
    #[TestWith([['type' => self::DATATYPE], [], true])]
    #[TestWith([['type' => self::DATATYPE], '2023-11-12', true])]
    #[TestWith([['type' => self::DATATYPE], '2023-11-12 12:01:02', true])]
    #[TestWith([['type' => self::DATATYPE], '2023-11-12T12:01:02', true])]
    #[TestWith([['type' => self::DATATYPE], 'abc', DatatypeInvalidValueException::class])]
    #[TestWith([['type' => self::DATATYPE, 'pattern' => '2022'], '2023-11-12', DatatypePatternMismatchException::class])]
    public function testValidate(array $fieldData, $value, $expected)
    {
        $this->checkValidate($fieldData, $value, $expected);
    }


    /**
     * Проверка метода export()
     * @param mixed $value Проверяемое значение
     * @param string $expected Ожидаемое значение
     */
    #[TestWith(['2023-11-12', '2023-11-12'])]
    #[TestWith(['1900-01-01', '1900-01-01'])]
    #[TestWith(['aaa', '0000-00-00'])]
    #[TestWith(['', '0000-00-00'])]
    #[TestWith(['0000-00-00', '0000-00-00'])]
    #[TestWith(['0001-01-01', '0001-01-01'])]
    #[TestWith(['2023-11-12', '2023-11-12'])]
    #[TestWith(['2023-11-12 12:01:02', '2023-11-12'])]
    #[TestWith(['2023-11-12T12:01:02', '2023-11-12'])]
    public function testExport(string $value, string $expected)
    {
        $this->checkExport($value, $expected);
    }


    /**
     * Проверка метода import()
     * @param mixed $value Проверяемое значение
     * @param string $expected Ожидаемое значение
     */
    #[TestWith(['2023-11-12', '2023-11-12'])]
    #[TestWith(['1900-01-01', '1900-01-01'])]
    #[TestWith(['0000-00-00', ''])]
    #[TestWith(['0001-01-01', '0001-01-01'])]
    #[TestWith(['2023-11-12', '2023-11-12'])]
    #[TestWith(['2023-11-12 12:01:02', '2023-11-12'])]
    #[TestWith(['2023-11-12T12:01:02', '2023-11-12'])]
    #[TestWith([null, ''])] //strtotime(): Argument #1 ($datetime) must be of type string, null given in datedatatypestrategy.class.php on line 25
    public function testImport($value, string $expected)
    {
        $this->checkImport($value, $expected);
    }
}
