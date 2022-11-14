<?php
/**
 * Представление подмодуля "Пользователи"
 */
namespace RAAS\General;

use RAAS\User;
use RAAS\Group;
use RAAS\IRightsContext;

/**
 * Класс представления подмодуля "Пользователи"
 */
class ViewSub_Users extends \RAAS\Abstract_Sub_View
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


    public function edit_user(array $in = [])
    {
        if ($this->sub == 'users') {
            $this->path[] = ['name' => $this->_('USERS_AND_GROUPS'), 'href' => $this->url];
            $this->submenu = $this->getGroupsMenu(new Group(), new Group());
        }
        $this->stdView->stdEdit($in, ($in['Item']->id && $this->application->user->root) ? 'getUserContextMenu' : '');
    }


    public function edit_group(array $in = [])
    {
        $this->getGroupsPath($in['Item']);
        $this->submenu = $this->getGroupsMenu(new Group(), $in['Item']->parent);
        $this->stdView->stdEdit($in, 'getGroupContextMenu');
    }


    public function user_rights(array $in = [])
    {
        $this->path[] = ['name' => $this->_('USERS_AND_GROUPS'), 'href' => $this->url];
        $this->path[] = [
            'name' => htmlspecialchars($in['Item']->full_name ? $in['Item']->full_name : $in['Item']->login),
            'href' => $this->url . '&action=edit_user&id=' . (int)$in['Item']->id . '#rights'
        ];
        $this->submenu = $this->getGroupsMenu(new Group(), new Group());
        $this->contextmenu = $this->getUserRightsContextMenu($in['Item'], $in['Context']);
        $this->stdView->stdEdit($in);
   }


    public function group_rights(array $in = [])
    {
        $this->getGroupsPath($in['Item']);
        $this->path[] = [
            'name' => htmlspecialchars($in['Item']->name),
            'href' => $this->url . '&action=edit_group&id=' . (int)$in['Item']->id . '#rights'
        ];
        $this->submenu = $this->getGroupsMenu(new Group(), $in['Item']->parent);
        $this->contextmenu = $this->getGroupRightsContextMenu($in['Item'], $in['Context']);
        $this->stdView->stdEdit($in);
    }


    public function showlist(array $in = [])
    {
        $view = $this;
        $in['UsersTable'] = new UsersTable([
            'Group' => $in['Group'],
            'Set' => $in['CONTENT']['Set'],
            'Pages' => $in['CONTENT']['Pages'],
            'sort' => $in['CONTENT']['sort'],
            'order' => $in['CONTENT']['order']
        ]);

        $in['GroupsTable'] = new GroupsTable(['Set' => $in['CONTENT']['GSet']]);

        $this->assignVars($in);
        $this->getGroupsPath($in['Group']);
        $this->submenu = $this->getGroupsMenu(new Group(), $in['Group']);
        $this->contextmenu[] = [
            'href' => $this->url . '&action=edit_user' . ((int)$in['Group']->id ? '&pid=' . (int)$in['Group']->id : ''),
            'name' => $this->_('ADD_USER2'),
            'icon' => 'plus'
        ];
        $this->contextmenu[] = [
            'href' => $this->url . '&action=edit_group' . ((int)$in['Group']->id ? '&pid=' . (int)$in['Group']->id : ''),
            'name' => $this->_('ADD_GROUP2'),
            'icon' => 'plus'
        ];
        if ($in['Group']->id) {
            $this->contextmenu[] = [
                'href' => $this->url . '&action=edit_group&id=' . (int)$in['Group']->id,
                'name' => $this->_('EDIT_GROUP2'),
                'icon' => 'edit'
            ];
            $this->contextmenu[] = [
                'href' => $this->url . '&action=delete_group&id=' . (int)$in['Group']->id,
                'name' => $this->_('DELETE_GROUP'),
                'icon' => 'remove',
                'onclick' => "return confirm('" . $this->_('DELETE_GROUP_TEXT') . "')"
            ];
        }
        $this->title = $in['Group']->id ? htmlspecialchars($in['Group']->name) : $this->_('USERS_AND_GROUPS');
        $this->template = 'admin_users_showlist';
    }


    public function getUserContextMenu(User $item, Group $group = null)
    {
        $arr = [];
        if ($item->id) {
            $edit = ($this->action == 'edit_user');
            $edit2 = ($this->action == 'edit');
            if (!$edit && !$edit2) {
                $arr[] = [
                    'href' => $this->url . '&action=edit_user&id=' . (int)$item->id,
                    'name' => $this->_('EDIT'),
                    'icon' => 'edit'
                ];
            }
            if (isset($group->id) && $group->id) {
                if (in_array($group->id, $item->groups_ids)) {
                    $arr[] = [
                        'href' => $this->url . '&action=del_group&id=' . (int)$item->id
                            . '&gid=' . (int)$group->id . ($edit ? '' : '&back=1'),
                        'name' => $this->_('DELETE_FROM_GROUP'),
                        'icon' => 'remove-circle'
                    ];
                } else {
                    $arr[] = [
                        'href' => $this->url . '&action=add_group&id=' . (int)$item->id
                            . '&gid=' . (int)$group->id . ($edit ? '' : '&back=1'),
                        'name' => $this->_('ADD_TO_GROUP'),
                        'icon' => 'ok-circle'
                    ];
                }
            }
            if ($item->id != $this->application->user->id) {
                $arr[] = [
                    'href' => $this->url . '&action=delete_user&id=' . (int)$item->id . ($edit ? '' : '&back=1'),
                    'name' => $this->_('DELETE'),
                    'icon' => 'remove',
                    'onclick' => 'return confirm(\'' . $this->_('DELETE_USER_TEXT') . '\')'
                  ];
            }
        }
        return $arr;
    }


    public function getGroupContextMenu(Group $item)
    {
        return $this->stdView->stdContextMenu($item, 0, 0, 'edit_group', '', 'delete_group');
    }


    public function getUserRightsContextMenu(User $item, IRightsContext $Context)
    {
        $arr = [];
        if ($item->id && $Context->hasRights && ($item->id != $this->application->user->id)) {
            $edit = ($this->action == 'user_rights');
            if (!$edit) {
                $arr[] = [
                    'name' => $this->_('EDIT_RIGHTS'),
                    'href' => $this->url . $this->getContextURL($Context) . '&action=user_rights&id=' . (int)$item->id,
                    'icon' => 'lock'
                ];
            }
            if ($item->access($Context)->selfRights) {
                $arr[] = [
                    'name' => $this->_('DELETE_RIGHTS'),
                    'href' => $this->url . $this->getContextURL($Context)
                        . '&action=delete_user_rights&id=' . (int)$item->id . ($edit ? '' : '&back=1'),
                    'icon' => 'remove',
                    'onclick' => 'return confirm(\'' . $this->_('DELETE_RIGHTS_TEXT') . '\')'
                ];
            }
        }
        return $arr;
    }


    public function getGroupRightsContextMenu(Group $item, IRightsContext $Context)
    {
        $arr = [];
        if ($Context->hasRights) {
            $edit = ($this->action == 'group_rights');
            if (!$edit) {
                $arr[] = [
                    'name' => $this->_('EDIT_RIGHTS'),
                    'href' => $this->url . $this->getContextURL($Context) . '&action=group_rights&id=' . (int)$item->id,
                    'icon' => 'lock',
                ];
            }
            if ($item->access($Context)->selfRights) {
                $arr[] = [
                    'name' => $this->_('DELETE_RIGHTS'),
                    'href' => $this->url . $this->getContextURL($Context)
                        . '&action=delete_group_rights&id=' . (int)$item->id . ($edit ? '' : '&back=1'),
                    'icon' => 'remove',
                    'onclick' => 'return confirm(\'' . $this->_('DELETE_RIGHTS_TEXT') . '\')'
                ];
            }
        }
        return $arr;
    }


    protected function getGroupsMenu(Group $node, Group $current)
    {
        $submenu = [];
        foreach ($node->children as $row) {
            $submenu[] = [
                'name' => htmlspecialchars($row->name),
                'href' => $this->url . '&id=' . (int)$row->id,
                'submenu' => $this->getGroupsMenu($row, $current)
            ];
        }
        return $submenu;
    }


    protected function getGroupsPath(Group $group)
    {
        if ($group->id || $group->pid) {
            $this->path[] = ['name' => $this->_('USERS_AND_GROUPS'), 'href' => $this->url . '#groups'];
            if ($group->parents) {
                foreach ($group->parents as $row) {
                    $this->path[] = [
                        'name' => htmlspecialchars($row->name),
                        'href' => $this->url . '&id=' . (int)$row->id . '#groups'
                    ];
                }
            }
        }
    }
}
