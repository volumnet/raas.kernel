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
            'where' => "vis",
            'orderBy' => 'priority'
        ]);
        foreach ($tasks as $task) {
            $task->process($this->controller, $timestamp);
        }
    }
}
