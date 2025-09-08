<?php
/**
 * @package RAAS.General
 */
declare(strict_types=1);

namespace RAAS\General;

use RAAS\Abstract_Sub_Controller;
use RAAS\Application;
use RAAS\User;
use RAAS\Group;
use RAAS\Redirector;
use RAAS\StdSub;

/**
 * Класс подмодуля пользователей
 */
class Sub_Users extends Abstract_Sub_Controller
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
            case 'edit_user':
                $this->editUser();
                break;
            case 'edit_group':
                $this->editGroup();
                break;
            case 'user_rights':
                $this->userRights();
                break;
            case 'group_rights':
                $this->groupRights();
                break;
            case 'delete_user':
                $item = new User((int)$this->id);
                if ($item->id == Application::i()->user->id) {
                    exit; // Не должен иметь возможность сам себя удалить
                }
                StdSub::delete(
                    $item,
                    $this->url,
                    true,
                    true
                );
                break;
            case 'delete_group':
                $item = new Group((int)$this->id);
                StdSub::delete(
                    $item,
                    (
                        isset($_GET['back']) ?
                        'history:back#groups' :
                        $this->url . ((int)$item->pid ? ('&id=' . (int)$item->pid) : '') . '#groups'
                    ),
                    false
                );
                break;
            case 'add_group':
                $group = new Group(
                    isset($this->nav['gid']) ?
                    (int)$this->nav['gid'] :
                    0
                );
                StdSub::associate(
                    new User((int)$this->id),
                    $this->url . '&id=' . (int)$group->id,
                    true,
                    $group->id,
                    $group
                );
                break;
            case 'del_group':
                $group = new Group(
                    isset($this->nav['gid']) ?
                    (int)$this->nav['gid'] :
                    0
                );
                StdSub::deassociate(
                    new User((int)$this->id),
                    $this->url . '&id=' . (int)$group->id,
                    true,
                    $group->id,
                    $group
                );
                break;
            case 'delete_user_rights':
                $context = $this->getContext();
                $item = new User((int)$this->id);
                StdSub::deleteRights(
                    $item->access($context),
                    $this->url . '&action=edit_user&id=' . (int)$item->id . '#rights',
                    true,
                    ($context && $context->hasRights && $item->id)
                );
                break;
            case 'delete_group_rights':
                $context = $this->getContext();
                $item = new Group((int)$this->id);
                StdSub::deleteRights(
                    $item->access($context),
                    $this->url . '&action=edit_group&id=' . (int)$item->id . '#rights',
                    true,
                    ($context && $context->hasRights && $item->id)
                );
                break;
            default:
                $this->showlist();
                break;
        }
    }


    /**
     * Редактирование пользователя
     */
    protected function editUser()
    {
        $item = new User((int)$this->id);
        $form = new EditUserForm(['Item' => $item]);
        $this->view->edit_user($form->process());
    }


    /**
     * Редактирование группы
     */
    protected function editGroup()
    {
        $item = new Group((int)$this->id);
        if (!$item->id) {
            $item->pid = isset($_GET['pid']) ? (int)$_GET['pid'] : 0;
        }
        $form = new EditGroupForm(['Item' => $item]);
        $this->view->edit_group($form->process());
    }


    /**
     * Права пользователя
     */
    protected function userRights()
    {
        $context = $this->getContext();
        $item = new User((int)$this->id);
        if (!isset($item->id) || !$item->id) {
            new Redirector($this->url);
        } elseif (!$context || !$context->hasRights) {
            new Redirector($this->url . '&action=edit_user&id=' . (int)$item->id . '#rights');
        }
        $t = $this;
        $in = (array)$context->controller->rights($item, $context);
        $form = new EditRightsForm(array_merge([
            'Item' => $item,
            'Context' => $context,
        ], $in));
        $this->view->user_rights(array_merge((array)$form->process(), [
            'Context' => $context,
            'Item' => $item,
        ]));
    }


    /**
     * Права группы
     */
    protected function groupRights()
    {
        $context = $this->getContext();
        $item = new Group((int)$this->id);
        if (!isset($item->id) || !$item->id) {
            new Redirector($this->url . '#groups');
        } elseif (!$context || !$context->hasRights) {
            new Redirector($this->url . '&action=edit_group&id=' . (int)$item->id . '#rights');
        }
        $t = $this;
        $in = (array)$context->controller->rights($item, $context);
        $form = new EditRightsForm(array_merge([
            'Item' => $item,
            'Context' => $context,
        ], $in));
        $this->view->group_rights(array_merge((array)$form->process(), [
            'Context' => $context,
            'Item' => $item,
        ]));
    }


    /**
     * Отображение списка пользователей
     */
    protected function showlist()
    {
        $group = new Group($this->id);
        $content = $this->model->admin_users_showlist($group, $this->nav);
        foreach (['sort', 'order'] as $key) {
            $content[$key] = isset($this->nav[$key]) ? $this->nav[$key] : null;
        }
        if (!$content['sort']) {
            $content['sort'] = 'login';
            $content['order'] = 'asc';
        } elseif (!$content['order']) {
            $content['order'] = 'asc';
        }
        $this->view->showlist(['CONTENT' => $content, 'Group' => $group]);
    }
}
