<?php
/**
 * @package RAAS
 */
namespace RAAS;

use SOME\SOME;

/**
 * Лог задачи планировщика
 * @property Crontab $parent Задача
 * @property-read Attachment $file Файл лога
 */
class CrontabLog extends SOME
{
    protected static $tablename = 'crontab_logs';

    protected static $defaultOrderBy = "post_date";

    protected static $references = [
        'parent' => [
            'FK' => 'pid',
            'classname' => Crontab::class,
            'cascade' => true
        ],
        'file' => [
            'FK' => 'attachment_id',
            'classname' => Attachment::class,
            'cascade' => false,
        ]
    ];


    public function commit()
    {
        if ($this->post_date) {
            $this->post_date = date('Y-m-d H:i:s');
        }
        parent::commit();
    }


    public static function delete(SOME $item)
    {
        if ($item->file->id) {
            Attachment::delete($item->file);
        }
        parent::delete($item);
    }
}
