<?php
/**
 * Менеджер обновления системы
 */
declare(strict_types=1);

namespace RAAS;

use SOME\SOME;

/**
 * Класс менеджера обновления системы
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
        $v = (string)Application::i()->registryGet('baseVersion');
        if (version_compare($v, '4.2.28') < 0) {
            $this->update20200412();
        }
        if (version_compare($v, '4.2.51') < 0) {
            $this->update20200904();
        }
        if (version_compare($v, '4.2.66') < 0) {
            $this->update20210301();
        }
        if (version_compare($v, '4.2.67') < 0) {
            $this->update20210315();
        }
        if (version_compare($v, '4.2.68') < 0) {
            $this->update20210317();
        }
        if (version_compare($v, '4.2.94') < 0) {
            $this->update20220608();
        }
        if (version_compare($v, '4.3.19') < 0) {
            $this->update20230503();
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


    /**
     * Добавляет первичный ключ в логи пользователей
     */
    public function update20210315()
    {
        if (in_array(SOME::_dbprefix() . "users_log", $this->tables)) {
            if (in_array(
                "id",
                $this->columns(SOME::_dbprefix() . "users_log")
            ) && !in_array(
                "element_id",
                $this->columns(SOME::_dbprefix() . "users_log")
            )) {
                $sqlQuery = "ALTER TABLE `users_log`
                            CHANGE uid uid SMALLINT(5) UNSIGNED NOT NULL COMMENT 'User ID#',
                            CHANGE id element_id INT UNSIGNED NOT NULL COMMENT 'Element ID#'";
                $this->SQL->query($sqlQuery);
            }
            if (!in_array(
                "id",
                $this->columns(SOME::_dbprefix() . "users_log")
            )) {
                $sqlQuery = "ALTER TABLE " . SOME::_dbprefix() . "users_log
                              DROP PRIMARY KEY";
                $this->SQL->query($sqlQuery);
                $sqlQuery = "ALTER TABLE " . SOME::_dbprefix() . "users_log
                               ADD id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID#' FIRST,
                               ADD PRIMARY KEY (id)";
                $this->SQL->query($sqlQuery);
            }
        }
    }


    /**
     * Убирает таблицу логов пользователей (перенесли в файлы)
     */
    public function update20210317()
    {
        if (in_array(SOME::_dbprefix() . "users_log", $this->tables)) {
            $sqlQuery = "DROP TABLE IF EXISTS " . SOME::_dbprefix() . "users_log";
            $this->SQL->query($sqlQuery);
        }
    }


    /**
     * Добавляет таблицу процессов
     */
    public function update20220608()
    {
        if (in_array(SOME::_dbprefix() . "processes", $this->tables)) {
            $sqlQuery = "CREATE TABLE IF NOT EXISTS " . SOME::_dbprefix() . "processes (
                          id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID#',
                          post_date DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'Start date/time',
                          query VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Process query',
                          user_agent VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'User agent',
                          ip VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'IP address',

                          PRIMARY KEY (id),
                          INDEX (post_date)
                        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Processes';";
            $this->SQL->query($sqlQuery);
        }
    }


    /**
     * Добавляет индекс на поле realname таблицы attachments
     */
    public function update20230503()
    {
        if (in_array(SOME::_dbprefix() . "attachments", $this->tables)) {
            $sqlQuery = "SELECT COUNT(*)
                           FROM information_schema.statistics
                          WHERE TABLE_SCHEMA = ?
                            AND table_name = 'attachments'
                            AND index_name = 'realname'";
            $sqlBind = [Application::i()->dbname];
            $sqlResult = $this->SQL->getvalue([$sqlQuery, $sqlBind]);
            if (!$sqlResult) {
                $sqlQuery = "ALTER TABLE attachments ADD INDEX realname (realname(32))";
                $this->SQL->query($sqlQuery);
            }
        }
    }
}
