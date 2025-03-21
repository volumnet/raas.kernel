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


    public function getAttrs(array $additional = []): array
    {
        $arr = (array)$this->attrs;
        if ($this instanceof Table) {
            if (!isset($arr['class'])) {
                $arr['class'] = '';
            }
            $arr['class'] .= ' table table-striped';
        }
        foreach ((array)$additional as $key => $val) {
            if ($val === false) {
                unset($arr[$key]);
            } else {
                if (in_array($key, ['class', 'data-role'])) {
                    $arr[$key] .= ' ' . $val;
                } else {
                    $arr[$key] = $val;
                }
            }
        }
        foreach ($arr as $key => $val) {
            $arr[$key] = trim($val);
        }
        return $arr;
    }
}
