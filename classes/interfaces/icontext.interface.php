<?php
/**
 * @package RAAS
 */
namespace RAAS;

/**
 * Интерфейс контекста RAAS
 *
 * Контекст представляет собой собственно приложение, любой пакет или модуль
 * @property-read string $baseDir основная директория
 * @property-read string $systemDir системная директория
 * @property-read string $classesDir директория классов
 * @property-read string $languagesDir директория переводов
 * @property-read string $publicDir директория шаблонов
 * @property-read string $baseFilesDir директория файлов
 * @property-read string $filesDir директория файлов именно данного контекста
 * @property-read string $baseFilesURL путь к папке файлов
 * @property-read string $filesURL путь к папке файлов именно данного контекста
 * @property-read string $resourcesDir директория ресурсов
 * @property-read string $installFile путь к файлу установки
 * @property-read string $Mid MID контекста с заглавных букв
 * @property-read string $mid MID контекста в нижнем регистре
 * @property-read bool $phpVersionCompatible флаг совместимости пакета по версии PHP
 * @property-read array(string) $missedExt недостающие модули PHP, необходимые для работы пакета
 * @property-read bool $isCompatible флаг общей совместимости пакета
 * @property-read string $version дата версии
 * @property-read string $versionTime UNIX-timestamp даты версии
 * @property-read array(\RAAS\Level) $levels уровни доступа
 * @property-read \RAAS\Level|int $defaultLevel уровень доступа по умолчанию
 * @property-read bool $hasRights имеет настраиваемые права доступа
 * @property-read \RAAS\IAbstract_Context_Controller $controller контроллер контекста
 * @property-read \RAAS\IAbstract_Context_View $view представление контекста
 * @property-read array $composer Содержимое файла composer.json
 */
interface IContext
{
    function __get($var);

    /**
     * Логика работающего контекста
     */
    function run();

    /**
     * Получение значения записи в реестре относительно вызывающего класса
     * @param string $var наименование записи
     * @return string значение записи
     */
    function registryGet($var);

    /**
     * Запись значения в реестр относительно вызывающего класса
     * @param string $var наименование записи
     * @param string $val значение записи
     * @return bool true, если вызов произведен успешно и значение записано, false в противном случае
     */
    function registrySet($var, $val);

    /**
     * Установка контекста
     */
    function install();

    /**
     * Подставляет в системные SQL-запросы значения системных переменных
     * @param string $sqlQuery текст SQL-запроса
     */
    function prepareSQL($sqlQuery);
}
