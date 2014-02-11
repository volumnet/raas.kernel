<?php
/**
 * ‘айл интерфейса веб-представлени€ контекста с возможностью назначени€ прав
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2012, Volume Networks
 */
namespace RAAS;

/**
 * »нтерфейс веб-представлени€ контекста с возможностью назначени€ прав RAAS
 * 
 *  онтекст с возможностью назначени€ прав представл€ет собой любой пакет или модуль
 * @package RAAS
 * @property-read string $versionName Ќаименование версии 
 */       
interface IRightsContext_View_Web extends IContext_View_Web
{
    /**
     * ѕредставление заголовка модул€
     */         
    function header();
}