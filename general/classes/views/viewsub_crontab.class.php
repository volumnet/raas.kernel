<?php
/**
 * Файл представления планировщика
 */
namespace RAAS\General;

use RAAS\Crontab;

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
        // foreach ($in['Item']->logs as $row) {
        //     $Set[] = $row;
        // }
        // $in['Table'] = new CrontabLogsTable(array_merge($in, [
        //     'ctxMenu' => 'getCrontabLogContextMenu',
        //     'Set' => $Set
        // ]));
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
     * @param array $in Входные данные
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
     * Возвращает контекстное меню для задачи
     * @param Crontab $field Задача для получения контекстного меню
     * @param int $i Порядок задачи в списке
     * @param int $c Количество задач в списке
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
            $edit = ($this->action == 'edit');
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
