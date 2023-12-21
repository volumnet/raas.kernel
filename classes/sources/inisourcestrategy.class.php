<?php
/**
 * Стратегия источника INI
 */
namespace RAAS;

class INISourceStrategy extends SourceStrategy
{
    protected static $instance;

    public function parse($source): array
    {
        $ini = @parse_ini_string($source);
        $result = [];
        foreach ($ini as $key => $val) {
            $result[trim($key)] = ['name' => trim($val)];
        }
        return $result;
    }
}
