<?php
/**
 * Тест для класса UrlDatatypeStrategy
 */
namespace RAAS;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestWith;

/**
 * Тест для класса UrlDatatypeStrategy
 */
#[CoversClass(UrlDatatypeStrategy::class)]
class UrlDatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    const DATATYPE = 'url';

    /**
     * Проверка метода validate()
     * @param mixed $value Проверяемое значение
     * @param mixed $expected Ожидаемое значение
     */
    #[TestWith([['type' => self::DATATYPE], '', true])]
    #[TestWith([['type' => self::DATATYPE], 'https://volumnet.ru', true])]
    #[TestWith([['type' => self::DATATYPE], 'aaa', DatatypeInvalidValueException::class])]
    #[TestWith([['type' => self::DATATYPE, 'pattern' => 'volumnet'], 'https://test.org', DatatypePatternMismatchException::class])]
    public function testValidate(array $fieldData, $value, $expected)
    {
        $this->checkValidate($fieldData, $value, $expected);
    }
}
