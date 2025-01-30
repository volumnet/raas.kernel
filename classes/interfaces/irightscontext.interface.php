<?php
/**
 * @package RAAS
 */
namespace RAAS;

/**
 * Интерфейс контекста с возможностью назначения прав
 *
 * Контекст с возможностью назначения прав реализован в виде любого пакета или модуля
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
