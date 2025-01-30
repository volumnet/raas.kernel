<?php
/**
 * Тест для класса WeekDatatypeStrategy
 */
namespace RAAS;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestWith;

/**
 * Тест для класса WeekDatatypeStrategy
 */
#[CoversClass(WeekDatatypeStrategy::class)]
class WeekDatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    const DATATYPE = 'week';

    /**
     * Проверка метода isFilled()
     * @param mixed $value Проверяемое значение
     * @param bool $expected Ожидаемое значение
     */
    #[TestWith(['', false])]
    #[TestWith(['2023-W11', true])]
    #[TestWith(['2023-12-06', true])]
    #[TestWith(['2023-12-06 11:08:01', true])]
    #[TestWith(['2023-12-06T11:08:01', true])]
    #[TestWith(['0000-W00', false])]
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
    #[TestWith([['type' => self::DATATYPE], '2023-W01', true])]
    #[TestWith([['type' => self::DATATYPE], '2023-11-12', true])]
    #[TestWith([['type' => self::DATATYPE], '2023-11-12 12:01:02', true])]
    #[TestWith([['type' => self::DATATYPE], '2023-11-12T12:01:02', true])]
    #[TestWith([['type' => self::DATATYPE], '2023-01', true])]
    #[TestWith([['type' => self::DATATYPE], '2023-W00', DatatypeInvalidValueException::class])]
    #[TestWith([['type' => self::DATATYPE], '2023-W99', DatatypeInvalidValueException::class])]
    #[TestWith([['type' => self::DATATYPE, 'pattern' => '2022'], '2023-W11', DatatypePatternMismatchException::class])]
    public function testValidate(array $fieldData, $value, $expected)
    {
        $this->checkValidate($fieldData, $value, $expected);
    }


    /**
     * Проверка метода export()
     * @param mixed $value Проверяемое значение
     * @param string $expected Ожидаемое значение
     */
    #[TestWith(['2023-W01', '2023-01-02'])] // Хз почему так, но вроде так
    #[TestWith(['0000-W00', '0000-00-00'])]
    #[TestWith(['2023-11-12', '2023-11-12'])]
    #[TestWith(['2023-11-12 12:01:02', '2023-11-12'])]
    #[TestWith(['2023-11-12T12:01:02', '2023-11-12'])]
    #[TestWith(['aaa', '0000-00-00'])]
    public function testExport(string $value, string $expected)
    {
        $this->checkExport($value, $expected);
    }


    /**
     * Проверка метода import()
     * @param mixed $value Проверяемое значение
     * @param string $expected Ожидаемое значение
     */
    #[TestWith(['2023-01-02', '2023-W01'])] // Хз почему так, но вроде так
    #[TestWith(['0000-00-00', ''])]
    #[TestWith(['2023-01-02', '2023-W01'])]
    #[TestWith(['2023-01-02 12:01:02', '2023-W01'])]
    #[TestWith(['2023-01-02T12:01:02', '2023-W01'])]
    public function testImport(string $value, string $expected)
    {
        $this->checkImport($value, $expected);
    }
}
