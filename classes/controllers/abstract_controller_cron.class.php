<?php
/**
 * Файл Cron-контроллера ядра RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2015, Volume Networks
 */
namespace RAAS;

use Exception;

/**
 * Класс Cron-контроллера ядра RAAS
 * @package RAAS
 */
abstract class Abstract_Controller_Cron extends Abstract_Controller
{
    /**
     * Максимальное заявленное время выполнения
     */
    const max_time = 3500;

    /**
     * Время начала работы
     * @var int
     */
    public $st;

    /**
     * Кодировка по умолчанию
     * @var string
     */
    protected $encoding = 'UTF-8';

    protected static $instance;

    public function __get($var)
    {
        switch ($var) {
            case 'nav':
                return $GLOBALS['argv'];
                break;
            default:
                return parent::__get($var);
                break;
        }
    }

    protected function init()
    {
    }


    public function run()
    {
        ini_set('max_execution_time', static::max_time);
        $this->st = time();
        if ($this->checkCompatibility()) {
            if ($this->checkDB()) {
                if ($this->checkSOME()) {
                    Process::checkIn();
                    while (ob_get_level()) {
                        ob_end_clean();
                    }
                    $this->fork();
                }
            }
        }
    }


    protected function checkCompatibility()
    {
        if (!$this->application->phpVersionCompatible) {
            throw new Exception('PHP version incompatible');
        }
        if ($missedExt = $this->application->missedExt) {
            throw new Exception('Missed extensions: ' . implode(', ', $missedExt));
        }
        return true;
    }


    protected function checkDB()
    {
        if (!$this->application->DSN) {
            throw new Exception('Config file corrupted: no DSN is present');
        }
        if (!$this->application->initDB()) {
            throw new Exception('Cannot connect to database');
        }
        return true;
    }


    protected function checkSOME()
    {
        if (!$this->application->initSOME()) {
            throw new Exception('SOME file corrupted');
        }
        return true;
    }


    protected function configureDB()
    {
    }


    protected function fork()
    {
        $this->action = isset($GLOBALS['argv'][1]) ? $GLOBALS['argv'][1] : '';
        $f = [$this, $this->action];
        if (is_callable($f)) {
            $args = array_slice($GLOBALS['argv'], 2);
            call_user_func_array($f, $args);
        } elseif (class_exists($this->action)) {
            $commandClassname = $this->action;
            $command = @new $commandClassname($this);
            if ($command instanceof Command) {
                call_user_func_array(
                    [$command, 'process'],
                    array_slice($GLOBALS['argv'], 2)
                );
            } else {
                $this->doLog('"' . $commandClassname . '" is not a command');
            }
        } else {
            $this->doLog('"' . $this->action . '" is not found');
        }
    }


    /**
     * Выдача лога в stdOut
     * @param string $text Текст для вывода
     */
    public function doLog($text)
    {
        if ($this->encoding) {
            $text = iconv('UTF-8', $this->encoding . '//IGNORE', $text);
        }
        echo number_format(microtime(true) - $this->st, 3, '.', ' ') .
             ' [' . memory_get_peak_usage() . ']: ' . $text . "\n";
    }


    /**
     * Запуск команды планировщика
     */
    public function master()
    {
        $taskId = (int)($GLOBALS['argv'][2] ?? null);
        $command = new CronCommand($this);
        $command->process($taskId);
    }
}
