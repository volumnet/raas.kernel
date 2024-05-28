<?php
/**
 * Стратегия типа данных "Адрес сайта"
 */
declare(strict_types=1);

namespace RAAS;

class UrlDatatypeStrategy extends TextDatatypeStrategy
{
    protected static $instance;

    public function validate($value, Field $field = null): bool
    {
        if (!is_scalar($value) || (trim($value) === '')) {
            return true;
        }
        DatatypeStrategy::validate($value, $field);
        if (!(bool)filter_var($value, FILTER_VALIDATE_URL)) {
            throw new DatatypeInvalidValueException();
        }
        return true;
    }
}
