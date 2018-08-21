<?php
/**
 * Файл класса интервала таймера
 * @package RAAS
 * @version 4.3
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2018, Volume Networks
 */
namespace RAAS;

use SOME\Singleton;

/**
 * Класс интервала таймера
 * @property-read float $time Время интервала (с миллисекундами)
 * @property-read bool $active Интервал запущен, но не остановлен
 * @property-read float $startTime UNIX-timestamp (с миллисекундами) начала интервала
 * @property-read float $endTime UNIX-timestamp (с миллисекундами) окончания интервала
 */
class TimerInterval
{
    /**
     * UNIX-timestamp (с миллисекундами) начала интервала
     * @var float
     */
    protected $startTime = 0;

    /**
     * UNIX-timestamp (с миллисекундами) окончания интервала
     * @var float|null
     */
    protected $endTime = null;

    public function __get($var)
    {
        switch ($var) {
            case 'startTime':
            case 'endTime':
                return $this->$var;
                break;
            case 'active':
                return !$this->endTime;
                break;
            case 'time':
                $startTime = $this->startTime;
                $endTime = $this->endTime ?: microtime(true);
                return $endTime - $startTime;
                break;
        }
    }


    /**
     * Конструктор класса
     */
    public function __construct()
    {
        $this->startTime = microtime(true);
    }


    /**
     * Остановить таймер
     */
    public function stop($id)
    {
        if (!$this->endTime) {
            $this->endTime = microtime(true);
        }
    }
}
