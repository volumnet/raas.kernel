<?php
/**
 * @package RAAS
 */
declare(strict_types=1);

namespace RAAS;

/**
 * Стратегия типа данных "время"
 */
class TimeDatatypeStrategy extends DateTimeDatatypeStrategy
{
    protected static $instance;

    public function export($value): string
    {
        $t = @strtotime((string)$value);
        if (!$this->isFilled($value) || ($t === false)) {
            return '00:00:00';
        }
        return date('H:i:s', $t);
    }


    public function import($value): string
    {
        $t = @strtotime((string)$value);
        if (!$this->isFilled($value) || ($t === false)) {
            return '';
        }
        return date('H:i', $t);
    }
}
