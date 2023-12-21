<?php
/**
 * Стратегия типа данных "E-mail"
 */
namespace RAAS;

class EmailDatatypeStrategy extends TextDatatypeStrategy
{
    protected static $instance;

    public function validate($value, Field $field = null): bool
    {
        if (!is_scalar($value) || (trim($value) === '')) {
            return true;
        }
        DatatypeStrategy::validate($value, $field);
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new DatatypeInvalidValueException();
        }
        return true;
    }
}
