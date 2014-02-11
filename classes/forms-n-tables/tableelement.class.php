<?php
/**
 * Файл класса элемента таблицы
 * @package RAAS
 * @version 4.2
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2013, Volume Networks
 */       
namespace RAAS;

/**
 * Класс элемента таблицы
 * @package RAAS
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