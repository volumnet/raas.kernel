<?php
/**
 * Файл представления пользовательских логов
 */
namespace RAAS\General;

use SOME\Pages;
use RAAS\Crontab;
use RAAS\CrontabLog;

/**
 * Класс представления пользовательских логов
 */
class ViewSub_UserLog extends \RAAS\Abstract_Sub_View
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


    /**
     * Список задач
     * @param array $in <pre>[
     *     'Set' => Crontab[]
     * ]</pre>
     */
    public function showlist(array $in = [])
    {
        $in['Table'] = new UserLogTable($in);
        $this->assignVars($in);
        $this->title = $in['Table']->caption;
        $this->template = $in['Table']->template;
    }
}
