<?php
/**
 * Файл обновления системы
 */
namespace RAAS;

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

    }
}
