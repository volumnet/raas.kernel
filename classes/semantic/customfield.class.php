<?php
namespace RAAS;

use SimpleXMLElement;
use SOME\CSV;
use SOME\SOME;

abstract class CustomField extends SOME
{
    const data_table = '';
    const DictionaryClass = '';

    protected $Owner;

    protected static $tablename = '';
    protected static $defaultOrderBy = "priority";

    protected static $cognizableVars = ['stdSource'];

    public static $fieldTypes = [
        'text',
        'color',
        'date',
        'datetime-local',
        'email',
        'number',
        'range',
        'tel',
        'time',
        'url',
        'month',
        /*'week',*/
        'password',
        'checkbox',
        'radio',
        'file',
        'image',
        'select',
        'textarea',
        'htmlarea'
    ];

    public static $sourceTypes = [
        'dictionary',
        'ini',
        'csv',
        'xml',
        'sql',
        'php'
    ];

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
                $f = new Field();
                $f->type = $this->datatype;
                foreach (['placeholder', 'pattern'] as $key) {
                    if ((string)$this->$key !== '') {
                        $f->$key = (string)$this->$key;
                    }
                }
                foreach (['required', 'maxlength', 'multiple'] as $key) {
                    if ((int)$this->$key) {
                        $f->$key = (int)$this->$key;
                    }
                }
                foreach (['min_val', 'max_val', 'step'] as $key) {
                    if ((float)$this->$key) {
                        $f->{str_replace('_val', '', $key)} = (float)$this->$key;
                    }
                }
                $f->name = $this->urn;
                $f->caption = $this->name;
                $f->children = $this->_getFieldChildren(
                    (array)$this->_stdSource(),
                    $f
                );
                $f->export = 'is_null';
                $f->import = function ($Field) use ($t) {
                    return $t->getValues();
                };
                // 2015-07-06, AVS: добавил && (!$t->multiple || $t->required),
                // чтобы автоматом не подставлял первое попавшееся
                // во множественном
                if (!in_array($t->datatype, ['image', 'file']) &&
                    (!$t->multiple || $t->required)
                ) {
                    $f->default = $t->defval;
                }
                if (in_array($t->datatype, ['image', 'file']) &&
                    $t->getValue()->id
                ) {
                    //$f->required = false;
                }
                $f->meta['CustomField'] = $t;
                $f->oncommit = function ($Field) use ($t) {
                    switch ($t->datatype) {
                        case 'file':
                        case 'image':
                            $t->deleteValues();
                            if ($Field->multiple) {
                                foreach ($_FILES[$Field->name]['tmp_name'] as $key => $val) {
                                    if (is_uploaded_file($_FILES[$Field->name]['tmp_name'][$key]) &&
                                        $t->validate($_FILES[$Field->name]['tmp_name'][$key])
                                    ) {
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
                                if (is_uploaded_file($_FILES[$Field->name]['tmp_name']) &&
                                    $t->validate($_FILES[$Field->name]['tmp_name'])
                                ) {
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
                    $sqlQuery = "SELECT MIN(inherited)
                                   FROM " . static::$dbprefix . static::data_table . "
                                  WHERE pid = ?
                                    AND fid = ?";
                    $sqlBind = [(int)$this->Owner->id, (int)$this->id];
                    return (bool)(int)static::$SQL->getvalue([
                        $sqlQuery,
                        $sqlBind
                    ]);
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
            $sqlQuery = "SELECT MAX(priority) FROM " . static::_tablename();
            $this->priority = static::$SQL->getvalue($sqlQuery) + 1;
        }
        if (!$this->urn && $this->name) {
            $this->urn = \SOME\Text::beautify($this->name);
        }
        if (!$this->classname) {
            $this->classname = static::$references['parent']['classname'];
        }
        $sqlQuery = "SELECT COUNT(*)
                       FROM " . static::_tablename() . "
                      WHERE urn = ?
                        AND classname = ?
                        AND pid = ?
                        AND id != ?";
        while (in_array($this->urn, ['name', 'description']) ||
            (int)static::$SQL->getvalue([
                $sqlQuery,
                $this->urn,
                $this->classname,
                (int)$this->pid,
                (int)$this->id
            ])
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


    /**
     * Возвращает "сырое" значение по индексу
     * @param int $index Индекс (начиная с 0)
     * @return mixed
     */
    public function getValue($index = 0)
    {
        if (!$this->Owner || !static::data_table) {
            return null;
        }
        $sqlQuery = "SELECT value
                       FROM " . static::$dbprefix . static::data_table . "
                      WHERE pid = ?
                        AND fid = ?
                        AND fii = ?";
        $sqlBind = [(int)$this->Owner->id, (int)$this->id, (int)$index];
        $value = static::$SQL->getvalue([$sqlQuery, $sqlBind]);
        switch ($this->datatype) {
            case 'image':
            case 'file':
                $att = new Attachment((int)$value);
                return $att;
                break;
            case 'number':
                return str_replace(',', '.', (float)$value);
                break;
            case 'datetime':
            case 'datetime-local':
                $value = str_replace(' ', 'T', $value);
                break;
        }
        return $value;
    }


    /**
     * Возвращает значение (значения) поля
     * @param bool $forceArray Представить в виде массива,
     *                         даже если значение одно
     * @return mixed Значение поля, если оно одно и не установлен $forceArray,
     *               массив значений в противном случае
     */
    public function getValues($forceArray = false)
    {
        if (!$this->Owner || !static::data_table) {
            return null;
        }
        if (!$this->multiple && !$forceArray) {
            return $this->getValue();
        }
        $sqlQuery = "SELECT value
                       FROM " . static::$dbprefix . static::data_table . "
                      WHERE pid = ?
                        AND fid = ?
                   ORDER BY fii ASC";
        $sqlBind = [(int)$this->Owner->id, (int)$this->id];
        $values = static::$SQL->getcol([$sqlQuery, $sqlBind]);
        switch ($this->datatype) {
            case 'image':
            case 'file':
                $values = array_map(
                    function ($x) {
                        return new Attachment((int)$x);
                    },
                    $values
                );
                break;
            case 'number':
                return array_map(
                    function ($x) {
                        return str_replace(',', '.', $x);
                    },
                    $values
                );
                break;
            case 'datetime':
            case 'datetime-local':
                $values = array_map(
                    function ($x) {
                        return str_replace(' ', 'T', $x);
                    },
                    $values
                );
                break;
        }
        return $values;
    }


    /**
     * Возвращает человеко-понятное значение
     * @param mixed $x "Сырое" значение (используется первое текущее, если null)
     * @return mixed
     */
    public function doRich($x = null)
    {
        if ($x === null) {
            $x = $this->getValue();
        }
        switch ($this->datatype) {
            case 'datetime':
            case 'datetime-local':
                $x = str_replace('T', ' ', $x);
                break;
            case 'number':
                return str_replace(',', '.', (float)$x);
                break;
            case 'checkbox':
            case 'radio':
            case 'select':
                if ($this->multiple || ($this->datatype != 'checkbox')) {
                    $x = $this->getCaption($x);
                } else {
                    $x = (bool)$x;
                }
                break;
        }
        return $x;
    }


    /**
     * Возвращает человеко-понятное значение по индексу
     * @param int $index Индекс (начиная с 0)
     * @return mixed
     */
    public function getRichValue($index = 0)
    {
        $val = $this->getValue($index);
        $result = $this->doRich($val);
        return $result;
    }


    /**
     * Возвращает человеко-понятное значение (значения) поля
     * @param bool $forceArray Представить в виде массива,
     *                         даже если значение одно
     * @return mixed Значение поля, если оно одно и не установлен $forceArray,
     *               массив значений в противном случае
     */
    public function getRichValues($forceArray = false)
    {
        $values = $this->getValues(true);
        $result = array_map(function ($x) {
            return $this->doRich($x);
        }, $values);
        if ((count($result) == 1) && !$forceArray) {
            $result = array_shift($result);
        }
        return $result;
    }


    /**
     * Возвращает "склеенную" строку человеко-понятных значений
     * @param string $separator Разделитель значений
     * @return string
     */
    public function getRichString($separator = ', ')
    {
        $richValues = array_map(function ($x) {
            if (is_object($x)) {
                return $x->name;
            } else {
                return $x;
            }
        }, $this->getRichValues(true));
        $result = implode($separator, $richValues);
        return $result;
    }


    public function fromRich($x = null)
    {
        switch ($this->datatype) {
            case 'datetime':
            case 'datetime-local':
                $x = str_replace('T', ' ', $x);
                $x = date('Y-m-d H:i:s', strtotime($x));
                break;
            case 'number':
                return str_replace(',', '.', (float)$x);
                break;
            case 'checkbox':
            case 'radio':
            case 'select':
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
        $sqlBind = [(int)$this->Owner->id, (int)$this->id];
        $sqlQuery = "SELECT MAX(fii)
                       FROM " . static::$dbprefix . static::data_table . "
                      WHERE pid = ?
                        AND fid = ?";
        $sqlResult = static::$SQL->getvalue([$sqlQuery, $sqlBind]);
        return ($sqlResult === null ? 0 : $sqlResult + 1);
    }


    public function setValue($value, $index = 0)
    {
        switch ($this->datatype) {
            case 'number':
                $value = (float)str_replace(',', '.', (float)$value);
                break;
            case 'datetime':
            case 'datetime-local':
                $value = str_replace('T', ' ', $value);
                break;
        }
        if (!$this->Owner || !static::data_table) {
            return null;
        }
        $arr = [
            'pid' => (int)$this->Owner->id,
            'fid' => (int)$this->id,
            'fii' => (int)$index,
            'value' => $value
        ];
        static::$SQL->add(static::$dbprefix . static::data_table, $arr);
        return $value;
    }


    public function addValue($value, $index = null)
    {
        if (!$this->Owner || !static::data_table) {
            return null;
        }
        $sqlBind = [(int)$this->Owner->id, (int)$this->id, (int)$index];
        if ($index === null) {
            $index = $this->countValues();
        } else {
            $sqlQuery = "UPDATE " . static::$dbprefix . static::data_table . "
                            SET fii = fii + 1
                          WHERE pid = ?
                            AND fid = ?
                            AND fii >= ?
                       ORDER BY fii DESC";
            static::$SQL->query([$sqlQuery, $sqlBind]);
        }
        $this->setValue($value, $index);
    }


    public function deleteValue($index = 0)
    {
        if (!$this->Owner || !static::data_table) {
            return null;
        }
        $sqlBind = [(int)$this->Owner->id, (int)$this->id, (int)$index];
        $sqlQuery = "DELETE FROM " . static::$dbprefix . static::data_table . "
                      WHERE pid = ?
                        AND fid = ?
                        AND fii = ?";
        static::$SQL->query([$sqlQuery, $sqlBind]);
        $sqlQuery = "UPDATE " . static::$dbprefix . static::data_table . "
                        SET fii = fii - 1
                      WHERE pid = ?
                        AND fid = ?
                        AND fii > ?
                   ORDER BY fii ASC";
        static::$SQL->query([$sqlQuery, $sqlBind]);
    }


    public function deleteValues()
    {
        if (!$this->Owner || !static::data_table) {
            return null;
        }
        $sqlQuery = "DELETE FROM " . static::$dbprefix . static::data_table . "
                      WHERE pid = ?
                        AND fid = ?";
        $sqlBind = [(int)$this->Owner->id, (int)$this->id];
        static::$SQL->query([$sqlQuery, $sqlBind]);
    }


    public function clearLostAttachments()
    {
        if (in_array($this->datatype, ['file', 'image'])) {
            $sqlQuery = "SELECT value
                           FROM " . static::$dbprefix . static::data_table . "
                          WHERE fid = " . (int)$this->id;
            $sqlResult = array_filter(static::$SQL->getcol($sqlQuery), 'intval');
            $sqlQuery = "SELECT *
                           FROM " . Attachment::_tablename() . "
                          WHERE classname = '" . self::$SQL->real_escape_string(get_class($this)) . "'
                            AND pid = " . (int)$this->id;
            if ($sqlResult) {
                $sqlQuery .= " AND id NOT IN (" . implode(", ", $sqlResult) . ")";
            }
            $sqlResult = Attachment::getSQLSet($sqlQuery);
            if ($sqlResult) {
                foreach ($sqlResult as $row) {
                    Attachment::delete($row);
                }
            }
        }
    }


    public function inheritValues()
    {
        $sqlQuery = "UPDATE " . static::$dbprefix . static::data_table . "
                        SET inherited = 1
                      WHERE pid = ?
                        AND fid = ?";
        $sqlBind = [(int)$this->Owner->id, (int)$this->id];
        static::$SQL->query([$sqlQuery, $sqlBind]);

        if ($this->Owner->all_children_ids &&
            is_array($this->Owner->all_children_ids)
        ) {
            if ($temp = array_values(array_map('intval', array_filter(
                $this->Owner->all_children_ids,
                'intval'
            )))) {
                $sqlQuery = "DELETE FROM " . static::$dbprefix . static::data_table . "
                              WHERE fid = " . (int)$this->id . "
                                AND pid IN (" . implode(", ", $temp) . ")";
                static::$SQL->query($sqlQuery);

                $classname = get_class($this->Owner);
                $sqlQuery = "INSERT INTO " . static::$dbprefix . static::data_table . " (pid, fid, fii, value, inherited)
                             SELECT tP.id AS pid, tD.fid, tD.fii, tD.value, tD.inherited
                               FROM " . $classname::_tablename() . " AS tP
                               JOIN " . static::$dbprefix . static::data_table . " AS tD
                              WHERE tD.pid = " . (int)$this->Owner->id . "
                                AND fid = " . (int)$this->id . "
                                AND tP.id IN (" . implode(", ", $temp) . ")";
                static::$SQL->query($sqlQuery);
            }
        }
    }


    protected static function parseCSV($text)
    {
        $csv = new CSV($text);
        $data = [];

        list($currentStep) = each(array_filter($csv->data[0], 'trim'));
        $backtrace = [[$currentStep, &$data]];
        $last = null;

        for ($i = 0; $i < count($csv->data); $i++) {
            $row = $csv->data[$i];
            list($step) = each(array_filter($row, 'trim'));

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

            $val = trim(isset($row[0]) ? $row[0] : '');
            $key = trim(isset($row[1]) && $row[1] ? $row[1] : $row[0]);
            $backtrace[count($backtrace) - 1][1][$key] = ['name' => $val];
            $last =& $backtrace[count($backtrace) - 1][1][$key];
        }

        return $data;
    }


    protected static function parseINI($text)
    {
        $ini = @parse_ini_string($text);
        $data = [];
        foreach ($ini as $key => $val) {
            $data[trim($key)] = ['name' => trim($val)];
        }
        return $data;
    }


    protected static function parseXML($text)
    {
        $data = [];
        if ($text instanceof SimpleXMLElement) {
            $sxe = $text;
        } else {
            try {
                $sxe = new SimpleXMLElement((string)$text);
            } catch (Exception $e) {
                try {
                    $sxe = new SimpleXMLElement(
                        '<dictionary>' . $text . '</dictionary>'
                    );
                } catch (Exception $e) {
                }
            }
        }
        if ($sxe) {
            foreach ($sxe->children() as $row) {
                if (isset($row['title']) && trim($row['title'])) {
                    $val = $row['title'];
                } elseif (isset($row['name']) && trim($row['name'])) {
                    $val = $row['name'];
                } else {
                    $val = $row->getName();
                }
                $val = trim($val);
                if (isset($row['value']) && trim($row['value'])) {
                    $key = $row['value'];
                } elseif (isset($row['id']) && trim($row['id'])) {
                    $key = $row['id'];
                } else {
                    $key = $val;
                }
                $key = trim($key);
                $data[$key] = ['name' => $val];
                if ($temp = static::parseXML($row)) {
                    $data[$key]['children'] = $temp;
                }
            }
        }
        return $data;
    }


    protected static function parseSQL($text, $pid = 0)
    {
        $data = [];
        if (is_array($text)) {
            $sqlResult = $text;
        } else {
            $rx = '/(INSERT )|(UPDATE )|(DELETE )|(FILE )|(CREATE )|(ALTER )|(INDEX )|(DROP )|(REPLACE )/i';
            if (preg_match($rx, $text)) {
                return $data;
            }
            $sqlResult = static::$SQL->get((string)$text);
        }
        if ($sqlResult) {
            // $rawData = array_values(array_filter($sqlResult, create_function('$x', '$v = "' . addslashes($pid) . '"; return ($x["pid"] == $v) || (!$x["pid"] && !$v);')));
            $rawData = array_values(
                array_filter(
                    $sqlResult,
                    function ($x) use ($pid) {
                        return ($x['pid'] == $pid) || (!$x['pid'] && !$pid);
                    }
                )
            );
            foreach ($rawData as $row) {
                if (isset($row['name']) && trim($row['name'])) {
                    $val = $row['name'];
                } else {
                    $val = array_shift(array_values($row));
                }
                $val = trim($val);
                if (isset($row['val']) && trim($row['val'])) {
                    $key = $row['val'];
                } else {
                    $key = $val;
                }
                $key = trim($key);
                $data[$key] = ['name' => $val];
                if ($temp = static::parseSQL($sqlResult, $key)) {
                    $data[$key]['children'] = $temp;
                }
            }
        }
        return $data;
    }


    protected static function parsePHP($text)
    {
        $data = [];
        if (is_array($text)) {
            $result = $text;
        } else {
            $result = @eval($text . ' ;');
        }
        if ($result) {
            foreach ((array)$result as $key => $arr) {
                $key = trim($key);
                if (is_array($arr)) {
                    $data[$key] = [];
                    if (isset($arr['name'])) {
                        $data[$key]['name'] = $arr['name'];
                    }
                    if (isset($arr['children']) &&
                        ($temp = static::parsePHP($arr['children']))
                    ) {
                        $data[$key]['children'] = $temp;
                    }
                } else {
                    $data[$key] = ['name' => trim($arr)];
                }
            }
        }
        return $data;
    }


    protected static function parseDictionary(Dictionary $Dictionary)
    {
        $data = [];
        foreach ($Dictionary->children as $row) {
            $key = $row->urn;
            $val = $row->name;
            $data[$key] = ['name' => $val];
            if ($temp = static::parseDictionary($row)) {
                $data[$key]['children'] = $temp;
            }
        }
        return $data;
    }


    protected function getCaption($key = '', $DATA = [])
    {
        if (!$DATA) {
            $DATA =& $this->stdSource;
        }
        if (isset($DATA[$key])) {
            return $DATA[$key]['name'];
        }
        foreach ($DATA as $k => $row) {
            if (isset($row['children']) &&
                ($v = $this->getCaption($key, $row['children']))
            ) {
                return $v;
            }
        }
        return null;
    }


    protected function getFromCaption($val = '', $DATA = [])
    {
        if (!$DATA) {
            $DATA =& $this->stdSource;
        }
        foreach ($DATA as $k => $row) {
            if (mb_strtolower(trim($row['name'])) == mb_strtolower(trim($val))) {
                return $k;
            }
            if (isset($row['children']) &&
                ($v = $this->getFromCaption($val, $row['children']))
            ) {
                return $v;
            }
        }
        return null;
    }


    protected function _stdSource()
    {
        if (!trim($this->source)) {
            return [];
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
                return (array)static::parseDictionary(
                    new $classname((int)$this->source)
                );
                break;
        }
    }

    protected function _getFieldChildren(array $stdSource, Field $parentField)
    {
        // 2020-07-27, AVS: добавил $level, чтобы не предлагал placeholder в
        // многоуровневых select'ах
        static $level = 0;
        $options = new OptionCollection();
        $options->Parent = $parentField;
        if (!$parentField->required && !$level) {
            $option = new Option([
                'value' => '',
                'caption' => ($parentField->placeholder ?: '--')
            ]);
            $options[] = $option;
        }
        foreach ((array)$stdSource as $key => $val) {
            $Option = new Option([
                'value' => $key,
                'caption' => $val['name']
            ]);
            if (isset($val['children'])) {
                $level++;
                $Option->children = $this->_getFieldChildren(
                    $val['children'],
                    $parentField
                );
                $level--;
            }
            $options[] = $Option;
        }
        return $options;
    }


    public static function getSet()
    {
        $args = func_get_args();
        if (!isset($args[0]['where'])) {
            $args[0]['where'] = [];
        } else {
            $args[0]['where'] = (array)$args[0]['where'];
        }
        if ($classname = static::$references['parent']['classname']) {
            $args[0]['where'][] = "classname = '" . static::$SQL->real_escape_string($classname) . "'";
        }
        return call_user_func_array('parent::getSet', $args);
    }


    public function reorder()
    {
        list($step, $where, $priorityN) = func_get_args();
        $where = (array)$where;
        $where[] = "classname = '" . static::$SQL->real_escape_string($this->classname) . "'";
        $where = array_map(
            function ($x) {
                return "(" . $x . ")";
            },
            $where
        );
        $where = implode(" AND ", $where);
        parent::reorder($step, $where, $priorityN);
    }


    public static function delete($object)
    {
        $object->deleteValues();
        parent::delete($object);
    }
}
