<?php
/**
 * Файл модуля резервного копирования
 */
namespace RAAS\General;

use RAAS\Abstract_Sub_Controller;
use RAAS\User as User;
use RAAS\Group as Group;
use RAAS\Level as Level;
use RAAS\Redirector as Redirector;
use RAAS\Application as Application;
use RAAS\Update as Update;
use RAAS\IContext as IContext;
use RAAS\IRightsContext as IRightsContext;
use RAAS\Form as Form;
use RAAS\Field as Field;
use RAAS\Option as Option;
use RAAS\FormTab as FormTab;

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
        }
    }
}
