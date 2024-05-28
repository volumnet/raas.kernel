<?php
/**
 * Исключение выхода числового значения за границы допустимых значений
 */
declare(strict_types=1);

namespace RAAS;

/**
 * Класс исключения выхода числового значения за границы допустимых значений
 */
class DatatypeOutOfRangeException extends DatatypeInvalidValueException
{
}
