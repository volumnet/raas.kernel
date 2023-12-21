<?php
/**
 * Стратегия типа данных "Флажок"
 */
namespace RAAS;

class CheckboxDatatypeStrategy extends DatatypeStrategy
{
    protected static $instance;

    public function export($value): string
    {
        return trim($value);
    }
}
