<?php
namespace RAAS\General;
use \RAAS\User as User;
use \RAAS\Group as Group;
use \RAAS\Level as Level;
use \RAAS\Redirector as Redirector;
use \RAAS\Application as Application;
use \RAAS\Update as Update;
use \RAAS\IContext as IContext;
use \RAAS\IRightsContext as IRightsContext;
use \RAAS\Form as Form;
use \RAAS\Field as Field;
use \RAAS\Option as Option;
use \RAAS\FormTab as FormTab;

class Sub_Backup extends \RAAS\Abstract_Sub_Controller
{
    protected static $instance;
    
    public function run()
    {
        ob_end_clean();
        switch ($this->action) {
            case 'sql':
                $this->model->backupSQL();
                break;
            case 'files':
                $this->model->backupFiles();
                break;
        }
        exit;
    }
}