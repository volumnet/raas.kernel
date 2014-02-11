<?php
/**
 * Файл интерфейса владельца прав доступа
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2012, Volume Networks
 */
namespace RAAS;

/**
 * Интерфейс владельца прав RAAS
 * 
 * Владельцы прав представлены пользователями и группами
 * @package RAAS
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