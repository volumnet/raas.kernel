<?php
/**
 * Абстрактный класс проверки класса DatatypeStrategy
 */
namespace RAAS;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\TestWith;
use SOME\BaseTest;

/**
 * Абстрактный класс проверки класса DatatypeStrategy
 */
#[CoversClass(DatatypeStrategy::class)]
abstract class AbstractDatatypeStrategyTest extends BaseTest
{
    /**
     * Тип данных
     */
    const DATATYPE = 'text';

    /**
     * Проверка метода isFilled()
     *
     * Начинается с check, чтобы не распознавалось как тест
     * @param mixed $value Проверяемое значение
     * @param bool $expected Ожидаемое значение
     */
    public function checkIsFilled($value, bool $expected)
    {
        $strategy = DatatypeStrategy::spawn(static::DATATYPE);
        $result = $strategy->isFilled($value);
        $this->assertEquals($expected, $result);
    }


    /**
     * Проверка метода validate()
     *
     * Начинается с check, чтобы не распознавалось как тест
     * @param mixed $value Проверяемое значение
     * @param mixed $expected Ожидаемое значение
     */
    public function checkValidate(array $fieldData, $value, $expected)
    {
        $field = new Field($fieldData);
        if ($expected !== true) {
            $this->expectException($expected);
        }

        $result = $field->datatypeStrategy->validate($value, $field);

        if ($expected == true) {
            $this->assertEquals($expected, $result);
        }
    }


    /**
     * Проверка метода export()
     *
     * Начинается с check, чтобы не распознавалось как тест
     * @param mixed $value Проверяемое значение
     * @param mixed $expected Ожидаемое значение
     */
    public function checkExport($value, $expected)
    {
        $strategy = DatatypeStrategy::spawn(static::DATATYPE);
        $result = $strategy->export($value);
        $this->assertEquals($expected, $result);
    }


    /**
     * Проверка метода import()
     *
     * Начинается с check, чтобы не распознавалось как тест
     * @param mixed $value Проверяемое значение
     * @param mixed $expected Ожидаемое значение
     */
    public function checkImport($value, $expected)
    {
        $strategy = DatatypeStrategy::spawn(static::DATATYPE);
        $result = $strategy->import($value);
        $this->assertEquals($expected, $result);
    }
}
