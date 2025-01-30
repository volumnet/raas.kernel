<?php
/**
 * Тест для класса ImageDatatypeStrategy
 */
namespace RAAS;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestWith;

/**
 * Тест для класса ImageDatatypeStrategy
 */
#[CoversClass(ImageDatatypeStrategy::class)]
class ImageDatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    const DATATYPE = 'image';

    public static function validateDataProvider(): array
    {
        $result = [
            [
                ['type' => self::DATATYPE],
                [
                    'tmp_name' => '',
                    'name' => '',
                    'type' => '',
                ],
                true,
            ],
            [
                ['type' => self::DATATYPE],
                [],
                true,
            ],
            [
                ['type' => self::DATATYPE],
                '',
                true,
            ],
            [
                ['type' => self::DATATYPE],
                [
                    'tmp_name' => static::getResourcesDir() . '/nophoto.jpg',
                    'name' => 'nophoto.jpg',
                    'type' => 'image/jpeg',
                ],
                true,
            ],
            [
                ['type' => self::DATATYPE],
                [
                    'tmp_name' => static::getResourcesDir() . '/favicon.svg',
                    'name' => 'favicon.svg',
                    'type' => 'application/svg+xml',
                ],
                true,
            ],
            [
                ['type' => self::DATATYPE],
                [
                    'tmp_name' => __FILE__,
                    'name' => basename(__FILE__),
                    'type' => 'text/php',
                ],
                DatatypeImageTypeMismatchException::class,
            ],
            [
                ['type' => self::DATATYPE, 'pattern' => '2022'],
                [
                    'tmp_name' => static::getResourcesDir() . '/nophoto.jpg',
                    'name' => 'nophoto.jpg',
                    'type' => 'image/jpeg',
                ],
                DatatypePatternMismatchException::class,
            ],
        ];
        return $result;
    }


    /**
     * Проверка метода validate()
     * @param mixed $value Проверяемое значение
     * @param mixed $expected Ожидаемое значение
     */
    #[DataProvider('validateDataProvider')]
    public function testValidate(array $fieldData, $value, $expected)
    {
        $this->checkValidate($fieldData, $value, $expected);
    }


    /**
     * Проверяет стратегию на медиа-поле
     */
    public function testIsMedia()
    {
        $strategy = DatatypeStrategy::spawn(self::DATATYPE);

        $result = $strategy->isMedia();

        $this->assertTrue($result);
    }
}
