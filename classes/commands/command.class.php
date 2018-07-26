<?php
/**
 * Файл класса команды
 */
namespace RAAS;

/**
 * Класс комманды
 */
abstract class Command
{
    /**
     * Контроллер, вызвавший команду
     * @var Abstract_Controller_Cron|null
     */
    protected $controller = null;


    /**
     * Конструктор класса
     * @param Abstract_Controller_Cron|null $controller Контроллер, вызвавший команду
     */
    public function __construct(Abstract_Controller_Cron $controller = null)
    {
        $this->controller = $controller;
    }

    /**
     * Выполнение команды
     */
    abstract public function process();
}
