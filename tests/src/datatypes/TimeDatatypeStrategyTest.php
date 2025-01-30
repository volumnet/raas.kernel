<?php
/**
 * Тест для класса TimeDatatypeStrategy
 */
namespace RAAS;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestWith;

/**
 * Тест для класса TimeDatatypeStrategy
 */
#[CoversClass(TimeDatatypeStrategy::class)]
class TimeDatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    const DATATYPE = 'time';

    /**
     * Проверка метода validate()
     * @param mixed $value Проверяемое значение
     * @param mixed $expected Ожидаемое значение
     */
    #[TestWith([['type' => self::DATATYPE], '', true])]
    #[TestWith([['type' => self::DATATYPE], '14:28', true])]
    #[TestWith([['type' => self::DATATYPE], '14:28:29', true])]
    #[TestWith([['type' => self::DATATYPE], '2023-11-12', true])]
    #[TestWith([['type' => self::DATATYPE], '2023-11-12 12:01:02', true])]
    #[TestWith([['type' => self::DATATYPE], '2023-11-12T12:01:02', true])]
    #[TestWith([['type' => self::DATATYPE], '99:99', DatatypeInvalidValueException::class])]
    #[TestWith([['type' => self::DATATYPE], '23:99', DatatypeInvalidValueException::class])]
    #[TestWith([['type' => self::DATATYPE], '23:59:99', DatatypeInvalidValueException::class])]
    #[TestWith([['type' => self::DATATYPE], 'aaa', DatatypeInvalidValueException::class])]
    #[TestWith([['type' => self::DATATYPE, 'pattern' => '10:'], '12:10', DatatypePatternMismatchException::class])]
    public function testValidate(array $fieldData, $value, $expected)
    {
        $this->checkValidate($fieldData, $value, $expected);
    }


    /**
     * Проверка метода export()
     * @param mixed $value Проверяемое значение
     * @param string $expected Ожидаемое значение
     */
    #[TestWith(['12:05', '12:05:00'])]
    #[TestWith(['00:00', '00:00:00'])]
    #[TestWith(['00:00:01', '00:00:01'])]
    #[TestWith(['aaa', '00:00:00'])]
    #[TestWith(['', '00:00:00'])]
    #[TestWith(['2023-11-12', '00:00:00'])]
    #[TestWith(['2023-11-12 12:01:02', '12:01:02'])]
    #[TestWith(['2023-11-12T12:01:02', '12:01:02'])]
    public function testExport(string $value, string $expected)
    {
        $this->checkExport($value, $expected);
    }


    /**
     * Проверка метода import()
     * @param mixed $value Проверяемое значение
     * @param string $expected Ожидаемое значение
     */
    #[TestWith(['2023-11-17 12:05:00', '12:05'])]
    #[TestWith(['0000-00-00 00:00:00', ''])] // Поскольку некорректная дата
    #[TestWith(['0001-01-01 00:00:00', '00:00'])]
    #[TestWith(['2023-11-12', '00:00'])]
    #[TestWith(['2023-11-12 12:01:02', '12:01'])]
    #[TestWith(['2023-11-12T12:01:02', '12:01'])]
    #[TestWith(['00:00:01', '00:00'])]
    #[TestWith(['00:01:01', '00:01'])]
    public function testImport(string $value, string $expected)
    {
        $this->checkImport($value, $expected);
    }
}
