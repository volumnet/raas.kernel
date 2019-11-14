<?php
/**
 * Файл приложения RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */
namespace RAAS;

use Mustache_Autoloader;
use PHPMailer\PHPMailer\PHPMailer;
use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;
use SOME\DB;
use SOME\File;
use SOME\Namespaces;
use SOME\Singleton;
use SOME\SOME;

/**
 * Класс приложения RAAS
 * @package RAAS
 * @property-read Abstract_Controller $controller контроллер приложения
 * @property-read Abstract_View $view представление приложения
 * @property-read array<Package> $packages массив загруженных пакетов
 * @property Package $activePackage активный пакет
 * @property Module $activeModule активный модуль
 * @property IContext $context активный модуль или пакет
 * @property-read string $modulesDir директория с пакетами и модулями
 * @property-read string $configFile путь к файлу системных настроек
 * @property-read string $classesFile путь к файлу кэша классов
 * @property-read array<string> $availableDatabases массив названий доступных
 *                                                  СУБД в виде
 *                                                  'alias' => 'Название СУБД'
 * @property-read bool $debug режим отладки
 * @property-read array<Exception> $exceptions массив исключений
 * @property-read array<\Exception> $sqlExceptions массив исключений
 *                                                 по SQL-запросам
 * @property User $user активный пользователь системы
 * @property-read DB $SQL подключение к базе данных
 * @property-read string $DSN строка подключения к базе данных
 * @property-read string $updateURL адрес сервера обновлений
 * @property-read string $userAgent поле User-Agent для обмена данными
 *                                  с сервером обновлений
 * @property-read resource $networkContext контекст соединения
 *                                         с сервером обновлений
 */
final class Application extends Singleton implements IContext
{
    /**
     * Наименование версии
     */
    const versionName = 'RAAS v4.1 Remote Automated Assistant';

    /**
     * Контроллер, используемый по умолчанию
     */
    const defaultController = 'web';

    /**
     * Сервер баз данных, используемый по умолчанию
     */
    const defaultDBHost = 'localhost';

    /**
     * Пользователь баз данных, используемый по умолчанию
     */
    const defaultDBUser = 'root';

    /**
     * "Соль" для шифрования MD5-алгоритмом
     */
    const generalSalt = 'KJLO(HD*hkojnds890fyhkOHnLO(U)*(#)&hjldfc890LKN(*YHN,vDIO89sILHKNLNVLDS*Y(DJXCVN';

    /**
     * Соль для дополнительного шифрования входа по COOKIES
     */
    const COOKIES_SALT = 'skldfjsoij)(*UKLMNsd90rtueropmgdfjgIJLLKDFMNGDIORTR(4fop+JK';

    /**
     * Время ожидания ответа от сервера обновлений
     */
    const networkTimeout = 10;

    /**
     * Версия файла
     */
    const version = '2013-12-01 18:36:50';

    /**
     * UNIX-timestamp времени начала выполнения скрипта
     * @var double
     */
    private $startMicrotime = 0;

    /**
     * Режим отладки
     * @var bool
     */
    private $debug = false;

    /**
     * Контроллер ядра
     * @var Abstract_Controller
     */
    private $controller;

    /**
     * Массив статических настроек, взятых из файла конфигурации
     * @var array
     */
    private $config = [];

    /**
     * Массив системных исключений
     * @var array
     */
    private $exceptions = [];

    /**
     * Массив исключений при работе с базой данных
     * @var array
     */
    private $sqlExceptions = [];

    /**
     * Экземпляр подключения к базе данных
     * @var DB
     */
    private $SQL;

    /**
     * Массив кэша параметров реестра
     * @var array
     */
    private $registry = [];

    /**
     * Текущий пользователь системы
     * @var User
     */
    private $user;

    /**
     * Массив загруженных пакетов
     * @var array
     */
    private $packages = [];

    /**
     * текущий (рабочий) пакет
     * @var Package
     */
    private $activePackage;

    /**
     * Массив наименований требуемых расширений
     * @var array
     */
    private static $requiredExtensions = [
        'session',
        'iconv',
        'pcre',
        'date',
        'standard',
        'zlib',
        'SimpleXML',
        'xml',
        'gd',
        'PDO',
        'mbstring'
    ];

    /**
     * Массив наименований переменных, которые будут использоваться
     * в файле конфигурации
     * @var array
     */
    private static $configVars = [
        'dbtype',
        'dbhost',
        'dbname',
        'dbuser',
        'dbpass',
        'dbprefix',
        'loginType'
    ];

    /**
     * Доступные базы данных
     * @var array<string[] идентификатор базы данных в DSN => string наименование СУБД>
     */
    private static $availableDatabases = ['mysql' => 'MySQL'];

    /**
     * Экземпляр приложения
     * @var Application
     */
    protected static $instance;

    public function __get($var)
    {
        switch ($var) {
            // MVC
            case 'controller':
                return $this->controller;
                break;
            case 'view':
                return $this->controller->view;
                break;
            case 'packages':
            case 'activePackage':
                return $this->$var;
                break;
            case 'activeModule':
                if ($this->activePackage) {
                    return $this->activePackage->activeModule;
                }
                return null;
                break;
            case 'context':
                if ($this->activeModule) {
                    return $this->activeModule;
                } elseif ($this->activePackage) {
                    return $this->activePackage;
                } else {
                    return $this;
                }
                break;

            // Файлы и директории
            case 'baseDir':
                return realpath(__DIR__ . '/../..');
                break;
            case 'systemDir':
                return realpath(__DIR__ . '/..');
                break;
            case 'modulesDir':
                return $this->baseDir . '/modules';
                break;
            case 'classesDir':
                return $this->systemDir . '/classes';
                break;
            case 'languagesDir':
                return $this->systemDir . '/languages';
                break;
            case 'publicDir':
                return $this->systemDir . '/public';
                break;
            case 'baseFilesDir':
                $dir = $this->baseDir . '/files';
                if (!is_dir($dir)) {
                    @mkdir($dir, 0777, true);
                }
                return $dir;
                break;
            case 'filesDir':
                $dir = $this->baseFilesDir . '/common';
                if (!is_dir($dir)) {
                    @mkdir($dir, 0777, true);
                }
                return $dir;
                break;
            case 'baseFilesURL':
                return 'files';
                break;
            case 'filesURL':
                return $this->baseFilesURL . '/common';
                break;
            case 'includeDir':
                return $this->systemDir . '/include';
                break;
            case 'resourcesDir':
                return $this->systemDir . '/resources';
                break;
            case 'configFile':
                return $this->baseDir . '/config.php';
                break;
            case 'installFile':
                if (isset($this->config['dbtype'])) {
                    $dbtype = (string)$this->config['dbtype'];
                    return $this->resourcesDir . '/install.' . $dbtype . '.sql';
                }
                return null;
                break;
            case 'uninstallFile':
                if (isset($this->config['dbtype'])) {
                    $dbtype = (string)$this->config['dbtype'];
                    return $this->resourcesDir .
                           '/uninstall.' . $dbtype . '.sql';
                }
                return null;
                break;
            case 'classesFile':
                return $this->resourcesDir . '/classes.dat';
                break;

            // Модель
            case 'Mid':
            case 'mid':
                return '';
                break;
            case 'availableDatabases':
                return static::$availableDatabases;
                break;
            case 'debug':
            case 'exceptions':
            case 'sqlExceptions':
            case 'SQL':
            case 'user':
                return $this->$var;
                break;
            case 'DSN':
                if (isset($this->config['dbtype'])) {
                    switch ($this->config['dbtype']) {
                        case 'mysql':
                        case 'mssql':
                            return $this->config['dbtype'] .
                                   ':host=' . $this->config['dbhost'] .
                                   ';dbname=' . $this->config['dbname'];
                            break;
                        case 'pgsql':
                            return 'pgsql:host=' . $this->config['dbhost'] .
                                    ' dbname=' . $this->config['dbname'] .
                                    ' user=' . $this->config['dbuser'] .
                                    ' password=' . $this->config['dbpass'];
                            break;
                        default:
                            return false;
                            break;
                    }
                }
                return false;
                break;
            case 'phpVersionCompatible':
                $verCmp = version_compare(
                    self::requiredPHPVersion,
                    phpversion()
                );
                return ($verCmp <= 0);
                break;
            case 'missedExt':
                $extLoaded = array_map('trim', get_loaded_extensions());
                $extLoaded = array_values($extLoaded);
                $diff = array_diff(self::$requiredExtensions, $extLoaded);
                return array_values($diff);
                break;
            case 'isCompatible':
                return $this->phpVersionCompatible && !$this->missedExt;
                break;
            case 'version':
                if (defined('static::version')) {
                    return static::version;
                }
                return date('Y-m-d', filemtime(__FILE__));
                break;
            case 'versionTime':
                if (defined('static::version')) {
                    return strtotime($this->version);
                }
                return filemtime(__FILE__);
                break;
            case 'updateURL':
                return 'http://raas.volumnet.ru/update/';
                break;
            case 'userAgent':
                return self::versionName . ' ' . $this->version;
                break;
            case 'networkContext':
                return stream_context_create(['http' => [
                    'timeout' => self::networkTimeout,
                    'user_agent' => $this->userAgent
                ]]);
                break;
            default:
                if (in_array($var, self::$configVars) &&
                    !in_array($var, ['dbpass']) &&
                    isset($this->config[$var])
                ) {
                    return (string)$this->config[$var];
                }
                return null;
                break;
        }
    }


    public function __set($var, $val)
    {
        switch ($var) {
            case 'activePackage':
                if ($val instanceof Package) {
                    $this->$var = $val;
                }
                break;
            case 'activeModule':
                if ($val instanceof Module) {
                    $this->activePackage = $val->package;
                    $this->activePackage->activeModule = $val;
                }
                break;
            case 'context':
                if ($val instanceof Module) {
                    $this->activePackage = $val->package;
                    $this->activePackage->activeModule = $val;
                } elseif ($val instanceof Package) {
                    $this->activePackage = $val;
                }
                break;
            case 'user':
                if ($val instanceof User) {
                    $this->user = $val;
                }
                break;
        }
    }


    /**
     * Метод запуска приложения
     * @param string $controller наименование контроллера
     * @param bool $debugMode режим отладки
     */
    public function run(
        $controller = self::defaultController,
        $debugMode = false
    ) {
        ob_start();
        $this->startMicrotime = microtime(true);
        $this->debug = $debugMode;

        mb_internal_encoding('UTF-8');
        spl_autoload_register([$this, 'autoload']);
        //error_reporting(E_ALL);
        set_error_handler([$this, 'errorHandler'], error_reporting());
        set_exception_handler([$this, 'errorHandler']);
        session_start();
        $_SESSION['RAAS_STARTED'] = microtime(true);
        $this->getConfig();

        $classname = ('RAAS\\Controller_' . ucfirst($controller));
        if (!class_exists($classname)) {
            $classname = 'RAAS\\Controller_' . ucfirst(self::defaultController);
        }

        $this->controller = $classname::i();
        $this->controller->run();
    }


     /**
     * Обработчик ошибок
     * @param Exception|int либо исключение (если передается исключение),
     *                      либо внутренний номер ошибки
     *                      (если передается ошибка)
     * @param string текстовое описание ошибки (если передается ошибка)
     * @param string путь к файлу, где была ошибка (если передается ошибка)
     * @param int строка в файле, где была ошибка (если передается ошибка)
     * @param array контекст ошибки (переменные окружения,
     *              если передается ошибка)
     * @return Exception возвращает ошибку в виде исключения
     */
    public function errorHandler()
    {
        if (func_num_args() > 2) {
            if (!error_reporting()) {
                return null;
            }
            $args = func_get_args();
            $errno = (isset($args[0]) ? $args[0] : null);
            $errstr = (isset($args[1]) ? $args[1] : null);
            $errfile = (isset($args[2]) ? $args[2] : null);
            $errline = (isset($args[3]) ? $args[3] : null);
            $errcontext = (isset($args[4]) ? $args[4] : null);
            $e = new Exception($errstr, $errno);
        } else {
            $e = func_get_arg(0);
        }
        if (count($this->exceptions) < 10) {
            $this->exceptions[] = $e;
        }
        if ($this->debug) {
            echo '<pre class="error">' .
                    $e->getMessage() .
                    ' in ' . $e->getFile() .
                    ' on line ' . $e->getLine() . ' ' .
                    $e->getTraceAsString() .
                 '</pre>';
        }
        return $e;
    }


    /**
     * Обработчик исключений при работе с базой данных
     * @param \Exception $e исключение
     */
    public function sqlErrorHandler(\Exception $e)
    {
        if ($this->SQL && $this->SQL->connection) {
            $arr = [
                'debug_code' => '',
                'error_type' => '',
                'error_message' => '',
                'sql_query' => '',
                'url' => '',
                'referer' => '',
                'request_method' => '',
                'debug_backtrace' => ''
            ];
        }
        throw $e;
    }


    /**
     * Обработчик запросов
     * @param string $query текст запроса
     *                      (возможно, с заменителями для подстановок)
     * @param array $bind массив подстановок
     *                    (ассоциированный или индексированный)
     * @param float $time время выполнения запроса
     */
    public function queryHandler($query = '', $bind = [], $time = 0)
    {
    }


    /**
     * Инициализация базы данных
     * @return bool true, если подключение прошло успешно,
     *              false в противном случае
     */
    public function initDB()
    {
        try {
            $this->SQL = new DB(
                $this->DSN,
                $this->config['dbuser'],
                $this->config['dbpass'],
                'utf8',
                [$this, 'sqlErrorHandler'],
                [$this, 'queryHandler']
            );
            return (!$this->sqlExceptions);
        } catch (\Exception $e) {
            return false;
        }
    }


    /**
     * Конфигурирование базы данных
     * @param array $DATA параметры для конфигурирования
     */
    public function configureDB(array $DATA)
    {
        $text = '<' . "?php\r\n";
        foreach (self::$configVars as $var) {
             $text .= '$' . $var . ' = \'' . addslashes($DATA[$var]) . "';\r\n";
        }
        file_put_contents($this->configFile, $text);
        chmod($this->configFile, 0777);
    }


    /**
     * Инициализация движка SOME
     * @return bool true, если инициализация прошла успешно,
     *              false в противном случае
     */
    public function initSOME()
    {
        $classes = [];
        $ok = SOME::init(
            $this->SQL,
            $this->config['dbprefix'],
            (array)$classes
        );
        return $ok;
    }


    /**
     * Получение значения записи в реестре относительно вызывающего класса
     * @param string $var наименование записи
     * @param object|null $Sender отправитель запроса
     * @return string значение записи
     */
    public function registryGet($var, $Sender = null)
    {
        if (!$Sender || !is_object($Sender)) {
            $Sender = $this;
        }
        $m = $Sender->mid;
        $NS = Namespaces::getNS($Sender);
        $NSArray = Namespaces::getNSArray($Sender);

        if (($NS == __NAMESPACE__) || $m == '/') {
            if (!isset($this->registry[''][$var])) {
                $sqlQuery = "SELECT *
                               FROM " . $this->dbprefix . "registry
                              WHERE m = ''";
                try {
                    $sqlResult = $this->SQL->get($sqlQuery);
                } catch (\Exception $e) {
                    $sqlResult = null;
                }
                foreach ((array)$sqlResult as $row) {
                    $this->registry[''][$row['name']] = $row['value'];
                }
            }
            if (isset($this->registry[''][$var])) {
                return $this->registry[''][$var];
            }
        } elseif ($NSArray[0] == 'RAAS') {
            if (!isset($this->registry[$m][$var])) {
                $sqlQuery = "SELECT *
                               FROM " . $this->dbprefix . "registry
                              WHERE m = ?";
                try {
                    $sqlResult = $this->SQL->get([$sqlQuery, $m]);
                } catch (\Exception $e) {
                    $sqlResult = null;
                }
                foreach ((array)$sqlResult as $row) {
                    $this->registry[$m][$row['name']] = $row['value'];
                }
            }
            if (isset($this->registry[$m][$var])) {
                return $this->registry[$m][$var];
            }
        }
        return null;
    }


    /**
     * Запись значения в реестр относительно вызывающего класса
     * @param string $var наименование записи
     * @param string $val значение записи
     * @param object|null $Sender отправитель запроса
     * @return bool true, если вызов произведен успешно и значение записано,
     *              false в противном случае
     */
    public function registrySet($var, $val, $Sender = null)
    {
        if (!$Sender || !is_object($Sender)) {
            $Sender = $this;
        }
        $m = $Sender->mid;
        $c = Namespaces::getClass($Sender);
        $NS = Namespaces::getNS($Sender);
        $NSArray = Namespaces::getNSArray($Sender);

        $arr = ['name' => $var, 'value' => $val];
        if (get_class($Sender) == __CLASS__) {
            if ($val === null) {
                $sqlQuery = "DELETE FROM " . $this->dbprefix . "registry
                              WHERE m = ''
                                AND name = ?";
                $this->SQL->query([$sqlQuery, $var]);
                unset($this->registry[''][$var]);
            } else {
                $this->SQL->add($this->dbprefix . "registry", $arr, $arr);
                $this->registry[''][$var] = $val;
            }
            return true;
        } elseif (($NS == __NAMESPACE__) || $m == '/') {
            $sqlQuery = "SELECT *
                           FROM " . $this->dbprefix . "registry
                          WHERE m = ''
                            AND name = ?";
            $sqlResult = $this->SQL->getline([$sqlQuery, $var]);
            if (!$sqlResult ||
                !isset($sqlResult['locked']) ||
                !$sqlResult['locked']
            ) {
                if ($val === null) {
                    $sqlQuery = "DELETE FROM " . $this->dbprefix . "registry
                                  WHERE m = ''
                                    AND name = ?";
                    $this->SQL->query([$sqlQuery, $var]);
                    unset($this->registry[''][$var]);
                } else {
                    $this->SQL->add($this->dbprefix . "registry", $arr, $arr);
                    $this->registry[''][$var] = $val;
                }
                return true;
            }
        } elseif ($NSArray[0] == 'RAAS') {
            $sqlQuery = "SELECT value
                           FROM " . $this->dbprefix . "registry
                          WHERE m = ?
                            AND name = ?";
            $sqlResult = $this->SQL->getline([$sqlQuery, (string)$m, $var]);
            if (!$sqlResult ||
                !isset($sqlResult['locked']) ||
                !$sqlResult['locked']) {
                if ($val === null) {
                    $sqlQuery = "DELETE FROM " . $this->dbprefix . "registry
                                  WHERE m = ?
                                    AND name = ?";
                    $this->SQL->query([$sqlQuery, (string)$m, $var]);
                    unset($this->registry[''][$var]);
                } else {
                    $arr2 = $arr;
                    $arr['m'] = $m;
                    $this->SQL->add($this->dbprefix . "registry", $arr, $arr2);
                    $this->registry[$m][$var] = $val;
                }
                return true;
            }
        }
        return false;
    }


    public function install()
    {
        if (!$this->registryGet('installDate')) {
            $sqlQuery = "";
            if (is_file($this->installFile)) {
                $sqlQuery = file_get_contents($this->installFile);
            }
            if ($sqlQuery) {
                $this->SQL->query($this->prepareSQL($sqlQuery));
            }
            $this->registrySet('installDate', date('Y-m-d H:i:s'));

            Attachment::clearLostAttachments();
            Attachment::clearLostFiles();
        }
    }


    public function prepareSQL($sqlQuery)
    {
        $sqlQuery = str_replace('{$DBPREFIX$}', $this->dbprefix, $sqlQuery);
        return $sqlQuery;
    }


    /**
     * Инициализация загруженных пакетов
     */
    public function initPackages()
    {
        $this->packages['/'] = General\Package::i();
        $m = $this;
        $callback = function ($x) use ($m) {
            return $x[0] != '.' && is_dir($m->modulesDir . '/' . $x);
        };
        $packages = File::scandir($this->modulesDir, $callback);
        foreach ((array)$packages as $package) {
            $classname = 'RAAS\\' . ucfirst($package) . '\\Package';
            if (class_exists($classname)) {
                $this->packages[$package] = $classname::i();
            }
        }
    }


    /**
     * Расширенное MD5-хэширование с использованием "соли"
     * @param string $string строка для хэширования
     * @return string хэш от строки
     */
    public function md5It($string)
    {
        return md5(
            $string .
            md5($string . Application::generalSalt) .
            Application::generalSalt
        );
    }


    /**
     * Получение контекста по строке mid
     * @param string $mid Строка вида "/", "Пакет" или "Пакет.Модуль"
     * @param bool $treatSlashAsApplication при установке в true
     *                                      по строке "/" возвращает приложение,
     *                                      в противном случае корневой пакет
     * @return IContext контекст
     */
    public function getContext($mid = '', $treatSlashAsApplication = false)
    {
        $mid = trim(strtolower($mid));
        if ($mid == '') {
            return $this;
        } elseif ($mid == '/') {
            return $treatSlashAsApplication ? $this : $this->packages['/'];
        } elseif (strstr($mid, '.')) {
            list($p, $m) = explode('.', $mid);
            if (isset($this->packages[$p]->modules[$m])) {
                return $this->packages[$p]->modules[$m];
            }
        } else {
            if (isset($this->packages[$mid])) {
                return $this->packages[$mid];
            }
        }
        return null;
    }


    /**
     * Получение параметров конфигурации из файла конфигурации
     */
    private function getConfig()
    {
        if (is_file($this->configFile)) {
            @include_once $this->configFile;
            foreach (self::$configVars as $var) {
                $this->config[$var] = $$var;
            }
        }
    }


    /**
     * Предлагает замену для повторяющегося URN
     *
     * Для URN без числового суффикса предлагает суффикс "_1".
     * Для URN с суффиксом увеличивает в суффиксе число на 1
     * @param string $urn Старый URN
     * @param bool $forceNewSuffix Принудительно добавлять суффикс "_1"
     *                             (даже если суффикс уже есть,
     *                             добавляет еще один)
     * @param string $separator разделитель суффикса
     * @return string Новый URN
     */
    public function getNewURN($urn, $forceNewSuffix = false, $separator = '_')
    {
        if (preg_match(
            '/' . preg_quote($separator) . '(\\d+)$/',
            $urn,
            $regs
        ) && !$forceNewSuffix) {
            $suffix = (int)$regs[1];
            $newURN = preg_replace(
                '/' . preg_quote($separator) . $suffix . '$/',
                $separator . ($suffix + 1),
                $urn
            );
        } else {
            $newURN = $urn . $separator . '1';
        }
        return $newURN;
    }


    /**
     * Отправка почты
     * @param array|string $toArr Получатель или список получателей
     * @param [
     *            string Шаблон,
     *            array<string[] переменная => string Значение> Подстановки
     *        ]|string $subject Текст заголовка письма либо массив шаблона
     *                          с подстановками
     * @param [
     *            string Шаблон,
     *            array<string[] переменная => string Значение> Подстановки
     *        ]|string $message Текст письма либо массив шаблона
     *                          с подстановками
     * @param string|null $from Отправитель (по умолчанию - полное имя
     *                          текущего пользователя)
     * @param string|null $fromEmail Обратный e-mail адрес (по умолчанию -
     *                                e-mail текущего пользователя)
     * @param bool $isHTML Отправлять сообщение в формате HTML
     * @param array<[
     *            'tmp_name' => string Путь к реальному файлу,
     *            'name' => string Имя файла,
     *            'type' => string MIME-тип файла
     *        ]> $attach Массив вложений
     * @param array<[
     *            'tmp_name' => путь к реальному файлу,
     *            'name' => имя файла,
     *            'type' => MIME-тип файла
     *        ]> $embedded Массив встраиваемых файлов
     */
    public function sendmail(
        $toArr,
        $subject,
        $message,
        $from = null,
        $fromEmail = null,
        $isHTML = true,
        $attach = [],
        $embedded = []
    ) {
        $toArr = (array)$toArr;
        $realFromEmail = trim($this->registryGet('email_from'));
        if (!$realFromEmail && $SERVER['HTTP_HOST']) {
            $realFromEmail = 'info@' . $SERVER['HTTP_HOST'];
        }
        if (!$realFromEmail && $fromEmail) {
            $realFromEmail = $fromEmail;
        }
        if (!$realFromEmail && $this->user->email) {
            $realFromEmail = $this->user->email;
        }
        // 2019-Добавляем точку в локальный адрес, чтобы был совместим
        // с валидатором нового PHPMailer'а
        if ($realFromEmail && !stristr($realFromEmail, '.')) {
            $realFromEmail .= '.local';
        }

        if (!$from) {
            $from = $this->user->name;
        }
        if (is_array($subject)) {
            $subject[1] = array_merge($_SERVER, (array)$subject[1]);
            foreach ((array)$subject[1] as $key => $val) {
                $subject[0] = str_replace(
                    '{%' . strtoupper($key) . '%}',
                    $val,
                    $subject[0]
                );
            }
            $subject = $subject[0];
        }
        if (is_array($message)) {
            $message[1] = array_merge($_SERVER, (array)$message[1]);
            foreach ((array)$message[1] as $key => $val) {
                $message[0] = str_replace(
                    '{%' . strtoupper($key) . '%}',
                    $val,
                    $message[0]
                );
            }
            $message = $message[0];
        }

        $mail = new PHPMailer();
        $mail->IsMail();
        $mail->From = $realFromEmail;
        $mail->CharSet = "utf-8";
        $mail->FromName = $from;
        $mail->IsHTML($isHTML);
        $mail->Subject = $subject;
        $mail->Body = $message;
        $mail->AltBody = "";
        foreach ($attach as $file) {
            if (is_array($file['name'])) {
                foreach ($file['name'] as $key => $val) {
                    $mail->AddAttachment(
                        $file['tmp_name'][$key],
                        $file['name'][$key],
                        'base64',
                        $file['type'][$key]
                    );
                }
            } else {
                $mail->AddAttachment(
                    $file['tmp_name'],
                    $file['name'],
                    'base64',
                    $file['type']
                );
            }
        }
        // if ($embedded) {
        //     print_r($embedded);
        //     exit;
        // }
        foreach ($embedded as $file) {
            if (is_array($file['name'])) {
                foreach ($file['name'] as $key => $val) {
                    $mail->AddEmbeddedImage(
                        $file['tmp_name'][$key],
                        $file['name'][$key],
                        $file['name'][$key],
                        'base64',
                        $file['type'][$key]
                    );
                }
            } else {
                $mail->AddEmbeddedImage(
                    $file['tmp_name'],
                    $file['name'],
                    $file['name'],
                    'base64',
                    $file['type']
                );
            }
        }
        $mail->SingleTo = true;

        foreach ((array)$toArr as $to) {
            $mail->AddAddress($to, $to);
        }
        $mail->AddReplyTo($realFromEmail);
        $mail->Send();
        return true;
    }



    /**
     * Функция автозагрузки классов
     * @param string $class наименование класса с пространством имен
     */
    public function autoload($class)
    {
        $NS = Namespaces::getNSArray($class);
        $classname = Namespaces::getClass($class);
        if (is_array($NS) && $NS && $NS[0] == 'RAAS') {
            if (isset($NS[1])) {
                $p = $NS[1];
                if ($p == 'General') {
                    if (is_file(
                        $this->systemDir . '/general/classes/package.class.php'
                    )) {
                        // General\Package::i();
                    }
                } else {
                    if (is_file(
                        $this->modulesDir . '/' . strtolower($p) .
                        '/common/classes/package.class.php'
                    )) {
                        require_once $this->modulesDir . '/' . strtolower($p) .
                                     '/common/classes/package.class.php';
                        $classname = 'RAAS\\' . $p . '\\Package';
                        $classname::i();
                    }
                }
            }
        } else {
            switch ($classname) {
                case 'Mustache_Engine':
                    Mustache_Autoloader::register();
                    break;
            }
        }
    }
}
