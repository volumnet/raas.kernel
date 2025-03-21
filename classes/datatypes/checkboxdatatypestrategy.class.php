<?php
/**
 * @package RAAS
 */
declare(strict_types=1);

namespace RAAS;

/**
 * Стратегия типа данных "флажок"
 */
class CheckboxDatatypeStrategy extends DatatypeStrategy
{
    protected static $instance;

    public function export($value): string
    {
        // 2025-03-19, AVS: заменил (string)$value ?: '' на (string)$value, т.к. ноль не проходит (#1275)
        return trim((string)$value);
    }
}
