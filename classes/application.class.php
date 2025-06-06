<?php
/**
 * @package RAAS
 */
declare(strict_types=1);

namespace RAAS;

use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;
use ReflectionClass;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use SOME\DB;
use SOME\File;
use SOME\Namespaces;
use SOME\Singleton;
use SOME\SOME;

/**
 * Приложение RAAS
 * @property-read array<Package> $packages массив загруженных пакетов
 * @property Package $activePackage активный пакет
 * @property Module $activeModule активный модуль
 * @property IContext $context активный модуль или пакет
 * @property-read string $configFile путь к файлу системных настроек
 * @property-read string[] $availableDatabases массив названий доступных СУБД в виде 'alias' => 'Название СУБД'
 * @property-read bool $debug режим отладки
 * @property User $user активный пользователь системы
 * @property-read DB $SQL подключение к базе данных
 * @property-read string $DSN строка подключения к базе данных
 * @property-read Updater $updater мастер обновлений
 */
final class Application extends Singleton implements IContext
{
    use ContextTrait;

    /**
     * "Соль" для шифрования MD5-алгоритмом
     */
    const generalSalt = 'KJLO(HD*hkojnds890fyhkOHnLO(U)*(#)&hjldfc890LKN(*YHN,vDIO89sILHKNLNVLDS*Y(DJXCVN';

    /**
     * Соль для дополнительного шифрования входа по COOKIES
     */
    const COOKIES_SALT = 'skldfjsoij)(*UKLMNsd90rtueropmgdfjgIJLLKDFMNGDIORTR(4fop+JK';

    /**
     * UNIX-timestamp времени начала выполнения скрипта
     * @var double
     */
    private $startMicrotime = 0;

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
        'loginType',
        'prod',
        'crossDomainSession',
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
            case 'activeModule':
                if ($this->activePackage) {
                    return $this->activePackage->activeModule;
                }
                return null;
                break;
            case 'context':
                return $this->activeModule ?: $this->activePackage ?: $this;
                break;

            // Файлы и директории
            case 'baseDir':
                if (defined('RAAS_BASEDIR')) {
                    return realpath(RAAS_BASEDIR);
                }
                if (isset($_SERVER['SCRIPT_FILENAME']) &&
                    $_SERVER['SCRIPT_FILENAME'] &&
                    (basename($_SERVER['SCRIPT_FILENAME']) == 'index.php')
                ) {
                    return realpath(dirname($_SERVER['SCRIPT_FILENAME']));
                }
                if (stristr(__DIR__, 'vendor')) {
                    return realpath(__DIR__ . '/../../../..');
                }
                return realpath(__DIR__ . '/../..');
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
                $dir = realpath($dir);
                return $dir;
                break;
            case 'baseFilesURL':
                return 'files';
                break;
            case 'filesURL':
                return $this->baseFilesURL . '/common';
                break;
            case 'backupsDir':
                $dir = $this->baseDir . '/backups';
                if (!is_dir($dir)) {
                    @mkdir($dir, 0777, true);
                }
                $dir = realpath($dir);
                return $dir;
                break;
            case 'backupsURL':
                return '/backups';
                break;
            case 'configFile':
                return $this->baseDir . '/config.php';
                break;

            // Модель
            case 'availableDatabases':
                return static::$availableDatabases;
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
            case 'composer':
            case 'updater':
            case 'requiredPHPVersion':
            case 'phpVersionCompatible':
            case 'requiredExtensions':
            case 'missedExt':
            case 'missedExtensions':
            case 'isCompatible':
            case 'version':
            case 'versionName':
            case 'systemDir':
            case 'classesDir':
            case 'languagesDir':
            case 'publicDir':
            case 'resourcesDir':
            case 'installFile':
            case 'mid':
            case 'view':
                return $this->getCommonContextVar($var);
                break;
            case 'packages':
            case 'activePackage':
            case 'SQL':
            case 'user':
            case 'startMicrotime':
                return $this->$var;
                break;
            case 'debug':
                return !$this->prod;
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
     */
    public function run($controller = 'web')
    {
        $this->startMicrotime = microtime(true);
        $this->registerDatatypes();
        $this->registerSources();
        mb_internal_encoding('UTF-8');
        $this->getConfig();
        if (($this->config['crossDomainSession'] ?? null) && ($domainL2 = $this->getCookieDomainL2())) {
            $sessionCookieParams = session_get_cookie_params();
            session_set_cookie_params(
                $sessionCookieParams['lifetime'],
                $sessionCookieParams['path'],
                $domainL2,
                $sessionCookieParams['secure'],
                $sessionCookieParams['httponly']
            );
        }
        ob_start();
        // 2025-04-22, AVS: проверка, возможно сессия уже открыта
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['KCFINDER']['uploadURL'] = '/files/common/';
        $_SESSION['RAAS_STARTED'] = $this->startMicrotime;

        $classname = ('RAAS\\Controller_' . ucfirst($controller));
        if (!class_exists($classname)) {
            $classname = 'RAAS\\Controller_Web';
        }

        $this->controller = $classname::i();
        $this->controller->run();
    }


     /**
     * Обработчик ошибок
     * @param \Exception|int либо исключение (если передается исключение),
     *                      либо внутренний номер ошибки
     *                      (если передается ошибка)
     * @param string текстовое описание ошибки (если передается ошибка)
     * @param string путь к файлу, где была ошибка (если передается ошибка)
     * @param int строка в файле, где была ошибка (если передается ошибка)
     * @param array контекст ошибки (переменные окружения,
     *              если передается ошибка)
     * @return Exception возвращает ошибку в виде исключения
     * @deprecated 2024-01-03 Не нужно, пусть будет стандартный вывод ошибок
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
            $e = new Exception($errstr, $errno);
        } else {
            $e = func_get_arg(0);
        }
        $eTrace = $e->getTrace();
                // var_dump($eTrace); exit;
        foreach ($eTrace as $i => $trace) {
            if (isset($trace['file']) &&
                stristr($trace['file'], 'eval') &&
                isset($_SESSION['EVAL_DEBUG']) &&
                $_SESSION['EVAL_DEBUG']
            ) {
                $newMessage = $_SESSION['EVAL_DEBUG'] . ':' . $trace['line']
                    . ': ' . $e->getMessage();
                $e = new Exception($newMessage, $e->getCode(), $e);
                break;
            }
        }
        if (!$this->prod) {
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
     * Инициализация базы данных
     * @return bool true, если подключение прошло успешно,
     *              false в противном случае
     */
    public function initDB()
    {
        $this->SQL = new DB($this->DSN, $this->config['dbuser'], $this->config['dbpass'], 'utf8');
        // 2024-12-02, AVS: добавил для совместимости
        $this->SQL->query("SET SESSION sql_mode = 'ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'");
        return true;
    }


    /**
     * Конфигурирование базы данных
     * @param array $DATA параметры для конфигурирования
     */
    public function configureDB(array $DATA)
    {
        $text = '<' . "?php\r\n";
        foreach (self::$configVars as $var) {
             $text .= '$' . $var . ' = \'' . addslashes($DATA[$var] ?? '') . "';\r\n";
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
        return SOME::init($this->SQL, $this->config['dbprefix']);
    }


    /**
     * Получение значения записи в реестре относительно вызывающего класса
     * @param string $var наименование записи
     * @param object|null $sender отправитель запроса
     * @return string значение записи
     */
    public function registryGet($var, $sender = null)
    {
        if (!$sender || !is_object($sender)) {
            $sender = $this;
        }
        $ns = Namespaces::getNS($sender);
        $sqlQuery = "SELECT *
                       FROM " . $this->dbprefix . "registry
                      WHERE m = ?";
        $key = null;
        if (($ns == 'RAAS') || $sender->mid == '/') {
            $key = '';
        } elseif (preg_match('/^RAAS\\\\/umi', $ns)) {
            $key = $sender->mid;
        }
        if ($key !== null) {
            if (!isset($this->registry[$key][$var])) {
                try {
                    $sqlResult = $this->SQL->get([$sqlQuery, $key]);
                } catch (\Exception $e) {
                    $sqlResult = null;
                }
                foreach ((array)$sqlResult as $row) {
                    $this->registry[$key][$row['name']] = $row['value'];
                }
            }
            if (isset($this->registry[$key][$var])) {
                return $this->registry[$key][$var];
            }
        }
        return null;
    }


    /**
     * Запись значения в реестр относительно вызывающего класса
     * @param string $var наименование записи
     * @param string $val значение записи
     * @param object|null $sender отправитель запроса
     * @return bool true, если вызов произведен успешно и значение записано,
     *              false в противном случае
     */
    public function registrySet($var, $val, $sender = null)
    {
        if (!$sender || !is_object($sender)) {
            $sender = $this;
        }
        $m = $sender->mid;
        $ns = Namespaces::getNS($sender);

        $arr = ['name' => $var, 'value' => $val];
        $key = null;
        if (get_class($sender) == __CLASS__) {
            $key = '';
        } elseif (($ns == __NAMESPACE__) || $m == '/') {
            $sqlQuery = "SELECT *
                           FROM " . $this->dbprefix . "registry
                          WHERE m = ?
                            AND name = ?";
            $sqlResult = $this->SQL->getline([$sqlQuery, '', $var]);
            if (!$sqlResult ||
                !isset($sqlResult['locked']) ||
                !$sqlResult['locked']
            ) {
                $key = '';
            }
        } elseif (preg_match('/^RAAS\\\\/umi', $ns)) {
            $key = $m;
        }
        if ($key !== null) {
            if ($val === null) {
                $deleteQuery = "DELETE FROM " . $this->dbprefix . "registry
                                 WHERE m = ?
                                   AND name = ?";
                $this->SQL->query([$deleteQuery, $key, $var]);
                unset($this->registry[$key][$var]);
            } else {
                $arr['m'] = $key;
                $this->SQL->add($this->dbprefix . "registry", $arr, $arr);
                $this->registry[$key][$var] = $val;
            }
            return true;
        }
        return false;
    }


    public function install()
    {
        if (!$this->registryGet('installDate') ||
            !$this->registryGet('baseVersion') ||
            ($this->registryGet('baseVersion') != $this->version)
        ) {
            $u = $this->updater;
            if ($u) {
                $u->preInstall();
            }
            if (is_file($this->installFile)) {
                $sqlQuery = file_get_contents($this->installFile);
                if ($sqlQuery) {
                    $sqlQuery = $this->prepareSQL($sqlQuery);
                    $this->SQL->query($sqlQuery);
                }
            }
            if ($u) {
                $u->postInstall();
            }
            $this->registrySet('installDate', date('Y-m-d H:i:s'));
            $this->registrySet('baseVersion', $this->version);

            // Attachment::clearLostAttachments();
            // Attachment::clearLostFiles();
        }
    }


    /**
     * Готовит SQL-запрос, заменяя переменную префикса {$DBPREFIX} на реальный префикс
     * @param string $sqlQuery Шаблон запроса
     * @return string
     */
    public function prepareSQL($sqlQuery)
    {
        $sqlQuery = strtr($sqlQuery, [
            '{$DBPREFIX$}' => $this->dbprefix,
        ]);
        return $sqlQuery;
    }


    /**
     * Инициализация загруженных пакетов
     */
    public function initPackages()
    {
        $this->packages['/'] = General\Package::i();

        $rxNamespace = '/^RAAS\\\\(\\w+)$/umi';
        $rxPackage = '/^RAAS\\\\(\\w+)\\\\Package$/umi';

        // Ищем среди существующих классов
        foreach (get_declared_classes() as $classname) {
            if (preg_match($rxPackage, $classname, $regs)) {
                $package = mb_strtolower($regs[1]);
                if (($package != 'general') &&
                    !isset($this->packages[$package])
                ) {
                    $this->packages[$package] = $classname::i();
                }
            }
        }

        // Ищем среди карты классов
        $classMapFile = $this->baseDir . '/vendor/composer/autoload_classmap.php';
        if (is_file($classMapFile)) {
            $classnames = include $classMapFile;
            $classnames = array_keys((array)$classnames);
            foreach ($classnames as $classname) {
                if (preg_match($rxPackage, $classname, $regs)) {
                    $package = mb_strtolower($regs[1]);
                    if (($package != 'general') &&
                        !isset($this->packages[$package])
                    ) {
                        $this->packages[$package] = $classname::i();
                    }
                }
            }
        }

        // Ищем среди пространств имен
        $namespacesFiles = ['autoload_namespaces.php', 'autoload_psr4.php'];
        foreach ($namespacesFiles as $namespacesFile) {
            $namespacesFile = $this->baseDir . '/vendor/composer/'
                            . $namespacesFile;
            if (is_file($namespacesFile)) {
                $namespaces = include $namespacesFile;
                $namespaces = array_keys((array)$namespaces);
                foreach ($namespaces as $namespace) {
                    $namespace = trim($namespace, '\\');
                    if (preg_match($rxNamespace, $namespace, $regs)) {
                        $classname = $namespace . '\\Package';
                        if (class_exists($classname)) {
                            $package = mb_strtolower($regs[1]);
                            if (($package != 'general') &&
                                !isset($this->packages[$package])
                            ) {
                                $this->packages[$package] = $classname::i();
                            }
                        }
                    }
                }
            }
        }

        // Старый вариант - для совместимости
        $packages = [];
        if (is_dir($this->baseDir . '/modules')) {
            $packages = @File::scandir($this->baseDir . '/modules', function ($x) {
                return $x[0] != '.' && is_dir($this->baseDir . '/modules/' . $x);
            });
        }
        foreach ((array)$packages as $package) {
            $classname = 'RAAS\\' . ucfirst($package) . '\\Package';
            if (!($this->packages[$package] ?? null) && class_exists($classname)) {
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
        return md5($string . md5($string . Application::generalSalt) . Application::generalSalt);
    }


    /**
     * Получение контекста по строке mid
     * @param string $mid Строка вида "/", "Пакет" или "Пакет.Модуль"
     * @param bool $treatSlashAsApplication при установке в true по строке "/" возвращает приложение,
     *     в противном случае корневой пакет
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
            // 2020-03-24, AVS: заменил на eval...file_get_contents
            // Потому что @include, судя по всему, кэшируется сквозь запросы
            // @include $this->configFile;
            @eval('?>' . file_get_contents($this->configFile));
            foreach (self::$configVars as $var) {
                if (isset($$var)) {
                    $this->config[$var] = $$var;
                } else {
                    $this->config[$var] = null;
                }
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
     * @param bool $debugMode Режим отладки для SMTP
     */
    public function sendmail(
        $toArr,
        $subject,
        $message,
        $from = null,
        $fromEmail = null,
        $isHTML = true,
        $attach = [],
        $embedded = [],
        $debugMode = false
    ) {
        $toArr = (array)$toArr;
        $realFromEmail = trim((string)$this->registryGet('email_from'));
        if (!$realFromEmail && $_SERVER['HTTP_HOST']) {
            $realFromEmail = 'info@' . $_SERVER['HTTP_HOST'];
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
            $from = $this->user ? $this->user->name : '';
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

        $smtpUser = $this->registryGet('smtp_username');
        $smtpForceLocal = (bool)(int)$this->registryGet('smtp_force_local');

        $mail = new PHPMailer();
        if ($smtpUser && ($this->prod || $smtpForceLocal)) {
            $smtpHost = $this->registryGet('smtp_host');
            $smtpEncryption = $this->registryGet('smtp_encryption');
            $smtpPort = (int)$this->registryGet('smtp_port');
            if (!$smtpHost && $_SERVER['HTTP_HOST']) {
                $smtpHost = $_SERVER['HTTP_HOST'];
            }
            if (($smtpEncryption == 'ssl') && !stristr($smtpHost, '//')) {
                $smtpHost = 'ssl://' . $smtpHost;
            }
            if (substr($smtpHost, 0, 2) == '//') {
                $smtpHost = substr($smtpHost, 2);
            }
            if (!$smtpPort) {
                $smtpPort = ($smtpEncryption == 'ssl') ? 465 : 25;
            }

            $mail->isSMTP();
            $mail->SMTPAuth = true;
            $mail->SMTPDebug = $debugMode ? SMTP::DEBUG_LOWLEVEL : 0;
            if ($smtpEncryption == 'tls') {
                $mail->SMTPSecure = 'TLS';
            } elseif (!$smtpEncryption) {
                // 2024-05-22, AVS: добавил, чтобы не пытался автоматом соединяться по шифрованному соединению
                // (возможно отключение в связи с ошибкой сертификата)
                $mail->SMTPSecure = false;
                $mail->SMTPAutoTLS = false;
            }
            $mail->Host = $smtpHost;
            $mail->Port = $smtpPort;
            $mail->Username = $smtpUser;
            $mail->Password = $this->registryGet('smtp_password');
        } else {
            $mail->IsMail();
        }
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
     * Получает домен второго уровня
     * @return string
     */
    public function getCookieDomainL2()
    {
        $domainL2 = explode('.', $_SERVER['HTTP_HOST']);
        $domainL2 = array_slice($domainL2, -2);
        if (count($domainL2) == 2) {
            $domainL2 = '.' . implode('.', $domainL2);
        } else {
            $domainL2 = null;
        }
        return $domainL2;
    }


    /**
     * Определяет, является ли ключ Cookie кроссдоменным
     */
    public function isCrossDomainCookie($var)
    {
        $subdomainRx = $this->registryGet('subdomainCookies');
        if ($subdomainRx) {
            $subdomainRx = '/' . $subdomainRx . '/umis';
        }
        return $subdomainRx && preg_match($subdomainRx, $var);
    }


    /**
     * Сохраняет cookie в зависимости от настроек, устанавливает переменную
     *     $_COOKIE[$var]. Не-строковые переменные кодируются в json_encode.
     *     Если $val == null, удаляет cookie.
     * @param string $var Наименование переменной
     * @param mixed $val Значение переменной
     * @return string Установленное значение
     */
    public function setcookie($var, $val)
    {
        $lifetime = $this->registryGet('cookieLifetime') * 86400;
        $domainL2 = $this->getCookieDomainL2();
        if ($val === null) {
            unset($_COOKIE[$var]);
            setcookie($var, '', time() - $lifetime, '/', '');
            if ($domainL2) {
                setcookie($var, '', time() - $lifetime, '/', $domainL2);
            }
            return null;
        }
        if (!is_scalar($val)) {
            $val = json_encode($val);
        }
        $val = (string)$val;
        $_COOKIE[$var] = $val;
        if ($domainL2 && $this->isCrossDomainCookie($var)) {
            setcookie($var, '', time() - $lifetime, '/', '');
            setcookie($var, $val, time() + $lifetime, '/', $domainL2);
        } else {
            // 2022-04-11, AVS: убрал удаление, т.к. порядок не определен, а на домене третьего уровня без rx'а глючит
            // 2022-04-11, AVS: пока оставил, судя по всему ошибка не в этом, а в HTTPOnly
            // if ($domainL2) {
            //     setcookie($var, '', time() - $lifetime, '/', $domainL2);
            // }
            setcookie($var, $val, time() + $lifetime, '/', '');
        }
        return $val;
    }


    /**
     * Пытается сохранить дамп текущей базы через mysqldump
     *
     * Именно здесь, поскольку registryGet('mysqldump_command') относится к приложению, а пароль не разглашается,
     * кроме как в DB (но там registryGet('mysqldump_command') не имеет смысла)
     * @param string $filename Имя файла
     * @param bool $gzip Сжимать файл
     */
    public function mysqldump(string $filename, bool $gzip = false)
    {
        $mysqldump = $this->registryGet('mysqldump_command') ?: 'mysqldump';
        $cmd = $mysqldump . ' -u ' . $this->config['dbuser'];
        if ($this->config['dbpass'] ?? '') {
            $cmd .= ' -p' . $this->config['dbpass'];
        }
        $cmd .= ' --default-character-set=utf8 ' . $this->config['dbname'] ;
        if ($gzip) {
            $cmd .= ' | gzip ';
        }
        $cmd .= ' > "' . $filename . '"';
        exec($cmd);
    }


    /**
     * Регистрирует стратегии типов данных
     */
    public function registerDatatypes()
    {
        TextDatatypeStrategy::register('text');
        ColorDatatypeStrategy::register('color');
        DateDatatypeStrategy::register('date');
        DateTimeDatatypeStrategy::register('datetime');
        DateTimeDatatypeStrategy::register('datetime-local');
        EmailDatatypeStrategy::register('email');
        NumberDatatypeStrategy::register('number');
        RangeDatatypeStrategy::register('range');
        TelDatatypeStrategy::register('tel');
        TimeDatatypeStrategy::register('time');
        UrlDatatypeStrategy::register('url');
        MonthDatatypeStrategy::register('month');
        YearDatatypeStrategy::register('year');
        WeekDatatypeStrategy::register('week');
        PasswordDatatypeStrategy::register('password');
        CheckboxDatatypeStrategy::register('checkbox');
        RadioDatatypeStrategy::register('radio');
        FileDatatypeStrategy::register('file');
        ImageDatatypeStrategy::register('image');
        SelectDatatypeStrategy::register('select');
        TextareaDatatypeStrategy::register('textarea');
        HtmlAreaDatatypeStrategy::register('htmlarea');
        CodeAreaDatatypeStrategy::register('codearea');
    }


    /**
     * Регистрирует стратегии источников
     */
    public function registerSources()
    {
        CSVSourceStrategy::register('csv');
        INISourceStrategy::register('ini');
        SQLSourceStrategy::register('sql');
        XMLSourceStrategy::register('xml');
        PHPSourceStrategy::register('php');
        DictionarySourceStrategy::register('dictionary');
    }
}
