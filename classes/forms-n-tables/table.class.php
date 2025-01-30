<?php
/**
 * @package RAAS
 */
namespace RAAS;

use ArrayObject;
use SOME\Pages;

/**
 * Таблица
 * @property-read Table $Table Возвращает текущую таблицу
 * @property array $Set Массив данных для отображения
 * @property Pages $Pages Объект постраничной разбивки
 * @property string $sortVar Переменная для сортировки
 * @property string $orderVar Переменная для типа упорядочения (по возрастанию/по убыванию)
 * @property string $pagesVar Переменная страниц
 * @property string $sort Колонка для сортировки
 * @property string $order Направление сортировки
 * @property string $emptyString Текст, выводимый при отсутствии строк
 * @property bool $header Отображать заголовок
 * @property bool $emptyHeader Отображать заголовок при отсутствии строк
 * @property ColumnCollection $columns Массив колонок
 * @property-read [Rows[]] $rows Строки таблицы
 */
class Table extends TableElement
{
    /**
     * Массмв данных для отображения
     * @var array
     */
    protected $Set;

    /**
     * Объект постраничной разбивки
     * @var Pages
     */
    protected $Pages;

    /**
     * Переменная для сортировки
     * @var string
     */
    protected $sortVar = 'sort';

    /**
     * Переменная для типа упорядочения (по возрастанию/по убыванию)
     * @var string
     */
    protected $orderVar = 'order';

    /**
     * Переменная страниц
     * @var string
     */
    protected $pagesVar = 'page';

    /**
     * Переменная сортировки
     * @var string
     */
    protected $sort = null;

    /**
     * Переменная упорядочения (по возрастанию/по убыванию)
     * @var string
     */
    protected $order = null;

    /**
     * Текст, выводимый при отсутствии строк
     * @var string
     */
    protected $emptyString = '';

    /**
     * Отображать заголовок
     * @var bool
     */
    protected $header = true;

    /**
     * Отображать заголовок при отсутствии строк
     * @var bool
     */
    protected $emptyHeader = false;

    /**
     * Массив колонок
     * @var ColumnCollection
     */
    protected $columns;

    /**
     * Шаблон для отображения элемента в формате шаблонов RAAS
     * @var string
     */
    protected $template = '/table';

    public function __get($var)
    {
        switch ($var) {
            case 'Table':
                return $this;
                break;
            case 'Set':
                return $this->Set;
                break;
            case 'rows':
                $Set = [];
                if ($this->Set) {
                    for ($i = 0; $i < count((array)$this->Set); $i++) {
                        $row = $this->Set[$i];
                        $R = new Row();
                        $R->source = $row;
                        $R->Parent = $this;
                        if ($f = $this->callback) {
                            call_user_func($f, $R, $i);
                        }
                        $Set[] = $R;
                    }
                }
                return $Set;
                break;
            default:
                return parent::__get($var);
                break;
        }
    }

    public function __set($var, $val)
    {
        switch ($var) {
            case 'sort':
                if (isset($this->columns[(string)$val]) && $this->columns[(string)$val]->sortable) {
                    $this->$var = (string)$val;
                }
                break;
            case 'order':
                if (in_array((int)$val, [Column::SORT_ASC, Column::SORT_DESC])) {
                    $this->$var = (int)$val;
                }
                break;
            case 'Set':
                if ($val instanceof ArrayObject) {
                    $this->$var = (array)$val;
                } elseif (is_array($val)) {
                    $this->$var = new ArrayObject($val);
                }
                break;
            case 'Pages':
                if ($val instanceof Pages) {
                    $this->$var = $val;
                }
                break;
            case 'sortVar':
            case 'orderVar':
            case 'pagesVar':
            case 'emptyString':
                $this->$var = (string)$val;
                break;
            case 'emptyHeader':
            case 'header':
                $this->$var = (bool)$val;
                break;
            case 'columns':
                $this->$var->Parent = $this;
                if ($val instanceof ColumnCollection) {
                    $this->$var = $val;
                } elseif (($val instanceof ArrayObject) || is_array($val)) {
                    foreach ((array)$val as $key => $row) {
                        if (!($row instanceof Column)) {
                            $row = new Column($row);
                        }
                        $row->Parent = $this;
                        $this->columns[$key] = $row;
                    }
                }
                break;
            default:
                parent::__set($var, $val);
                break;
        }
    }

    /**
     * Конструктор класса
     * @param array $params массив дополнительных свойств, доступных для установки
     */
    public function __construct(array $params = [])
    {
        $this->columns = new ColumnCollection();
        $this->columns->Parent = $this;
        $this->Set = new ArrayObject();
        parent::__construct($params);
    }
}
