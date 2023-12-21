<?php
/**
 * Тест для класса NumberDatatypeStrategy
 */
namespace RAAS;

class NumberDatatypeStrategyTest extends AbstractDatatypeStrategyTest
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
            ['123', true],
            ['0.0', false],
            ['0,00', false],
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
        $strategy = DatatypeStrategy::spawn('number');

        $result = $strategy->isFilled($value);

        $this->assertEquals($expected, $result);
    }


    /**
     * Провайдер данных для метода testValidate
     * @return array <pre><code>array<[
     *     mixed Проверяемое значение
     *     float|null Минимальное значение
     *     float|null Максимальное значение
     *     bool Ожидаемый результат
     * ]></code></pre>
     */
    public function validateDataProvider(): array
    {
        $result = [
            [['type' => 'number'], '', true],
            [['type' => 'number'], 'aaa', DatatypeInvalidValueException::class],
            [['type' => 'number', 'min' => 10], 9, DatatypeOutOfRangeException::class],
            [['type' => 'number', 'max' => 999], 1000, DatatypeOutOfRangeException::class],
            [['type' => 'number', 'min' => 10, 'max' => 999], 100, true],
            [['type' => 'number', 'pattern' => '2022'], '2023', DatatypePatternMismatchException::class],
        ];
        return $result;
    }


    /**
     * Провайдер данных для метода testExport
     * @return array <pre><code>array<[
     *     mixed Проверяемое значение
     *     float Ожидаемый результат
     * ]></code></pre>
     */
    public function exportDataProvider(): array
    {
        $result = [
            [' aaa ', 0],
            [' 1,52 ', 1.52],
            ['123,5 ', 123.5],
        ];
        return $result;
    }


    /**
     * Проверка метода export()
     * @dataProvider exportDataProvider
     * @param mixed $value Проверяемое значение
     * @param float $expected Ожидаемое значение
     */
    public function testExport(string $value, float $expected)
    {
        $strategy = DatatypeStrategy::spawn('number');

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
            ['0', 0],
            [' 1,52 ', 1.52],
            [123.5, 123.5],
        ];
        return $result;
    }


    /**
     * Проверка метода import()
     * @dataProvider importDataProvider
     * @param mixed $value Проверяемое значение
     * @param string $expected Ожидаемое значение
     */
    public function testImport($value, $expected)
    {
        $strategy = DatatypeStrategy::spawn('number');

        $result = $strategy->import($value);

        $this->assertEquals($expected, $result);
    }
}
