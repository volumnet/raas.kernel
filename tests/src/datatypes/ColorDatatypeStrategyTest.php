<?php
/**
 * Тест для класса ColorDatatypeStrategy
 */
namespace RAAS;

use InvalidArgumentException;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestWith;

/**
 * Тест для класса ColorDatatypeStrategy
 */
#[CoversClass(ColorDatatypeStrategy::class)]
class ColorDatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    const DATATYPE = 'color';

    /**
     * Проверка метода validate()
     * @param mixed $value Проверяемое значение
     * @param mixed $expected Ожидаемое значение
     */
    #[TestWith([['type' => self::DATATYPE], '', true])]
    #[TestWith([['type' => self::DATATYPE], '#abcdef', true])]
    #[TestWith([['type' => self::DATATYPE], '#zzzzzz', DatatypeInvalidValueException::class])]
    #[TestWith([['type' => self::DATATYPE, 'pattern' => 'aaa'], '#bbbbbb', DatatypePatternMismatchException::class])]
    public function testValidate(array $fieldData, $value, $expected)
    {
        $this->checkValidate($fieldData, $value, $expected);
    }
}
