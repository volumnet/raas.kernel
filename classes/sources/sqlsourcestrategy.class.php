<?php
/**
 * Стратегия источника SQL
 */
declare(strict_types=1);

namespace RAAS;

class SQLSourceStrategy extends SourceStrategy
{
    protected static $instance;

    /**
     * Разбирает результат SQL-запроса источника в стандартный источник
     * @param string|array $source Текст запроса либо массив строк ответа
     * @param mixed $pid Фильтрация по родительскому ID# (для внутреннего использования)
     * @return array
     */
    public function parse($source, $pid = 0): array
    {
        $result = [];
        if (is_array($source)) {
            $sqlResult = $source;
        } else {
            $rx = '/((INSERT)|(UPDATE)|(DELETE)|(FILE)|(CREATE)|(ALTER)|(INDEX)|(DROP)|(REPLACE)) /i';
            if (preg_match($rx, $source)) {
                return $result;
            }
            $sqlResult = Application::i()->SQL->get((string)$source);
        }
        if ($sqlResult) {
            $rawData = array_values(array_filter($sqlResult, function ($x) use ($pid) {
                $originalPid = ($x['pid'] ?? null);
                return ($originalPid == $pid) || (!$originalPid && !$pid);
            }));
            foreach ($rawData as $sqlRow) {
                if (trim((string)($sqlRow['name'] ?? ''))) {
                    $val = (string)$sqlRow['name'];
                } else {
                    $sqlRowValues = array_values($sqlRow);
                    $val = (string)array_shift($sqlRowValues);
                }
                $val = trim((string)$val);
                $allowRecursive = isset($sqlRow['pid']);
                if (trim((string)($sqlRow['val'] ?? '')) !== '') {
                    $key = (string)$sqlRow['val'];
                } else {
                    $key = (string)$val;
                }
                $key = trim((string)$key);
                $result[$key] = ['name' => $val];
                if ($allowRecursive) {
                    if ($temp = $this->parse($sqlResult, $key)) {
                        $result[$key]['children'] = $temp;
                    }
                }
            }
        }
        return $result;
    }
}
