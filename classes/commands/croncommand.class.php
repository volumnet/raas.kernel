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
            // 2021-03-17, AVS: добавил принудительное сохранение логов
            // при запуске вручную
            $task->save_log = true;
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
            if (count($tasks) > 1) {
                $this->controller->doLog('Task #' . $task->id . ' ' . $task->name . ' started');
            }
            $task->process($this->controller, $timestamp);
        }
    }
}
