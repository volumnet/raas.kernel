<?php
/**
 * Пользовательское поле
 */
declare(strict_types=1);

namespace RAAS;

use Exception;
use InvalidArgumentException;
use SOME\SOME;
use SOME\Text;

/**
 * Класс пользовательского поля
 *
 * <pre>Предустановленные типы:
 * <Стандартный источник> => array<
 *     string[] Значение пункта => [
 *         'name' => string Подпись пункта,
 *         'children' =>? <Стандартный источник>
 *     ]
 * >,
 * <ФАЙЛ> => [
 *     'tmp_name' => string Путь к файлу,
 *     'name' => string Названия файлов,
 *     'type' => string MIME-типы файлов,
 * ]</pre>
 * @property SOME|null $Owner Сущность, к которому относится поле с данными
 * @property-read Field $Field Поле для RAAS-формы
 * @property-read bool $inherited Наследуемое поле
 * @property-read array $stdSource Стандартный источник
 */
abstract class CustomField extends SOME
{
    /**
     * Таблица данных
     */
    const DATA_TABLE = '';

    /**
     * Класс справочника
     */
    const DICTIONARY_CLASS = '';

    /**
     * Класс поля по умолчанию
     */
    const DEFAULT_CLASSNAME = SOME::class;

    /**
     * Кэш значений
     * @var array <pre><code>array<string[] ID# владельца => array<
     *     string[] ID# поля => mixed[] Значения
     * >></code></pre>
     */
    public static $cache = [];

    protected $Owner;

    protected static $tablename = '';

    protected static $defaultOrderBy = "priority";

    protected static $cognizableVars = ['stdSource'];

    /**
     * Кэш источников данных
     * @var array <pre><code>array<
     *     string[] ID# поля => array stdSource поля
     * ></code></pre>
     */
    public static $sourceCache = [];

    /**
     * Кэш соответствия значений и наименований по источникам данных
     * @var array <pre><code>array<
     *     string[] ID# поля => array<
     *         string[] Значение => string Наименование
     *     >
     * ></code></pre>
     */
    public static $sourceAssocCache = [];

    /**
     * Кэш соответствия наименований и значений по источникам данных
     * @var array <pre><code>array<
     *     string[] ID# поля => array<
     *         string[] Наименование (приведено к нижнему регистру) => string Значение
     *     >
     * ></code></pre>
     */
    public static $sourceAssocCacheReverse = [];

    /**
     * Типы полей
     * @var string[]
     */
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

    /**
     * Типы источников данных
     * @var string[]
     */
    public static $sourceTypes = ['dictionary', 'ini', 'csv', 'xml', 'sql', 'php'];


    public function __get($var)
    {
        switch ($var) {
            case 'Owner':
                return $this->Owner;
                break;
            case 'datatypeStrategy':
                return DatatypeStrategy::spawn($this->datatype);
                break;
            case 'sourceStrategy':
                // 2025-01-14, AVS: непонятно почему, но SourceStrategy::spawn('') валит Apache без записи в логи
                if (!$this->source_type) {
                    return null;
                }
                try {
                    return SourceStrategy::spawn((string)$this->source_type);
                } catch (Exception $e) {
                }
                return null;
                break;
            case 'Field':
                $result = new Field();
                $result->type = $this->datatype;
                foreach (['placeholder', 'pattern'] as $key) {
                    if ((string)$this->$key !== '') {
                        $result->$key = (string)$this->$key;
                    }
                }
                foreach (['maxlength'] as $key) {
                    if ((int)$this->$key) {
                        $result->$key = (int)$this->$key;
                    }
                }
                foreach (['required', 'multiple'] as $key) {
                    if ((int)$this->$key) {
                        $result->$key = (bool)(int)$this->$key;
                    }
                }
                foreach (['min_val', 'max_val', 'step'] as $key) {
                    if ((float)$this->$key) {
                        $result->{str_replace('_val', '', $key)} = (float)$this->$key;
                    }
                }
                $result->name = $this->urn;
                $result->caption = $this->name;
                $result->children = $this->_getFieldChildren((array)$this->_stdSource(), $result);
                $result->export = 'is_null';
                $result->import = function (Field $field) {
                    return $this->getValues();
                };
                $result->isMediaFilled = function (Field $field) {
                    return $this->isMediaFilled();
                };
                if ($this->datatypeStrategy->isMedia()) {
                    if ($this->source) {
                        $accept = explode(',', trim(mb_strtolower((string)$this->source)));
                        $accept = array_map(function ($x) {
                            $y = trim((string)$x);
                            if (($y[0] != '.') && !stristr($y, '/')) {
                                $y = '.' . $y;
                            }
                            return $y;
                        }, $accept);
                        $accept = implode(',', $accept);
                        $result->accept = $accept;
                    }
                } else {
                    // 2015-07-06, AVS: добавил && (!$this->multiple || $this->required),
                    // чтобы автоматом не подставлял первое попавшееся
                    // во множественном
                    if (!$this->multiple || $this->required) {
                        $result->default = $this->defval;
                    }
                    if (in_array($this->datatype, ['text', 'number', 'range']) && $this->source) {
                        $result->unit = $this->source;
                    }
                }
                $result->meta['CustomField'] = $this;
                $result->oncommit = function (Field $field) {
                    return $this->oncommit($field);
                };
                return $result;
                break;
            case 'inherited':
                if ($this->Owner) {
                    $sqlQuery = "SELECT MIN(inherited)
                                   FROM " . static::$dbprefix . static::DATA_TABLE . "
                                  WHERE pid = ?
                                    AND fid = ?";
                    $sqlBind = [(int)$this->Owner->id, (int)$this->id];
                    return (bool)(int)static::$SQL->getvalue([$sqlQuery, $sqlBind]);
                }
                return false;
                break;
            default:
                return parent::__get($var);
                break;
        }
    }


    public function __set($var, $val)
    {
        switch ($var) {
            case 'Owner':
                if ($val instanceof SOME) {
                    $this->Owner = $val;
                }
                break;
            default:
                return parent::__set($var, $val);
                break;
        }
    }


    /**
     * Проверяет предзаполненность медиа-поля
     * @return bool
     */
    public function isMediaFilled(): bool
    {
        if (!$this->datatypeStrategy->isMedia()) {
            return false;
        }
        $filesData = $this->datatypeStrategy->getFilesData($this, true, true);
        foreach ($filesData as $fileData) {
            if ((int)($fileData['meta']['attachment'] ?? 0)) {
                return true;
            }
        }
        return false;
    }


    /**
     * Создает либо обрабатывает существующее вложение для сущности
     * @param array $fileData <pre><code>[
     *     'tmp_name' => string Путь к файлу,
     *     'name' => string Название файла,
     *     'type' => string MIME-тип файла,
     *     'copy' =>? bool Скопировать файл вместо перемещения
     * ]</code></pre>
     * @return Attachment|null
     */
    public function processAttachment(array $fileData)
    {
        if ($this->datatypeStrategy->isFileLoaded($fileData['tmp_name'] ?? '', Application::i()->debug)) {
            $attachment = new Attachment();

            $attachment->upload = $fileData['tmp_name'];
            if (!is_uploaded_file($fileData['tmp_name']) || ($fileData['copy'] ?? false)) {
                $attachment->copy = true;
            }
            $attachment->filename = $fileData['name'];
            $attachment->parent = $this;
            $attachment->mime = $fileData['type'];
            if ($this->datatype == 'image') {
                $attachment->image = 1;
                if ($maxSize = $this->getMaxSize()) {
                    $attachment->maxWidth = $attachment->maxHeight = $maxSize;
                }
                if ($tnSize = $this->getTnSize()) {
                    $attachment->tnsize = $tnSize;
                }
            }
            $attachment->commit();
            return $attachment;
        }
        return null;
    }


    /**
     * Возвращает максимальный размер изображения в пикселях
     * @return int
     */
    public function getMaxSize(): int
    {
        $result = (int)Application::i()->context->registryGet('maxsize');
        return $result;
    }


    /**
     * Возвращает размер эскиза в пикселях
     * @return int
     */
    public function getTnSize(): int
    {
        $result = (int)Application::i()->context->registryGet('tnsize');
        return $result;
    }


    public function oncommit(Field $field)
    {
        $this->deleteValues();
        if ($this->datatypeStrategy->isMedia()) {
            $filesData = $this->datatypeStrategy->getFilesData($this, true, true);
            foreach ($filesData as $key => $fileData) {
                // 2017-09-05, AVS: убрал создание attachment'а по ID#, чтобы не было конфликтов
                // в случае дублирования материалов с одним attachment'ом
                // с текущего момента каждый новый загруженный файл - это новый attachment
                $attachment = $this->processAttachment($fileData);
                $oldAttachmentId = (int)($fileData['meta']['attachment'] ?? null);
                if (!$attachment && $oldAttachmentId) {
                    $attachment = new Attachment($oldAttachmentId);
                }
                if ($attachment && $attachment->id) {
                    $value = $this->datatypeStrategy->export($attachment);
                    if ($value !== null) {
                        $this->addValue($value);
                    }
                }
            }
            $this->clearLostAttachments();
        } else {
            $postData = $this->datatypeStrategy->getPostData($this, true);
            foreach ($postData as $key => $value) {
                $value = $this->datatypeStrategy->export($value);
                if ($value !== null) {
                    $this->addValue($value);
                }
            }
        }
    }


    /**
     * Предполучение значений для кэша
     * @param int[]|SOME[] $parents Родительские объекты
     * @param int[]|self[] $fields Поля
     */
    public static function prefetch(array $parents = [], array $fields = [])
    {
        if (!$parents && !$fields) {
            return;
        }
        $parentsIds = array_map(function ($x) {
            if ($x instanceof SOME) {
                return (int)$x->id;
            }
            return (int)$x;
        }, $parents);
        $fieldsIds = array_map(function ($x) {
            if ($x instanceof SOME) {
                return (int)$x->id;
            }
            return (int)$x;
        }, $fields);
        $sqlQuery = "SELECT pid, fid, fii, value
                       FROM " . static::$dbprefix . static::DATA_TABLE;
        $sqlWhere = [];
        if ($parentsIds) {
            $sqlWhere[] = "pid IN (" . implode(", ", $parentsIds) . ")";
        }
        if ($fieldsIds) {
            $sqlWhere[] = "fid IN (" . implode(", ", $fieldsIds) . ")";
        }
        if ($sqlWhere) {
            $sqlQuery .= " WHERE " . implode(" AND ", $sqlWhere);
        }
        $sqlQuery .= " ORDER BY fii";
        $sqlResult = static::$SQL->get($sqlQuery);
        foreach ($sqlResult as $sqlRow) {
            static::$cache[trim((string)$sqlRow['pid'])][trim((string)$sqlRow['fid'])][trim((string)$sqlRow['fii'])] = $sqlRow['value'];
        }
    }


    /**
     * Предполучает значение кэша поля относительно одного родителя,
     * если не существует
     * @param ?SOME $parent Родительский объект, для которого нужно получить кэш
     *     Если не задан, получает относительно Owner'а
     */
    public function prefetchIfNotExists(?SOME $parent = null)
    {
        if (!$parent) {
            $parent = $this->Owner;
        }
        if (!isset(static::$cache[$parent->id][$this->id])) {
            static::prefetch([$parent], [$this]);
        }
    }


    /**
     * Чистит внутренний кэш
     */
    public static function clearCache()
    {
        static::$cache = [];
        static::$sourceCache = [];
        static::$sourceAssocCache = [];
        static::$sourceAssocCacheReverse = [];
    }


    public function commit()
    {
        if (!$this->id || !$this->priority) {
            $sqlQuery = "SELECT MAX(priority) FROM " . static::_tablename();
            $this->priority = static::$SQL->getvalue($sqlQuery) + 1;
        }
        if (!$this->urn && $this->name) {
            $this->urn = Text::beautify($this->name);
        }
        if (!$this->classname) {
            $this->classname = static::$references['parent']['classname'] ?? SOME::class;
        }
        $sqlQuery = "SELECT COUNT(*)
                       FROM " . static::_tablename() . "
                      WHERE urn = ?
                        AND classname = ?
                        AND pid = ?
                        AND id != ?";
        while (in_array($this->urn, ['name', 'description']) ||
            (int)static::$SQL->getvalue([$sqlQuery, $this->urn, $this->classname, (int)$this->pid, (int)$this->id])
        ) {
            $this->urn = '_' . $this->urn . '_';
        }
        parent::commit();
    }


    /**
     * Проверяет, заполнено ли поле
     * @param mixed $val Значение для проверки
     * @return bool
     */
    public function isFilled($value)
    {
        return $this->datatypeStrategy->isFilled($value, Application::i()->debug);
    }


    /**
     * Проверяет, корректно ли заполнено поле
     * !!! ВАЖНО: 2023-12-01 изменен интерфейс для медиа-полей: $value должно быть типа <ФАЙЛ>
     * @param mixed $val Значение для проверки
     * @return bool
     */
    public function validate($value)
    {
        try {
            return $this->datatypeStrategy->validate($value, $this->Field);
        } catch (Exception $e) {
            return false;
        }
    }


    /**
     * Возвращает "сырое" значение по индексу
     * @param int $index Индекс (начиная с 0)
     * @return mixed
     */
    public function getRawValue($index = 0)
    {
        if (!$this->Owner || !static::DATA_TABLE) {
            return null;
        }
        $this->prefetchIfNotExists();
        $value = null;
        if (isset(static::$cache[$this->Owner->id][$this->id][$index])) {
            $value = static::$cache[$this->Owner->id][$this->id][$index];
        }
        return $value;
    }


    /**
     * Возвращает первично обработанное значение по индексу
     * @param int $index Индекс (начиная с 0)
     * @return mixed
     */
    public function getValue($index = 0)
    {
        if (!$this->Owner || !static::DATA_TABLE) {
            return null;
        }
        $value = $this->getRawValue($index);
        $result = $this->datatypeStrategy->import($value);
        return $result;
    }


    /**
     * Возвращает сырое значение (значения) поля
     * @param bool $forceArray Представить в виде массива, даже если значение одно
     * @return mixed Значение поля, если поле одиночное и не установлен $forceArray, массив значений в противном случае
     */
    public function getRawValues($forceArray = false)
    {
        if (!$this->Owner || !static::DATA_TABLE) {
            return null;
        }
        if (!$this->multiple && !$forceArray) {
            return $this->getRawValue();
        }
        $this->prefetchIfNotExists();
        $values = null;
        if (isset(static::$cache[$this->Owner->id][$this->id])) {
            $values = static::$cache[$this->Owner->id][$this->id];
        }
        if ($forceArray) {
            $values = (array)$values;
            // 2022-01-26, AVS: Если хотим получить массив, то принудительно приводим к массиву,
            // иначе возникают ошибки во многих местах
        }
        return $values;
    }


    /**
     * Возвращает значение (значения) поля
     * @param bool $forceArray Представить в виде массива, даже если значение одно
     * @return mixed Значение поля, если поле одиночное и не установлен $forceArray, массив значений в противном случае
     */
    public function getValues($forceArray = false)
    {
        if (!$this->Owner || !static::DATA_TABLE) {
            return null;
        }
        if (!$this->multiple && !$forceArray) {
            return $this->getValue();
        }
        $values = $this->getRawValues($forceArray);
        $values = $this->datatypeStrategy->batchImport((array)$values);
        return $values;
    }


    /**
     * Возвращает человеко-понятное значение
     * @param mixed $x "Сырое" значение (используется первое текущее, если null)
     * @return mixed
     */
    public function doRich($value = null)
    {
        if ($value === null) {
            $value = $this->getValue();
        }
        if ($this->sourceStrategy) {
            $result = $this->getCaption($value);
        } elseif (($this->datatype == 'checkbox') && !$this->multiple) {
            $result = (bool)$value;
        } else {
            $result = $value;
        }
        return $result;
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
     * @return mixed Значение поля, если поле одиночное и не установлен $forceArray, массив значений в противном случае
     */
    public function getRichValues($forceArray = false)
    {
        if (!$this->multiple && !$forceArray) {
            return $this->getRichValue();
        }
        $values = $this->getValues(true);
        $result = array_map(function ($x) {
            return $this->doRich($x);
        }, $values);
        return $result;
    }


    /**
     * Возвращает "склеенную" строку человеко-понятных значений
     * @param string $separator Разделитель значений
     * @return string
     */
    public function getRichString($separator = ', ')
    {
        $richValues = $this->getRichValues(true);
        $result = [];
        foreach ($richValues as $richValue) {
            if (is_object($richValue)) {
                $result[] = $richValue->name;
            } else {
                $result[] = $richValue;
            }
        }
        $result = implode($separator, $result);
        return $result;
    }


    /**
     * Возвращает "сырое" значение из человеко-понятного
     * @param mixed $x Человеко-понятное значение
     * @return mixed
     */
    public function fromRich($value = null)
    {
        if ($this->sourceStrategy) {
            return $this->getFromCaption($value);
        } elseif (($this->datatype == 'checkbox') && !$this->multiple) {
            return (bool)$value;
        }
        return $value;
    }


    /**
     * Возвращает количество значений в множественном поле
     * @return int
     */
    public function countValues()
    {
        if (!$this->Owner || !static::DATA_TABLE) {
            return null;
        }
        $this->prefetchIfNotExists();
        if (static::$cache[$this->Owner->id][$this->id] ?? false) {
            // 2021-01-12, AVS: исправил, иначе каждый раз при одной записи
            // выдает 0 и перезаписывает множественное поле в один индекс
            return max(array_keys(static::$cache[$this->Owner->id][$this->id])) + 1;
        }
        return 0;
    }


    /**
     * Устанавливает значение поля
     * @param mixed $value Значение для установки
     * @param int $index Индекс значения
     * @return mixed|null Исходное значение, если удалось установить,
     *     null в противном случае
     */
    public function setValue($value, $index = 0)
    {
        if (!$this->Owner || !static::DATA_TABLE) {
            return null;
        }
        $this->prefetchIfNotExists();
        $arr = [
            'pid' => (int)$this->Owner->id,
            'fid' => (int)$this->id,
            'fii' => (int)$index,
            'value' => $value
        ];
        static::$SQL->add(static::$dbprefix . static::DATA_TABLE, $arr);
        static::$cache[trim((string)$this->Owner->id)][trim((string)$this->id)][trim((string)$index)] = $value;
        return $value;
    }


    /**
     * Добавляет значение поля, смещая индексы
     * @param mixed $value Значение для установки
     * @param int|null $index Индекс значения, null если добавить в конец
     * @return mixed|null Исходное значение, если удалось установить,
     *     null в противном случае
     */
    public function addValue($value, $index = null)
    {
        if (!$this->Owner || !static::DATA_TABLE) {
            return null;
        }
        $sqlBind = [(int)$this->Owner->id, (int)$this->id, (int)$index];
        if ($index === null) {
            $index = $this->countValues();
        } else {
            $this->prefetchIfNotExists();
            if (isset(static::$cache[$this->Owner->id][$this->id])) {
                array_splice(static::$cache[$this->Owner->id][$this->id], $index, 0, [null]);
            }
            $sqlQuery = "UPDATE " . static::$dbprefix . static::DATA_TABLE . "
                            SET fii = fii + 1
                          WHERE pid = ?
                            AND fid = ?
                            AND fii >= ?
                       ORDER BY fii DESC";
            static::$SQL->query([$sqlQuery, $sqlBind]);
        }
        return $this->setValue($value, $index);
    }


    /**
     * Удаляет значение поля, смещая индексы
     * @param int|null $index Индекс значения
     */
    public function deleteValue($index = 0)
    {
        if (!$this->Owner || !static::DATA_TABLE) {
            return null;
        }
        $this->prefetchIfNotExists();
        $sqlQuery = "DELETE FROM " . static::$dbprefix . static::DATA_TABLE . "
                      WHERE pid = ?
                        AND fid = ?
                        AND fii = ?";
        $sqlBind = [(int)$this->Owner->id, (int)$this->id, (int)$index];
        static::$SQL->query([$sqlQuery, $sqlBind]);
        $sqlQuery = "UPDATE " . static::$dbprefix . static::DATA_TABLE . "
                        SET fii = fii - 1
                      WHERE pid = ?
                        AND fid = ?
                        AND fii > ?
                   ORDER BY fii ASC";
        static::$SQL->query([$sqlQuery, $sqlBind]);
        if (isset(static::$cache[$this->Owner->id][$this->id])) {
            array_splice(static::$cache[$this->Owner->id][$this->id], $index, 1);
        }
    }


    /**
     * Удаляет все значения поля
     */
    public function deleteValues()
    {
        if (!$this->Owner || !static::DATA_TABLE) {
            return null;
        }
        $sqlQuery = "DELETE FROM " . static::$dbprefix . static::DATA_TABLE . "
                      WHERE pid = ?
                        AND fid = ?";
        $sqlBind = [(int)$this->Owner->id, (int)$this->id];
        static::$SQL->query([$sqlQuery, $sqlBind]);
        if (isset(static::$cache[$this->Owner->id][$this->id])) {
            unset(static::$cache[$this->Owner->id][$this->id]);
        }
    }


    /**
     * Очищает "потерянные" вложения (для которых нет записей в таблице данных
     * для данного типа поля)
     */
    public function clearLostAttachments()
    {
        if ($this->datatypeStrategy->isMedia()) {
            $sqlQuery = "SELECT value
                           FROM " . static::$dbprefix . static::DATA_TABLE . "
                          WHERE fid = " . (int)$this->id;
            $sqlResult = static::$SQL->getcol($sqlQuery);
            $affectedIds = $this->datatypeStrategy->batchImportAttachmentsIds($sqlResult);

            $sqlQuery = "SELECT *
                           FROM " . Attachment::_tablename() . "
                          WHERE classname = '" . self::$SQL->real_escape_string(get_class($this)) . "'
                            AND pid = " . (int)$this->id;
            if ($affectedIds) {
                $sqlQuery .= " AND id NOT IN (" . implode(", ", $affectedIds) . ")";
            }
            $sqlResult = Attachment::getSQLSet($sqlQuery);
            if ($sqlResult) {
                Attachment::batchDelete($sqlResult);
            }
        }
    }


    /**
     * Наследует значения поля
     */
    public function inheritValues()
    {
        $sqlQuery = "UPDATE " . static::$dbprefix . static::DATA_TABLE . "
                        SET inherited = 1
                      WHERE pid = ?
                        AND fid = ?";
        $sqlBind = [(int)$this->Owner->id, (int)$this->id];
        static::$SQL->query([$sqlQuery, $sqlBind]);

        if ($this->Owner->all_children_ids && is_array($this->Owner->all_children_ids)) {
            if ($temp = array_values(array_map('intval', array_filter($this->Owner->all_children_ids, 'intval')))) {
                $sqlQuery = "DELETE FROM " . static::$dbprefix . static::DATA_TABLE . "
                              WHERE fid = " . (int)$this->id . "
                                AND pid IN (" . implode(", ", $temp) . ")";
                static::$SQL->query($sqlQuery);

                $classname = get_class($this->Owner);

                $sqlQuery = "SELECT tP.id AS pid, tD.fid, tD.fii, tD.value, tD.inherited
                               FROM " . $classname::_tablename() . " AS tP
                               JOIN " . static::$dbprefix . static::DATA_TABLE . " AS tD
                              WHERE tD.pid = " . (int)$this->Owner->id . "
                                AND fid = " . (int)$this->id . "
                                AND tP.id IN (" . implode(", ", $temp) . ")";
                $sqlResult = static::$SQL->get($sqlQuery);

                static::$SQL->add(static::$dbprefix . static::DATA_TABLE, $sqlResult);
            }
        }
    }


    /**
     * Получает подпись к значению
     * @param mixed $key Значение для обработки
     * @return string
     */
    protected function getCaption($key = '')
    {
        if (trim((string)$key) === '') {
            return null;
        }
        if (!$this->id || !(static::$sourceAssocCache[$this->id] ?? false)) {
            $this->stdSource; // Вызовем для формирования ассоциативного массива
        }
        $result = static::$sourceAssocCache[$this->id][$key] ?? $key;
        return $result;
    }


    /**
     * Получает значение из подписи
     * @param mixed $val Подпись для обработки
     * @return mixed
     */
    protected function getFromCaption($val = '')
    {
        if (!$val) {
            return null;
        }
        if (!(static::$sourceAssocCacheReverse[$this->id] ?? null)) {
            $this->stdSource; // Вызовем для формирования ассоциативного массива
        }
        $result = static::$sourceAssocCacheReverse[$this->id][mb_strtolower(trim((string)$val))] ?? null;
        return $result;
    }


    /**
     * Возвращает стандартный источник поля
     * @return array <pre><Стандартный источник></pre>
     */
    protected function _stdSource()
    {
        if (!$this->source_type || !trim((string)$this->source)) {
            return [];
        }
        if ($this->id && isset(static::$sourceCache[$this->id]) && static::$sourceCache[$this->id]) {
            return static::$sourceCache[$this->id];
        }
        $result = [];

        $source = $this->source;
        if ($this->source_type == 'dictionary') {
            $classname = static::DICTIONARY_CLASS;
            $source = new $classname((int)$source);
        }
        $result = $this->sourceStrategy->parse($source);

        static::$sourceCache[trim((string)$this->id)] = $result;
        static::$sourceAssocCache[trim((string)$this->id)] = $this->getSourceAssoc($result);
        static::$sourceAssocCacheReverse[trim((string)$this->id)] = [];
        foreach (static::$sourceAssocCache[trim((string)$this->id)] as $key => $val) {
            static::$sourceAssocCacheReverse[trim((string)$this->id)][trim(mb_strtolower((string)$val))] = $key;
        }
        return $result;
    }


    /**
     * Определяет ассоциации по источнику данных
     * @param array $source Источник данных stdSource
     * @return array <pre><code>array<
     *     string[] Значение => string Наименование
     * ></code></pre>
     */
    protected function getSourceAssoc(array $source)
    {
        $result = [];
        foreach ($source as $key => $val) {
            $result[$key] = $val['name'];
            if (isset($val['children'])) {
                $result += $this->getSourceAssoc($val['children']);
            }
        }
        return $result;
    }


    /**
     * Возвращает набор опций для формы RAAS
     * @param array $stdSource <pre><Стандартный источник></pre> Источник поля
     * @param Field $parentField Родительское поле для опций
     * @return OptionCollection
     */
    protected function _getFieldChildren(array $stdSource, Field $parentField)
    {
        // 2020-07-27, AVS: добавил $level, чтобы не предлагал placeholder в
        // многоуровневых select'ах
        static $level = 0;
        $options = new OptionCollection();
        $options->Parent = $parentField;
        // 2022-03-29, AVS: убрал добавление опции по placeholder'у,
        // т.к. она отражена во Vue
        // if (!$parentField->required && !$level) {
        //     $option = new Option([
        //         'value' => '',
        //         'caption' => ($parentField->placeholder ?: '--')
        //     ]);
        //     $options[] = $option;
        // }
        foreach ((array)$stdSource as $key => $val) {
            $Option = new Option([
                'value' => $key,
                'caption' => $val['name']
            ]);
            if (isset($val['children'])) {
                $level++;
                $Option->children = $this->_getFieldChildren($val['children'], $parentField);
                $level--;
            }
            $options[] = $Option;
        }
        return $options;
    }


    public static function getSet(): array
    {
        $args = func_get_args();
        if (!isset($args[0]['where'])) {
            $args[0]['where'] = [];
        } else {
            $args[0]['where'] = (array)$args[0]['where'];
        }
        if ($classname = static::$references['parent']['classname'] ?? null) {
            $args[0]['where'][] = "classname = '" . static::$SQL->real_escape_string($classname) . "'";
        }
        // return call_user_func_array('parent::getSet', $args);
        $result = parent::getSet(...$args);
        return $result;
    }


    public function reorder()
    {
        $args = func_get_args();
        $step = $args[0] ?? 0;
        $where = (array)($args[1] ?? []);
        $priorityN = trim($args[2] ?? '');
        $where[] = "classname = '" . static::$SQL->real_escape_string($this->classname) . "'";
        $where = array_map(function ($x) {
            return "(" . $x . ")";
        }, $where);
        $where = implode(" AND ", $where);
        parent::reorder($step, $where, $priorityN);
    }


    /**
     * Меняет значение свойства "обязательно для заполнения"
     */
    public function required()
    {
        $this->required = (int)!(bool)$this->required;
        $this->commit();
    }


    public static function delete(SOME $object)
    {
        $sqlQuery = "DELETE FROM " . static::$dbprefix . static::DATA_TABLE . "
                      WHERE fid = ?";
        $sqlBind = [(int)$object->id];
        static::$SQL->query([$sqlQuery, $sqlBind]);
        foreach (static::$cache as $ownerId => $ownerFields) {
            if (isset(static::$cache[$ownerId][$object->id])) {
                unset(static::$cache[$ownerId][$object->id]);
            }
        }
        if ($object->datatypeStrategy->isMedia()) {
            $object->clearLostAttachments();
        }
        parent::delete($object);
    }
}
