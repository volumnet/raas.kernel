<?php
/**
 * Файл Cron-контроллера ядра RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2015, Volume Networks
 */       
namespace RAAS;

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
    protected $st;

    /**
     * Кодировка по умолчанию
     * @var string
     */         
    protected $encoding = 'UTF-8';
    
    protected static $instance;
    
    protected function init()
    {
        $nav = $GLOBALS['argv'];
        $this->nav = $nav;
    }
    

    public function run()
    {
        ini_set('max_execution_time', static::max_time);
        $this->st = time();
        if ($this->checkCompatibility()) {
            if ($this->checkDB()) {
                if ($this->checkSOME()) {
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
        return ($this->application->phpVersionCompatible && !$this->application->missedExt);
    }
    

    protected function checkDB()
    {
        return ($this->application->DSN && $this->application->initDB());
    }
    

    protected function checkSOME()
    {
        return $this->application->initSOME();
    }
    

    protected function configureDB()
    {}
    

    protected function fork()
    {}


    /**
     * Выдача лога в stdOut
     * @param string $text Текст для вывода
     */         
    protected function doLog($text)
    {
        if ($this->encoding) {
            $text = iconv('UTF-8', $this->encoding . '//IGNORE', $text);
        }
        echo number_format(microtime(true) - $this->st, 3, '.', ' ') . ': ' . $text . "\n";
    }
}