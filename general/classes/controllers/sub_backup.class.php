<?php
/**
 * Файл модуля резервного копирования
 */
namespace RAAS\General;

use SOME\Pages;
use RAAS\Abstract_Sub_Controller;
use RAAS\Application;
use RAAS\Backup;

/**
 * Класс модуля резервного копирования
 */
class Sub_Backup extends Abstract_Sub_Controller
{
    protected static $instance;

    public function run()
    {
        switch ($this->action) {
            case 'sql':
                ob_end_clean();
                $this->model->backupSQL();
                exit;
                break;
            case 'files':
                ob_end_clean();
                $this->model->backupFiles();
                exit;
                break;
            default:
                $this->showlist();
                break;
        }
    }


    /**
     * Просмотр списка резервных копий
     */
    private function showlist()
    {
        $pages = new Pages(
            (isset($this->nav['page']) ? $this->nav['page'] : 1),
            Application::i()->registryGet('rowsPerPage')
        );
        $set = Backup::getSet([], $pages);
        $this->view->showlist(['Set' => $set, 'Pages' => $pages]);
    }
}
