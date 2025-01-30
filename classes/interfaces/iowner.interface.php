<?php
/**
 * @package RAAS
 */
namespace RAAS;

/**
 * Интерфейс владельца прав RAAS
 * 
 * Владельцы прав представлены пользователями и группами
 */       
interface IOwner
{
    /**
     * Получает уровень доступа
     * @param \RAAS\IRightsContext $Context Контекст доступа
     * @return \RAAS\Access уровень доступа
     */         
    function access(IRightsContext $Context);
}
