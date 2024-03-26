<?php
/**
 * Абстрактный справочник
 */
declare(strict_types=1);

namespace RAAS;

use Exception;
use SimpleXMLElement;
use SOME\CSV;
use SOME\SOME;

/**
 * Класс абстрактного справочника
 * @property-read self $parent Родительский справочник
 * @property-read self[] $children Дочерние справочники
 * @property-read self[] $parents Цепочка родительских справочников
 */
abstract class Dictionary extends SOME
{
    protected static $tablename = '';

    protected static $defaultOrderBy = "priority";

    protected static $cognizableVars = [];

    protected static $parents = ['parents' => 'parent'];

    protected static $children = []; // Переопределяется методом _children()

    protected static $references = []; // Переопределяется методом _references()

    protected static $links = [];

    /**
     * Доступные сортировки
     * @var array <pre><code>array<string[] Значение сортировки => string Ключ названия сортировки></code></pre>
     */
    public static $ordersBy = ['id' => 'ID', 'urn' => 'URN', 'name' => 'NAME', 'priority' => 'MANUAL'];

    /**
     * Доступные расширения для загрузки
     * @var string[]
     */
    public static $availableExtensions = ['csv', 'ini', 'xml', 'sql'];

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


    /**
     * Разбирает стандартный источник
     * @param array $source <pre><code>array<string[] Значение => [
     *     'name' => string Заголовок,
     *     'children' =>? (рекурсивно)
     * ]></code></pre> источник
     */
    public function parseStdSource(array $source)
    {
        foreach ($source as $value => $entryData) {
            $child = self::exportByNameURN((string)($entryData['name'] ?? $value), (string)$value, $this);
            if (is_array($entryData['children'] ?? null)) {
                $child->parseStdSource($entryData['children']);
            }
        }
    }


    /**
     * Разбирает CSV-текст
     * @param string $source CSV-текст
     * @deprecated
     */
    public function parseCSV(string $source)
    {
        $stdSource = CSVSourceStrategy::i()->parse($source);
        $this->parseStdSource($stdSource);
    }


    /**
     * Разбирает INI-текст
     * @param string $source INI-текст
     * @deprecated
     */
    public function parseINI(string $source)
    {
        $stdSource = INISourceStrategy::i()->parse($source);
        $this->parseStdSource($stdSource);
    }


    /**
     * Разбирает XML-текст
     * @param string $source XML-текст
     * @deprecated
     */
    public function parseXML(string $source)
    {
        $stdSource = XMLSourceStrategy::i()->parse($source);
        $this->parseStdSource($stdSource);
    }


    /**
     * Разбирает SQL-запрос
     * @param string $source SQL-запрос
     * @deprecated
     */
    public function parseSQL(string $source)
    {
        $stdSource = SQLSourceStrategy::i()->parse($source);
        $this->parseStdSource($stdSource);
    }


    /**
     * Сохраняет запись справочника по URN и заголовку
     * @param string|null $name Заголовок записи
     * @param string|null $urn URN записи
     * @param self|null Родительская запись
     * @return self
     */
    protected static function exportByNameURN(string $name, string $urn = null, self $parent = null): self
    {
        if ($item = static::importByLike($urn, $name, $parent)) {
            if ($name && ($item->name != $name)) {
                $item->name = $name;
                $item->commit();
            }
        } else {
            $item = new static();
            $item->name = $name;
            if ($urn) {
                $item->urn = $urn;
            }
            $item->pid = $parent->id;
            $item->commit();
        }
        return $item;
    }


    /**
     * Получает запись справочника по соответствию URN, заголовка и родителя
     * @param string|null $urn URN записи
     * @param string|null $name Заголовок записи
     * @param self|null Родительская запись
     * @return self|null
     */
    protected static function importByLike(string $urn = null, string $name = null, self $parent = null)
    {
        if (!$urn && !$name) {
            return null;
        }
        $sqlQuery = "SELECT * FROM " . static::_tablename() . " WHERE 1";
        if ($parent && $parent->id) {
            $sqlQuery .= " AND pid = " . (int)$parent->id;
        }
        if ($urn) {
            $sqlQuery .= " AND urn = '" . self::$SQL->real_escape_string($urn) . "'";
        } elseif ($name) {
            $sqlQuery .= " AND name = '" . self::$SQL->real_escape_string($name) . "'";
        }
        $sqlResult = self::$SQL->getline($sqlQuery);
        if ($sqlResult) {
            return new static($sqlResult);
        }
    }


    public static function _references(string $key = null): array
    {
        $references = ['parent' => ['FK' => 'pid', 'classname' => static::class, 'cascade' => true]];
        return $key ? $references[$key] : $references;
    }


    public static function _children(string $key = null): array
    {
        $children = ['children' => ['classname' => static::class, 'FK' => 'pid']];
        return $key ? $children[$key] : $children;
    }
}
