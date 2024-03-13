<?php
/**
 * Тест для класса ImageDatatypeStrategy
 */
namespace RAAS;

/**
 * Тест для класса ImageDatatypeStrategy
 * @covers \RAAS\ImageDatatypeStrategy
 */
class ImageDatatypeStrategyTest extends AbstractDatatypeStrategyTest
{
    public function validateDataProvider(): array
    {
        $result = [
            [
                ['type' => 'image'],
                [
                    'tmp_name' => '',
                    'name' => '',
                    'type' => '',
                ],
                true,
            ],
            [
                ['type' => 'image'],
                [],
                true,
            ],
            [
                ['type' => 'image'],
                '',
                true,
            ],
            [
                ['type' => 'image'],
                [
                    'tmp_name' => $this->getResourcesDir() . '/nophoto.jpg',
                    'name' => 'nophoto.jpg',
                    'type' => 'image/jpeg',
                ],
                true,
            ],
            [
                ['type' => 'image'],
                [
                    'tmp_name' => $this->getResourcesDir() . '/favicon.svg',
                    'name' => 'favicon.svg',
                    'type' => 'application/svg+xml',
                ],
                true,
            ],
            [
                ['type' => 'image'],
                [
                    'tmp_name' => __FILE__,
                    'name' => basename(__FILE__),
                    'type' => 'text/php',
                ],
                DatatypeImageTypeMismatchException::class,
            ],
            [
                ['type' => 'image', 'pattern' => '2022'],
                [
                    'tmp_name' => $this->getResourcesDir() . '/nophoto.jpg',
                    'name' => 'nophoto.jpg',
                    'type' => 'image/jpeg',
                ],
                DatatypePatternMismatchException::class,
            ],
        ];
        return $result;
    }


    /**
     * Проверяет стратегию на медиа-поле
     */
    public function testIsMedia()
    {
        $strategy = DatatypeStrategy::spawn('image');

        $result = $strategy->isMedia();

        $this->assertTrue($result);
    }
}
