<?php
/**
 * Файл класса абстрактной резервной копии
 */
namespace RAAS;

use SOME\SOME;

/**
 * Класс абстрактной резервной копии
 * @property-read Attachment $attachment Вложение резервной копии
 */
abstract class Backup extends SOME
{
    protected static $tablename = 'backups';

    protected static $references = [
        'attachment' => [
            'FK' => 'attachment_id',
            'classname' => Attachment::class,
            'cascade' => true
        ],
    ];

    public function commit()
    {
    }
}
