<?php
/**
 * Стратегия источника INI
 */
declare(strict_types=1);

namespace RAAS;

class INISourceStrategy extends SourceStrategy
{
    protected static $instance;

    public function parse($source): array
    {
        $ini = @parse_ini_string((string)$source);
        $result = [];
        foreach ($ini as $key => $val) {
            $result[trim((string)$key)] = ['name' => trim((string)$val)];
        }
        return $result;
    }
}
