<?php
/**
 * Задача планировщика
 */
namespace RAAS;

use SOME\SOME;

/**
 * Класс задачи планировщика
 */
class Crontab extends SOME
{
    protected static $tablename = 'crontab';

    protected static $defaultOrderBy = "priority";

    protected static $aiPriority = true;
}
