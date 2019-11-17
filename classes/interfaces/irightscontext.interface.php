<?php
/**
 * Файл интерфейса контекста с возможностью назначения прав
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2012, Volume Networks
 */
namespace RAAS;

/**
 * Интерфейс контекста с возможностью назначения прав
 *
 * Контекст с возможностью назначения прав реализован в виде любого пакета или модуля
 * @package RAAS
 * @property-read \RAAS\Application $application объект приложения
 * @property-read string $alias псевдоним модуля
 * @property-read array(\RAAS\Level) $levels уровни доступа
 * @property-read \RAAS\Level|int $defaultLevel уровень доступа по умолчанию
 * @property-read bool $hasRights имеет настраиваемые права доступа

 * @property-read \RAAS\IContext $parent родительский объект контекста
 */
interface IRightsContext extends IContext
{
    /**
     * Метод инициализации контекста
     */
    public function init();

    /**
     * Права доступа
     * @param \RAAS\IOwner $Owner владелец прав доступа
     * @return \RAAS\Access
     */
    public function access(IOwner $Owner);
}
