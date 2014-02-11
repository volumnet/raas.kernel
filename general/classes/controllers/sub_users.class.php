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
use \RAAS\StdSub as StdSub;

class Sub_Users extends \RAAS\Abstract_Sub_Controller
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
            case 'edit_user': case 'edit_group': case 'user_rights': case 'group_rights':
                $this->{$this->action}();
                break;
            case 'delete_user': 
                $Item = new User((int)$this->id);
                StdSub::delete($Item, $this->url, true, $Item->id != $this->application->model->user->id);
                break;
            case 'delete_group': 
                $Item = new Group((int)$this->id);
                StdSub::delete($Item, (isset($_GET['back']) ? 'history:back#groups' : $this->url . ((int)$Item->pid ? ('&id=' . (int)$Item->pid) : '') . '#groups'), false);
                break;
            case 'add_group': 
                $Group = new Group(isset($this->nav['gid']) ? (int)$this->nav['gid'] : 0);
                StdSub::associate(new User((int)$this->id), $this->url . '&id=' . (int)$Group->id, true, $Group->id, $Group);
                break;
            case 'del_group':
                $Group = new Group(isset($this->nav['gid']) ? (int)$this->nav['gid'] : 0);
                StdSub::deassociate(new User((int)$this->id), $this->url . '&id=' . (int)$Group->id, true, $Group->id, $Group);
                break;
            case 'delete_user_rights': 
                $Context = $this->getContext();
                $Item = new User((int)$this->id);
                StdSub::deleteRights(
                    $Item->access($Context), $this->url . '&action=edit_user&id=' . (int)$Item->id . '#rights', true, ($Context && $Context->hasRights && $Item->id)
                );
                break;
            case 'delete_group_rights':
                $Context = $this->getContext();
                $Item = new Group((int)$this->id);
                StdSub::deleteRights(
                    $Item->access($Context), $this->url . '&action=edit_group&id=' . (int)$Item->id . '#rights', true, ($Context && $Context->hasRights && $Item->id)
                );
                break;
            default:
                $this->showlist();
                break;
        }
    }
    

    private function edit_user()
    {
        $Item = new User((int)$this->id);
        $t = $this;
        $Form = new Form(array(
            'caption' => $Item->id ? htmlspecialchars($Item->full_name ? $Item->full_name : $Item->login) : $this->view->_('ADD_USER'), 'Item' => $Item
        ));
        /*** Вкладка редактирования пользователя ***/
        $FormTab = new FormTab(array('name' => 'edit', 'caption' => $this->view->_('EDIT_USER')));
        // Логин
        $Field = new Field(array('name' => 'login', 'caption' => $this->view->_('LOGIN'), 'required' => 'required'));
        if ($Item->id == $this->model->user->id) {
            $Field->readonly = 'readonly';
            $Field->export = 'is_null';
        } else {
            $Field->required = 'required';
            $Field->check = function($Field) use ($t) {
                $localError = $Field->getErrors();
                if (!$localError) {
                    if ($t->model->checkLoginExists($_POST[$Field->name], $Field->Form->Item->id)) {
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
        if ($Item->id != $this->model->user->id) {
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
        $Form->children[] = $FormTab;
        
        if ($t->model->user->root) {
            // Группы
            $Form->children[] = new FormTab(array(
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
            if ($t->model->user->id != $Form->Item->id) {
                // Права доступа
                $Form->children[] = new FormTab(array(
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
                            foreach ($t->application->packages as $row) {
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
        $this->view->edit_user($Form->process());
    }
    

    private function edit_group()
    {
        $Item = new Group((int)$this->id);
        if (!$Item->id) {
            $Item->pid = isset($_GET['pid']) ? (int)$_GET['pid'] : 0;
        }
        $t = $this;
        $Form = new Form(array(
            'Item' => $Item,
            'caption' => $Item->id ? htmlspecialchars($Item->name) : $this->view->_('ADD_GROUP'),
            'parentUrl' => urldecode(\SOME\HTTP::queryString('id=%s&action=')) . '#groups',
            'children' => array(
                new FormTab(array(
                    'name' => 'edit', 
                    'caption' => $this->view->_('EDIT_GROUP'), 
                    'children' => array(
                        array('name' => 'name', 'caption' => $this->view->_('NAME'), 'required' => 'required'),
                        array('type' => 'textarea', 'name' => 'description', 'caption' => $this->view->_('DESCRIPTION')),
                    )
                )),
                new FormTab(array(
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
                            foreach ($t->application->packages as $row) {
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
                ))
            )
        ));
        $this->view->edit_group($Form->process());
    }

    
    private function user_rights()
    {
        $Context = $this->getContext();
        $Item = new User((int)$this->id);
        if (!isset($Item->id) || !$Item->id) {
            new Redirector($this->url);
        } elseif (!$Context || !$Context->hasRights) {
            new Redirector($this->url . '&action=edit_user&id=' . (int)$Item->id . '#rights');
        }
        $t = $this;
        $IN = (array)$Context->controller->rights($Item, $Context);
        $Form = new Form(array(
            'caption' => $this->application->view->_('EDIT_RIGHTS') . ': ' . htmlspecialchars($IN['Item']->full_name ? $IN['Item']->full_name : $IN['Item']->login),
            'import' => function($Form) use ($IN) { return $IN['DATA']; },
            'commit' => function($Form) use ($IN, $Context, $Item) { $Item->access($Context)->setRights($IN['rights']); },
            'children' => array(
                array('name' => 'rights', 'template' => str_replace('.', '/', $Context->mid) . '/rights.inc.tmp.php', 'import' => 'is_null', 'export' => 'is_null')
            )
        ));
        $this->view->user_rights(array_merge((array)$Form->process(), array('Context' => $Context, 'Item' => $Item)));
    }
    

    private function group_rights()
    {
        $Context = $this->getContext();
        $Item = new Group((int)$this->id);
        if (!isset($Item->id) || !$Item->id) {
            new Redirector($this->url . '#groups');
        } elseif (!$Context || !$Context->hasRights) {
            new Redirector($this->url . '&action=edit_group&id=' . (int)$Item->id . '#rights');
        }
        $t = $this;
        $IN = (array)$Context->controller->rights($Item, $Context);
        $Form = new Form(array(
            'caption' => $this->application->view->_('EDIT_RIGHTS') . ': ' . htmlspecialchars($IN['Item']->name),
            'import' => function($Form) use ($IN) { return $IN['DATA']; },
            'commit' => function($Form) use ($IN, $Context, $Item) { $Item->access($Context)->setRights($IN['rights']); },
            'children' => array(
                array('name' => 'rights', 'template' => str_replace('.', '/', $Context->mid) . '/rights.inc.tmp.php', 'import' => 'is_null', 'export' => 'is_null')
            )
        ));
        $this->view->group_rights(array_merge((array)$Form->process(), array('Context' => $Context, 'Item' => $Item)));
    }
    

    private function showlist()
    {
        $Group = new Group($this->id);
        $CONTENT = $this->model->admin_users_showlist($Group, $this->nav);
        foreach (array('sort', 'order') as $key) {
            $CONTENT[$key] = isset($this->nav[$key]) ? $this->nav[$key] : null;
        }
        if (!$CONTENT['sort']) {
            $CONTENT['sort'] = 'login';
            $CONTENT['order'] = 'asc';
        } elseif (!$CONTENT['order']) {
            $CONTENT['order'] = 'asc';
        }
        $this->view->showlist(array('CONTENT' => $CONTENT, 'Group' => $Group));
    }
}