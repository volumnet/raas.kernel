<?php
/**
 * Файл API-представления абстрактного пакета RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */       
namespace RAAS;

/**
 * Класс API-представления абстрактного пакета RAAS
 * @package RAAS
 */       
abstract class Package_View_Api extends Abstract_Package_View
{
    /**
     * Экземпляр класса
     * @var \RAAS\Package_View_Api     
     */         
    protected static $instance;
}