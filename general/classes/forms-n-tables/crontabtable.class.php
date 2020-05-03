<?php
/**
 * Таблица задач планировщика
 */
namespace RAAS\General;

use RAAS\Table;

/**
 * Класс таблицы задач планировщика
 */
class CrontabTable extends Table
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
                        return '<a href="' . $this->view->url . '&id=' . (int)$item->id . '">' .
                                  '<span' . (!$item->vis ? ' class="muted"' : '') . '>' .
                                     (int)$item->id .
                                  '</span>' .
                               '</a>';
                    }
                ],
                'name' => [
                    'caption' => $this->view->_('NAME'),
                    'callback' => function ($item) {
                        return '<a href="' . $this->view->url . '&id=' . (int)$item->id . '">' .
                                  '<span' . (!$item->vis ? ' class="muted"' : '') . '>' .
                                     htmlspecialchars($item->name) .
                                  '</span>' .
                               '</a>';
                    }
                ],
                'processing' => [
                    'caption' => $this->view->_('IS_PROCESSING_NOW'),
                    'callback' => function ($item) {
                        if (strtotime($item->start_time) > 0) {
                            return '<span class="text-success fa fa-circle" title="' . date($this->view->_('DATETIMEFORMAT')) . '"></span>';
                        }
                        return '';
                    }
                ],
                'priority' => [
                    'caption' => $this->view->_('PRIORITY'),
                    'callback' => function ($item, $i) {
                        return '<input type="number" name="priority[' . (int)$item->id . ']" value="' . (($i + 1) * 10) . '" class="span1" min="0" />';
                    }
                ],
                ' ' => [
                    'callback' => function ($item, $i) use ($ctxMenu, $params) {
                        return rowContextMenu(
                            $this->view->getCrontabContextMenu(
                                $item,
                                $i,
                                count($params['Set'])
                            )
                        );
                    }
                ],
            ],
            'caption' => $this->view->_('CRONTAB'),
            'emptyString' => $this->view->_('NO_NOTES_FOUND'),
            'template' => 'prioritytable.tmp.php'
        );
        parent::__construct(array_merge($defaultParams, $params));
    }
}
