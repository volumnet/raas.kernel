<?php
/**
 * Стратегия типа данных "Время"
 */
namespace RAAS;

class TimeDatatypeStrategy extends DateTimeDatatypeStrategy
{
    protected static $instance;

    public function export($value): string
    {
        $t = @strtotime($value);
        if (!$this->isFilled($value) || ($t === false)) {
            return '00:00:00';
        }
        return date('H:i:s', $t);
    }


    public function import($value): string
    {
        $t = @strtotime($value);
        if (!$this->isFilled($value) || ($t === false)) {
            return '';
        }
        return date('H:i', $t);
    }
}
