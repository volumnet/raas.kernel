<?php
/**
 * @package RAAS
 */
declare(strict_types=1);

namespace RAAS;

use SOME\AbstractStrategy;

/**
 * Стратегия источника данных
 */
abstract class SourceStrategy extends AbstractStrategy
{
    protected static $registeredStrategies = [];

    /**
     * Разбирает источник
     * @param mixed $source Источник
     * @return array <pre><code>array<string[] Значение => [
     *     'name' => string Заголовок,
     *     'children' =>? (рекурсивно)
     * ]></code></pre>
     */
    abstract public function parse($source): array;
}
