<?php
/**
 * Файл таблицы резервных копий
 */
namespace RAAS\General;

use RAAS\Table;

/**
 * Класс таблицы резервных копий
 * @param ViewSub_Users $view Представление
 */
class BackupsTable extends Table
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


    public function __construct(array $params = [])
    {
        $view = $this->view;
        unset($params['view']);
        $defaultParams = array(
            'columns' => [
                'post_date' => [
                    'caption' => $this->view->_('DATETIME'),
                    'callback' => function ($item) {
                        return date($this->view->_('DATETIMEFORMAT'), strtotime($item->post_date));
                    }
                ],
                'type' => [
                    'caption' => $this->view->_('TYPE'),
                    'callback' => function ($item) {
                        return htmlspecialchars($this->view->_('BACKUP_TYPE_' . mb_strtoupper(str_replace('-', '_', $item->type))));
                    }
                ],
                'name' => [
                    'caption' => $this->view->_('name'),
                    'callback' => function ($item) {
                        return htmlspecialchars($item->name);
                    }
                ],
                ' ' => [
                    'callback' => function ($item) {
                        return rowContextMenu($this->view->getBackupContextMenu($item));
                    }
                ]
            ],
            'caption' => $this->view->_('BACKUPS'),
            'Set' => $params['Set'],
            'Pages' => $params['Pages'],
        );
        $arr = array_merge($defaultParams, $params);
        parent::__construct($arr);
    }
}
