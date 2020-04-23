<?php
/**
 * Файл класса инкрементарной резервной копии файлов
 */
namespace RAAS;

use SOME\File;
use SOME\ZipArchive;

/**
 * Класс инкрементарной резервной копии файлов
 */
class FilesIncBackup extends FilesBackup
{
    const TYPE = 'files-inc';

    public function __get($var)
    {
        switch ($var) {
            default:
                return parent::__get($var);
                break;
        }
    }


    public function commit()
    {
        if ($this->new) {
            $lastBackup = static::getLastBackup();
            if (!$lastBackup) {
                return;
            }
            $result = FilesBackup::writeArchive($this->filepath, $lastBackup->dateTime);
        }
        Backup::commit();
    }
}
