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
     * Не сортируемое
     */
    const NOT_SORTABLE = 0;

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
                if (in_array($val, [self::NOT_SORTABLE, self::SORTABLE_NON_REVERSABLE, self::SORTABLE_REVERSABLE])) {
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

    /**
     * Рендерит ячейку
     * @param string $value Значение ячейки
     * @return string
     */
    public function render(string $value = ''): string
    {
        $template = $this->template ?? null;
        if (is_callable($template)) {
            $result = $template($this);
        } else {
            include Application::i()->view->tmp('/column.inc.php');
            if ($template) {
                include Application::i()->view->context->tmp($template);
            }
            ob_start();
            $_RAASTable_Cell($this, $value);
            $result = ob_get_clean();
        }
        return $result;
    }

    /**
     * Рендерит ячейку-заголовок
     * @param string $columnURN URN ячейки
     * @return string
     */
    public function renderHeader(string $columnURN = ''): string
    {
        $template = $this->template ?? null;
        if (is_callable($template)) {
            $result = $template($this);
        } else {
            include Application::i()->view->tmp('/column.inc.php');
            if ($template) {
                include Application::i()->view->context->tmp($template);
            }
            ob_start();
            $_RAASTable_Header($this, $columnURN);
            $result = ob_get_clean();
        }
        return $result;
    }
}
