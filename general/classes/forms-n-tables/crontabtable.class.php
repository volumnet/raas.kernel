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
                        $text = ' <div>
                                    <a href="' . $this->view->url . '&id=' . (int)$item->id . '">
                                      <span' . (!$item->vis ? ' class="muted"' : '') . '>
                                        ' . htmlspecialchars($item->name) . '
                                      </span>
                                    </a>
                                 <div class="muted" style="font-size: .75em">';
                        if ($item->command_classname) {
                            $text .= htmlspecialchars($item->command_classname . ' ' . $item->args);
                        } elseif ($item->command_line) {
                            $text .= htmlspecialchars($item->command_line);
                        }
                        $text .= '</div>';
                        return $text;
                    }
                ],
                'once' => [
                    'caption' => $this->view->_('LAUNCH_ONCE'),
                    'style' => 'text-align: center',
                    'callback' => function ($item) {
                        if ($item->once) {
                            return '<span class="fa fa-check"></span>';
                        }
                    },
                ],
                'minutes' => [
                    'caption' => $this->view->_('MINUTES')
                ],
                'hours' => [
                    'caption' => $this->view->_('HOURS')
                ],
                'days' => [
                    'caption' => $this->view->_('DAYS')
                ],
                'weekdays' => [
                    'caption' => $this->view->_('WEEKDAYS')
                ],
                'processing' => [
                    'caption' => $this->view->_('IS_PROCESSING_NOW'),
                    'callback' => function ($item) {
                        if (strtotime($item->start_time) > 0) {
                            $title = date($this->view->_('DATETIMEFORMAT'), strtotime($item->start_time));
                            if ($item->pid) {
                                $title .= '; PID#' . (int)$item->pid;
                            }
                            return '<span class="text-success fa fa-circle" title="' . $title . '"></span>';
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
