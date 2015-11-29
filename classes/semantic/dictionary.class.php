<?php
namespace RAAS;

abstract class Dictionary extends \SOME\SOME
{
    protected static $tablename = '';
    protected static $defaultOrderBy = "priority";
    protected static $cognizableVars = array();

    protected static $references = array('parent' => array('FK' => 'pid', 'classname' => 'RAAS\\Dictionary', 'cascade' => true));
    protected static $parents = array('parents' => 'parent');
    protected static $children = array('children' => array('classname' => 'RAAS\\Dictionary', 'FK' => 'pid'));
    protected static $links = array();
    
    public static $ordersBy = array('id' => 'ID', 'urn' => 'URN', 'name' => 'NAME', 'priority' => 'MANUAL');
    
    public static $availableExtensions = array('csv', 'ini', 'xml', 'sql');
    
    public function commit()
    {
        if (!$this->id || !$this->priority) {
            $this->priority = static::$SQL->getvalue("SELECT MAX(priority) FROM " . static::_tablename()) + 1;
        }
        parent::commit();
        if ($this->pid && !$this->urn) {
            $this->urn = $this->id;
            parent::commit();
        }
    }
    
    public function parseCSV($text)
    {
        $csv = new \SOME\CSV($text);
        list($currentStep) = each(array_filter($csv->data[0], 'trim'));
        $backtrace = array(array($currentStep, $this));
        $last = null;
        
        for ($i = 0; $i < count($csv->data); $i++) {
            $row = $csv->data[$i];
            list($step) = each(array_filter($row, 'trim'));
        
            if ($step != $currentStep) {
                for ($j = 0; ($j < count($backtrace)) && ($backtrace[$j][0] <= $step); $j++);
                if ($j >= count($backtrace)) {
                    $backtrace[] = array($step, $last);
                } else {
                    $backtrace = array_slice($backtrace, 0, $j);
                }
                $currentStep = $step;
            }
            $row = array_slice($row, $currentStep);
            
            $val = trim(isset($row[0]) && trim($row[0]) ? $row[0] : '');
            $key = trim(isset($row[1]) && trim($row[1]) ? $row[1] : '');
            $last = self::exportByNameURN($val, $key, $backtrace[count($backtrace) - 1][1]);
        }
    }
    
    
    public function parseINI($text)
    {
        $ini = parse_ini_string($text);
        foreach ($ini as $key => $val) {
            $last = self::exportByNameURN(trim($val), trim($key), $this);
        }
    }
    
    
    public function parseXML($text)
    {
        if ($text instanceof \SimpleXMLElement) {
            $sxe = $text;
        } else {
            try {
                $sxe = new \SimpleXMLElement((string)$text);
            } catch (\Exception $e) {
                try {
                    $sxe = new \SimpleXMLElement('<dictionary>' . $text . '</dictionary>');
                } catch (\Exception $e) {}
            }
        }
        if ($sxe) {
            foreach ($sxe->children() as $row) {
                $val = trim(isset($row['title']) && trim($row['title']) ? $row['title'] : (isset($row['name']) && trim($row['name']) ? $row['name'] : $row->getName()));
                $key = trim(isset($row['value']) && trim($row['value']) ? $row['value'] : (isset($row['id']) && trim($row['id']) ? $row['id'] : $val));
                $last = self::exportByNameURN($val, $key, $this);
                if (count($row->children())) {
                    $last->parseXML($row);
                }
            }
        }
    }
    
    
    public function parseSQL($text, $pid = 0)
    {
        if (is_array($text)) {
            $SQL_result = $text;
        } else {
            if (preg_match('/(INSERT )|(UPDATE )|(DELETE )|(FILE )|(CREATE )|(ALTER )|(INDEX )|(DROP )|(REPLACE )/i', $text)) {
                return;
            } 
            $SQL_result = self::$SQL->get((string)$text);
        }
        if ($SQL_result) {
            $rawData = array_values(array_filter($SQL_result, create_function('$x', 'return $x["pid"] == "' . self::$SQL->real_escape_string($pid) . '";')));
            foreach ($rawData as $row) {
                $val = trim(isset($row['name']) && trim($row['name']) ? $row['name'] : array_shift(array_values($row)));
                $key = trim(isset($row['val']) && trim($row['val']) ? $row['val'] : $val);
                $last = self::exportByNameURN($val, $key, $this);
                $last->parseSQL($SQL_result, $key);
            }
        }
    }
    
    
    protected static function exportByNameURN($name, $urn = null, self $Parent)
    {
        if ($Item = static::importByLike($urn, $name, $Parent)) {
            if ($name && ($Item->name != $name)) {
                $Item->name = $name;
                $Item->commit();
            }
        } else {
            $Item = new static();
            $Item->name = $name;
            if ($urn) {
                $Item->urn = $urn;
            }
            $Item->pid = $Parent->id;
            $Item->commit();
        }
        return $Item;
    }
    
    
    protected static function importByLike($urn = null, $name = null, self $Parent)
    {
        if (!$urn && !$name) {
            return null;
        }
        $SQL_query = "SELECT * FROM " . static::_tablename() . " WHERE pid = " . (int)$Parent->id;
        if ($urn) {
            $SQL_query .= " AND urn = '" . self::$SQL->real_escape_string($urn) . "'";
        } elseif ($name) {
            $SQL_query .= " AND name = '" . self::$SQL->real_escape_string($name) . "'";
        }
        $SQL_result = self::$SQL->getline($SQL_query);
        if ($SQL_result) {
            return new static($SQL_result);
        }
    }
    
}