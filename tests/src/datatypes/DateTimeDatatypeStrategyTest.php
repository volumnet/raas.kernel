<?php
/**
 * Тест для класса DateTimeDatatypeStrategy
 */
namespace RAAS;

use InvalidArgumentException;

class DateTimeDatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
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
            ['', false],
            ['aaa', true],
            ['2023-11-12T14:14', true],
            ['2023-12-06', true],
            ['2023-12-06 11:08:01', true],
            ['2023-12-06T11:08:01', true],
            ['0000-00-00T00:00', false],
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
        $strategy = DatatypeStrategy::spawn('datetime');

        $result = $strategy->isFilled($value);

        $this->assertEquals($expected, $result);
    }


    public function validateDataProvider(): array
    {
        $result = [
            [['type' => 'datetime'], '', true],
            [['type' => 'datetime'], 'aaa', DatatypeInvalidValueException::class],
            [['type' => 'datetime'], '2023-11-12', true],
            [['type' => 'datetime'], '2023-11-12 12:01:02', true],
            [['type' => 'datetime'], '2023-11-12T12:01:02', true],
            [['type' => 'datetime'], '2023-99-99 14:26', DatatypeInvalidValueException::class],
            [['type' => 'datetime'], '2023-11-12T99:99', DatatypeInvalidValueException::class],
            [['type' => 'datetime'], '2023-11-12T23:99', DatatypeInvalidValueException::class],
            [['type' => 'datetime'], '2023-11-12T23:59:99', DatatypeInvalidValueException::class],
            [['type' => 'datetime'], '2023-11-12T99', DatatypeInvalidValueException::class],
            [['type' => 'datetime', 'pattern' => '2022'], '2023-11-12 12:10', DatatypePatternMismatchException::class],
        ];
        return $result;
    }


    /**
     * Провайдер данных для метода testCheckDateTime
     * @return array <pre><code>array<[
     *     mixed Проверяемое значение
     *     bool Ожидаемый результат
     * ]></code></pre>
     */
    public function checkDateTimeDataProvider(): array
    {
        $result = [
            ['2023-11-12T16:05', true],
            ['2023-11-12 16:05', true],
            ['1900-01-01T10:00', true],
            ['1900-01-01 10:00', true],
            ['1900-01-01 aaa', false],
            ['aaa 10:00', false],
            ['aaa', false],
            ['', false],
            ['0001-01-01 00:00', true],
            ['2023-11-12', false],
            ['2023-11-12 12:01:02', true],
            ['2023-11-12T12:01:02', true],

        ];
        return $result;
    }


    /**
     * Проверка метода checkDateTime()
     * @dataProvider checkDateTimeDataProvider
     * @param mixed $value Проверяемое значение
     * @param bool $expected Ожидаемое значение
     */
    public function testCheckDateTime(string $value, bool $expected)
    {
        $strategy = DatatypeStrategy::spawn('datetime');

        $result = $strategy->checkDateTime($value);

        $this->assertEquals($expected, $result);
    }


    /**
     * Провайдер данных для метода testCheckDate
     * @return array <pre><code>array<[
     *     mixed Проверяемое значение
     *     bool Ожидаемый результат
     * ]></code></pre>
     */
    public function checkDateDataProvider(): array
    {
        $result = [
            ['2023-12-12', true],
            ['2023-99-99', false],
            ['23:99', false],
            ['aaa', false],
            ['', false],

        ];
        return $result;
    }


    /**
     * Проверка метода checkDate()
     * @dataProvider checkDateDataProvider
     * @param mixed $value Проверяемое значение
     * @param bool $expected Ожидаемое значение
     */
    public function testCheckDate(string $value, bool $expected)
    {
        $strategy = DatatypeStrategy::spawn('datetime');

        $result = $strategy->checkDate($value);

        $this->assertEquals($expected, $result);
    }


    /**
     * Провайдер данных для метода testCheckTime
     * @return array <pre><code>array<[
     *     mixed Проверяемое значение
     *     bool Ожидаемый результат
     * ]></code></pre>
     */
    public function checkTimeDataProvider(): array
    {
        $result = [
            ['16:05', true],
            ['16:05:01', true],
            ['99:01', false],
            ['23:99', false],
            ['16:05:99', false],
            ['aaa', false],
            ['', false],

        ];
        return $result;
    }


    /**
     * Проверка метода checkTime()
     * @dataProvider checkTimeDataProvider
     * @param mixed $value Проверяемое значение
     * @param bool $expected Ожидаемое значение
     */
    public function testCheckTime(string $value, bool $expected)
    {
        $strategy = DatatypeStrategy::spawn('datetime');

        $result = $strategy->checkTime($value);

        $this->assertEquals($expected, $result);
    }


    /**
     * Провайдер данных для метода testCheckWeek
     * @return array <pre><code>array<[
     *     mixed Проверяемое значение
     *     bool Ожидаемый результат
     * ]></code></pre>
     */
    public function checkWeekDataProvider(): array
    {
        $result = [
            ['2023-W12', true],
            ['2023-W99', false],
            ['aaa', false],
            ['', false],

        ];
        return $result;
    }


    /**
     * Проверка метода checkWeek()
     * @dataProvider checkWeekDataProvider
     * @param mixed $value Проверяемое значение
     * @param bool $expected Ожидаемое значение
     */
    public function testCheckWeek(string $value, bool $expected)
    {
        $strategy = DatatypeStrategy::spawn('datetime');

        $result = $strategy->checkWeek($value);

        $this->assertEquals($expected, $result);
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
            ['2023-11-12T16:05', '2023-11-12 16:05:00'],
            ['2023-11-12 16:05', '2023-11-12 16:05:00'],
            ['1900-01-01T10:00', '1900-01-01 10:00:00'],
            ['1900-01-01 10:00', '1900-01-01 10:00:00'],
            ['aaa', '0000-00-00 00:00:00'],
            ['', '0000-00-00 00:00:00'],
            ['0001-01-01 00:00', '0001-01-01 00:00:00'],
            ['2023-11-12', '2023-11-12 00:00:00'],
            ['2023-11-12 12:01:02', '2023-11-12 12:01:02'],
            ['2023-11-12T12:01:02', '2023-11-12 12:01:02'],

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
        $strategy = DatatypeStrategy::spawn('datetime');

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
            ['2023-11-12 16:05:00', '2023-11-12 16:05'],
            ['1900-01-01 10:00:00', '1900-01-01 10:00'],
            ['0000-00-00 00:00:00', ''],
            ['0001-01-01 00:00:00', '0001-01-01 00:00'],
            ['2023-11-12', '2023-11-12 00:00'],
            ['2023-11-12 12:01:02', '2023-11-12 12:01'],
            ['2023-11-12T12:01:02', '2023-11-12 12:01'],
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
        $strategy = DatatypeStrategy::spawn('datetime');

        $result = $strategy->import($value);

        $this->assertEquals($expected, $result);
    }
}
