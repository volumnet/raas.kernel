<?php
/**
 * Тест для класса UrlDatatypeStrategy
 */
namespace RAAS;

/**
 * Тест для класса UrlDatatypeStrategy
 * @covers \RAAS\UrlDatatypeStrategy
 */
class UrlDatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    public function validateDataProvider(): array
    {
        $result = [
            [['type' => 'url'], '', true],
            [['type' => 'url'], 'https://volumnet.ru', true],
            [['type' => 'url'], 'aaa', DatatypeInvalidValueException::class],
            [['type' => 'url', 'pattern' => 'volumnet'], 'https://test.org', DatatypePatternMismatchException::class],
        ];
        return $result;
    }
}
