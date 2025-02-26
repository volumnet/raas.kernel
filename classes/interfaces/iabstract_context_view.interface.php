<?php
/**
 * @package RAAS
 */
namespace RAAS;

/**
 * Интерфейс абстрактного представления контекста RAAS
 * 
 * Контекст представляет собой собственно приложение, любой пакет или модуль
 * @property-read \RAAS\Application $application ссылка на экземпляр приложения
 * @property-read string $languagesDir путь к папке переводов
 * @property-read \RAAS\IContext $model ссылка на контекст
 */       
interface IAbstract_Context_View
{
     /**
     * Переводит идентификатор на текущий язык
     * @param string $var идентификатор
     * @return string перевод идентификатора
     */         
    function _($var);
    
    /**
     * Формирует набор констант из массива переводов
     */         
    function exportLang();
    
    /**
     * Быстрое формирование контейнеров данных и строковых контейнеров из входных данных
     * @param array $IN данные для формирования переменных
     */         
    function assignVars(array $IN);
}
