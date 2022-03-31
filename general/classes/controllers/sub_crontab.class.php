<?php
/**
 * Файл модуля планировщика
 */
namespace RAAS\General;

use SOME\Pages;
use RAAS\Abstract_Sub_Controller;
use RAAS\Application;
use RAAS\Crontab;
use RAAS\CrontabLog;
use RAAS\Redirector;
use RAAS\StdSub;

/**
 * Класс модуля планировщика
 */
class Sub_Crontab extends Abstract_Sub_Controller
{
    protected static $instance;

    public function __get($var)
    {
        switch ($var) {
            case 'url':
                return '?mode=admin&sub=' . $this->sub;
                break;
            default:
                return parent::__get($var);
                break;
        }
    }


    public function run()
    {
        switch ($this->action) {
            case 'edit':
                $this->edit();
                break;
            case 'chvis':
                $item = new Crontab((int)$this->id);
                StdSub::chvis($item, $this->url);
                break;
            case 'reset':
                $item = new Crontab((int)$this->id);
                StdSub::reset($item, $this->url);
                break;
            case 'run':
                $item = new Crontab((int)$this->id);
                if ($item->id) {
                    $phpCommand = Application::i()->registryGet('php_command') ?: 'php';
                    if (stristr(PHP_OS, 'win')) {
                        $cmd = 'START /D "' . Application::i()->baseDir . '/cron" ' . $phpCommand . ' cron.php master ' . (int)$item->id;
                        pclose(popen($cmd, 'r'));
                    } else {
                        $cmd = 'cd "' . Application::i()->baseDir . '/cron" && ' . $phpCommand . ' cron.php master ' . (int)$item->id . ' > /dev/null 2>&1 & echo $!';
                        exec($cmd);
                    }
                    sleep(1);
                }
                new Redirector($this->url);
                break;
            case 'delete':
                $item = new Crontab((int)$this->id);
                StdSub::delete($item, $this->url);
                break;
            case 'delete_log':
                $items = [];
                $ids = (array)$_GET['id'];
                if (in_array('all', $ids, true)) {
                    $pids = (array)$_GET['pid'];
                    $pids = array_filter($pids, 'trim');
                    $pids = array_map('intval', $pids);
                    if ($pids) {
                        $items = CrontabLog::getSet([
                            'where' => "pid IN (" . implode(", ", $pids) . ")"
                        ]);
                    }
                } else {
                    $items = array_map(function ($x) {
                        return new CrontabLog((int)$x);
                    }, $ids);
                }
                $items = array_values($items);
                $Item = isset($items[0]) ? $items[0] : new CrontabLog();
                StdSub::delete(
                    $items,
                    $this->url . '&id=' . (int)$Item->pid
                );
                break;
            default:
                $task = new Crontab((int)$this->id);
                if ($task->id) {
                    $this->showTask($task);
                } else {
                    $this->showlist();
                }
                break;
        }
    }


    /**
     * Редактирование задачи
     */
    private function edit()
    {
        $item = new Crontab((int)$this->id);
        $command = $_GET['command'];
        $form = new EditCrontabForm(['Item' => $item, 'command' => $command]);
        $this->view->edit($form->process());
    }


    /**
     * Просмотр списка задач
     */
    private function showlist()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            if (isset($_POST['priority']) && is_array($_POST['priority'])) {
                Package::i()->setEntitiesPriority(
                    Crontab::class,
                    (array)$_POST['priority']
                );
            }
        }
        if (stristr(PHP_OS, 'win')) {
            $cmd = 'tasklist';
        } else {
            $cmd = 'ps -A';
        }
        ob_start();
        system($cmd);
        $rawTaskList = trim(ob_get_clean());
        $taskList = explode("\n", $rawTaskList);
        if (stristr(PHP_OS, 'win')) {
            $taskList = array_slice($taskList, 2);
            $tasksIds = array_map(function ($x) {
                $x = explode('  ', trim($x), 2);
                $x = trim($x[1]);
                $x = explode(' ', $x, 2);
                $id = (int)$x[0];
                return $id;
            }, $taskList);
        } else {
            $taskList = array_slice($taskList, 2);
            $tasksIds = array_map(function ($x) {
                $x = explode(' ', trim($x), 2);
                $id = (int)$x[0];
                return $id;
            }, $taskList);
        }
        $this->view->showlist([
            'Set' => Crontab::getSet([
                'select' => ["COUNT(DISTINCT logs.id) AS logsCounter"],
            ]),
            'tasksIds' => $tasksIds
        ]);
    }


    /**
     * Просмотр логов задачи
     * @param Crontab $task Задача
     */
    private function showTask(Crontab $task)
    {
        $pages = new Pages(
            $_GET['page'] ?: 1,
            Application::i()->registryGet('rowsPerPage')
        );
        $set = CrontabLog::getSet([
            'where' => "pid = " . (int)$task->id,
            'orderBy' => 'post_date DESC'
        ], $pages);

        $this->view->showTask([
            'Item' => $task,
            'Set' => $set,
            'Pages' => $pages
        ]);
    }
}
