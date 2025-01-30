<?php
/**
 * @package RAAS
 */       
namespace RAAS;

/**
 * Элемент таблицы
 * @property callable $callback Функция для обработки входных данных
 */       
abstract class TableElement extends HTMLElement
{
    /**
     * Функция для обработки входных данных
     * @var callable
     */
    protected $callback;

    public function __set($var, $val)
    {
        switch ($var){
            case 'callback':
                if (is_callable($val)) {
                    $this->$var = $val;
                }
                break;
            default:
                parent::__set($var, $val);
                break;
        }

    }
}
