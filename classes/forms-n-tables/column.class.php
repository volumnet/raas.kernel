<?php
/**
 * @package RAAS
 */       
namespace RAAS;

/**
 * Колонка таблицы
 * @property-read Table $Table Рабочая таблица
 * @property Table $Parent Рабочая таблица
 * @property int $sortable Сортируемое поле
 * @property bool $defaultOrderDesc По умолчанию упорядочивать по убыванию
 */       
class Column extends TableElement
{
    /**
     * Сортировка по возрастанию
     */
    const SORT_ASC = 1;

    /**
     * Сортировка по убыванию
     */
    const SORT_DESC = -1;

    /**
     * Сортируемое только в одну сторону
     */
    const SORTABLE_NON_REVERSABLE = 1;

    /**
     * Сортируемое в обе стороны
     */
    const SORTABLE_REVERSABLE = 2;

    /**
     * Родительский элемент
     * @var Table
     */
    protected $Parent;

    /**
     * Сортируемое поле
     * @var int
     */
    protected $sortable = 0;

    /**
     * Переменная для сортировки
     * @var string
     */
    protected $defaultOrderDesc = false;

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
            case 'defaultOrderDesc':
                $this->$var = (bool)$val;
                break;
            case 'sortable':
                if (in_array($val, array(self::SORTABLE_NON_REVERSABLE, self::SORTABLE_REVERSABLE))) {
                    $this->$var = (int)$val;
                }
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
