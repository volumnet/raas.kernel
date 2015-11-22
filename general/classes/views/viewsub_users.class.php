<?php
namespace RAAS\General;
use \RAAS\User as User;
use \RAAS\Group as Group;
use \RAAS\Level as Level;
use \RAAS\IContext as IContext;
use \RAAS\IRightsContext as IRightsContext;
use \RAAS\Table as Table;
use \RAAS\Column as Column;
use \RAAS\Row as Row;
use \RAAS\View_StdSub as View_StdSub;

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

    
    public function edit_user(array $IN = array())
    {
        if ($this->sub == 'users') {
            $this->path[] = array('name' => $this->_('USERS_AND_GROUPS'), 'href' => $this->url);
            $this->submenu = $this->getGroupsMenu(new Group(), new Group());
        }
        $this->stdView->stdEdit($IN, ($IN['Item']->id && $this->application->user->root) ? 'getUserContextMenu' : '');
    }
    
    
    public function edit_group(array $IN = array())
    {
        $this->getGroupsPath($IN['Item']);
        $this->submenu = $this->getGroupsMenu(new Group(), $IN['Item']->parent);
        $this->stdView->stdEdit($IN, 'getGroupContextMenu');
    }
    

    public function user_rights(array $IN = array())
    {
        $this->path[] = array('name' => $this->_('USERS_AND_GROUPS'), 'href' => $this->url);
        $this->path[] = array(
            'name' => htmlspecialchars($IN['Item']->full_name ? $IN['Item']->full_name : $IN['Item']->login), 
            'href' => $this->url . '&action=edit_user&id=' . (int)$IN['Item']->id . '#rights'
        );
        $this->submenu = $this->getGroupsMenu(new Group(), new Group());
        $this->contextmenu = $this->getUserRightsContextMenu($IN['Item'], $IN['Context']);
        $this->stdView->stdEdit($IN);
   }
    

    public function group_rights(array $IN = array())
    {
        $this->getGroupsPath($IN['Item']);
        $this->path[] = array('name' => htmlspecialchars($IN['Item']->name), 'href' => $this->url . '&action=edit_group&id=' . (int)$IN['Item']->id . '#rights');
        $this->submenu = $this->getGroupsMenu(new Group(), $IN['Item']->parent);
        $this->contextmenu = $this->getGroupRightsContextMenu($IN['Item'], $IN['Context']);
        $this->stdView->stdEdit($IN);
    }


    public function showlist(array $IN = array())
    {
        $view = $this;
        $IN['UsersTable'] = new UsersTable(array(
            'Group' => $IN['Group'], 
            'Set' => $IN['CONTENT']['Set'], 
            'Pages' => $IN['CONTENT']['Pages'], 
            'sort' => $IN['CONTENT']['sort'], 
            'order' => $IN['CONTENT']['order']
        ));

        $IN['GroupsTable'] = new GroupsTable(array('Set' => $IN['CONTENT']['GSet']));

        $this->assignVars($IN);
        $this->getGroupsPath($IN['Group']);
        $this->submenu = $this->getGroupsMenu(new Group(), $IN['Group']);
        $this->contextmenu[] = array(
            'href' => $this->url . '&action=edit_user' . ((int)$IN['Group']->id ? '&pid=' . (int)$IN['Group']->id : ''), 
            'name' => $this->_('ADD_USER2'),
            'icon' => 'plus'
        );
        $this->contextmenu[] = array(
            'href' => $this->url . '&action=edit_group' . ((int)$IN['Group']->id ? '&pid=' . (int)$IN['Group']->id : ''), 
            'name' => $this->_('ADD_GROUP2'),
            'icon' => 'plus'
        );
        if ($IN['Group']->id) {
            $this->contextmenu[] = array(
                'href' => $this->url . '&action=edit_group&id=' . (int)$IN['Group']->id, 'name' => $this->_('EDIT_GROUP2'), 'icon' => 'edit'
            );
            $this->contextmenu[] = array(
                'href' => $this->url . '&action=delete_group&id=' . (int)$IN['Group']->id, 
                'name' => $this->_('DELETE_GROUP'),
                'icon' => 'remove', 
                'onclick' => "return confirm('" . $this->_('DELETE_GROUP_TEXT') . "')"
            );
        }
        $this->title = $IN['Group']->id ? htmlspecialchars($IN['Group']->name) : $this->_('USERS_AND_GROUPS');
        $this->template = 'admin_users_showlist';
    }
    
    
    public function getUserContextMenu(User $Item, Group $Group = null) 
    {
        $arr = array();
        if ($Item->id) {
            $edit = ($this->action == 'edit_user');
            $edit2 = ($this->action == 'edit');
            if (!$edit && !$edit2) {
                $arr[] = array('href' => $this->url . '&action=edit_user&id=' . (int)$Item->id, 'name' => $this->_('EDIT'), 'icon' => 'edit');
            }
            if (isset($Group->id) && $Group->id) {
                if (in_array($Group->id, $Item->groups_ids)) {
                    $arr[] = array(
                        'href' => $this->url . '&action=del_group&id=' . (int)$Item->id . '&gid=' . (int)$Group->id . ($edit ? '' : '&back=1'), 
                        'name' => $this->_('DELETE_FROM_GROUP'), 
                        'icon' => 'remove-circle'
                    );
                } else {
                    $arr[] = array(
                        'href' => $this->url . '&action=add_group&id=' . (int)$Item->id . '&gid=' . (int)$Group->id . ($edit ? '' : '&back=1'), 
                        'name' => $this->_('ADD_TO_GROUP'), 
                        'icon' => 'ok-circle'
                    );
                }
            }
            if ($Item->id != $this->application->user->id) {
                $arr[] = array(
                    'href' => $this->url . '&action=delete_user&id=' . (int)$Item->id . ($edit ? '' : '&back=1'), 
                    'name' => $this->_('DELETE'), 
                    'icon' => 'remove', 
                    'onclick' => 'return confirm(\'' . $this->_('DELETE_USER_TEXT') . '\')'
                  );
            }
        }
        return $arr;
    }
    

    public function getGroupContextMenu(Group $Item)
    {
        return $this->stdView->stdContextMenu($Item, 0, 0, 'edit_group', '', 'delete_group');
    }
    

    public function getUserRightsContextMenu(User $Item, IRightsContext $Context)
    {
        $arr = array();
        if ($Item->id && $Context->hasRights && ($Item->id != $this->application->user->id)) {
            $edit = ($this->action == 'user_rights');
            if (!$edit) {
                $arr[] = array(
                    'name' => $this->_('EDIT_RIGHTS'), 'href' => $this->url . $this->getContextURL($Context) . '&action=user_rights&id=' . (int)$Item->id, 'icon' => 'lock'
                );
            }
            if ($Item->access($Context)->selfRights) {
                $arr[] = array(
                    'name' => $this->_('DELETE_RIGHTS'), 
                    'href' => $this->url . $this->getContextURL($Context) . '&action=delete_user_rights&id=' . (int)$Item->id . ($edit ? '' : '&back=1'),
                    'icon' => 'remove',
                    'onclick' => 'return confirm(\'' . $this->_('DELETE_RIGHTS_TEXT') . '\')'
                );
            }
        }
        return $arr;
    }
    

    public function getGroupRightsContextMenu(Group $Item, IRightsContext $Context)
    {
        $arr = array();
        if ($Context->hasRights) {
            $edit = ($this->action == 'group_rights');
            if (!$edit) {
                $arr[] = array(
                    'name' => $this->_('EDIT_RIGHTS'), 'href' => $this->url . $this->getContextURL($Context) . '&action=group_rights&id=' . (int)$Item->id, 'icon' => 'lock'
                );
            }
            if ($Item->access($Context)->selfRights) {
                $arr[] = array(
                    'name' => $this->_('DELETE_RIGHTS'), 
                    'href' => $this->url . $this->getContextURL($Context) . '&action=delete_group_rights&id=' . (int)$Item->id . ($edit ? '' : '&back=1'),
                    'icon' => 'remove',
                    'onclick' => 'return confirm(\'' . $this->_('DELETE_RIGHTS_TEXT') . '\')'
                );
            }
        }
        return $arr;
    }


    private function getGroupsMenu(Group $node, Group $current)
    {
        $submenu = array();
        foreach ($node->children as $row) {
            $submenu[] = array('name' => htmlspecialchars($row->name), 'href' => $this->url . '&id=' . (int)$row->id, 'submenu' => $this->getGroupsMenu($row, $current));
        }
        return $submenu;
    }
    

    private function getGroupsPath(Group $Group)
    {
        if ($Group->id || $Group->pid) {
            $this->path[] = array('name' => $this->_('USERS_AND_GROUPS'), 'href' => $this->url . '#groups');
            if ($Group->parents) {
                foreach ($Group->parents as $row) {
                    $this->path[] = array('name' => htmlspecialchars($row->name), 'href' => $this->url . '&id=' . (int)$row->id . '#groups');
                }
            }
        }
    }
}