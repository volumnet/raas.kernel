<?php
/**
 * Стратегия источника PHP
 */
declare(strict_types=1);

namespace RAAS;

class PHPSourceStrategy extends SourceStrategy
{
    protected static $instance;

    public function parse($source): array
    {
        $result = [];
        if (is_array($source)) {
            $phpResult = $source;
        } else {
            $phpResult = @eval($source . ' ;');
        }
        if ($phpResult) {
            foreach ((array)$phpResult as $key => $arr) {
                $key = trim((string)$key);
                if (is_array($arr)) {
                    $result[$key] = [];
                    if ($arr['name'] ?? '') {
                        $result[$key]['name'] = $arr['name'];
                    }
                    if (isset($arr['children']) && ($children = $this->parse($arr['children']))) {
                        $result[$key]['children'] = $children;
                    }
                } else {
                    $result[$key] = ['name' => trim($arr)];
                }
            }
        }
        return $result;
    }
}
