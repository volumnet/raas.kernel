<?php
/**
 * Стратегия типа данных "Неделя"
 */
declare(strict_types=1);

namespace RAAS;

class WeekDatatypeStrategy extends DateTimeDatatypeStrategy
{
    protected static $instance;

    public function export($value): string
    {
        $t = @strtotime((string)$value);
        if (!$this->isFilled($value) || ($t === false)) {
            return '0000-00-00';
        }
        return date('Y-m-d', $t);
    }


    public function import($value): string
    {
        $t = @strtotime((string)$value);
        if (!$this->isFilled($value) || ($t === false)) {
            return '';
        }
        return date('Y-\WW', $t);
    }
}
