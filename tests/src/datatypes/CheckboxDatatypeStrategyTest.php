<?php
/**
 * Тест для класса CheckboxDatatypeStrategy
 */
namespace RAAS;

/**
 * Тест для класса CheckboxDatatypeStrategy
 * @covers \RAAS\CheckboxDatatypeStrategy
 */
class CheckboxDatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    /**
     * Проверка ошибки от 2024-05-14 15:56
     * TypeError: trim(): Argument #1 ($string) must be of type string, int given
     * При передаче в export значения типа int
     */
    public function test202405141556()
    {
        $strategy = DatatypeStrategy::spawn('checkbox');

        $result = $strategy->export(1);

        $this->assertEquals('1', $result);
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
            [' aaa ', 'aaa'],
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
        $strategy = DatatypeStrategy::spawn('checkbox');

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
            [' aaa ', ' aaa '],
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
        $strategy = DatatypeStrategy::spawn('checkbox');

        $result = $strategy->import($value);

        $this->assertEquals($expected, $result);
    }
}
