<?php
/**
 * Файл класса команды планировщика
 */
namespace RAAS;

/**
 * Команда планировщика
 */
class CronCommand extends Command
{
    public function process()
    {
        $timestamp = time();
        $tasks = Crontab::getSet([
            'where' => [
                "vis",
                "(NOT start_time OR (start_time < NOW() - INTERVAL 2 HOUR))"
            ],
            'orderBy' => 'priority'
        ]);
        foreach ($tasks as $task) {
            $task->process($this->controller, $timestamp);
        }
    }
}
