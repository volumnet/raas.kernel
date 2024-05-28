<?php
/**
 * Стратегия типа данных "Пароль"
 */
declare(strict_types=1);

namespace RAAS;

class PasswordDatatypeStrategy extends TextDatatypeStrategy
{
    protected static $instance;
}
