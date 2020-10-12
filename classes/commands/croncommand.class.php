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
    /**
     * Выполняет пакет команд планировщика
     * @param int|null $taskId Конкретная команда планировщика для выполнения,
     *                         либо все, если null
     */
    public function process($taskId = null)
    {
        $timestamp = time();
        $tasks = [];
        if ($taskId) {
            $task = new Crontab($taskId);
            if ($task->id) {
                $tasks[] = $task;
            }
            $timestamp = true;
        } else {
            $tasks = Crontab::getSet([
                'where' => [
                    "vis",
                    "(NOT start_time OR (start_time < NOW() - INTERVAL 2 HOUR))"
                ],
                'orderBy' => 'priority'
            ]);
        }
        foreach ($tasks as $task) {
            $task->process($this->controller, $timestamp);
        }
    }
}
