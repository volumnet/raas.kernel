<?php
/**
 * Файл класса коллекции колонок
 * @package RAAS
 * @version 4.2
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2013, Volume Networks
 */       
namespace RAAS;

/**
 * Класс коллекции колонок
 * @package RAAS
 * @property-read Table $Table Рабочая таблица
 * @property TableElement $Parent Родительский элемент
 */       
class ColumnCollection extends \ArrayObject
{
    /**
     * Родительский элемент
     * @var TableElement
     */
    protected $Parent;

    public function __get($var)
    {
        switch($var) {
            case 'Table':
                return $this->Parent;
                break;
            default:
                if (isset($this->$var)) {
                    return $this->$var;
                }
                break;
        }
    }

    public function __set($var, $val)
    {
        switch ($var){
            case 'Parent':
                if ($val instanceof Table) {
                    $this->$var = $val;
                }
                break;
        }

    }

    public function append($val)
    {
        if ($val = $this->checkval($val)) {
            parent::append($val);
        }
    }

    public function offsetSet($index, $val) 
    {
        if ($val = $this->checkval($val)) {
            parent::offsetSet($index, $val);
        }
    }

    protected function checkval($val) 
    {
        if (($val instanceof \ArrayObject) || is_array($val)) {
            $val = new Column((array)$val);
        }
        if (($val instanceof Column) || ($val instanceof ColumnContainer)) {
            $val->Parent = $this->Parent;
            return $val;
        } else {
            return null;
        }
    }
}