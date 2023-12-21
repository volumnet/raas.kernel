<?php
/**
 * Тест для класса DateDatatypeStrategy
 */
namespace RAAS;

use InvalidArgumentException;

class DateDatatypeStrategyTest extends AbstractDatatypeStrategyTest
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
            ['2023-12-06', true],
            ['2023-12-06 11:08:01', true],
            ['2023-12-06T11:08:01', true],
            ['2023-11-12', true],
            ['0000-00-00', false],
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
        $strategy = DatatypeStrategy::spawn('date');

        $result = $strategy->isFilled($value);

        $this->assertEquals($expected, $result);
    }


    public function validateDataProvider(): array
    {
        $result = [
            [['type' => 'date'], '', true],
            [['type' => 'date'], [], true],
            [['type' => 'date'], '2023-11-12', true],
            [['type' => 'date'], '2023-11-12 12:01:02', true],
            [['type' => 'date'], '2023-11-12T12:01:02', true],
            [['type' => 'date'], 'abc', DatatypeInvalidValueException::class],
            [['type' => 'date', 'pattern' => '2022'], '2023-11-12', DatatypePatternMismatchException::class],
        ];
        return $result;
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
            ['2023-11-12', '2023-11-12'],
            ['1900-01-01', '1900-01-01'],
            ['aaa', '0000-00-00'],
            ['', '0000-00-00'],
            ['0000-00-00', '0000-00-00'],
            ['0001-01-01', '0001-01-01'],
            ['2023-11-12', '2023-11-12'],
            ['2023-11-12 12:01:02', '2023-11-12'],
            ['2023-11-12T12:01:02', '2023-11-12'],
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
        $strategy = DatatypeStrategy::spawn('date');

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
            ['2023-11-12', '2023-11-12'],
            ['1900-01-01', '1900-01-01'],
            ['0000-00-00', ''],
            ['0001-01-01', '0001-01-01'],
            ['2023-11-12', '2023-11-12'],
            ['2023-11-12 12:01:02', '2023-11-12'],
            ['2023-11-12T12:01:02', '2023-11-12'],

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
        $strategy = DatatypeStrategy::spawn('date');

        $result = $strategy->import($value);

        $this->assertEquals($expected, $result);
    }
}
