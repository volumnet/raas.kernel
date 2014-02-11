<?php
/**
 * Файл API-представления абстрактного модуля RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */       
namespace RAAS;

/**
 * Класс API-представления абстрактного модуля RAAS
 * @package RAAS
 */       
abstract class Module_View_Api extends Abstract_Module_View
{
    /**
     * Экземпляр класса
     * @var \RAAS\Module_View_Api     
     */         
    protected static $instance;
}