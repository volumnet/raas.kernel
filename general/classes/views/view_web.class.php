<?php
namespace RAAS\General;

use RAAS\Application;
use RAAS\IRightsContext;
use RAAS\Package_View_Web;

class View_Web extends Package_View_Web
{
    protected static $instance;

    public function __set($var, $val)
    {
        if ($var == 'template' && !strstr($val, '/')) {
            $val = './' . $val;
        }
        parent::__set($var, $val);
    }


    public function tmp($file)
    {
        if (!strstr($file, '/')) {
            $file = './' . $file;
        }
        return parent::tmp($file);
    }


    public function header()
    {
        $this->menu[] = array(
            'name' => $this->_('HOME'), 'href' => '?p=/&sub=main', 'active' => ((!$this->nav || (array_keys($this->nav) == array('p'))) ? true : null)
        );
        if ($this->model->user->canAdminUsers) {
            $this->menu[] = array('name' => $this->_('USERS_AND_GROUPS'), 'href' => '?mode=admin&sub=users');
        }
        if ($this->model->user->root) {
            $this->menu[] = array('name' => $this->_('MODULES'), 'href' => '?mode=admin&sub=modules');
            $this->menu[] = array('name' => $this->_('BACKUP_SQL'), 'href' => '?mode=admin&sub=backup&action=sql');
            $this->menu[] = array('name' => $this->_('BACKUP_FILES'), 'href' => '?mode=admin&sub=backup&action=files');
        }
    }


    public function main(array $IN)
    {
        $old = 0;
        $greetings = array(
            0 => 'GOODNIGHT', 4 => 'GOODMORNING', 12 => 'GOODAFTERNOON', 16 => 'GOODEVENING', 24 => 'GOODNIGHT'
        );
        foreach ($greetings as $key => $val) {
            if ($IN['CONTENT']['H'] >= $old && $IN['CONTENT']['H'] <= $key) {
                $this->title = $this->_($greetings[$old]);
            }
            $old = $key;
        }

        $IN['CONTENT']['MAIN'] = true;
        $this->assignVars($IN);
        $this->title = $this->title . (trim($this->model->user->first_name . ' ' . $this->model->user->second_name) ? ', ' . trim($this->model->user->first_name . ' ' . $this->model->user->second_name) : '');
        $this->template = 'greeting';
    }


    public function getContextURL(IRightsContext $Context)
    {
        return $this->model->controller->getContextURL($Context);
    }
}
