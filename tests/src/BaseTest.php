<?php
/**
 * Файл базового теста
 */
namespace RAAS;

use PHPUnit\Framework\TestCase;

/**
 * Класс базового теста
 */
class BaseTest extends TestCase
{
    /**
     * Получение папки с ресурсами
     */
    public function getResourcesDir()
    {
        return __DIR__ . '/../resources';
    }
}
