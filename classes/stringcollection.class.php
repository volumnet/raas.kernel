<?php
/**
 * @package RAAS
 */
declare(strict_types=1);

namespace RAAS;

use ArrayObject;

/**
 * Коллекция строк
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
