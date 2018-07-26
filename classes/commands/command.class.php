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
     * Выполнение команды
     */
    abstract public function process();
}
