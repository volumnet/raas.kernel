<?php
/**
 * Исключение некорректного значения типа данных
 */
declare(strict_types=1);

namespace RAAS;

use InvalidArgumentException;

/**
 * Класс исключения некорректного значения типа данных
 */
class DatatypeInvalidValueException extends InvalidArgumentException
{
}
