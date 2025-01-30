<?php
/**
 * @package RAAS
 */
namespace RAAS;

/**
 * Интерфейс абстрактного контроллера контекста RAAS
 * 
 * Контекст представляет собой собственно приложение, любой пакет или модуль
 * @property-read \RAAS\Application $application ссылка на экземпляр приложения
 * @property-read \RAAS\IContext $model ссылка на экземпляр контекста
 * @property-read \RAAS\IAbstract_Context_View $view ссылка на экземпляр текущего представления контекста
 */       
interface IAbstract_Context_Controller
{
    /**
     * Функция запуска контроллера
     */         
    function run();
}
