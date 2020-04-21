<?php
/**
 * Файл обновления системы
 */
namespace RAAS;

use SOME\SOME;

/**
 * Класс обновления системы
 * @property-read string[] $tables Список таблиц базы данных
 */
class Updater
{
    protected $Context;

    public function __get($var)
    {
        switch ($var) {
            case 'tables':
                return $this->SQL->getcol("SHOW TABLES");
                break;
            default:
                return $this->Context->$var;
                break;
        }
    }


    /**
     * Конструктор класса
     * @param IContext $context Контекст обновления
     */
    public function __construct(IContext $context)
    {
        $this->Context = $context;
    }


    /**
     * Подготовка к установке
     */
    public function preInstall()
    {
        if (version_compare(
            Application::i()->registryGet('baseVersion'),
            '4.2.28'
        ) < 0) {
            $this->update20200412();
        }
        return true;
    }


    /**
     * Завершение установки
     */
    public function postInstall()
    {
        return true;
    }


    /**
     * Возвращает список колонок в таблице
     * @param string $table Наименование таблицы
     * @return string[] Массив наименований колонок
     */
    public function columns($table)
    {
        $sqlQuery = "SHOW FIELDS FROM " . $table;
        $sqlResult = $this->SQL->get($sqlQuery);
        $result = array_map(function ($x) {
            return $x['Field'];
        }, $sqlResult);
        return $result;
    }


    /**
     * Добавление резервных копий и планировщика
     */
    public function update20200412()
    {
        if (!in_array(SOME::_dbprefix() . "backups", $this->tables)) {
            $sqlQuery = "CREATE TABLE IF NOT EXISTS " . SOME::_dbprefix() . "backups (
                           id int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID#',
                           uid INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Author ID#',
                           type ENUM('db', 'files-full', 'files-inc') NOT NULL COMMENT 'Backup type',
                           post_date DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'Backup date/time',
                           name VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Name',
                           attachment_id INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Attachment ID#',
                           preserve TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Preserve from deletion',

                           PRIMARY KEY (id),
                           KEY (uid),
                           KEY (type),
                           INDEX (post_date),
                           KEY (attachment_id)
                         ) COMMENT='Backups'";
            $this->SQL->query($sqlQuery);
        }
        if (!in_array(SOME::_dbprefix() . "crontab", $this->tables)) {
            $sqlQuery = "CREATE TABLE IF NOT EXISTS " . SOME::_dbprefix() . "crontab (
                           id int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID#',
                           name VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Name',
                           vis TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Is active',
                           once TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Process once',
                           minutes VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Minutes',
                           hours VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Hours',
                           days VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Days',
                           weekdays VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Weekdays',
                           command_classname VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Command classname',
                           args TEXT NULL DEFAULT NULL COMMENT 'Command arguments',
                           priority INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Priority',

                           PRIMARY KEY (id),
                           INDEX (priority)
                         ) COMMENT='Crontab'";
            $this->SQL->query($sqlQuery);
        }
        if (!in_array(SOME::_dbprefix() . "crontab_logs", $this->tables)) {
            $sqlQuery = "CREATE TABLE IF NOT EXISTS " . SOME::_dbprefix() . "crontab (
                           id int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID#',
                           pid INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Crontab task ID#',
                           post_date DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'Backup date/time',
                           attachment_id INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Attachment ID#',

                           PRIMARY KEY (id),
                           KEY (pid),
                           INDEX (post_date),
                           KEY (attachment_id)
                         ) COMMENT='Crontab logs'";
            $this->SQL->query($sqlQuery);
        }
    }
}
