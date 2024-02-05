<?php
/**
 * Файл базового теста с обновлением базы данных
 */
namespace RAAS;

use PHPUnit_Framework_TestCase;

/**
 * Класс базового теста с обновлением базы данных
 */
class BaseDBTest extends BaseTest
{
    /**
     * Перестройка перед тестом
     */
    public static function setUpBeforeClass(): void
    {
        $newSQL = file_get_contents(__DIR__ . '/../resources/test.sql');
        Application::i()->SQL->query($newSQL);
    }
}
