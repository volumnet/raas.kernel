<?php
/**
 * Тест для класса DateTimeDatatypeStrategy
 */
namespace RAAS;

use InvalidArgumentException;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestWith;

/**
 * Тест для класса DateTimeDatatypeStrategy
 */
#[CoversClass(DateTimeDatatypeStrategy::class)]
class DateTimeDatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    const DATATYPE = 'datetime';

    /**
     * Проверка метода isFilled()
     * @param mixed $value Проверяемое значение
     * @param bool $expected Ожидаемое значение
     */
    #[TestWith(['', false])]
    #[TestWith(['aaa', true])]
    #[TestWith(['2023-11-12T14:14', true])]
    #[TestWith(['2023-12-06', true])]
    #[TestWith(['2023-12-06 11:08:01', true])]
    #[TestWith(['2023-12-06T11:08:01', true])]
    #[TestWith(['0000-00-00T00:00', false])]
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
    #[TestWith([['type' => self::DATATYPE], 'aaa', DatatypeInvalidValueException::class])]
    #[TestWith([['type' => self::DATATYPE], '2023-11-12', true])]
    #[TestWith([['type' => self::DATATYPE], '2023-11-12 12:01:02', true])]
    #[TestWith([['type' => self::DATATYPE], '2023-11-12T12:01:02', true])]
    #[TestWith([['type' => self::DATATYPE], '2023-99-99 14:26', DatatypeInvalidValueException::class])]
    #[TestWith([['type' => self::DATATYPE], '2023-11-12T99:99', DatatypeInvalidValueException::class])]
    #[TestWith([['type' => self::DATATYPE], '2023-11-12T23:99', DatatypeInvalidValueException::class])]
    #[TestWith([['type' => self::DATATYPE], '2023-11-12T23:59:99', DatatypeInvalidValueException::class])]
    #[TestWith([['type' => self::DATATYPE], '2023-11-12T99', DatatypeInvalidValueException::class])]
    #[TestWith([['type' => self::DATATYPE, 'pattern' => '2022'], '2023-11-12 12:10', DatatypePatternMismatchException::class])]
    public function testValidate(array $fieldData, $value, $expected)
    {
        $this->checkValidate($fieldData, $value, $expected);
    }


    /**
     * Проверка метода checkDateTime()
     * @param mixed $value Проверяемое значение
     * @param bool $expected Ожидаемое значение
     */
    #[TestWith(['2023-11-12T16:05', true])]
    #[TestWith(['2023-11-12 16:05', true])]
    #[TestWith(['1900-01-01T10:00', true])]
    #[TestWith(['1900-01-01 10:00', true])]
    #[TestWith(['1900-01-01 aaa', false])]
    #[TestWith(['aaa 10:00', false])]
    #[TestWith(['aaa', false])]
    #[TestWith(['', false])]
    #[TestWith(['0001-01-01 00:00', true])]
    #[TestWith(['2023-11-12', false])]
    #[TestWith(['2023-11-12 12:01:02', true])]
    #[TestWith(['2023-11-12T12:01:02', true])]
    public function testCheckDateTime(string $value, bool $expected)
    {
        $strategy = DatatypeStrategy::spawn(self::DATATYPE);
        $result = $strategy->checkDateTime($value);
        $this->assertEquals($expected, $result);
    }


    #[TestWith(['2023-12-12', true])]
    #[TestWith(['2023-99-99', false])]
    #[TestWith(['23:99', false])]
    #[TestWith(['aaa', false])]
    #[TestWith(['', false])]
    public function testCheckDate(string $value, bool $expected)
    {
        $strategy = DatatypeStrategy::spawn(self::DATATYPE);
        $result = $strategy->checkDate($value);
        $this->assertEquals($expected, $result);
    }


    /**
     * Проверка метода checkTime()
     * @param mixed $value Проверяемое значение
     * @param bool $expected Ожидаемое значение
     */
    #[TestWith(['16:05', true])]
    #[TestWith(['16:05:01', true])]
    #[TestWith(['99:01', false])]
    #[TestWith(['23:99', false])]
    #[TestWith(['16:05:99', false])]
    #[TestWith(['aaa', false])]
    #[TestWith(['', false])]
    public function testCheckTime(string $value, bool $expected)
    {
        $strategy = DatatypeStrategy::spawn(self::DATATYPE);
        $result = $strategy->checkTime($value);
        $this->assertEquals($expected, $result);
    }


    /**
     * Проверка метода checkWeek()
     * @param mixed $value Проверяемое значение
     * @param bool $expected Ожидаемое значение
     */
    #[TestWith(['2023-W12', true])]
    #[TestWith(['2023-W99', false])]
    #[TestWith(['aaa', false])]
    #[TestWith(['', false])]
    public function testCheckWeek(string $value, bool $expected)
    {
        $strategy = DatatypeStrategy::spawn(self::DATATYPE);
        $result = $strategy->checkWeek($value);
        $this->assertEquals($expected, $result);
    }


    /**
     * Проверка метода export()
     * @param mixed $value Проверяемое значение
     * @param string $expected Ожидаемое значение
     */
    #[TestWith(['2023-11-12T16:05', '2023-11-12 16:05:00'])]
    #[TestWith(['2023-11-12 16:05', '2023-11-12 16:05:00'])]
    #[TestWith(['1900-01-01T10:00', '1900-01-01 10:00:00'])]
    #[TestWith(['1900-01-01 10:00', '1900-01-01 10:00:00'])]
    #[TestWith(['aaa', '0000-00-00 00:00:00'])]
    #[TestWith(['', '0000-00-00 00:00:00'])]
    #[TestWith(['0001-01-01 00:00', '0001-01-01 00:00:00'])]
    #[TestWith(['2023-11-12', '2023-11-12 00:00:00'])]
    #[TestWith(['2023-11-12 12:01:02', '2023-11-12 12:01:02'])]
    #[TestWith(['2023-11-12T12:01:02', '2023-11-12 12:01:02'])]
    public function testExport(string $value, string $expected)
    {
        $this->checkExport($value, $expected);
    }


    /**
     * Проверка метода import()
     * @param mixed $value Проверяемое значение
     * @param string $expected Ожидаемое значение
     */
    #[TestWith(['2023-11-12 16:05:00', '2023-11-12 16:05'])]
    #[TestWith(['1900-01-01 10:00:00', '1900-01-01 10:00'])]
    #[TestWith(['0000-00-00 00:00:00', ''])]
    #[TestWith(['0001-01-01 00:00:00', '0001-01-01 00:00'])]
    #[TestWith(['2023-11-12', '2023-11-12 00:00'])]
    #[TestWith(['2023-11-12 12:01:02', '2023-11-12 12:01'])]
    #[TestWith(['2023-11-12T12:01:02', '2023-11-12 12:01'])]
    public function testImport(string $value, string $expected)
    {
        $this->checkImport($value, $expected);
    }
}
