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
        return trim((string)($value ?: ''));
    }
}
