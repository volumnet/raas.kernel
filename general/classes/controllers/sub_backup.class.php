<?php
/**
 * Файл модуля резервного копирования
 */
namespace RAAS\General;

use SOME\Pages;
use RAAS\Abstract_Sub_Controller;
use RAAS\Application;
use RAAS\Backup;
use RAAS\DBBackup;
use RAAS\Redirector;

/**
 * Класс модуля резервного копирования
 */
class Sub_Backup extends Abstract_Sub_Controller
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
            case 'add_sql':
                $backup = new DBBackup();
                $backup->commit();
                new Redirector('history:back');
                break;
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
            case 'restore':
                $backup = Backup::importById($_GET['id']);
                if ($backup) {
                    $backup->restore();
                }
                new Redirector('history:back');
                break;
            case 'download_uncompressed':
                $backup = Backup::importById($_GET['id']);
                $text = @file_get_contents($backup->filepath);
                if (mb_strtolower(pathinfo($backup->filename, PATHINFO_EXTENSION)) == 'gz') {
                    $text = gzdecode($text);
                }
                while (ob_get_level()) {
                    ob_end_clean();
                }
                header('Content-Type: text/plain;encoding=UTF-8');
                header('Content-Disposition: attachment; filename="' . str_ireplace('.gz', '', $backup->filename) . '"');
                echo $text;
                break;
            case 'edit':
                $this->edit();
                break;
            case 'delete':
                $backup = Backup::importById($_GET['id']);
                if ($backup) {
                    Backup::delete($backup);
                }
                new Redirector(
                    isset($_GET['back']) ?
                    'history:back' :
                    $this->url
                );
                break;
            default:
                $this->showlist();
                break;
        }
    }


    /**
     * Редактирование резервной копии
     */
    private function edit()
    {
        $item = Backup::importById($this->nav['id']);
        if (!$item->id) {
            new Redirector($this->url);
        }
        $form = new EditBackupForm(array('Item' => $item));
        $this->view->edit(array_merge($form->process(), ['Item' => $item]));
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
        $set = array_values(Backup::load());
        $this->view->showlist(['Set' => $set]);
    }
}
