<?php
/**
 * Файл модуля планировщика
 */
namespace RAAS\General;

use RAAS\Abstract_Sub_Controller;
use RAAS\Crontab;
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
            case 'delete':
                $item = new Crontab((int)$this->id);
                StdSub::delete($item, $this->url);
                break;
            default:
                $this->showlist();
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
        $this->view->showlist(['Set' => Crontab::getSet()]);
    }
}
