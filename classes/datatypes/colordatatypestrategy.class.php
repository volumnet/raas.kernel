<?php
/**
 * Стратегия типа данных "Цвет"
 */
declare(strict_types=1);

namespace RAAS;

class ColorDatatypeStrategy extends TextDatatypeStrategy
{
    protected static $instance;

    public function validate($value, Field $field = null): bool
    {
        if (!is_scalar($value) || (trim($value) === '')) {
            return true;
        }
        DatatypeStrategy::validate($value, $field);
        if (!preg_match('/^(#[0-9A-F]{3})|(#[0-9A-F]{6})|#[0-9A-F]{8}$/i', $value)) {
            throw new DatatypeInvalidValueException();
        }
        return true;
    }
}
