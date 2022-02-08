<?php
/**
 * Файл представления планировщика
 */
namespace RAAS\General;

use SOME\Pages;
use RAAS\Crontab;
use RAAS\CrontabLog;

/**
 * Класс представления планировщика
 */
class ViewSub_Crontab extends \RAAS\Abstract_Sub_View
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
     * Редактирование задачи
     * @param array $in <pre>[
     *     'Item' => Crontab,
     *     'Form' => CrontabEditForm
     * ]</pre> Входные данные
     */
    public function edit(array $in = [])
    {
        $Set = [];
        $this->assignVars($in);
        $this->path[] = array('name' => $this->_('CRONTAB'), 'href' => $this->url);
        $this->title = $in['Form']->caption;
        $this->template = $in['Form']->template;
        $this->js[] = $this->publicURL . '/edit_crontab.js';
        $this->contextmenu = $this->getCrontabContextMenu($in['Item']);
        $this->subtitle = $this->getCrontabSubtitle($in['Item']);
    }


    /**
     * Список задач
     * @param array $in <pre>[
     *     'Set' => Crontab[]
     * ]</pre>
     */
    public function showlist(array $in = [])
    {
        $in['Table'] = new CrontabTable($in);
        $this->assignVars($in);
        $this->title = $in['Table']->caption;
        $this->contextmenu = [
            [
                'href' => $this->url . '&action=edit',
                'name' => $this->_('ADD_TASK'),
                'icon' => 'plus'
            ]
        ];
        $this->template = $in['Table']->template;
    }


    /**
     * Просмотр задачи
     * @param array $in <pre>[
     *     'Item' => Crontab Задача,
     *     'Set' => CrontabLog[] Список логов,
     *     'Pages' => Pages Постраничная разбивка
     * ]</pre>
     */
    public function showTask(array $in = [])
    {
        $in['Table'] = new CrontabLogsTable($in);
        $this->assignVars($in);
        $this->path[] = array('name' => $this->_('CRONTAB'), 'href' => $this->url);
        $this->title = $in['Table']->caption;
        $this->contextmenu = $this->getCrontabContextMenu($in['Item']);
        $this->subtitle = $this->getCrontabSubtitle($in['Item']);
        $this->template = $in['Table']->template;
        $this->js[] = $this->publicURL . '/multitable.js';
    }


    /**
     * Возвращает контекстное меню для задачи
     * @param Crontab $item Задача для получения контекстного меню
     * @return array<[
     *             'href' ?=> string Ссылка,
     *             'name' => string Заголовок пункта
     *             'icon' ?=> string Наименование иконки,
     *             'title' ?=> string Всплывающая подсказка
     *             'onclick' ?=> string JavaScript-команда при клике,
     *         ]>
     */
    public function getCrontabContextMenu(Crontab $item)
    {
        $arr = [];
        if ($item->id) {
            $view = (($this->action == '') && $this->nav['id']);
            $edit = ($this->action == 'edit');
            $t = strtotime($item->start_time);
            if (!$view) {
                $arr[] = [
                    'href' => $this->url . '&id=' . (int)$item->id,
                    'name' => $this->_('LOGS'),
                    'icon' => 'th-list'
                ];
            }
            if (!$edit) {
                $arr[] = [
                    'href' => $this->url . '&action=edit&id=' . (int)$item->id,
                    'name' => $this->_('EDIT'),
                    'icon' => 'edit'
                ];
            }
            $arr[] = [
                'name' => $item->vis
                       ?  $this->_('ACTIVE')
                       :  '<span class="muted">' . $this->_('INACTIVE') . '</span>',
                'href' => $this->url . '&action=chvis&id='
                       .  (int)$item->id . '&back=1',
                'icon' => $item->vis ? 'ok' : '',
                'title' => $this->_($item->vis ? 'TURN_OFF' : 'TURN_ON')
            ];
            if ($t > 0) {
                $arr[] = [
                    'name' => $this->_('STOP_COMMAND'),
                    'href' => $this->url . '&action=reset&id='
                           .  (int)$item->id . '&back=1',
                    'icon' => 'stop',
                ];
            } else {
                $arr[] = [
                    'name' => $this->_('RUN_COMMAND'),
                    'href' => $this->url . '&action=run&id='
                           .  (int)$item->id . '&back=1',
                    'icon' => 'play',
                ];
            }
            $arr[] = [
                'href' => $this->url . '&action=delete_log&id=all&pid=' . (int)$item->id . '&back=1',
                'name' => $this->_('CLEAR_LOGS'),
                'icon' => 'remove-circle',
                'onclick' => 'return confirm(\'' . $this->_('CLEAR_LOGS_TEXT') . '\')'
            ];
            $arr[] = [
                'href' => $this->url . '&action=delete&id=' . (int)$item->id . ($edit ? '' : '&back=1'),
                'name' => $this->_('DELETE'),
                'icon' => 'remove',
                'onclick' => 'return confirm(\'' . $this->_('DELETE_TEXT') . '\')'
            ];
        }
        return $arr;
    }


    /**
     * Возвращает контекстное меню для лога задачи
     * @param CrontabLog $item Задача для получения контекстного меню
     * @return array<[
     *             'href' ?=> string Ссылка,
     *             'name' => string Заголовок пункта
     *             'icon' ?=> string Наименование иконки,
     *             'title' ?=> string Всплывающая подсказка
     *             'onclick' ?=> string JavaScript-команда при клике,
     *         ]>
     */
    public function getCrontabLogContextMenu(CrontabLog $item)
    {
        $arr = [];
        if ($item->id) {
            $arr[] = [
                'href' => $item->file->fileURL,
                'target' => '_blank',
                'name' => $this->_('VIEW'),
                'icon' => 'search'
            ];
            $arr[] = [
                'href' => $this->url . '&action=delete_log&id=' . (int)$item->id . '&back=1',
                'name' => $this->_('DELETE'),
                'icon' => 'remove',
                'onclick' => 'return confirm(\'' . $this->_('DELETE_TEXT') . '\')'
            ];
        }
        return $arr;
    }


    /**
     * Возвращает контекстное меню для списка логов задачи
     * @return array<[
     *             'href' ?=> string Ссылка,
     *             'name' => string Заголовок пункта
     *             'icon' ?=> string Наименование иконки,
     *             'title' ?=> string Всплывающая подсказка
     *             'onclick' ?=> string JavaScript-команда при клике,
     *         ]>
     */
    public function getAllCrontabLogsContextMenu()
    {
        $arr = [];
        $arr[] = [
            'name' => $this->_('DELETE'),
            'href' => $this->url . '&action=delete_log&back=1',
            'icon' => 'remove',
            'onclick' => 'return confirm(\''
                      .  $this->_('DELETE_MULTIPLE_TEXT')
                      .  '\')'
        ];
        return $arr;
    }


    /**
     * Получает подзаголовок задачи
     * @param Crontab $crontab Задача для получения
     * @return string HTML-код подзаголовка
     */
    public function getCrontabSubtitle(Crontab $crontab)
    {
        $subtitleArr = [];
        if ($crontab->id) {
            $subtitleArr[] = $this->_('ID') . ': ' . (int)$crontab->id;
            return implode('; ', $subtitleArr);
        }
        return '';
    }
}
