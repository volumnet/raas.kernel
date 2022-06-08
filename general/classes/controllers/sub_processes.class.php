<?php
/**
 * Файл модуля диспетчера задач
 */
namespace RAAS\General;

use SOME\Pages;
use RAAS\Abstract_Sub_Controller;
use RAAS\Application;
use RAAS\Crontab;
use RAAS\CrontabLog;
use RAAS\Process;
use RAAS\Redirector;
use RAAS\StdSub;

/**
 * Класс модуля диспетчера задач
 */
class Sub_Processes extends Abstract_Sub_Controller
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
            case 'reboot':
                $this->reboot();
                break;
            case 'delete':
                Process::kill($this->id);
                new Redirector($this->url);
                break;
            default:
                $this->showlist();
                break;
        }
    }


    /**
     * Перезагрузка системы
     */
    private function reboot()
    {
        if (!Application::i()->registryGet('allowReboot') || stristr(PHP_OS, 'win')) {
            exit;
        }
        $form = new RebootForm();
        $this->view->reboot($form->process());
    }


    /**
     * Просмотр списка задач
     */
    private function showlist()
    {
        $tasks = Process::getSystemTasks();
        usort($tasks, function ($a, $b) {
            if ($a['process'] && $b['process']) {
                return $a['process']->post_date - $b['process']->post_date;
            } elseif ($a['process'] && !$b['process']) {
                return -1;
            } elseif (!$a['process'] && $b['process']) {
                return 1;
            }
            if ($a['time'] && $b['time']) {
                return $b['time'] - $a['time'];
            }
        });
        $this->view->showlist([
            'Set' => array_values($tasks),
        ]);
    }
}
