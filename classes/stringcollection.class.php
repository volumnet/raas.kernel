<?php
/**
 * Файл класса коллекции строк
 */
declare(strict_types=1);

namespace RAAS;

use ArrayObject;

/**
 * Класс коллекции строк
 * @package RAAS
 */
class StringCollection extends ArrayObject
{
    #[\ReturnTypeWillChange]
    public function append($value)
    {
        parent::append((string)$value);
    }


    #[\ReturnTypeWillChange]
    public function offsetSet($index, $newval)
    {
        parent::offsetSet($index, (string)$newval);
    }
}
