<?php
/**
 * Файл абстрактного подмодуля RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2013, Volume Networks
 */       
namespace RAAS;

/**
 * Класс абстрактного подмодуля RAAS
 * @package RAAS
 */       
abstract class Sub extends \SOME\Singleton
{
    /**
     * Ссылка на экземпляр контекста (пакет или модуль)
     * @var \RAAS\IRightsContext
     */         
    protected $Context;
    
    /**
     * Экземпляр класса
     * @var Sub
     */              
    protected static $instance;
    
    
    public function __get($var)
    {
        return $this->Context->$var;
    }
    
    public function __set($var, $val)
    {
        $this->Context->$var = $val;
    }
    
    public function __call($f, $args)
    {
        call_user_func_array(array($this->Context, $f), $args);
    }
    
    public static function __callStatic($f, $args)
    {
        call_user_func_array(get_class($this->Context) . '::' . $f, $args);
    }
    
    protected function init()
    {
        $args = func_get_args();
        if (isset($args[0]) && $args[0] instanceof IAbstract_Context_Controller) {
            $this->Context = $args[0];
        }
    }

    /**
     * Функция запуска контроллера
     */         
    public function run() {}
}