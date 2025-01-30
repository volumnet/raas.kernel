<?php
/**
 * @package RAAS
 */
namespace RAAS;

use DateTime;
use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;
use ZipArchive;

/**
 * Резервная копия файлов
 * @property-read string $filename Имя файла резервной копии
 * @property-read bool $hasChildren Есть ли инкрементарные резервные копии,
 *                                  базирующиеся на данной
 * @property-read bool $canBeDeleted Резервная копия может быть удалена
 */
class FilesBackup extends Backup
{
    const TYPE = 'files-full';

    public function __get($var)
    {
        switch ($var) {
            case 'filename':
                $filename = $this->postDate . ' ' . static::TYPE
                          . '.' . $this->id . '.zip';
                return $filename;
                break;
            case 'hasChildren':
                $backups = array_filter(static::load(), function ($x) {
                    return ($x instanceof FilesBackup);
                });
                usort($backups, function ($a, $b) {
                    return strcmp($a->postDate, $b->postDate);
                });
                // Найдем текущий бэкап
                $index = array_search($this, $backups);
                return (
                    ($index < count($backups) - 1) &&
                    ($backups[$index + 1]->type == 'files-inc')
                );
                break;
            case 'canBeDeleted':
                return !$this->hasChildren;
                break;
            default:
                return parent::__get($var);
                break;
        }
    }


    public function commit()
    {
        if ($this->new) {
            static::writeArchive($this->filepath);
        }
        parent::commit();
    }


    public function restore()
    {
        if (is_file($this->filepath)) {
            static::restoreArchive($this->filepath);
        }
    }


    /**
     * Записывает архив в файл
     * @param string $filename Имя файла
     * @param ?DateTime $dateTime Дата/время, с которого нужно формировать файлы (либо null, если все)
     * @throws NoFilesForBackupException Выбрасывается, если нет
     *                                   файлов для добавления
     */
    public static function writeArchive($filename, ?DateTime $dateTime = null)
    {
        $baseDir = realpath(Application::i()->baseFilesDir);
        $directory = new RecursiveDirectoryIterator($baseDir);
        $iterator = new RecursiveIteratorIterator($directory);
        $files = [];
        foreach ($iterator as $info) {
            $f = realpath($info->getPathname());
            if (($f != $baseDir) &&
                !in_array($info->getBasename(), ['..']) &&
                (!$dateTime || (filemtime($f) > $dateTime->getTimestamp()))
            ) {
                $files[] = str_ireplace('\\', '/', $f);
            }
        }
        $baseDir = str_ireplace('\\', '/', $baseDir);

        if (!$files) {
            throw new NoFilesForBackupException();
        }

        $z = new ZipArchive();
        $z->open($filename, ZipArchive::CREATE);
        foreach ($files as $f) {
            $relName = trim(preg_replace(
                '/^' . preg_quote($baseDir, '/') . '/umi',
                '',
                $f
            ), '/');
            if (is_file($f)) {
                $z->addFile($f, $relName);
            } elseif (is_dir($f)) {
                $z->addEmptyDir($relName);
            }
        }
        $z->close();
        return is_file($filename);
    }


    /**
     * Восстанавливает файлы из архива
     * @param string $filename Имя файла
     */
    public static function restoreArchive($filename)
    {
        if (!is_file($filename)) {
            return;
        }
        $z = new ZipArchive();
        $z->open($filename);
        $z->extractTo(Application::i()->baseFilesDir);
    }


    /**
     * Получает последний файловый бэкап
     * @return FilesBackup|null (null, если не найдено)
     */
    public static function getLastBackup()
    {
        $backups = array_filter(static::load(), function ($x) {
            return ($x instanceof FilesBackup);
        });
        usort($backups, function ($a, $b) {
            return strcmp($b->postDate, $a->postDate);
        });
        if ($backups) {
            return $backups[0];
        }
        return null;
    }
}
