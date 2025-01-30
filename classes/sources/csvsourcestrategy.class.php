<?php
/**
 * @package RAAS
 */
declare(strict_types=1);

namespace RAAS;

use SOME\CSV;

/**
 * Стратегия источника данных CSV
 */
class CSVSourceStrategy extends SourceStrategy
{
    protected static $instance;

    public function parse($source): array
    {
        $csv = new CSV($source);
        $result = [];

        $steps = array_keys(array_filter($csv->data[0] ?? [], 'trim'));
        $currentStep = array_shift($steps);
        $backtrace = [[$currentStep, &$result]];
        $last = null;

        for ($i = 0; $i < count($csv->data); $i++) {
            $row = $csv->data[$i];
            $steps = array_keys(array_filter($row, 'trim'));
            $step = array_shift($steps);

            if ($step != $currentStep) {
                for ($j = 0; ($j < count($backtrace)) && ($backtrace[$j][0] <= $step); $j++) {
                }
                if ($j >= count($backtrace)) {
                    $last['children'] = [];
                    $backtrace[] = [$step, &$last['children']];
                } else {
                    $backtrace = array_slice($backtrace, 0, $j);
                }
                $currentStep = $step;
            }
            $row = array_slice($row, $currentStep);

            $val = trim($row[0] ?? '');
            $key = trim(($row[1] ?? '') ?: $row[0]);
            $backtrace[count($backtrace) - 1][1][$key] = ['name' => $val];
            $last =& $backtrace[count($backtrace) - 1][1][$key];
        }

        return $result;
    }
}
