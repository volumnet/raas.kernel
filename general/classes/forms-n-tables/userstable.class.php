<?php
namespace RAAS\General;
use \RAAS\Column;

class UsersTable extends \RAAS\Table
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


    public function __construct(array $params = array())
    {
        $view = $this->view;
        unset($params['view']);
        $columns = array();
        $columns['login'] = array(
            'caption' => $this->view->_('LOGIN'),
            'sortable' => Column::SORTABLE_REVERSABLE,
            'callback' => function($row) use ($view) { 
                return '<a href="' . $view->url . '&action=edit_user&id=' . (int)$row->id . '">' . htmlspecialchars($row->login) . '</a>'; 
            }
        );
        $columns['last_name'] = array(
            'caption' => $this->view->_('FULL_NAME'), 
            'sortable' => Column::SORTABLE_REVERSABLE, 
            'callback' => function($row) { 
                return $row->full_name; 
            }
        );
        $columns[' '] = array('callback' => function ($row) use ($view, $params) { return rowContextMenu($view->getUserContextMenu($row, $params['Group'])); });
        $defaultParams = array(
            'columns' => $columns, 
            'caption' => $this->view->_('USERS'),
            'callback' => function ($Row) use ($view) { if ($Row->source->root) { $Row->class = 'info'; $Row->title = $view->_('ADMINISTRATOR'); } },
            'Set' => $params['Set'],
            'Pages' => $params['Pages'],
            'sort' => $params['sort'] ? $params['sort'] : 'login',
            'order' => ($params['order'] == 'desc') ? Column::SORT_DESC : Column::SORT_ASC,
        );
        unset($params['columns'], $params['order']);
        $arr = array_merge($defaultParams, $params);
        parent::__construct($arr);
    }
}