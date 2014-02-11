<?php
/**
 * Файл класса коллекции строк
 * @package RAAS
 * @version 4.2
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2013, Volume Networks
 */       
namespace RAAS;

/**
 * Класс коллекции строк
 * @package RAAS
 */       
class StringCollection extends \ArrayObject
{
    public function append($value)
    {
        parent::append((string)$value);
    }

    public function offsetSet($index, $newval) 
    {
        parent::offsetSet($index, (string)$newval);
    }
}