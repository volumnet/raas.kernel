<?php
namespace RAAS\General;

use RAAS\Application;
use RAAS\IRightsContext;
use RAAS\Package_View_Web;

class View_Web extends Package_View_Web
{
    protected static $instance;

    public function __get($var)
    {
        switch ($var) {
            case 'publicURL':
                if (stristr(
                    Application::i()->systemDir,
                    Application::i()->baseDir
                )) {
                    return mb_substr(
                        Application::i()->systemDir,
                        mb_strlen(Application::i()->baseDir)
                    ) . '/general/public/';
                } elseif (Application::i()->composer['name']) {
                    return '/vendor/' . Application::i()->composer['name']
                        . '/general/public';
                } else {
                    return '/vendor/volumnet/raas.kernel/general/public';
                }
                break;

            default:
                return parent::__get($var);
                break;
        }
    }


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
        $this->menu[] = [
            'name' => $this->_('HOME'),
            'href' => '?p=/&sub=main',
            'active' => (!$this->nav || (array_keys($this->nav) == ['p'])),
        ];
        if ($this->model->user->canAdminUsers) {
            $this->menu[] = [
                'name' => $this->_('USERS_AND_GROUPS'),
                'href' => '?mode=admin&sub=users'
            ];
        }
        if ($this->model->user->root) {
            $this->menu[] = [
                'name' => $this->_('MODULES'),
                'href' => '?mode=admin&sub=modules'
            ];
            $this->menu[] = [
                'name' => $this->_('BACKUPS'),
                'href' => '?mode=admin&sub=backup'
            ];
            $this->menu[] = [
                'name' => $this->_('CRONTAB'),
                'href' => '?mode=admin&sub=crontab'
            ];
            $this->menu[] = [
                'name' => $this->_('USER_LOG'),
                'href' => '?mode=admin&sub=user_log'
            ];
        }
    }


    public function main(array $IN)
    {
        $old = 0;
        $greetings = [
            0 => 'GOODNIGHT',
            4 => 'GOODMORNING',
            12 => 'GOODAFTERNOON',
            16 => 'GOODEVENING',
            24 => 'GOODNIGHT'
        ];
        foreach ($greetings as $key => $val) {
            if ($IN['CONTENT']['H'] >= $old && $IN['CONTENT']['H'] <= $key) {
                $this->title = $this->_($greetings[$old]);
            }
            $old = $key;
        }

        $IN['CONTENT']['MAIN'] = true;
        $this->assignVars($IN);
        $fullName = trim(
            Application::i()->user->first_name . ' ' .
            Application::i()->user->second_name
        );
        $this->title = $this->title . ($fullName ? (', ' . $fullName) : '');
        $this->template = 'greeting';
    }


    public function getContextURL(IRightsContext $Context)
    {
        return $this->model->controller->getContextURL($Context);
    }
}
