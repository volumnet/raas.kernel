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


    /**
     * Рендерит строку
     * @param int $num Номер ячейки
     * @return string
     */
    public function render(int $num = 0): string
    {
        $template = $this->template ?? null;
        if (is_callable($template)) {
            $result = $template($this);
        } else {
            if ($template) {
                include Application::i()->view->context->tmp($template);
            } else {
                include Application::i()->view->tmp('/row.inc.php'); // Т.к. в шаблоне ничего не содержится кроме $_RAASTable_Row, его не подключаем
            }
            ob_start();
            $_RAASTable_Row($this, $num);
            $result = ob_get_clean();
        }
        return $result;
    }
}
