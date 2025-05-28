<?php
/**
 * Файл представления диспетчера задач
 */
namespace RAAS\General;

use SOME\Pages;
use RAAS\Application;

/**
 * Класс представления диспетчера задач
 */
class ViewSub_Processes extends \RAAS\Abstract_Sub_View
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
     *     'Set' => array[]
     * ]</pre>
     */
    public function showlist(array $in = [])
    {
        $in['Table'] = new ProcessesTable($in);
        $this->assignVars($in);
        $this->title = $in['Table']->caption;
        if (Application::i()->registryGet('allowReboot') && !stristr(PHP_OS, 'win')) {
            $this->contextmenu = [
                [
                    'href' => $this->url . '&action=reboot',
                    'name' => $this->_('REBOOT'),
                    'icon' => 'refresh'
                ]
            ];
        }
        $this->template = $in['Table']->template;
    }


    /**
     * Перезагрузка системы
     */
    public function reboot(array $in = [])
    {
        $this->assignVars($in);
        $this->path[] = array('name' => $this->_('PROCESSES'), 'href' => $this->url);
        $this->title = $in['Form']->caption;
        $this->template = $in['Form']->template;
    }

    /**
     * Возвращает контекстное меню для задачи
     * @param array $item Задача для получения контекстного меню
     * @return array<[
     *             'href' ?=> string Ссылка,
     *             'name' => string Заголовок пункта
     *             'icon' ?=> string Наименование иконки,
     *             'title' ?=> string Всплывающая подсказка
     *             'onclick' ?=> string JavaScript-команда при клике,
     *         ]>
     */
    public function getProcessContextMenu(array $item)
    {
        $arr = [[
            'name' => $this->_('STOP_COMMAND'),
            'href' => $this->url . '&action=delete&id='
                   .  (int)($item['pid'] ?? 0) . '&back=1',
            'onclick' => 'return confirm(\'' . $this->_('DELETE_PROCESS_HINT') . '\')',
            'icon' => 'stop',
        ]];
        return $arr;
    }
}
