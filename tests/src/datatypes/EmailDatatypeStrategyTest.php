<?php
/**
 * Тест для класса EmailDatatypeStrategy
 */
namespace RAAS;

use InvalidArgumentException;

class EmailDatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    public function validateDataProvider(): array
    {
        $result = [
            [['type' => 'email'], '', true],
            [['type' => 'email'], 'info@volumnet.ru', true],
            [['type' => 'email'], 'aaa', DatatypeInvalidValueException::class],
            [['type' => 'email', 'pattern' => 'volumnet'], 'test@test.org', DatatypePatternMismatchException::class],
        ];
        return $result;
    }
}
