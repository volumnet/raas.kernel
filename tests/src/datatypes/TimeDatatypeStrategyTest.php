<?php
/**
 * Тест для класса TimeDatatypeStrategy
 */
namespace RAAS;

/**
 * Тест для класса TimeDatatypeStrategy
 * @covers \RAAS\TimeDatatypeStrategy
 */
class TimeDatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    public function validateDataProvider(): array
    {
        $result = [
            [['type' => 'time'], '', true],
            [['type' => 'time'], '14:28', true],
            [['type' => 'time'], '14:28:29', true],
            [['type' => 'time'], '2023-11-12', true],
            [['type' => 'time'], '2023-11-12 12:01:02', true],
            [['type' => 'time'], '2023-11-12T12:01:02', true],
            [['type' => 'time'], '99:99', DatatypeInvalidValueException::class],
            [['type' => 'time'], '23:99', DatatypeInvalidValueException::class],
            [['type' => 'time'], '23:59:99', DatatypeInvalidValueException::class],
            [['type' => 'time'], 'aaa', DatatypeInvalidValueException::class],
            [['type' => 'time', 'pattern' => '10:'], '12:10', DatatypePatternMismatchException::class],
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
            ['12:05', '12:05:00'],
            ['00:00', '00:00:00'],
            ['00:00:01', '00:00:01'],
            ['aaa', '00:00:00'],
            ['', '00:00:00'],
            ['2023-11-12', '00:00:00'],
            ['2023-11-12 12:01:02', '12:01:02'],
            ['2023-11-12T12:01:02', '12:01:02'],
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
        $strategy = DatatypeStrategy::spawn('time');

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
            ['2023-11-17 12:05:00', '12:05'],
            ['0000-00-00 00:00:00', ''], // Поскольку некорректная дата
            ['0001-01-01 00:00:00', '00:00'],
            ['2023-11-12', '00:00'],
            ['2023-11-12 12:01:02', '12:01'],
            ['2023-11-12T12:01:02', '12:01'],
            ['00:00:01', '00:00'],
            ['00:01:01', '00:01'],

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
        $strategy = DatatypeStrategy::spawn('time');

        $result = $strategy->import($value);

        $this->assertEquals($expected, $result);
    }
}
