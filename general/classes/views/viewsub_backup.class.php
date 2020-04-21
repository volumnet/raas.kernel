<?php
/**
 * Файл класса представления подмодуля резервного копирования
 */
namespace RAAS\General;

use RAAS\Abstract_Sub_View;
use RAAS\Application;
use RAAS\Level;
use RAAS\IRightsContext;
use RAAS\Table;
use RAAS\Column;
use RAAS\Module;
use RAAS\Package as AbstractPackage;

/**
 * Класс представления подмодуля резервного копирования
 * @property-read string $url Текущий URL
 */
class ViewSub_Backup extends Abstract_Sub_View
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
     * Просмотр списка резервных копий
     */
    public function showlist(array $in = [])
    {
        $view = $this;
        $in['Table'] = new BackupsTable($in);
        $this->assignVars($in);
        $this->title = $this->_('BACKUPS');
        $this->template = $in['Table']->template;
        $this->contextmenu = $this->getBackupsContextMenu();
    }


    /**
     * Возвращает контекстное меню для списка резервных копий
     * @return array<[
     *             'href' ?=> string Ссылка,
     *             'name' => string Заголовок пункта
     *             'icon' ?=> string Наименование иконки,
     *             'title' ?=> string Всплывающая подсказка
     *             'onclick' ?=> string JavaScript-команда при клике,
     *         ]>
     */
    public function getBackupsContextMenu()
    {
        $arr = [];
        $arr[] = [
            'name' => $this->_('ADD'),
            'href' => $this->url . '&action=edit',
            'icon' => 'plus'
        ];
        $arr[] = [
            'name' => $this->_('DOWNLOAD_DB_BACKUP'),
            'href' => $this->url . '&action=sql',
            'icon' => 'list-alt'
        ];
        $arr[] = [
            'name' => $this->_('DOWNLOAD_FILES_BACKUP'),
            'href' => $this->url . '&action=files',
            'icon' => 'hdd'
        ];
        return $arr;
    }
}
