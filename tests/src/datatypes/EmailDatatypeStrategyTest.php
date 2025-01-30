<?php
/**
 * Тест для класса EmailDatatypeStrategy
 */
namespace RAAS;

use InvalidArgumentException;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestWith;

/**
 * Тест для класса EmailDatatypeStrategy
 */
#[CoversClass(EmailDatatypeStrategy::class)]
class EmailDatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    const DATATYPE = 'email';

    /**
     * Проверка метода validate()
     * @param mixed $value Проверяемое значение
     * @param mixed $expected Ожидаемое значение
     */
    #[TestWith([['type' => self::DATATYPE], '', true])]
    #[TestWith([['type' => self::DATATYPE], 'info@volumnet.ru', true])]
    #[TestWith([['type' => self::DATATYPE], 'aaa', DatatypeInvalidValueException::class])]
    #[TestWith([['type' => self::DATATYPE, 'pattern' => 'volumnet'], 'test@test.org', DatatypePatternMismatchException::class])]
    public function testValidate(array $fieldData, $value, $expected)
    {
        $this->checkValidate($fieldData, $value, $expected);
    }
}
