<?php
/**
 * @package RAAS
 */
namespace RAAS;

/**
 * Интерфейс веб-представления контекста с возможностью назначения прав RAAS
 * 
 * Контекст с возможностью назначения прав представляет собой любой пакет или модуль
 * @property-read string $versionName Наименование версии
 */       
interface IRightsContext_View_Web extends IContext_View_Web
{
    /**
     * Представление заголовка модуля
     */         
    function header();
}
