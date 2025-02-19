<?php
/**
 * @package RAAS.General
 */
declare(strict_types=1);

namespace RAAS\General;

use SOME\Pages;
use RAAS\Abstract_Sub_Controller;
use RAAS\Application;
use RAAS\Backup;
use RAAS\DBBackup;
use RAAS\Exception;
use RAAS\FilesBackup;
use RAAS\FilesIncBackup;
use RAAS\NoFilesForBackupException;
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
                new Redirector($this->url);
                break;
            case 'add_files':
                $backup = new FilesBackup();
                $backup->commit();
                new Redirector($this->url);
                break;
            case 'add_inc_files':
                try {
                    $backup = new FilesIncBackup();
                    $backup->commit();
                    new Redirector($this->url);
                } catch (Exception $e) {
                    $this->showlist([$e]);
                }
                break;
            case 'sql':
                while (ob_get_level()) {
                    ob_end_clean();
                }
                $tmpname = tempnam(sys_get_temp_dir(), '');
                $gzip = (bool)($_GET['gzip'] ?? null);
                $filename = date('Y-m-d H-i') . ' ' . Application::i()->dbname . '.sql';
                if ($gzip) {
                    $filename .= '.gz';
                }
                DBBackup::saveSQLDump($tmpname, $gzip);
                header('Content-Type: text/plain;encoding=UTF-8');
                header('Content-Disposition: attachment; filename="' . $filename . '"');
                readfile($tmpname);
                unlink($tmpname);
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
                new Redirector($this->url);
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
                exit;
                break;
            case 'edit':
                $this->edit();
                break;
            case 'delete':
                $backup = Backup::importById($_GET['id']);
                if ($backup) {
                    Backup::delete($backup);
                }
                new Redirector($this->url);
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
     * @param Exception[] $exceptions Исключения для отображения ошибок
     */
    private function showlist(array $exceptions = [])
    {
        $pages = new Pages(
            (isset($this->nav['page']) ? $this->nav['page'] : 1),
            Application::i()->registryGet('rowsPerPage')
        );
        $set = array_values(Backup::load());
        $localError = [];
        foreach ($exceptions as $exception) {
            if ($exception instanceof NoFilesForBackupException) {
                $localError[] = [
                    'name' => 'INVALID',
                    'value' => '',
                    'description' => $this->view->_('NO_FILES_FOR_BACKUP_ARCHIVE')
                ];
            }
        }
        $this->view->showlist(['Set' => $set, 'localError' => $localError]);
    }
}
