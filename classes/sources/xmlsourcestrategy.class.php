<?php
/**
 * @package RAAS
 */
declare(strict_types=1);

namespace RAAS;

use Exception;
use SimpleXMLElement;

/**
 * Стратегия источника данных XML
 */
class XMLSourceStrategy extends SourceStrategy
{
    protected static $instance;

    public function parse($source): array
    {
        $result = [];
        $sxe = null;
        if ($source instanceof SimpleXMLElement) {
            $sxe = $source;
        } else {
            try {
                $sxe =@ new SimpleXMLElement((string)$source); // Подавляем ошибку (т.к. вместе с исключением появляется и ошибка)
            } catch (Exception $e) {
                try {
                    $sxe =@ new SimpleXMLElement('<dictionary>' . $source . '</dictionary>');
                } catch (Exception $e) {
                }
            }
        }
        if ($sxe) {
            foreach ($sxe->children() as $row) {
                if (trim((string)$row['title'] ?? '')) {
                    $val = (string)$row['title'];
                } elseif (trim((string)$row['name'] ?? '')) {
                    $val = (string)$row['name'];
                } else {
                    $val = (string)$row->getName();
                }
                $val = trim($val);
                if (trim((string)$row['value'] ?? '')) {
                    $key = (string)$row['value'];
                } elseif (trim((string)$row['id'] ?? '')) {
                    $key = (string)$row['id'];
                } else {
                    $key = (string)$val;
                }
                $key = trim((string)$key);
                $result[$key] = ['name' => $val];
                if ($parsedChildren = $this->parse($row)) {
                    $result[$key]['children'] = $parsedChildren;
                }
            }
        }
        return $result;
    }
}
