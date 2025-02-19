<?php
/**
 * @package RAAS.General
 */
declare(strict_types=1);

namespace RAAS\General;

use RAAS\Application;
use RAAS\IContext;
use RAAS\IRightsContext;
use RAAS\Form;
use RAAS\Module;
use RAAS\Package;
use RAAS\User;

/**
 * Класс абстрактного контроллера пакета "Главная"
 */
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
        } elseif (!in_array($this->mode, ['set_package', 'set_language'])) {
            $this->main();
        }
    }

    /**
     * Раздел администрирования
     */
    protected function admin()
    {
        if (($this->sub == 'users') && $this->model->user->canAdminUsers) {
            parent::execute();
        } elseif (($this->sub == 'modules') && $this->model->user->root) {
            parent::execute();
        } elseif (($this->sub == 'backup') && $this->model->user->root) {
            parent::execute();
        } elseif (($this->sub == 'crontab') && $this->model->user->root) {
            parent::execute();
        } elseif (($this->sub == 'processes') && $this->model->user->root) {
            parent::execute();
        } elseif (($this->sub == 'user_log') && $this->model->user->root) {
            Sub_UserLog::i()->run();
        } elseif (($this->sub == 'phperrors') && $this->model->user->root) {
            Sub_PHPErrors::i()->run();
        } else {
            $this->main();
        }
    }


    /**
     * Получает контекст
     * @return IContext
     */
    public function getContext($safe = true)
    {
        $Context = null;
        if (isset($this->nav['mid']) &&
            $this->nav['mid'] &&
            (!$safe || ($this->nav['mid'] != '/')) &&
            ($c = $this->application->getContext($this->nav['mid']))
        ) {
            $Context = $c;
        } elseif (!$safe) {
            $Context = $this->application;
        }
        return $Context;
    }


    /**
     * Редактирование текущего профиля
     */
    protected function edit()
    {
        $t = $this;
        $CONTENT = [];
        foreach ($this->view->availableLanguages as $key => $val) {
            $CONTENT['languages'][] = ['value' => $key, 'caption' => $val];
        }
        $Form = new Form([
            'caption' => htmlspecialchars($this->model->user->full_name ? $this->model->user->full_name : $this->model->user->login),
            'Item' => $this->model->user,
            'children' => [
                [
                    'name' => 'login',
                    'caption' => $this->view->_('LOGIN'),
                    'readonly' => 'readonly',
                    'export' => 'is_null',
                ],
                [
                    'type' => 'password',
                    'name' => 'password',
                    'caption' => $this->view->_('PASSWORD'),
                    'confirm' => true,
                    'export' => function ($field) use ($t) {
                        if ($_POST[$field->name]) {
                            $field->Form->Item->password_md5 = $t->application->md5It(trim($_POST[$field->name]));
                        }
                    },
                ],
                [
                    'type' => 'email',
                    'name' => 'email',
                    'required' => true,
                    'caption' => $this->view->_('EMAIL'),
                    'check' => function ($field) {
                        $localError = $field->getErrors();
                        if (!$localError) {
                            $sqlQuery = "SELECT COUNT(*) FROM " . User::_tablename() . " WHERE email = ? AND id != ?";
                            $sqlBind = [$_POST[$field->name] ?? '', (int)$field->Form->Item->id];
                            $sqlResult = (bool)(int)Application::i()->SQL->getvalue([$sqlQuery, $sqlBind]);
                            if ($sqlResult) {
                                $localError[] = [
                                    'name' => 'INVALID',
                                    'value' => $field->name,
                                    'description' => $this->view->_('ERR_EMAIL_EXISTS')
                                ];
                            }
                        }
                        return $localError;
                    }
                ],
                [
                    'name' => 'last_name',
                    'caption' => $this->view->_('LAST_NAME'),
                ],
                [
                    'name' => 'first_name',
                    'caption' => $this->view->_('FIRST_NAME')
                ],
                [
                    'name' => 'second_name',
                    'caption' => $this->view->_('SECOND_NAME')
                ],
                [
                    'type' => 'select',
                    'name' => 'lang',
                    'caption' => $this->view->_('LANGUAGE'),
                    'children' => $CONTENT['languages'],
                    'default' => $this->view->language,
                    'import' => function ($field) {
                        return $field->Form->Item->preferences[$field->name];
                    },
                    'export' => function ($field) {
                        $preferences = $field->Form->Item->preferences;
                        if (isset($_POST[$field->name])) {
                            $preferences['lang'] = $_POST[$field->name];
                        }
                        $field->Form->Item->preferences = $preferences;
                    }
                ]
            ],
        ]);
        ViewSub_Users::i()->edit_user($Form->process());
    }


    /**
     * Страница приветствия
     */
    protected function main()
    {
        $out = [];
        $out['CONTENT']['H'] = date('H');

        $out['CONTENT']['ip'] = $_SERVER['REMOTE_ADDR'];
        $out['CONTENT']['serverIP'] = $_SERVER['SERVER_ADDR'];
        $out['CONTENT']['NAME'] = Application::i()->versionName;
        if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $out['CONTENT']['proxy'] = $_SERVER['HTTP_X_FORWARDED_FOR'];
        }
        $this->view->main($out);
    }


    /**
     * Получает URL контекста
     */
    public function getContextURL(IRightsContext $Context)
    {
        if (($Context instanceof Package) ||  ($Context instanceof Module)) {
            return '&mid=' . $Context->mid;
        } else {
            return '';
        }
    }
}
