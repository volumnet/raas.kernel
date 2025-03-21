<?php
/**
 * Тест для класса CheckboxDatatypeStrategy
 */
namespace RAAS;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestWith;

/**
 * Тест для класса CheckboxDatatypeStrategy
 */
#[CoversClass(CheckboxDatatypeStrategy::class)]
class CheckboxDatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    const DATATYPE = 'checkbox';

    /**
     * Проверка метода export()
     * @param mixed $value Проверяемое значение
     * @param mixed $expected Ожидаемое значение
     */
    #[TestWith([' aaa ', 'aaa'])]
    #[TestWith([1, '1'])] // Проверка ошибки от 2024-05-14 15:56 : TypeError: trim(): Argument #1 ($string) must be of type string, int given, при передаче в export значения типа int
    #[TestWith([0, '0'])] // Проверка ошибки от 2025-03-19 16:01 : '0' не проходит
    public function testExport($value, $expected)
    {
        $this->checkExport($value, $expected);
    }


    /**
     * Проверка метода import()
     * @param mixed $value Проверяемое значение
     * @param string $expected Ожидаемое значение
     */
    #[TestWith([' aaa ', ' aaa '])]
    public function testImport(string $value, string $expected)
    {
        $this->checkImport($value, $expected);
    }
}
