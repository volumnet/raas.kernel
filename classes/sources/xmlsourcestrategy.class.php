<?php
/**
 * Стратегия источника XML
 */
namespace RAAS;

use Exception;
use SimpleXMLElement;

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
                if (trim($row['title'] ?? '')) {
                    $val = $row['title'];
                } elseif (trim($row['name'] ?? '')) {
                    $val = $row['name'];
                } else {
                    $val = $row->getName();
                }
                $val = trim($val);
                if (trim($row['value'] ?? '')) {
                    $key = $row['value'];
                } elseif (trim($row['id'] ?? '')) {
                    $key = $row['id'];
                } else {
                    $key = $val;
                }
                $key = trim($key);
                $result[$key] = ['name' => $val];
                if ($parsedChildren = $this->parse($row)) {
                    $result[$key]['children'] = $parsedChildren;
                }
            }
        }
        return $result;
    }
}
