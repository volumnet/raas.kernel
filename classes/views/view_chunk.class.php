<?php
/**
 * Файл фрагментированного web-представления ядра RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2012, Volume Networks
 */
namespace RAAS;

/**
 * Класс фрагментированного web-представления ядра RAAS
 * @package RAAS
 */
final class View_Chunk extends View_Web
{
    /**
     * Экземпляр класса
     * @var \RAAS\View_Chunk
     */
    protected static $instance;

    /**
     * Выводит данные конечному пользователю
     */
    public function render()
    {
        $this->combineViews();
        extract($this->prepareVars(), EXTR_SKIP);

        if ($this->application->debug &&
            (
                $this->application->exceptions ||
                $this->application->sqlExceptions
            )) {
            foreach (array_merge(
                (array)$this->application->exceptions,
                (array)$this->application->sqlExceptions
            ) as $e) {
                array_unshift($localError, $this->debugShowException($e));
            }
        }
        header ('Cache-Control: no-cache, must-revalidate');
        header ('Pragma: no-cache');
        header('Content-Type: text/html; charset=UTF-8');
        ob_clean();
        include $this->tmp($this->template);
        $content = ob_get_contents();
        ob_end_clean();
        echo $this->processXSLT($content);
    }
}
