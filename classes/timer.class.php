<?php
/**
 * Файл класса таймера
 * @package RAAS
 * @version 4.3
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */
namespace RAAS;

use SOME\Singleton;

/**
 * Класс таймера
 */
class Timer extends Singleton
{
    /**
     * Экземпляр фильтра
     * @var self
     */
    protected static $instance;

    /**
     * Таймеры
     * @var array<string[] ID# таймера => array(
     *          'time' => float Общее время,
     *          'intervals' => array<
     *              array(
     *                  'startTime' => float UNIX-timestamp (с миллисекундами) начала интервала,
     *                  'endTime' => float UNIX-timestamp (с миллисекундами) окончания интервала,
     *                  'time' => float Время интервала (с миллисекундами),
     *              )
     *          > Статистика по интервалам
     *      )>
     */
    protected $timers = array();

    /**
     * Запустить таймер
     * @param string|null $id Идентификатор таймера (null, если автоматически)
     * @return string Идентификатор таймера
     */
    public function start($id = null)
    {
        if (!$id) {
            $id = uniqid('');
        }
        if (!isset($this->timers[$id])) {
            $this->reset($id);
        }
        $timer = $this->timers[$id]['intervals'];
        if ($timer) {
            $lastInterval = $timer[count($timer) - 1];
            if (!isset($lastInterval['endTime']) || !$lastInterval['endTime']) {
                return;
            }
        }
        $this->timers[$id]['intervals'][] = array('startTime' => microtime(true));
    }


    /**
     * Остановить таймер
     * @param string $id Идентификатор таймера
     * @return float Время последнего круга таймера
     */
    public function stop($id)
    {
        if (isset($this->timers[$id])) {
            $timer =& $this->timers[$id]['intervals'];
            if ($timer) {
                $lastInterval =& $timer[count($timer) - 1];
                if (!isset($lastInterval['endTime']) || !$lastInterval['endTime']) {
                    $lastInterval['endTime'] = microtime(true);
                    $lastInterval['time'] = $lastInterval['endTime'] - $lastInterval['startTime'];
                    $this->timers[$id]['time'] += $lastInterval['time'];
                    return $lastInterval['time'];
                }
            }
        }
        return 0;
    }


    /**
     * Сбросить таймер
     * @param string $id Идентификатор таймера
     */
    public function reset($id)
    {
        $this->timers[$id] = array('intervals' => array(), 'time' => 0);
    }


    /**
     * Возвращает статистику по таймеру
     * @param string $id Идентификатор интервала (null, если для всех)
     * @return array(
     *             'time' => float Общее время,
     *             'intervals' => array<
     *                 array(
     *                     'startTime' => float UNIX-timestamp (с миллисекундами) начала интервала,
     *                     'endTime' => float UNIX-timestamp (с миллисекундами) окончания интервала,
     *                     'time' => float Время интервала (с миллисекундами),
     *                 )
     *             > Статистика по интервалам
     *         )|
     *         array<string[] ID# таймера => array(
     *             'time' => float Общее время,
     *             'intervals' => array<
     *                 array(
     *                     'startTime' => float UNIX-timestamp (с миллисекундами) начала интервала,
     *                     'endTime' => float UNIX-timestamp (с миллисекундами) окончания интервала,
     *                     'time' => float Время интервала (с миллисекундами),
     *                 )
     *             > Статистика по интервалам
     *         )>|null
     */
    public function stat($id = null)
    {
        if (!$id) {
            return $this->timers;
        }
        if (isset($this->timers[$id])) {
            return $this->timers[$id];
        }
    }


    /**
     * Получает общее время по таймеру
     * @param string $id Идентификатор интервала (null, если для всех)
     * @return float|array<string[] ID# таймера => float>|null
     */
    public function time($id = null)
    {
        if (!$id) {
            $timers = array_map(function ($x) {
                return $x['time'];
            }, $this->timers);
            return $timers;
        }
        if (isset($this->timers[$id])) {
            return $this->timers[$id]['time'];
        }
    }
}
