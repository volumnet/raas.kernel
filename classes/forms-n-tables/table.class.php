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
 * @property-read bool $hasAllContextMenu Есть ли общее контекстное меню
 * @property-read bool $isMultitable Является ли мульти-таблицей (множественный выбор строк)
 * @property-read int? $priorityColumnIndex Индекс колонки порядка отображения
 * @property-read array $displayData Данные для отображения
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

    /**
     * Кэш отображаемых данных
     */
    protected $displayDataCache = null;

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
            case 'hasAllContextMenu':
                return (bool)($this->meta['allContextMenu'] ?? false);
                break;
            case 'isMultitable':
                return (($this->{'data-role'} ?? '') == 'multitable') || $this->hasAllContextMenu;
                break;
            case 'priorityColumnIndex':
                $result = null;
                if ($this->meta['priorityColumn'] ?? null) {
                    $i = array_search($this->meta['priorityColumn'], array_keys((array)$this->columns));
                    if ($i !== false) {
                        $result = $i + (int)$this->isMultitable; // + (int)$this->isMultitable - Увеличиваем на колонку чекбоксов
                    }
                }
                return $result;
                break;
            case 'displayData':
                if (!$this->displayDataCache) {
                    $st = microtime(true);
                    $result = [];
                    $rows = $this->rows;
                    $columns = $this->columns;
                    for ($i = 0; $i < count($rows); $i++) {
                        $row = $rows[$i];
                        foreach ($columns as $key => $col) {
                            $var = null;
                            if ($f = $col->callback) {
                                $var = (string)$f($row->source, $i);
                            } elseif (is_object($row->source)) {
                                $var = $row->source->$key ?? null;
                            } elseif (is_array($row->source)) {
                                $var = $row->source[$key] ?? null;
                            }
                            $result[$i][$key] = (string)$var;
                        }
                    }
                    $this->displayDataCache = $result;
                }
                return $this->displayDataCache;
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


    /**
     * Рендерит таблицу
     * @param bool $insideForm Уже находится внутри формы
     * @param string $pagesHash Хэш-тег для постраничной разбивки
     * @return string
     */
    public function render(bool $insideForm = false, string $pagesHash = ''): string
    {
        $Table = $this;
        $template = $this->template ?? null;
        if (is_callable($template)) {
            $result = $template($this);
        } else {
            ob_start();
            include Application::i()->view->context->tmp($template);
            $result = ob_get_clean();
        }
        return $result;
    }


    /**
     * Рендерит строку заголовка таблицы
     * @return string
     */
    public function renderHeaderRow(): string
    {
        include Application::i()->view->tmp('/table.inc.php');
        ob_start();
        $_RAASTable_HeaderRow($this);
        $result = ob_get_clean();
        return $result;
    }


    /**
     * Рендерит заголовок таблицы
     * @return string
     */
    public function renderHeader(): string
    {
        include Application::i()->view->tmp('/table.inc.php');
        ob_start();
        $_RAASTable_Header($this);
        $result = ob_get_clean();
        return $result;
    }


    /**
     * Рендерит заголовок таблицы
     * @return string
     */
    public function renderBody(): string
    {
        include Application::i()->view->tmp('/table.inc.php');
        ob_start();
        $_RAASTable_Body($this);
        $result = ob_get_clean();
        return $result;
    }


    /**
     * Рендерит строку подвала таблицы
     * @return string
     */
    public function renderFooterRow(): string
    {
        include Application::i()->view->tmp('/table.inc.php');
        ob_start();
        $_RAASTable_FooterRow($this);
        $result = ob_get_clean();
        return $result;
    }


    /**
     * Рендерит подвал таблицы
     * @return string
     */
    public function renderFooter(): string
    {
        include Application::i()->view->tmp('/table.inc.php');
        ob_start();
        $_RAASTable_Footer($this);
        $result = ob_get_clean();
        return $result;
    }


    /**
     * Рендерит собственно таблицу
     * @return string
     */
    public function renderTable(): string
    {
        include Application::i()->view->tmp('/table.inc.php');
        ob_start();
        $_RAASTable_Table($this);
        $result = ob_get_clean();
        return $result;
    }


    /**
     * Рендерит таблицу с окружающей формой (если нужна)
     * @param bool $insideForm Уже находится внутри формы
     * @return string
     */
    public function renderTableForm(bool $insideForm = false): string
    {
        include Application::i()->view->tmp('/table.inc.php');
        ob_start();
        $_RAASTable_TableForm($this, $insideForm);
        $result = ob_get_clean();
        return $result;
    }


    /**
     * Рендерит таблицу полностью
     * @param bool $insideForm Уже находится внутри формы
     * @param string $pagesHash Хэш-тег для постраничной разбивки
     * @return string
     */
    public function renderFull(bool $insideForm = false, string $pagesHash = ''): string
    {
        include Application::i()->view->tmp('/table.inc.php');
        ob_start();
        $_RAASTable($this, $insideForm, $pagesHash);
        $result = ob_get_clean();
        return $result;
    }
}
