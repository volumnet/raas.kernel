<?php
/**
 * @package RAAS
 */
declare(strict_types=1);

namespace RAAS;

/**
 * Стратегия типа данных "число"
 */
class NumberDatatypeStrategy extends DatatypeStrategy
{
    protected static $instance;

    public function isFilled($value, bool $debug = false): bool
    {
        if (!DatatypeStrategy::isFilled($value)) {
            return false;
        }
        return (bool)(float)str_replace(',', '.', (string)($value ?: ''));
    }



    public function validate($value, ?Field $field = null): bool
    {
        if (!is_scalar($value) || (trim((string)$value) === '')) {
            return true;
        }
        DatatypeStrategy::validate($value, $field);
        $value = str_replace(',', '.', (string)$value ?: '');
        if (!is_numeric($value)) {
            throw new DatatypeInvalidValueException();
        } else {
            $value = (float)$value;
            if ($field) {
                if ($field->min && ($value < $field->min)) {
                    throw new DatatypeOutOfRangeException();
                } elseif ($field->max && ($value > $field->max)) {
                    throw new DatatypeOutOfRangeException();
                }
            }
        }
        return true;
    }


    public function export($value): float
    {
        return (float)(str_replace(',', '.', (string)$value ?: ''));
    }


    public function import($value): float
    {
        return (float)(str_replace(',', '.', (string)$value ?: ''));
    }
}
