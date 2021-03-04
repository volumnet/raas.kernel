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
        $v = Application::i()->registryGet('baseVersion');
        if (version_compare($v, '4.2.28') < 0) {
            $this->update20200412();
        }
        if (version_compare($v, '4.2.51') < 0) {
            $this->update20200904();
        }
        if (version_compare($v, '4.2.66') < 0) {
            $this->update20210301();
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
                           command_line VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Arbitrary command line',
                           command_classname VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Command classname',
                           args TEXT NULL DEFAULT NULL COMMENT 'Command arguments',
                           start_time DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'Processing start time',
                           save_log TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Save log',
                           email_log VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Email for sending log',
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


    /**
     * Добавляет идентификатор процесса в crontab
     */
    public function update20200904()
    {
        if (in_array(SOME::_dbprefix() . "crontab", $this->tables) &&
            !in_array("pid", $this->columns(SOME::_dbprefix() . "crontab"))
        ) {
            $sqlQuery = "ALTER TABLE " . SOME::_dbprefix() . "crontab
                           ADD pid int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'Process ID#' AFTER id";
            $this->SQL->query($sqlQuery);
        }
    }


    /**
     * Добавляет HTTP-метод в логи пользователя
     */
    public function update20210301()
    {
        if (in_array(SOME::_dbprefix() . "users_log", $this->tables) &&
            !in_array("method", $this->columns(SOME::_dbprefix() . "users_log"))
        ) {
            $sqlQuery = "ALTER TABLE " . SOME::_dbprefix() . "users_log
                           ADD method VARCHAR(8) NOT NULL DEFAULT '' COMMENT 'HTTP method' AFTER ip";
            $this->SQL->query($sqlQuery);
        }
    }
}
