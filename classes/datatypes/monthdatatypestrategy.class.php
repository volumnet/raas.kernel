<?php
/**
 * Стратегия типа данных "Месяц"
 */
namespace RAAS;

class MonthDatatypeStrategy extends DateTimeDatatypeStrategy
{
    protected static $instance;

    public function export($value): string
    {
        $t = @strtotime($value);
        if (!$this->isFilled($value) || ($t === false)) {
            return '0000-00-00';
        }
        return date('Y-m-d', $t);
    }


    public function import($value): string
    {
        $t = @strtotime($value);
        if (!$this->isFilled($value) || ($t === false)) {
            return '';
        }
        return date('Y-m', $t);
    }
}
