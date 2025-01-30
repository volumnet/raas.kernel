<?php
/**
 * @package RAAS
 */
declare(strict_types=1);

namespace RAAS;

/**
 * Стратегия типа данных "дата и время"
 */
class DateTimeDatatypeStrategy extends DatatypeStrategy
{
    protected static $instance;

    public function isFilled($value): bool
    {
        if (!DatatypeStrategy::isFilled($value)) {
            return false;
        }
        // Состоит из нулей и нет никаких других цифр
        if (preg_match('/^[0\\-: TW]+$/umis', $value) && !preg_match('/[1-9]/umis', $value)) {
            return false;
        }
        return true;
    }


    public function validate($value, ?Field $field = null): bool
    {
        if (!is_scalar($value) || (trim($value) === '')) {
            return true;
        }
        DatatypeStrategy::validate($value, $field);
        $t = @strtotime((string)$value);
        if ($t === false) {
            throw new DatatypeInvalidValueException();
        }
        return true;
    }


    public static function checkDateTime(string $dateTime): bool
    {
        if (!preg_match('/^(.*?)( |T)(.*?)$/i', $dateTime, $regs)) {
            return false;
        }
        if (!static::checkDate($regs[1])) {
            return false;
        }
        if (!static::checkTime($regs[3])) {
            return false;
        }
        return true;
    }


    /**
     * Проверяет на корректность дату
     * @param string $date Дата в формате ГГГГ-ММ-ДД
     * @return bool
     */
    public static function checkDate(string $date): bool
    {
        if (!preg_match('/^(\\d{4})-(\\d{2})-(\\d{2})$/mi', $date, $regs)) {
            return false;
        }
        if (!checkdate((int)$regs[2], (int)$regs[3], (int)$regs[1])) {
            return false;
        }
        return true;
    }


    /**
     * Проверяет на корректность время
     * @param string $time Время в формате ЧЧ:ММ:(СС(.МММ)?)?
     * @return bool
     */
    public static function checkTime(string $time): bool
    {
        if (!preg_match('/^(\\d{2}):(\\d{2})(:(\\d{2})(\\.\\d+)?)?$/mi', $time, $regs)) {
            return false;
        }
        if ((int)$regs[1] > 23) {
            return false;
        }
        if ((int)$regs[2] > 59) {
            return false;
        }
        if (isset($regs[4]) && ((int)$regs[4] > 59)) {
            return false;
        }
        return true;
    }


    /**
     * Проверяет на корректность дату
     * @param string $date Дата в формате ГГГГ-ММ-ДД
     * @return bool
     */
    public static function checkWeek(string $week): bool
    {
        if (!preg_match('/^(\\d{4})-W(\\d{2})$/mi', $week, $regs)) {
            return false;
        }
        if (((int)$regs[2] <= 0) || ((int)$regs[2] > 53)) {
            return false;
        }
        return true;
    }


    public function export($value): string
    {
        $t = @strtotime((string)$value);
        if (!$this->isFilled($value) || ($t === false)) {
            return '0000-00-00 00:00:00';
        }
        return date('Y-m-d H:i:s', $t);
    }


    public function import($value): string
    {
        $t = @strtotime((string)$value);
        if (!$this->isFilled($value) || ($t === false)) {
            return '';
        }
        return date('Y-m-d H:i', $t);
    }
}
