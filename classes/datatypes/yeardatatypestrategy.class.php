<?php
/**
 * Стратегия типа данных "Год"
 */
namespace RAAS;

class YearDatatypeStrategy extends DateTimeDatatypeStrategy
{
    protected static $instance;

    public function export($value): string
    {
        $t = @strtotime($value);
        if (!$this->isFilled($value) || ($t === false)) {
            return '0000';
        }
        if (is_numeric($value)) {
            return str_pad((int)$value, 4, '0', STR_PAD_LEFT);
        }
        return date('Y', $t);
    }


    public function import($value): string
    {
        $t = @strtotime($value);
        $newValue = str_pad((int)$value, 4, '0', STR_PAD_LEFT);
        if (!$this->isFilled($value) || ($t === false)) {
            return '';
        }
        if (is_numeric($value)) {
            return str_pad((int)$value, 4, '0', STR_PAD_LEFT);
        }
        return date('Y', $t);
    }
}
