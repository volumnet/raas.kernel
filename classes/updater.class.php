<?php
/**
 * @package RAAS
 */
declare(strict_types=1);

namespace RAAS;

use SOME\SOME;

/**
 * Менеджер обновления системы
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
        // 2025 год - 8
        // 2024 год - 7/8
        // 2023 год - 7
        // 2022 год - 5/7
        // 2021 год - 5 -- убираем его и ранее
        $v = (string)Application::i()->registryGet('baseVersion');
        if (version_compare($v, '4.2.94') < 0) {
            $this->update20220608();
        }
        if (version_compare($v, '4.3.19') < 0) {
            $this->update20230503();
        }
        // ПО ВОЗМОЖНОСТИ НЕ ПИШЕМ СЮДА, А ПИШЕМ В postInstall
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
                        ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Processes';";
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
