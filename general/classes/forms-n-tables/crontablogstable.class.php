<?php
/**
 * Таблица логов задачи планировщика
 */
namespace RAAS\General;

use RAAS\Table;

/**
 * Класс таблицы логов задачи планировщика
 */
class CrontabLogsTable extends Table
{
    protected $_view;

    public function __get($var)
    {
        switch ($var) {
            case 'view':
                return ViewSub_Crontab::i();
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
                'id' => [
                    'caption' => $this->view->_('ID'),
                    'callback' => function ($item) {
                        return '<a href="/' . $item->file->fileURL . '" target="_blank">' .
                                 (int)$item->id .
                               '</a>';
                    }
                ],
                'post_date' => [
                    'caption' => $this->view->_('NAME'),
                    'callback' => function ($item) {
                        return '<a href="/' . $item->file->fileURL . '" target="_blank">' .
                                  date($this->view->_('DATETIMEFORMAT'), strtotime($item->post_date)) .
                               '</a>';
                    }
                ],
                ' ' => [
                    'callback' => function ($item) {
                        return rowContextMenu(
                            $this->view->getCrontabLogContextMenu($item)
                        );
                    }
                ],
            ],
            'template' => 'multitable.tmp.php',
            'caption' => $params['Item']->name . ':  ' . $this->view->_('LOGS'),
            'emptyString' => $this->view->_('NO_NOTES_FOUND'),
            'data-role' => 'multitable',
            'meta' => [
                'allContextMenu' => $view->getAllCrontabLogsContextMenu(),
                'allValue' => 'all&pid=' . (int)$params['Item']->id,
            ],
        );
        parent::__construct(array_merge($defaultParams, $params));
    }
}
