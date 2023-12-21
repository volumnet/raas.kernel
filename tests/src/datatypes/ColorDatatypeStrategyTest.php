<?php
/**
 * Тест для класса ColorDatatypeStrategy
 */
namespace RAAS;

use InvalidArgumentException;

class ColorDatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    public function validateDataProvider(): array
    {
        $result = [
            [['type' => 'color'], '', true],
            [['type' => 'color'], '#abcdef', true],
            [['type' => 'color'], '#zzzzzz', DatatypeInvalidValueException::class],
            [['type' => 'color', 'pattern' => 'aaa'], '#bbbbbb', DatatypePatternMismatchException::class]
        ];
        return $result;
    }
}
