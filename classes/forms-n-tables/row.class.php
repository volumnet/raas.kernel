<?php
/**
 * @package RAAS
 */       
namespace RAAS;

/**
 * Строка таблицы
 * @property-read Table $Table Рабочая таблица
 * @property Table $Parent Рабочая таблица
 * @property mixed $source Исходные значения
 */       
class Row extends TableElement
{
    /**
     * Родительский элемент
     * @var Table
     */
    protected $Parent;

    /**
     * Исходные значения
     * @var mixed
     */
    protected $source;

    public function __get($var)
    {
        switch ($var) {
            case 'Table':
                return $this->Parent;
                break;
            default:
                return parent::__get($var);
                break;
        }
    }

    public function __set($var, $val)
    {
        switch ($var){
            case 'source':
                $this->$var = $val;
                break;
            case 'Parent':
                if ($val instanceof Table) {
                    $this->$var = $val;
                }
                break;
            default:
                parent::__set($var, $val);
                break;
        }
    }
}
