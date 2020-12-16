<?php
/**
 * Файл базового теста
 */
namespace RAAS;

use PHPUnit_Framework_TestCase;

/**
 * Класс базового теста
 */
class BaseTest extends PHPUnit_Framework_TestCase
{
    /**
     * Получение папки с ресурсами
     */
    public function getResourcesDir()
    {
        return __DIR__ . '/../resources';
    }
}
