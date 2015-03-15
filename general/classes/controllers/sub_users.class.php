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
        $Form = new EditUserForm(array('Item' => $Item));
        $this->view->edit_user($Form->process());
    }
    

    private function edit_group()
    {
        $Item = new Group((int)$this->id);
        if (!$Item->id) {
            $Item->pid = isset($_GET['pid']) ? (int)$_GET['pid'] : 0;
        }
        $Form = new EditGroupForm(array('Item' => $Item));
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
        $Form = new EditRightsForm(array_merge(array('Item' => $Item, 'Context' => $Context), $IN));
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
        $Form = new EditRightsForm(array_merge(array('Item' => $Item, 'Context' => $Context), $IN));
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