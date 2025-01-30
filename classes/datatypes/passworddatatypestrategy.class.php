<?php
/**
 * @package RAAS
 */
declare(strict_types=1);

namespace RAAS;

/**
 * Стратегия типа данных "пароль"
 */
class PasswordDatatypeStrategy extends TextDatatypeStrategy
{
    protected static $instance;
}
