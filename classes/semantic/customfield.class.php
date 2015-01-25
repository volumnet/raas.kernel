<?php
namespace RAAS;

abstract class CustomField extends \SOME\SOME
{
    const data_table = '';
    const DictionaryClass = '';
    
    protected $Owner;
    
    protected static $tablename = '';
    protected static $defaultOrderBy = "priority";
    
    protected static $cognizableVars = array('stdSource');
    
    public static $fieldTypes = array(
        'text', 'color', 'date', 'datetime-local', 'email', 'number', 'range', 'tel', 'time', 'url', 'month', /*'week', */'password',
        'checkbox', 'radio', 'file', 'image', 'select', 'textarea', 'htmlarea'
    );
    
    public static $sourceTypes = array('dictionary', 'ini', 'csv', 'xml', 'sql', 'php');
    
    /**
     * @todo
     */
    public function __get($var)
    {
        switch ($var) {
            case 'Owner':
                return $this->Owner;
                break;
            case 'Field':
                $t = $this;
                $f = new \RAAS\Field();
                $f->type = $this->datatype;
                foreach (array('placeholder') as $key) {
                    if ((string)$this->$key !== '') {
                        $f->$key = (string)$this->$key;
                    }
                }
                foreach (array('required', 'maxlength', 'multiple') as $key) {
                    if ((int)$this->$key) {
                        $f->$key = (int)$this->$key;
                    }
                }
                foreach (array('min_val', 'max_val') as $key) {
                    if ((float)$this->$key) {
                        $f->{str_replace('_val', '', $key)} = (float)$this->$key;
                    }
                }
                $f->name = $this->urn;
                $f->caption = $this->name;
                $f->children = $this->_getFieldChildren((array)$this->_stdSource());
                $f->export = 'is_null';
                $f->import = function ($Field) use ($t) { return $t->getValues(); };
                if (in_array($t->datatype, array('image', 'file')) && $t->getValue()->id) {
                    //$f->required = false;
                }
                $f->meta['CustomField'] = $t;
                $f->oncommit = function ($Field) use ($t) {
                    switch ($t->datatype) {
                        case 'file': case 'image':
                            $t->deleteValues();
                            if ($Field->multiple) {
                                foreach ($_FILES[$Field->name]['tmp_name'] as $key => $val) {
                                    if (is_uploaded_file($_FILES[$Field->name]['tmp_name'][$key]) && $t->validate($_FILES[$Field->name]['tmp_name'][$key])) {
                                        $att = new Attachment();
                                        $att->upload = $_FILES[$Field->name]['tmp_name'][$key];
                                        $att->filename = $_FILES[$Field->name]['name'][$key];
                                        $att->mime = $_FILES[$Field->name]['type'][$key];
                                        $att->parent = $t;
                                        if ($t->datatype == 'image') {
                                            $att->image = 1;
                                            if ($temp = (int)Application::i()->context->registryGet('maxsize')) {
                                                $att->maxWidth = $att->maxHeight = $temp;
                                            }
                                            if ($temp = (int)Application::i()->context->registryGet('tnsize')) {
                                                $att->tnsize = $temp;
                                            }
                                        }
                                        $att->commit();
                                        $t->addValue($att->id);
                                    }
                                    unset($att);
                                }
                            } else {
                                if (is_uploaded_file($_FILES[$Field->name]['tmp_name']) && $t->validate($_FILES[$Field->name]['tmp_name'])) {
                                    $att = new Attachment((int)$t2['attachment']);
                                    $att->upload = $_FILES[$Field->name]['tmp_name'];
                                    $att->filename = $_FILES[$Field->name]['name'];
                                    $att->mime = $_FILES[$Field->name]['type'];
                                    $att->parent = $t;
                                    if ($t->datatype == 'image') {
                                        $att->image = 1;
                                        if ($temp = (int)Application::i()->context->registryGet('maxsize')) {
                                            $att->maxWidth = $att->maxHeight = $temp;
                                        }
                                        if ($temp = (int)Application::i()->context->registryGet('tnsize')) {
                                            $att->tnsize = $temp;
                                        }
                                    }
                                    $att->commit();
                                    $t->addValue($att->id);
                                }
                                unset($att);
                            }
                            $t->clearLostAttachments();
                            break;
                        default:
                            $t->deleteValues();
                            if (isset($_POST[$Field->name])) {
                                foreach ((array)$_POST[$Field->name] as $val) {
                                    $t->addValue($val);
                                }
                            }
                            break;
                    }
                };
                return $f;
                break;
            case 'inherited':
                if ($this->Owner) {
                    $SQL_query = "SELECT MIN(inherited) FROM " . static::$dbprefix . static::data_table . " WHERE pid = ? AND fid = ?";
                    $SQL_bind = array((int)$this->Owner->id, (int)$this->id);
                    return (bool)(int)static::$SQL->getvalue(array($SQL_query, $SQL_bind));
                }
                return false;
                break;
            default:
                return parent::__get($var);
                break;
        }
    }
    
    public function commit()
    {
        if (!$this->id || !$this->priority) {
            $this->priority = static::$SQL->getvalue("SELECT MAX(priority) FROM " . static::_tablename()) + 1;
        }
        if (!$this->urn && $this->name) {
            $this->urn = \SOME\Text::beautify($this->name);
        }
        if (!$this->classname) {
            $this->classname = static::$references['parent']['classname'];
        }
        $SQL_query = "SELECT COUNT(*) FROM " . static::_tablename() . " WHERE urn = ? AND classname = ? AND pid = ? AND id != ?";
        while (
            in_array($this->urn, array('name', 'description')) || (int)static::$SQL->getvalue(array($SQL_query, $this->urn, $this->classname, $this->pid, (int)$this->id))
        ) {
            $this->urn = '_' . $this->urn . '_';
        }
        parent::commit();
    }
    
    
    public function isFilled($val)
    {
        return $this->Field->_isFilled($val);
    }
    
    
    public function validate($val)
    {
        return $this->Field->_validate($val);
    }
    
    
    public function getValue($index = 0)
    {
        if (!$this->Owner || !static::data_table) {
            return null;
        }
        $SQL_query = "SELECT value FROM " . static::$dbprefix . static::data_table . " WHERE pid = ? AND fid = ? AND fii = ?";
        $SQL_bind = array((int)$this->Owner->id, (int)$this->id, (int)$index);
        $value = static::$SQL->getvalue(array($SQL_query, $SQL_bind));
        switch ($this->datatype) {
            case 'image': case 'file':
                $att = new Attachment((int)$value);
                return $att;
                break;
            case 'number':
                return str_replace(',', '.', (float)$value);
                break;
            case 'datetime': case 'datetime-local':
                $value = str_replace(' ', 'T', $value);
                break;
        }
        return $value;
    }
    
    
    public function getValues($forceArray = false)
    {
        if (!$this->Owner || !static::data_table) {
            return null;
        }
        if (!$this->multiple && !$forceArray) {
            return $this->getValue();
        }
        $SQL_query = "SELECT value FROM " . static::$dbprefix . static::data_table . " WHERE pid = ? AND fid = ? ORDER BY fii ASC";
        $SQL_bind = array((int)$this->Owner->id, (int)$this->id);
        $values = static::$SQL->getcol(array($SQL_query, $SQL_bind));
        switch ($this->datatype) {
            case 'image': case 'file':
                $values = array_map(function($x) { return new Attachment((int)$x); }, $values);
                break;
            case 'number':
                return array_map(function($x) { return str_replace(',', '.', $x); }, $values);
                break;
            case 'datetime': case 'datetime-local':
                $values = array_map(function($x) { return str_replace(' ', 'T', $x); }, $values);
                break;
        }
        return $values;
    }
    
    
    public function doRich($x = null)
    {
        if ($x === null) {
            $x = $this->getValue();
        }
        switch ($this->datatype) {
            case 'datetime': case 'datetime-local':
                $x = str_replace('T', ' ', $x);
                break;
            case 'number':
                return str_replace(',', '.', (float)$x);
                break;
            case 'checkbox': case 'radio': case 'select':
                if ($this->multiple || ($this->datatype != 'checkbox')) {
                    $x = $this->getCaption($x);
                } else {
                    $x = (bool)$x;
                }
                break;
        }
        return $x;
    }
    
    
    public function fromRich($x = null)
    {
        switch ($this->datatype) {
            case 'datetime': case 'datetime-local':
                $x = str_replace('T', ' ', $x);
                $x = date('Y-m-d H:i:s', strtotime($x));
                break;
            case 'number':
                return str_replace(',', '.', (float)$x);
                break;
            case 'checkbox': case 'radio': case 'select':
                if ($this->multiple || ($this->datatype != 'checkbox')) {
                    $x = $this->getFromCaption($x);
                } else {
                    $x = (bool)$x;
                }
                break;
        }
        return $x;
    }
    
    
    public function countValues()
    {
        if (!$this->Owner || !static::data_table) {
            return null;
        }
        $SQL_bind = array((int)$this->Owner->id, (int)$this->id);
        $SQL_query = "SELECT MAX(fii) FROM " . static::$dbprefix . static::data_table . " WHERE pid = ? AND fid = ?";
        $SQL_result = static::$SQL->getvalue(array($SQL_query, $SQL_bind));
        return ($SQL_result === null ? 0 : $SQL_result + 1);
    }
    
    
    public function setValue($value, $index = 0)
    {
        switch ($this->datatype) {
            case 'number':
                $value = (float)str_replace(',', '.', (float)$value);
                break;
            case 'datetime': case 'datetime-local':
                $value = str_replace('T', ' ', $value);
                break;
        }
        if (!$this->Owner || !static::data_table) {
            return null;
        }
        $arr = array('pid' => (int)$this->Owner->id, 'fid' => (int)$this->id, 'fii' => (int)$index, 'value' => $value);
        static::$SQL->add(static::$dbprefix . static::data_table, $arr);
        return $value;
    }
    
    
    public function addValue($value, $index = null)
    {
        if (!$this->Owner || !static::data_table) {
            return null;
        }
        $SQL_bind = array((int)$this->Owner->id, (int)$this->id, (int)$index);
        if ($index === null) {
            $index = $this->countValues();
        } else {
            $SQL_query = "UPDATE " . static::$dbprefix . static::data_table . " SET fii = fii + 1 WHERE pid = ? AND fid = ? AND fii >= ? ORDER BY fii DESC";
            static::$SQL->query(array($SQL_query, $SQL_bind));
        }
        $this->setValue($value, $index);
    }
    
    
    public function deleteValue($index = 0)
    {
        if (!$this->Owner || !static::data_table) {
            return null;
        }
        $SQL_bind = array((int)$this->Owner->id, (int)$this->id, (int)$index);
        $SQL_query = "DELETE FROM " . static::$dbprefix . static::data_table . " WHERE pid = ? AND fid = ? AND fii = ?";
        static::$SQL->query(array($SQL_query, $SQL_bind));
        $SQL_query = "UPDATE " . static::$dbprefix . static::data_table . " SET fii = fii - 1 WHERE pid = ? AND fid = ? AND fii > ? ORDER BY fii ASC";
        static::$SQL->query(array($SQL_query, $SQL_bind));
    }
    
    
    public function deleteValues()
    {
        if (!$this->Owner || !static::data_table) {
            return null;
        }
        $SQL_bind = array((int)$this->Owner->id, (int)$this->id);
        static::$SQL->query(array("DELETE FROM " . static::$dbprefix . static::data_table . " WHERE pid = ? AND fid = ?", $SQL_bind));
    }
    
    
    public function clearLostAttachments()
    {
        if (in_array($this->datatype, array('file', 'image'))) {
            $SQL_query = "SELECT value FROM " . static::$dbprefix . static::data_table . " WHERE fid = " . (int)$this->id;
            $SQL_result = array_filter(static::$SQL->getcol($SQL_query), 'intval');
            $SQL_query = "SELECT * FROM " . Attachment::_tablename() . " 
                           WHERE classname = '" . self::$SQL->real_escape_string(get_class($this)) . "' AND pid = " . (int)$this->id;
            if ($SQL_result) {
                $SQL_query .= " AND id NOT IN (" . implode(", ", $SQL_result) . ")";
            }
            $SQL_result = Attachment::getSQLSet($SQL_query);
            if ($SQL_result) {
                foreach ($SQL_result as $row) {
                    Attachment::delete($row);
                }
            }
        }
    }
    
    
    public function inheritValues()
    {
        $SQL_query = "UPDATE " . static::$dbprefix . static::data_table . " SET inherited = 1 WHERE pid = ? AND fid = ?";
        $SQL_bind = array((int)$this->Owner->id, (int)$this->id);
        static::$SQL->query(array($SQL_query, $SQL_bind));
        
        if ($this->Owner->all_children_ids && is_array($this->Owner->all_children_ids)) {
            if ($temp = array_values(array_map('intval', array_filter($this->Owner->all_children_ids, 'intval')))) {
                $SQL_query = "DELETE FROM " . static::$dbprefix . static::data_table . " WHERE fid = " . (int)$this->id . " AND pid IN (" . implode(", ", $temp) . ")";
                static::$SQL->query($SQL_query);
                
                $classname = get_class($this->Owner);
                $SQL_query = "INSERT INTO " . static::$dbprefix . static::data_table . " (pid, fid, fii, value, inherited) 
                              SELECT tP.id AS pid, tD.fid, tD.fii, tD.value, tD.inherited
                                FROM " . $classname::_tablename() . " AS tP
                                JOIN " . static::$dbprefix . static::data_table . " AS tD
                               WHERE tD.pid = " . (int)$this->Owner->id . " AND fid = " . (int)$this->id . " AND tP.id IN (" . implode(", ", $temp) . ")";
                static::$SQL->query($SQL_query);
            }
        }
    }
    
    
    protected static function parseCSV($text)
    {
        $csv = new \SOME\CSV($text);
        $data = array();
        
        list($currentStep) = each(array_filter($csv->data[0], 'trim'));
        $backtrace = array(array($currentStep, &$data));
        $last = null;
        
        for ($i = 0; $i < count($csv->data); $i++) {
            $row = $csv->data[$i];
            list($step) = each(array_filter($row, 'trim'));
        
            if ($step != $currentStep) {
                for ($j = 0; ($j < count($backtrace)) && ($backtrace[$j][0] <= $step); $j++);
                if ($j >= count($backtrace)) {
                    $last['children'] = array();
                    $backtrace[] = array($step, &$last['children']);
                } else {
                    $backtrace = array_slice($backtrace, 0, $j);
                }
                $currentStep = $step;
            }
            $row = array_slice($row, $currentStep);
            
            $val = trim(isset($row[0]) ? $row[0] : '');
            $key = trim(isset($row[1]) && $row[1] ? $row[1] : $row[0]);
            $backtrace[count($backtrace) - 1][1][$key] = array('name' => $val);
            $last =& $backtrace[count($backtrace) - 1][1][$key];
        }
        
        return $data;
    }
    
    
    protected static function parseINI($text)
    {
        $ini = @parse_ini_string($text);
        $data = array();
        foreach ($ini as $key => $val) {
            $data[trim($key)] = array('name' => trim($val));
        }
        return $data;
    }
    
    
    protected static function parseXML($text)
    {
        $data = array();
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
                $data[$key] = array('name' => $val);
                if ($temp = static::parseXML($row)) {
                    $data[$key]['children'] = $temp;
                }
            }
        }
        return $data;
    }
    
    
    protected static function parseSQL($text, $pid = 0)
    {
        $data = array();
        if (is_array($text)) {
            $SQL_result = $text;
        } else {
            if (preg_match('/(INSERT )|(UPDATE )|(DELETE )|(FILE )|(CREATE )|(ALTER )|(INDEX )|(DROP )|(REPLACE )/i', $text)) {
                return $data;
            } 
            $SQL_result = static::$SQL->get((string)$text);
        }
        if ($SQL_result) {
            $rawData = array_values(array_filter($SQL_result, create_function('$x', '$v = "' . addslashes($pid) . '"; return ($x["pid"] == $v) || (!$x["pid"] && !$v);')));
            foreach ($rawData as $row) {
                $val = trim(isset($row['name']) && trim($row['name']) ? $row['name'] : array_shift(array_values($row)));
                $key = trim(isset($row['val']) && trim($row['val']) ? $row['val'] : $val);
                $data[$key] = array('name' => $val);
                if ($temp = static::parseSQL($SQL_result, $key)) {
                    $data[$key]['children'] = $temp;
                }
            }
        }
        return $data;
    }
    
    
    protected static function parsePHP($text)
    {
        $data = array();
        if (is_array($text)) {
            $result = $text;
        } else {
            $result = @eval($text . ' ;');
        }
        if ($result) {
            foreach ((array)$result as $key => $arr) {
                $key = trim($key);
                $val = trim(is_array($arr) && isset($arr['name']) ? $arr['name'] : $arr);
                $data[$key] = array('name' => $val);
                if (isset($arr['children']) && ($temp = static::parsePHP($arr['children']))) {
                    $data[$key]['children'] = $temp;
                }
            }
        }
        return $data;
    }
    
    
    protected static function parseDictionary(Dictionary $Dictionary)
    {
        $data = array();
        foreach ($Dictionary->children as $row) {
            $key = $row->urn;
            $val = $row->name;
            $data[$key] = array('name' => $val);
            if ($temp = static::parseDictionary($row)) {
                $data[$key]['children'] = $temp;
            }
        }
        return $data;
    }
    

    protected function getCaption($key = '', $DATA = array())
    {
        if (!$DATA) {
            $DATA =& $this->stdSource;
        }
        if (isset($DATA[$key])) {
            return $DATA[$key]['name'];
        }
        foreach ($DATA as $k => $row) {
            if (isset($row['children']) && ($v = $this->getCaption($key, $row['children']))) {
                return $v;
            }
        }
        return null;
    }


    protected function getFromCaption($val = '', $DATA = array())
    {
        if (!$DATA) {
            $DATA =& $this->stdSource;
        }
        foreach ($DATA as $k => $row) {
            if (mb_strtolower(trim($row['name'])) == mb_strtolower(trim($val))) {
                return $k;
            }
            if (isset($row['children']) && ($v = $this->getFromCaption($val, $row['children']))) {
                return $v;
            }
        }
        return null;
    }

    
    protected function _stdSource()
    {
        if (!trim($this->source)) {
            return array();
        }
        switch ($this->source_type) {
            case 'csv':
                return (array)static::parseCSV($this->source);
                break;
            case 'ini':
                return (array)static::parseINI($this->source);
                break;
            case 'xml':
                return (array)static::parseXML($this->source);
                break;
            case 'sql':
                return (array)static::parseSQL($this->source);
                break;
            case 'php':
                return (array)static::parsePHP($this->source);
                break;
            case 'dictionary':
                $classname = static::DictionaryClass;
                return (array)static::parseDictionary(new $classname((int)$this->source));
                break;
        }
    }
    
    protected function _getFieldChildren(array $stdSource = array())
    {
        $temp = array();
        foreach ((array)$stdSource as $key => $val) {
            $Option = new Option(array('value' => $key, 'caption' => $val['name']));
            if (isset($val['children'])) {
                $Option->children = $this->_getFieldChildren($val['children']);
            }
            $temp[] = $Option;
        }
        return $temp;
    }


    public static function delete($object)
    {
        $object->deleteValues();
        parent::delete($object);
    }
}