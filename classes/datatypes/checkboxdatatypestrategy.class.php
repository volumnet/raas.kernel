<?php
/**
 * Стратегия типа данных "Флажок"
 */
declare(strict_types=1);

namespace RAAS;

class CheckboxDatatypeStrategy extends DatatypeStrategy
{
    protected static $instance;

    public function export($value): string
    {
        return trim((string)($value ?: ''));
    }
}
