<?php
/**
 * Таблица процессов диспетчера задач
 */
namespace RAAS\General;

use RAAS\Table;

/**
 * Класс таблицы процессов диспетчера задач
 */
class ProcessesTable extends Table
{
    protected $_view;

    public function __get($var)
    {
        switch ($var) {
            case 'view':
                return ViewSub_Processes::i();
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
                        return '<span' . (!$item['process'] ? ' class="muted"' : '') . '>' .
                                  (int)$item['pid'] .
                               '</span>';
                    }
                ],
                'name' => [
                    'caption' => $this->view->_('NAME'),
                    'callback' => function ($item) {
                        $text = '<span' . (!$item['process'] ? ' class="muted"' : '') . '>
                                   ' . htmlspecialchars($item['file']) . '
                                 </span>';
                        return $text;
                    }
                ],
                'cpu' => [
                    'caption' => $this->view->_('CPU'),
                    'callback' => function ($item) {
                        if (isset($item['cpu%'])) {
                            $text = '<span' . (!$item['process'] ? ' class="muted"' : '') . '>
                                       ' . htmlspecialchars($item['cpu%']) . '%
                                     </span>';
                            return $text;
                        }
                    }
                ],
                'mem' => [
                    'caption' => $this->view->_('MEMORY'),
                    'callback' => function ($item) {
                        $val = '';
                        if (isset($item['mem%'])) {
                            $val = $item['mem%'] . '%';
                        } elseif ($item['mem%'] || $item['mem']) {
                            $val = number_format($item['mem%'], 0, '.', ' ')
                                 . $this->view->_('FILESIZE_KBYTES');
                        }
                        if ($val) {
                            $text = '<span' . (!$item['process'] ? ' class="muted"' : '') . ' style="white-space: nowrap">
                                       ' . htmlspecialchars($val) . '
                                     </span>';
                            return $text;
                        }
                    }
                ],
                'time' => [
                    'caption' => $this->view->_('TIME'),
                    'callback' => function ($item) {
                        if (isset($item['time'])) {
                            $text = '<span' . (!$item['process'] ? ' class="muted"' : '') . ' style="white-space: nowrap">
                                       ' . htmlspecialchars($item['time']) . '
                                     </span>';
                            return $text;
                        }
                    }
                ],
                'description' => [
                    'caption' => $this->view->_('DESCRIPTION'),
                    'callback' => function ($item) {
                        $text = '';
                        if ($process = $item['process']) {
                            $t = strtotime($process->post_date);
                            $text .= '<div>'
                                  .     date('Y-m-d H:i:s', $t)
                                  .     ': ';
                            if (stristr($process->query, '://')) {
                                $text .= '<a href="' . htmlspecialchars($process->query) . '" target="_blank">'
                                      .     htmlspecialchars($process->query)
                                      .  '</a>';
                            } else {
                                $text .= htmlspecialchars($process->query);
                            }
                            $text .= '</div>';
                            if ($process->ip) {
                                $text .= '<div style="font-size: .75em">
                                            <a href="https://www.nic.ru/whois/?searchWord=' . htmlspecialchars($process->ip) . '" target="_blank">
                                              ' . htmlspecialchars($process->ip) . '
                                            </a>'
                                      .     htmlspecialchars($process->user_agent)
                                      .  '</div>';
                            }
                        }
                        return $text;
                    },
                ],
                ' ' => [
                    'callback' => function ($item) {
                        return rowContextMenu(
                            $this->view->getProcessContextMenu(
                                $item
                            )
                        );
                    }
                ],
            ],
            'caption' => $this->view->_('PROCESSES'),
            'emptyString' => $this->view->_('NO_NOTES_FOUND'),
        );
        parent::__construct(array_merge($defaultParams, $params));
    }
}
