<?php
/**
 * Файл класса таймера
 * @package RAAS
 * @version 4.3
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2018, Volume Networks
 */
namespace RAAS;

use SOME\Singleton;

/**
 * Класс таймера
 * @property-read float $time Общее время таймера
 * @property-read TimerInterval|null $active Активный интервал, если таймер запущен, но не остановлен,
 *                                           null если таймер остановлен
 */
class Timer
{
    /**
     * Интервалы
     * @var array<TimerInterval>
     */
    protected $intervals = array();

    /**
     * Таймеры
     * @var array<string[] ID# таймера => Timer>
     */
    protected static $timers = array();

    public function __get($var)
    {
        switch ($var) {
            case 'intervals':
                return $this->$var;
                break;
            case 'time':
                $times = array_map(function ($x) {
                    return $x->time;
                }, $this->intervals);
                $time = array_sum($times);
                return $time;
                break;
            case 'active':
                $actives = array_filter($this->intervals, function ($x) {
                    return $x->active;
                });
                if ($actives) {
                    return array_shift($actives);
                }
                break;
        }
    }

    /**
     * Запустить таймер
     * @param string|null $id Идентификатор таймера (null, если автоматически)
     * @return string Идентификатор таймера
     */
    public function start()
    {
        if (!$this->active) {
            $this->intervals[] = new TimerInterval();
        }
    }


    /**
     * Остановить таймер
     * @param string $id Идентификатор таймера
     */
    public function stop()
    {
        if ($interval = $this->active) {
            $interval->stop();
        }
    }


    /**
     * Сбросить таймер
     */
    public function reset()
    {
        $this->intervals = array();
    }


    /**
     * Добавить таймер
     * @param string $id ID# таймера
     * @param bool $start Сразу стартовать
     * @return Timer Добавленный таймер
     */
    public static function add($id, $start = true)
    {
        static::$timers[$id] = new Timer();
        if ($start) {
            static::$timers[$id]->start();
        }
    }


    /**
     * Удалить таймер
     * @param string $id ID# таймера
     */
    public static function remove($id)
    {
        unset(static::$timers[$id]);
    }


    /**
     * Получить таймер
     * @param string $id ID# таймера
     * @return Timer
     */
    public static function get($id)
    {
        return static::$timers[$id];
    }


    /**
     * Получить статистику по таймерам
     * @return array<string[] ID# таймера => float Время таймера>
     */
    public static function stat()
    {
        $stat = array_map(function ($x) {
            return $x->time;
        }, static::$timers);
        return $stat;
    }
}
