<?php
/**
 * Файл класса представления подмодуля резервного копирования
 */
namespace RAAS\General;

use DateTime;
use RAAS\Abstract_Sub_View;
use RAAS\Backup;

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
     * Редактирование резервной копии
     */
    public function edit(array $in = [])
    {
        $this->path[] = array('name' => $this->_('BACKUPS'), 'href' => $this->url);
        $this->stdView->stdEdit($in, 'getBackupContextMenu');
        $this->subtitle = $this->getBackupSubtitle($in['Item']);
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
            'name' => $this->_('ADD_DB_BACKUP'),
            'href' => $this->url . '&action=add_sql',
            'icon' => 'plus'
        ];
        $arr[] = [
            'name' => $this->_('ADD_FULL_FILES_BACKUP'),
            'href' => $this->url . '&action=add_files',
            'icon' => 'plus'
        ];
        $arr[] = [
            'name' => $this->_('ADD_INCREMENTAL_FILES_BACKUP'),
            'href' => $this->url . '&action=add_inc_files',
            'icon' => 'plus'
        ];
        $arr[] = [
            'name' => $this->_('DOWNLOAD_DB_BACKUP'),
            'href' => $this->url . '&action=sql',
            'icon' => 'download'
        ];
        $arr[] = [
            'name' => $this->_('DOWNLOAD_FILES_BACKUP'),
            'href' => $this->url . '&action=files',
            'icon' => 'download'
        ];
        return $arr;
    }


    /**
     * Возвращает контекстное меню для резервной копии
     * @param Backup $backup Резервная копия
     * @return array<[
     *             'href' ?=> string Ссылка,
     *             'name' => string Заголовок пункта
     *             'icon' ?=> string Наименование иконки,
     *             'title' ?=> string Всплывающая подсказка
     *             'onclick' ?=> string JavaScript-команда при клике,
     *         ]>
     */
    public function getBackupContextMenu(Backup $backup)
    {
        $arr = [];
        $showlist = ($this->action == '');

        $arr[] = [
            'href' => $this->url . '&action=restore&id=' . $backup->id,
            'name' => $this->_('RESTORE'),
            'icon' => 'refresh',
            'onclick' => 'return confirm(\'' .
                         $this->_('RESTORE_TEXT') .
                         '\')'
        ];
        $arr[] = [
            'href' => $backup->fileURL,
            'name' => $this->_('DOWNLOAD'),
            'icon' => 'download',
        ];
        if (mb_strtolower(pathinfo($backup->filename, PATHINFO_EXTENSION)) == 'gz') {
            $arr[] = [
                'href' => $this->url . '&action=download_uncompressed&id=' . $backup->id,
                'name' => $this->_('DOWNLOAD_UNCOMPRESSED'),
                'icon' => 'download',
            ];
        }
        if ($backup->id) {
            $edit = ($this->action == 'edit');
            if (!$edit) {
                $arr[] = [
                    'href' => $this->url . '&action=edit&id=' . $backup->id,
                    'name' => $this->_('EDIT'),
                    'icon' => 'pencil',
                ];
            }
        }
        $arr[] = [
            'href' => $this->url . '&action=delete&id=' . $backup->id
                   .  ($showlist ? '&back=1' : ''),
            'name' => $this->_('DELETE'),
            'icon' => 'remove',
            'onclick' => 'return confirm(\'' .
                         $this->_('DELETE_TEXT') .
                         '\')'
        ];
        return $arr;
    }

    /**
     * Получает подзаголовок резервной копии
     * @param Backup $backup Резервная копия для получения
     * @return string HTML-код подзаголовка
     */
    public function getBackupSubtitle(Backup $backup)
    {
        $subtitleArr = [];
        if ($backup->id) {
            $subtitleArr[] = $this->_('ID') . ': '
                           . htmlspecialchars($backup->id);
            $subtitleArr[] = $this->_('TYPE') . ': ' . htmlspecialchars(
                $this->_(
                    'BACKUP_TYPE_' .
                    mb_strtoupper(str_replace('-', '_', $backup->type))
                )
            );
            $dt = DateTime::createFromFormat('Y-m-d H-i-s', $backup->postDate);
            $subtitleArr[] = $this->_('DATETIME') . ': ' . $dt->format(
                $this->_('DATETIMEFORMAT')
            );
            $sizesPrefixes = [
                $this->_('FILESIZE_BYTES'),
                $this->_('FILESIZE_KBYTES'),
                $this->_('FILESIZE_MBYTES'),
                $this->_('FILESIZE_GBYTES')
            ];
            $filesize = (int)@filesize($backup->filepath);
            $sizelog = floor(log10($filesize) / 3);
            $subtitleArr[] = $this->_('SIZE') . ': '
                           . '<a href="' . htmlspecialchars($backup->fileURL) . '" target="_blank">'
                           .    round($filesize / pow(10, ($sizelog * 3)), 1)
                           .    $sizesPrefixes[$sizelog]
                           . '</a>';
            return implode('; ', $subtitleArr);
        }
        return '';
    }
}
