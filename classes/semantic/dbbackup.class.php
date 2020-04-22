<?php
/**
 * Файл класса резервной копии базы данных
 */
namespace RAAS;

/**
 * Класс резервной копии базы данных
 * @property-read string $filename Имя файла резервной копии
 */
class DBBackup extends Backup
{
    const TYPE = 'db';

    public function __get($var)
    {
        switch ($var) {
            case 'filename':
                $filename = $this->postDate . ' ' . static::TYPE . '.' . $this->id . '.sql.gz';
                return $filename;
                break;
            default:
                return parent::__get($var);
                break;
        }
    }


    public function commit()
    {
        if ($this->new) {
            Application::i()->getSQLDump($this->filepath, true);
        }
        parent::commit();
    }


    public function restore()
    {
        if (is_file($this->filepath)) {
            Application::i()->restoreSQLDump($this->filepath);
        }
    }
}
