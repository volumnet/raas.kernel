<?php
/**
 * Файл класса абстрактной резервной копии
 */
namespace RAAS;

/**
 * Класс абстрактной резервной копии
 * @property-read string $filename Имя файла (без пути) резервной копии
 * @property-read string $filepath Путь к файлу резервной копии
 * @property-read string $fileURL URL файла резервной копии
 * @property-read string $type Тип резервной копии
 */
abstract class Backup
{
    /**
     * Тип резервной копии
     */
    const TYPE = '';

    /**
     * Данные по резервным копиям
     * @var array <pre>array<string[] ID# резервной копии => Backup></pre>
     */
    protected static $data = [];

    /**
     * дата/время резервной копии
     * @var string
     */
    public $postDate;

    /**
     * ID# (дата/время) резервной копии
     * @var string
     */
    public $id;

    /**
     * Резервная копия еще не сохранена
     * @var bool
     */
    public $new = true;

    /**
     * Наименование
     * @var string
     */
    public $name = '';

    /**
     * Не удалять автоматически
     * @var bool
     */
    public $preserveFromDeletion = true;

    protected static $references = [
        'attachment' => [
            'FK' => 'attachment_id',
            'classname' => Attachment::class,
            'cascade' => true
        ],
    ];

    public function __get($var)
    {
        switch ($var) {
            case 'filename':
                // @abstract
                exit;
                break;
            case 'filepath':
                $filepath = Application::i()->backupsDir . '/'
                          . $this->filename;
                return $filepath;
                break;
            case 'fileURL':
                $fileURL = Application::i()->backupsURL . '/'
                         . $this->filename;
                return $fileURL;
                break;
            case 'type':
                return static::TYPE;
                break;
        }
    }


    /**
     * Конструктор класса
     */
    public function __construct()
    {
        if (!$this->id) {
            $this->postDate = date('Y-m-d H-i-s');
            $this->id = uniqid('');
        }
    }


    public static function importById($id)
    {
        static::load();
        if (isset(static::$data[$id])) {
            return static::$data[$id];
        }
        return null;
    }


    /**
     * Сохранение резервной копии
     */
    public function commit()
    {
        static::load();
        $this->new = false;
        static::$data[$this->id] = $this;
        static::save();
    }


    /**
     * Восстанавливает данные из резервной копии
     */
    abstract public function restore();


    /**
     * Получает файл данных по бэкапам
     * @return string
     */
    public static function getDataFilename()
    {
        $filename = Application::i()->backupsDir . '/backups.php';
        return $filename;
    }


    /**
     * Получает данные по резервным копиям
     * @return array <pre>array<string[] ID# резервной копии => Backup></pre>
     */
    public static function load()
    {
        if (!static::$data) {
            $filename = static::getDataFilename();
            static::$data = [];
            if (is_file($filename)) {
                $result = @eval('?>' . file_get_contents($filename));
                static::$data = (array)$result;
            }
        }
        uasort(static::$data, function ($a, $b) {
            return strcmp($b->postDate, $a->postDate);
        });
        return static::$data;
    }


    /**
     * Сохраняет данные по резервным копиям
     */
    public static function save()
    {
        uasort(static::$data, function ($a, $b) {
            return strcmp($b->postDate, $a->postDate);
        });
        $filename = static::getDataFilename();
        $cacheId = 'RAASBACKUPS' . date('YmdHis') . md5(rand());
        $text = '<' . '?php return unserialize(<<' . "<'" . $cacheId . "'\n" . serialize(static::$data) . "\n" . $cacheId . "\n);\n";
        $result = file_put_contents($filename, $text);
    }


    /**
     * Удаление резервной копии
     * @param self $object Резервная копия для удаления
     */
    public static function delete(self $object)
    {
        static::load();
        if (is_file($object->filepath)) {
            unlink($object->filepath);
        }
        unset(static::$data[$object->id]);
        static::save();
    }
}
