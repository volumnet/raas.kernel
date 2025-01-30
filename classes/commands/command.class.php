<?php
/**
 * @package RAAS
 */
namespace RAAS;

/**
 * Команда
 */
abstract class Command
{
    /**
     * Время актуальности блокировки по умолчанию, сек.
     */
    const LOCK_EXPIRATION_TIME = 7200;

    /**
     * Контроллер, вызвавший команду
     * @var Abstract_Controller_Cron|null
     */
    protected $controller = null;


    /**
     * Конструктор класса
     * @param ?Abstract_Controller_Cron $controller Контроллер, вызвавший команду
     */
    public function __construct(?Abstract_Controller_Cron $controller = null)
    {
        $this->controller = $controller;
    }


    /**
     * Выполнение команды
     */
    abstract public function process();


    /**
     * Проверяет, актуальна ли блокировка, и при положительном результате выводит ошибку
     * @return bool Блокировано ли выполнение
     */
    public function checkLock()
    {
        if ($this->isLocked()) {
            $this->controller->doLog('Another process is running');
            return true;
        }
        return false;
    }


    /**
     * Получает путь к блокировочному файлу
     * @return string
     */
    public function getLockFilename()
    {
        return 'command.lock.json';
    }


    /**
     * Получает UNIX-timestamp блокировки
     * @return int
     */
    public function getLockTimestamp()
    {
        return is_file($this->getLockFilename()) ? filemtime($this->getLockFilename()) : null;
    }


    /**
     * Получает время актуальности блокировки, сек.
     * @return int
     */
    public function getLockExpirationTime()
    {
        return self::LOCK_EXPIRATION_TIME;
    }


    /**
     * Блокировано ли выполнение команды
     * @return bool
     */
    public function isLocked()
    {
        $lockTimestamp = $this->getLockTimestamp();
        if (!$lockTimestamp) {
            return false;
        }
        if (($lockTimestamp + $this->getLockExpirationTime()) > time()) {
            return true;
        }
        return false;
    }


    /**
     * Устанавливает блокировку
     */
    public function lock()
    {
        $filename = $this->getLockFilename();
        if (!is_file($filename)) {
            $backtrace = debug_backtrace(0, 2);
            foreach ($backtrace as $bt) {
                if ($bt['function'] == 'process') {
                    $backtrace = $bt;
                    break;
                }
            }
            $data = array(
                'datetime' => date('Y-m-d H:i:s'),
                'timestamp' => time(),
                'command' => $backtrace['class'],
                'args' => $backtrace['args']
            );
            file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }
    }


    /**
     * Снимает блокировку
     */
    public function unlock()
    {
        @unlink($this->getLockFilename());
    }
}
