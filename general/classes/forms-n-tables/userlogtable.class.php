<?php
/**
 * Таблица задач пользовательских логов
 */
namespace RAAS\General;

use RAAS\Table;

/**
 * Класс таблицы задач пользовательских логов
 */
class UserLogTable extends Table
{
    protected $_view;

    public function __get($var)
    {
        switch ($var) {
            case 'view':
                return ViewSub_UserLog::i();
                break;
            default:
                return parent::__get($var);
                break;
        }
    }


    public function __construct(array $params = [])
    {
        $view = $this->view;
        unset($params['view']);
        $defaultParams = array(
            'columns' => [
                'login' => [
                    'caption' => $this->view->_('LOGIN'),
                    'callback' => function ($row) use ($view) {
                        return '<a href="?p=/&mode=admin&sub=users&action=edit_user&id=' . (int)$row->uid . '">' .
                                  htmlspecialchars($row->user->login) .
                               '</a>';
                    }
                ],
                'postDate' => [
                    'caption' => $this->view->_('DATETIME'),
                    'callback' => function ($item) {
                        $t = strtotime($item->postDate);
                        if ($t > 0) {
                            return date($this->view->_('DATETIMEFORMAT'), $t);
                        }
                    }
                ],
                'ip' => [
                    'caption' => $this->view->_('IP'),
                ],
                'method' => [
                    'caption' => $this->view->_('HTTP_METHOD')
                ],
                'package' => [
                    'caption' => $this->view->_('PACKAGE'),
                    'callback' => function ($item) {
                        return $item->package;
                    }
                ],
                'module' => [
                    'caption' => $this->view->_('MODULE'),
                    'callback' => function ($item) {
                        return $item->module;
                    }
                ],
                'sub' => [
                    'caption' => $this->view->_('SUB'),
                    'callback' => function ($item) {
                        return $item->sub;
                    }
                ],
                'actionName' => [
                    'caption' => $this->view->_('ACTION'),
                    'callback' => function ($item) {
                        return $item->actionName;
                    }
                ],
                'elementId' => [
                    'caption' => $this->view->_('ELEMENT_ID'),
                    'callback' => function ($item) {
                        return $item->elementId ?: '';
                    }
                ],
            ],
            'caption' => $this->view->_('USER_LOG'),
            'emptyString' => $this->view->_('NO_NOTES_FOUND'),
            'template' => 'userlog.tmp.php'
        );
        parent::__construct(array_merge($defaultParams, $params));
    }
}
