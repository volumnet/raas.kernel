<?php
/**
 * Лог пользователей
 */
namespace RAAS;

use SOME\CSV;
use SOME\SOME;
use SOME\Pages;

/**
 * Класс лога пользователей
 * @property-read User $user Пользователь
 */
class UserLog
{
    /**
     * ID# пользователя
     * @var int
     */
    public $uid;

    /**
     * Дата/время действия в формате ГГГГ-ММ-ДД чч:мм:сс
     * @var string
     */
    public $postDate;

    /**
     * IP-адрес
     * @var string
     */
    public $ip;

    /**
     * HTTP-метод
     * @var string
     */
    public $method;

    /**
     * Пакет
     * @var string
     */
    public $package;

    /**
     * Модуль
     * @var string
     */
    public $module;

    /**
     * Подмодуль
     * @var string
     */
    public $sub;

    /**
     * Действие
     * @var string
     */
    public $actionName;

    /**
     * ID# элемента
     * @var int
     */
    public $elementId;


    /**
     * Ключи данных в строке лога
     * @var string[]
     */
    public static $keys = [
        'uid',
        'postDate',
        'ip',
        'method',
        'package',
        'module',
        'sub',
        'actionName',
        'elementId',
    ];


    public function __get($var)
    {
        switch ($var) {
            case 'user':
                return new User($this->uid);
                break;
        }
    }


    /**
     * Конструктор класса
     * @param array $data Данные лога <pre><code>[
     *     'uid'|0 => int ID# пользователя
     *     'postDate'|1 => string Дата/время действия
     *         в формате ГГГГ-ММ-ДД чч:мм:сс
     *     'ip'|2 => string IP-адрес
     *     'method'|3 => string HTTP-метод
     *     'package'|4 => string Пакет
     *     'module'|5 => string Модуль
     *     'sub'|6 => string Подмодуль
     *     'actionName'|7 => string Действие
     *     'elementId'|8 => int ID# элемента
     * ]</code></pre>
     */
    public function __construct(array $data = [])
    {
        foreach (static::$keys as $i => $key) {
            if (isset($data[$key])) {
                $this->$key = $data[$key];
            } elseif (isset($data[$i])) {
                $this->$key = $data[$i];
            }
        }
    }


    public function commit()
    {
        $t = time();
        if (!$this->uid) {
            $this->uid = (int)Application::i()->user->id;
        }
        if (!$this->postDate) {
            $this->postDate = date('Y-m-d H:i:s', $t);
        }
        if (!$this->ip) {
            $this->ip = $_SERVER['REMOTE_ADDR'];
        }
        if (!$this->method) {
            $this->method = $_SERVER['REQUEST_METHOD'];
        }
        if (!$this->package) {
            $this->package = Application::i()->controller->packageName;
        }
        if (!$this->module) {
            $this->module = Application::i()->controller->moduleName;
        }
        if (!$this->sub) {
            $this->sub = Application::i()->controller->sub;
        }
        if (!$this->actionName) {
            $this->actionName = Application::i()->controller->action;
        }
        if (!$this->elementId) {
            $this->elementId = (int)Application::i()->controller->id;
        }

        $filename = static::getLogDir() . '/userlog' . date('Y-m-d', $t) . '.log';
        $dataRow = [];
        foreach (static::$keys as $key) {
            $dataRow[] = $this->$key;
        }
        $dataCSV = new CSV([$dataRow]);
        file_put_contents($filename, $dataCSV->csv . "\n", FILE_APPEND);
    }


    /**
     * Получение списка записей
     * @param string $dateFrom Дата начала интервала поиска в формате ГГГГ-ММ-ДД
     * @param string $dateTo Дата окончания интервала поиска в формате ГГГГ-ММ-ДД
     * @param callable[] $filters Фильтры по логам <pre><code>array<
     *     function (UserLog $log): boolean
     * ></code></pre>
     * @param ?Pages $pages Постраничная разбивка
     * @return self[]
     */
    public static function getSet(
        $dateFrom = null,
        $dateTo = null,
        array $filters = [],
        ?Pages $pages = null
    ) {
        $tFrom = $tTo = null;
        if ($dateFrom && (($t = strtotime($dateFrom)) > 0)) {
            $tFrom = $t;
        }
        if ($dateTo && (($t = strtotime($dateTo)) > 0)) {
            $tTo = $t;
        }
        $files = glob(static::getLogDir() . '/userlog*.log');
        $files = array_values(array_filter(
            $files,
            function ($filename) use ($tFrom, $tTo) {
                if (!$tFrom && !$tTo) {
                    return true;
                }
                preg_match(
                    '/^userlog(.*?)\\.log$/umis',
                    basename($filename),
                    $regs
                );
                if ($tFrom && ($regs[1] < date('Y-m-d', $tFrom))) {
                    return false;
                }
                if ($tTo && ($regs[1] > date('Y-m-d', $tTo))) {
                    return false;
                }
                return true;
            }
        ));
        $result = [];
        foreach ($files as $filename) {
            $text = file_get_contents($filename);
            $csv = new CSV($text);
            $csv = array_values(array_filter($csv->data));
            $result = array_merge($result, $csv);
        }
        $result = SOME::getArraySet($result, null, static::class);

        if ($dateFrom) {
            $result = array_filter($result, function ($x) use ($dateFrom) {
                return $x->postDate >= $dateFrom . ' 00:00:00';
            });
        }
        if ($dateTo) {
            $result = array_filter($result, function ($x) use ($dateTo) {
                return $x->postDate <= $dateTo . ' 23:59:59';
            });
        }

        if ($filters) {
            foreach ($filters as $filter) {
                $result = array_filter($result, $filter);
            }
        }
        $result = array_values($result);
        if ($pages) {
            $result = SOME::getArraySet($result, $pages);
        }
        return $result;
    }


    /**
     * Создает при необходимости и возвращает папку логов
     * @return string|null null, если невозможно создать папку
     */
    public static function getLogDir()
    {
        $dir = Application::i()->baseDir . '/logs';
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }
        if (is_dir($dir)) {
            if (!is_file($dir . '/.htaccess')) {
                file_put_contents($dir . '/.htaccess', "Order deny,allow\nDeny from all");
            }
            return $dir;
        }
        return null;
    }
}
