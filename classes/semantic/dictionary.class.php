<?php
/**
 * Абстрактный справочник
 */
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
            $child = self::exportByNameURN($entryData['name'] ?? $value, $value, $this);
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


    protected static function exportByNameURN($name, $urn = null, self $parent = null)
    {
        if ($Item = static::importByLike($urn, $name, $parent)) {
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
            $Item->pid = $parent->id;
            $Item->commit();
        }
        return $Item;
    }


    protected static function importByLike($urn = null, $name = null, self $parent)
    {
        if (!$urn && !$name) {
            return null;
        }
        $sqlQuery = "SELECT * FROM " . static::_tablename() . " WHERE pid = " . (int)$parent->id;
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


    public static function _references($key = null)
    {
        $references = ['parent' => ['FK' => 'pid', 'classname' => static::class, 'cascade' => true]];
        return $key ? $references[$key] : $references;
    }


    public static function _children($key = null)
    {
        $children = ['children' => ['classname' => static::class, 'FK' => 'pid']];
        return $key ? $children[$key] : $children;
    }
}
