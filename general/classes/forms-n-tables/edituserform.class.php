<?php
/**
 * Форма редактирования пользователя
 */
namespace RAAS\General;

use RAAS\Application;
use RAAS\Form;
use RAAS\FormTab;
use RAAS\Field;
use RAAS\Option;
use RAAS\Group;
use RAAS\Level;

class EditUserForm extends Form
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


    public function __construct(array $params = [])
    {
        $view = $this->view;
        $t = $this;
        unset($params['view']);
        $item = isset($params['Item']) ? $params['Item'] : null;

        $defaultParams = [
            'caption' => $item->id ?
                htmlspecialchars(
                    $item->full_name ?
                    $item->full_name :
                    $item->login
                ) :
                $this->view->_('ADD_USER'),
            'Item' => $item,
        ];

        /*** Вкладка редактирования пользователя ***/
        $formTab = new FormTab([
            'name' => 'edit',
            'caption' => $this->view->_('EDIT_USER')
        ]);
        // Логин
        $field = new Field([
            'name' => 'login',
            'caption' => $this->view->_('LOGIN'),
            'required' => 'required'
        ]);
        if ($item->id == Application::i()->user->id) {
            $field->readonly = 'readonly';
            $field->export = 'is_null';
        } else {
            $field->required = 'required';
            $field->check = function ($field) {
                $localError = $field->getErrors();
                if (!$localError) {
                    if (Package::i()->checkLoginExists(
                        $_POST[$field->name],
                        $field->Form->Item->id
                    )) {
                        $localError[] = [
                            'name' => 'INVALID',
                            'value' => $field->name,
                            'description' => $this->view->_('ERR_LOGIN_EXISTS')
                        ];
                    }
                }
                return $localError;
            };
        }
        $formTab->children['login'] = $field;
        // Пароль
        $field = new Field([
            'type' => 'password',
            'name' => 'password',
            'caption' => $this->view->_('PASSWORD'),
            'confirm' => true,
            'export' => function ($field) {
                if ($_POST[$field->name]) {
                    $field->Form->Item->password_md5 = Application::i()->md5It(trim($_POST[$field->name]));
                }
            }
        ]);
        if (!$item->id) {
            $field->required = 'required';
        }
        $formTab->children['password'] = $field;
        // E-mail
        $formTab->children['email'] = new Field([
            'type' => 'email',
            'name' => 'email',
            'caption' => $this->view->_('EMAIL'),
        ]);
        // ФИО
        $formTab->children['last_name'] = new Field([
            'name' => 'last_name',
            'caption' => $this->view->_('LAST_NAME'),
        ]);
        $formTab->children['first_name'] = new Field([
            'name' => 'first_name',
            'caption' => $this->view->_('FIRST_NAME'),
        ]);
        $formTab->children['second_name'] = new Field([
            'name' => 'second_name',
            'caption' => $this->view->_('SECOND_NAME'),
        ]);
        // Глобальный админ
        if ($item->id != Application::i()->user->id) {
            $formTab->children['root'] = new Field([
                'type' => 'checkbox',
                'name' => 'root',
                'caption' => $this->view->_('GLOBAL_ADMIN'),
            ]);
        }
        // Язык
        $field = new Field([
            'type' => 'select',
            'name' => 'lang',
            'caption' => $this->view->_('LANGUAGE'),
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
        ]);
        foreach ($this->view->availableLanguages as $key => $val) {
            $field->children[] = new Option(['value' => $key, 'caption' => $val]);
        }
        $formTab->children['lang'] = $field;
        $defaultParams['children']['common'] = $formTab;

        if (Application::i()->user->root) {
            // Группы
            $g = new Group();
            $defaultParams['children']['groups'] = new FormTab([
                'name' => 'user_groups',
                'caption' => $this->view->_('GROUPS'),
                'children' => [
                    'groups' => [
                        'type' => 'checkbox',
                        'name' => 'groups',
                        'children' => ['Set' => $g->children],
                        'multiple' => 'multiple',
                        'import' => function ($field) {
                            return array_keys($field->Form->Item->associations);
                        },
                        'export' => function ($field) {
                            $arr = [];
                            foreach ((array)$_POST[$field->name] as $key => $val) {
                                $arr[$val] = 1;
                            }
                            $field->Form->Item->_SET_groups = $arr;
                        }
                    ]
                ]
            ]);
            if (Application::i()->user->id != $Form->Item->id) {
                // Права доступа
                $defaultParams['children']['rights'] = new FormTab([
                    'name' => 'rights',
                    'caption' => $this->view->_('RIGHTS'),
                    'template' => 'rights',
                    'children' => [
                        'rights' => [
                            'type' => 'select',
                            'name' => 'rights',
                            'multiple' => 'multiple',
                            'export' => function ($field) {
                                $field->Form->Item->_SET_rights = $_POST[$field->name];
                            },
                            'import' => function ($field) {
                                $DATA = [];
                                $item = $field->Form->Item;
                                foreach (Application::i()->packages as $row) {
                                    $level = $item->access($row)->level;
                                    $DATA[$row->mid] = (int)(
                                        $level instanceof Level ?
                                        $level->id :
                                        $level
                                    );
                                    foreach ($row->modules as $row2) {
                                        $level = $item->access($row2)->level;
                                        $DATA[$row2->mid] = (int)(
                                            $level instanceof Level ?
                                            $level->id :
                                            $level
                                        );
                                    }
                                }
                                return $DATA;
                            }
                        ]
                    ],
                ]);
            }
        }
        $arr = array_merge($defaultParams, $params);
        parent::__construct($arr);
    }
}
