<?php
namespace RAAS\General;
use \RAAS\Application;
use \RAAS\FormTab;
use \RAAS\Field;
use \RAAS\Option;

class EditUserForm extends \RAAS\Form
{
    protected $_view;

    public function __get($var)
    {
        switch ($var) {
            case 'view':
                return ViewSub_Users::i();
                break;
            default:
                return parent::__get($var);
                break;
        }
    }


    public function __construct(array $params = array())
    {
        $view = $this->view;
        $t = $this;
        unset($params['view']);
        $Item = isset($params['Item']) ? $params['Item'] : null;

        $defaultParams = array(
            'caption' => $Item->id ? htmlspecialchars($Item->full_name ? $Item->full_name : $Item->login) : $this->view->_('ADD_USER'), 
            'Item' => $Item,
        );
        
        /*** Вкладка редактирования пользователя ***/
        $FormTab = new FormTab(array('name' => 'edit', 'caption' => $this->view->_('EDIT_USER')));
        // Логин
        $Field = new Field(array('name' => 'login', 'caption' => $this->view->_('LOGIN'), 'required' => 'required'));
        if ($Item->id == Application::i()->user->id) {
            $Field->readonly = 'readonly';
            $Field->export = 'is_null';
        } else {
            $Field->required = 'required';
            $Field->check = function($Field) use ($t) {
                $localError = $Field->getErrors();
                if (!$localError) {
                    if (Package::i()->checkLoginExists($_POST[$Field->name], $Field->Form->Item->id)) {
                        $localError[] = array('name' => 'INVALID', 'value' => $Field->name, 'description' => $t->view->_('ERR_LOGIN_EXISTS'));
                    }
                }
                return $localError;
           };
        }
        $FormTab->children[] = $Field;
        // Пароль
        $Field = new Field(array(
            'type' => 'password', 
            'name' => 'password', 
            'caption' => $this->view->_('PASSWORD'),
            'confirm' => true, 
            'export' => function($Field) use ($t) { 
                if ($_POST[$Field->name]) {
                    $Field->Form->Item->password_md5 = $t->application->md5It(trim($_POST[$Field->name])); 
                }
            }
        ));
        if (!$Item->id) {
            $Field->required = 'required';
        }
        $FormTab->children[] = $Field;
        // E-mail
        $FormTab->children[] = new Field(array('type' => 'email', 'name' => 'email', 'caption' => $this->view->_('EMAIL')));
        // ФИО
        $FormTab->children[] = new Field(array('name' => 'last_name', 'caption' => $this->view->_('LAST_NAME')));
        $FormTab->children[] = new Field(array('name' => 'first_name', 'caption' => $this->view->_('FIRST_NAME')));
        $FormTab->children[] = new Field(array('name' => 'second_name', 'caption' => $this->view->_('SECOND_NAME')));
        // Глобальный админ
        if ($Item->id != Application::i()->user->id) {
            $FormTab->children[] = new Field(array('type' => 'checkbox', 'name' => 'root', 'caption' => $this->view->_('GLOBAL_ADMIN')));
        }
        // Язык
        $Field = new Field(array(
            'type' => 'select',
            'name' => 'lang', 
            'caption' => $this->view->_('LANGUAGE'),
            'default' => $this->view->language,
            'import' => function($Field) use ($t) { return $Field->Form->Item->preferences[$Field->name]; },
            'export' => function($Field) use ($t) { 
                $preferences = $Field->Form->Item->preferences;
                if (isset($_POST[$Field->name])) {
                    $preferences['lang'] = $_POST[$Field->name];
                }
                $Field->Form->Item->preferences = $preferences;
            }
        ));
        foreach ($this->view->availableLanguages as $key => $val) {
            $Field->children[] = new Option(array('value' => $key, 'caption' => $val));
        }
        $FormTab->children[] = $Field;
        $defaultParams['children']['common'] = $FormTab;
        
        if (Application::i()->user->root) {
            // Группы
            $defaultParams['children']['groups'] = new FormTab(array(
                'name' => 'user_groups', 
                'caption' => $this->view->_('GROUPS'), 
                'template' => 'admin_users_edit_user',
                'children' => array(
                    new Field(array(
                        'type' => 'checkbox', 
                        'name' => 'groups',
                        'multiple' => 'multiple', 
                        'import' => function($Field) use ($t) { return $Field->Form->Item->associations; }, 
                        'export' => function($Field) use ($t) { $Field->Form->Item->_SET_groups = $_POST[$Field->name]; }
                    )
                ))
            ));
            if (Application::i()->user->id != $Form->Item->id) {
                // Права доступа
                $defaultParams['children']['rights'] = new FormTab(array(
                    'name' => 'rights',
                    'caption' => $this->view->_('RIGHTS'), 
                    'template' => 'rights', 
                    'children' => array(array(
                        'type' => 'select', 
                        'name' => 'rights', 
                        'multiple' => 'multiple',
                        'export' => function($Field) use ($t) { $Field->Form->Item->_SET_rights = $_POST[$Field->name]; },
                        'import' => function($Field) use ($t) {
                            $DATA = array();
                            $Item = $Field->Form->Item;
                            foreach (Application::i()->packages as $row) {
                                $level = $Item->access($row)->level;
                                $DATA[$row->mid] = (int)($level instanceof Level ? $level->id : $level);
                                foreach ($row->modules as $row2) {
                                    $level = $Item->access($row2)->level;
                                    $DATA[$row2->mid] = (int)($level instanceof Level ? $level->id : $level);
                                }
                            }
                            return $DATA;
                        }
                    ))
                ));
            }
        }
        $arr = array_merge($defaultParams, $params);
        parent::__construct($arr);
    }
}