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
                return ViewSub_Backup::i();
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
                        return '<a href="' . htmlspecialchars($item->fileURL) . '" target="_blank">' .
                                  htmlspecialchars($item->id) .
                               '</a>';
                    },
                ],
                'post_date' => [
                    'caption' => $this->view->_('DATETIME'),
                    'callback' => function ($item) {
                        return '<a href="' . htmlspecialchars($item->fileURL) . '" target="_blank">' .
                                  $item->dateTime->format($this->view->_('DATETIMEFORMAT')) .
                               '</a>';
                    },
                ],
                'type' => [
                    'caption' => $this->view->_('TYPE'),
                    'callback' => function ($item) {
                        return '<a href="' . htmlspecialchars($item->fileURL) . '" target="_blank">' .
                                  htmlspecialchars($this->view->_('BACKUP_TYPE_' . mb_strtoupper(str_replace('-', '_', $item->type)))) .
                               '</a>';
                    },
                ],
                'name' => [
                    'caption' => $this->view->_('NAME'),
                    'callback' => function ($item) {
                        return '<a href="' . htmlspecialchars($item->fileURL) . '" target="_blank">' .
                                  htmlspecialchars($item->name) .
                               '</a>';
                    },
                ],
                'preserveFromDeletion' => [
                    'caption' => $this->view->_('PRESERVE_FROM_DELETION'),
                    'callback' => function ($item) {
                        return ($item->preserveFromDeletion ? '<span class="fa fa-check"></span>' : '');
                    },
                ],
                'size' => [
                    'caption' => $this->view->_('SIZE'),
                    'callback' => function ($item) {
                        $sizesPrefixes = [
                            $this->view->_('FILESIZE_BYTES'),
                            $this->view->_('FILESIZE_KBYTES'),
                            $this->view->_('FILESIZE_MBYTES'),
                            $this->view->_('FILESIZE_GBYTES')
                        ];
                        $filesize = (int)@filesize($item->filepath);
                        $sizelog = floor(log10($filesize) / 3);
                        return round($filesize / (pow(10, ($sizelog * 3)) ?: 1), 1) .
                               $sizesPrefixes[$sizelog];
                    },
                ],
                ' ' => [
                    'callback' => function ($item) {
                        return rowContextMenu($this->view->getBackupContextMenu($item));
                    }
                ]
            ],
            'caption' => $this->view->_('BACKUPS'),
            'emptyString' => $this->view->_('NO_BACKUPS_FOUND'),
        );
        $arr = array_merge($defaultParams, $params);
        parent::__construct($arr);
    }
}
