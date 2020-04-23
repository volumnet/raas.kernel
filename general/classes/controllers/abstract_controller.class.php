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

abstract class Abstract_Controller extends \RAAS\Abstract_Package_Controller
{
    protected static $instance;

    protected function execute()
    {
        if (($this->mode == 'admin') && $this->model->user->adminRights) {
            $this->admin();
        } elseif ($this->mode == 'manual') {

        } elseif ($this->mode == 'set_package') {

        } elseif ($this->mode == 'set_language') {

        } elseif ($this->action == 'edit') {
            $this->edit();
        } elseif (!in_array($this->mode, array('set_package', 'set_language'))) {
            $this->main();
        }
    }

    private function admin()
    {
        if (($this->sub == 'users') && $this->model->user->canAdminUsers) {
            parent::execute();
        } elseif (($this->sub == 'modules') && $this->model->user->root) {
            parent::execute();
        } elseif (($this->sub == 'backup') && $this->model->user->root) {
            parent::execute();
        } elseif (($this->sub == 'crontab') && $this->model->user->root) {
            parent::execute();
        } else {
            $this->main();
        }
    }

    public function getContext($safe = true)
    {
        $Context = null;
        if (isset($this->nav['mid']) && $this->nav['mid'] && (!$safe || ($this->nav['mid'] != '/')) && ($c = $this->application->getContext($this->nav['mid']))) {
            $Context = $c;
        } elseif (!$safe) {
            $Context = $this->application;
        }
        return $Context;
    }

    private function edit()
    {
        $t = $this;
        $CONTENT = array();
        foreach ($this->view->availableLanguages as $key => $val) {
            $CONTENT['languages'][] = array('value' => $key, 'caption' => $val);
        }
        $Form = new Form(array(
            'caption' => htmlspecialchars($this->model->user->full_name ? $this->model->user->full_name : $this->model->user->login),
            'Item' => $this->model->user,
            'children' => array(
                array('name' => 'login', 'caption' => $this->view->_('LOGIN'), 'readonly' => 'readonly', 'export' => 'is_null'),
                array(
                    'type' => 'password',
                    'name' => 'password',
                    'caption' => $this->view->_('PASSWORD'),
                    'confirm' => true,
                    'export' => function($Field) use ($t) {
                        if ($_POST[$Field->name]) {
                            $Field->Form->Item->password_md5 = $t->application->md5It(trim($_POST[$Field->name]));
                        }
                    }
                ),
                array('type' => 'email', 'name' => 'email', 'caption' => $this->view->_('EMAIL')),
                array('name' => 'last_name', 'caption' => $this->view->_('LAST_NAME')),
                array('name' => 'first_name', 'caption' => $this->view->_('FIRST_NAME')),
                array('name' => 'second_name', 'caption' => $this->view->_('SECOND_NAME')),
                array(
                    'type' => 'select',
                    'name' => 'lang',
                    'caption' => $this->view->_('LANGUAGE'),
                    'children' => $CONTENT['languages'],
                    'default' => $this->view->language,
                    'import' => function($Field) use ($t) { return $Field->Form->Item->preferences[$Field->name]; },
                    'export' => function($Field) use ($t) {
                        $preferences = $Field->Form->Item->preferences;
                        if (isset($_POST[$Field->name])) {
                            $preferences['lang'] = $_POST[$Field->name];
                        }
                        $Field->Form->Item->preferences = $preferences;
                    }
                )
            )
        ));
        ViewSub_Users::i()->edit_user($Form->process());
    }

    protected function main()
    {
        $OUT = array();
        $OUT['CONTENT']['H'] = date('H');

        $OUT['CONTENT']['ip'] = $_SERVER['REMOTE_ADDR'];
        $OUT['CONTENT']['NAME'] = Application::i()->versionName;
        if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $OUT['CONTENT']['proxy'] = $_SERVER['HTTP_X_FORWARDED_FOR'];
        }
        $this->view->main($OUT);
    }

    public function getContextURL(IRightsContext $Context)
    {
        if (($Context instanceof \RAAS\Package) ||  ($Context instanceof \RAAS\Module)) {
            return '&mid=' . $Context->mid;
        } else {
            return '';
        }
    }
}
