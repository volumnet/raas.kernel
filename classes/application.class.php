<?php
/**
 * Файл приложения RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */       
namespace RAAS;

/**
 * Класс приложения RAAS
 * @package RAAS
 * @property-read \RAAS\Abstract_Controller $controller контроллер приложения
 * @property-read \RAAS\Abstract_View $view представление приложения
 * @property-read array(\RAAS\Package) $packages массив загруженных пакетов
 * @property \RAAS\Package $activePackage активный пакет
 * @property \RAAS\Module $activeModule активный модуль
 * @property \RAAS\IContext $context активный модуль или пакет
 * @property-read string $modulesDir директория с пакетами и модулями
 * @property-read string $someFile путь к файлу SOME
 * @property-read string $configFile путь к файлу системных настроек
 * @property-read string $classesFile путь к файлу кэша классов
 * @property-read array(string) $availableDatabases массив названий доступных СУБД в виде 'alias' => 'Название СУБД'
 * @property-read bool $debug режим отладки
 * @property-read array(\RAAS\Exception) $exceptions массив исключений 
 * @property-read array(\Exception) $sqlExceptions массив исключений по SQL-запросам
 * @property \RAAS\User $user активный пользователь системы
 * @property-read \SOME\DB $SQL подключение к базе данных
 * @property-read string $DSN строка подключения к базе данных
 * @property-read string $updateURL адрес сервера обновлений 
 * @property-read string $userAgent поле User-Agent для обмена данными с сервером обновлений
 * @property-read resource $networkContext контекст соединения с сервером обновлений
 */
final class Application extends \SOME\Singleton implements IContext
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
    private $config = array();

    /**
     * Массив системных исключений
     * @var array
     */
    private $exceptions = array();

    /**
     * Массив исключений при работе с базой данных
     * @var array
     */
    private $sqlExceptions = array();

    /**
     * Экземпляр подключения к базе данных
     * @var \SOME\DB
     */
    private $SQL;

    /**
     * Массив кэша параметров реестра
     * @var array
     */
    private $registry = array();

    /**
     * Текущий пользователь системы
     * @var \RAAS\User
     */
    private $user;

    /**
     * Массив загруженных пакетов
     * @var array
     */
    private $packages = array();

    /**
     * текущий (рабочий) пакет
     * @var \RAAS\Package
     */
    private $activePackage;
    
    /**
     * Массив наименований требуемых расширений
     * @var array
     */              
    private static $requiredExtensions = array('session', 'iconv', 'pcre', 'date', 'standard', 'zlib', 'SimpleXML', 'xml', 'gd', 'PDO', 'mbstring');
    
    /**
     * Массив наименований переменных, которые будут использоваться в файле конфигурации
     * @var array
     */         
    private static $configVars = array('dbtype', 'dbhost', 'dbname', 'dbuser', 'dbpass', 'dbprefix', 'loginType');
    
    /**
     * Массив вида $key => $val, где $key - идентификатор базы данных в DSN, $val - наименование СУБД     
     * @var array
     */         
    private static $availableDatabases = array('mysql' => 'MySQL');
    
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
            case 'packages': case 'activePackage': 
                return $this->$var;
                break;
            case 'activeModule':
                if ($this->activePackage) {
                    return $this->activePackage->activeModule;
                }
                return null; 
                break;
            case 'context':
                return $this->activeModule ? $this->activeModule : ($this->activePackage ? $this->activePackage : $this);
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
            case 'someFile':
                return $this->includeDir . '/some/some.class.php';
                break;
            case 'configFile':
                return $this->baseDir . '/config.php';
                break;
            case 'installFile':
                return (isset($this->config['dbtype']) ? ($this->resourcesDir . '/install.' . (string)$this->config['dbtype'] . '.sql') : null);
                break;
            case 'uninstallFile':
                return (isset($this->config['dbtype']) ? ($this->resourcesDir . '/uninstall.' . (string)$this->config['dbtype'] . '.sql') : null);
                break;
            case 'classesFile':
                return $this->resourcesDir . '/classes.dat';
                break;
            
            // Модель
            case 'Mid': case 'mid':
                return '';
                break;
            case 'availableDatabases':
                return eval('return ' . \get_called_class() . '::$' . $var . ';');
                break; 
            case 'debug': case 'exceptions': case 'sqlExceptions': case 'SQL': case 'user':
                return $this->$var;
                break;
            case 'DSN':
                if (isset($this->config['dbtype'])) {
                    switch ($this->config['dbtype']) {
                        case 'mysql': case 'mssql':
                            return $this->config['dbtype'] . ':host=' . $this->config['dbhost'] . ';dbname=' . $this->config['dbname'];
                            break;
                        case 'pgsql':
                            return 'pgsql:host=' . $this->config['dbhost'] . ' dbname=' . $this->config['dbname']
                                      . ' user=' . $this->config['dbuser'] . ' password=' . $this->config['dbpass'];
                            break;
                        default:
                            return false;
                            break;
                    }
                }
                return false;
                break;
            case 'phpVersionCompatible':
                return (version_compare(self::requiredPHPVersion, phpversion()) <= 0);
                break;
            case 'missedExt':
                $ext_loaded = array_values(array_map('trim', get_loaded_extensions()));
                return array_values(array_diff(self::$requiredExtensions, $ext_loaded));
                break;
            case 'isCompatible':
                return $this->phpVersionCompatible && !$this->missedExt;
                break;
            case 'version':
                return defined('static::version') ? static::version : date('Y-m-d', filemtime(__FILE__));
                break;
            case 'versionTime':
                return defined('static::version') ? strtotime($this->version) : filemtime(__FILE__);
                break;
            case 'updateURL':
                return 'http://raas.volumnet.ru/update/';
                break;
            case 'userAgent':
                return self::versionName . ' ' . $this->version;
                break;
            case 'networkContext':
                return stream_context_create(array('http' => array('timeout' => self::networkTimeout, 'user_agent' => $this->userAgent)));
                break;
            default:
                if (in_array($var, self::$configVars) && !in_array($var, array('dbpass')) && isset($this->config[$var])) {
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
    public function run($controller = self::defaultController, $debugMode = false)
    {
        ob_start();
        $this->startMicrotime = microtime(true);
        $this->debug = $debugMode;

        mb_internal_encoding('UTF-8');
        require_once ($this->someFile);
        spl_autoload_register('\\SOME\\SOME::autoload');
        spl_autoload_register(array($this, 'autoload'));
        //error_reporting(E_ALL);
        set_error_handler(array($this, 'errorHandler'), error_reporting());
        set_exception_handler(array($this, 'errorHandler'));
        session_start();
        $_SESSION['RAAS_STARTED'] = microtime(true);
        $this->getConfig();
        
        if (!class_exists($classname = ('RAAS\\Controller_' . ucfirst($controller)))) {
            $classname = 'RAAS\\Controller_' . ucfirst(self::defaultController);
        }
        
        $this->controller = $classname::i();
        $this->controller->run();
    }


     /**
     * Обработчик ошибок
     * @param Exception|int либо исключение (если передается исключение), либо внутренний номер ошибки (если передается ошибка)
     * @param string текстовое описание ошибки (если передается ошибка)
     * @param string путь к файлу, где была ошибка (если передается ошибка)
     * @param int строка в файле, где была ошибка (если передается ошибка)
     * @param array контекст ошибки (переменные окружения, если передается ошибка)
     * @return \RAAS\Exception возвращает ошибку в виде исключения
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
            //if (!$this->view->renderStarted) {
                echo '<pre class="error">' . $e->getMessage() . ' in ' . $e->getFile() . ' on line ' . $e->getLine() . ' ' . $e->getTraceAsString() . '</pre>';
            //}
        }
        return $e;
    }
    
    
    /**
     * Обработчик исключений при работе с базой данных
     * @param \Exception $e исключение
     */
    public function sqlErrorHandler(\Exception $e)
    {
        //$this->sqlExceptions[] = $e;
        //$this->errorHandler($e);
        if ($this->SQL && $this->SQL->connection) {
            $arr = array(
                'debug_code' => '',
                'error_type' => '',
                'error_message' => '',
                'sql_query' => '',
                'url' => '',
                'referer' => '',
                'request_method' => '',
                'debug_backtrace' => ''
            );
        }
        throw $e;
    }


    /**
     * Обработчик запросов
     * @param string $query текст запроса (возможно, с заменителями для подстановок)
     * @param array $bind массив подстановок (ассоциированный или индексированный)
     * @param float $time время выполнения запроса
     */
    public function queryHandler($query = '', $bind = array(), $time = 0)
    {

    }


    /**
     * Инициализация базы данных
     * @return bool true, если подключение прошло успешно, false в противном случае
     */
    public function initDB()
    {
        try {
            $this->SQL = new \SOME\DB(
                $this->DSN, $this->config['dbuser'], $this->config['dbpass'], 'utf8', array($this, 'sqlErrorHandler'), array($this, 'queryHandler')
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
             $text .= '$' . $var . ' = \'' . \addslashes($DATA[$var]) . "';\r\n";
        }
        file_put_contents($this->configFile, $text);
        chmod($this->configFile, 0777);
    }


    /**
     * Инициализация движка SOME
     * @return bool true, если инициализация прошла успешно, false в противном случае
     */
    public function initSOME()
    {
        $classes = array();
        if (is_file(__DIR__ . '/../classes.dat')) {
            $classes = @json_decode(@file_get_contents(__DIR__ . '/../classes.dat'), true);
        }
        if (!is_array($classes)) {
            $classes = array();
        }
        $ok = \SOME\SOME::init($this->SQL, $this->config['dbprefix'], (array)$classes);
        //file_put_contents(__DIR__ . '/../classes.dat', json_encode(\SOME\SOME::_classes()));
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
        $NS = \SOME\Namespaces::getNS($Sender);
        $NSArray = \SOME\Namespaces::getNSArray($Sender);

        if (($NS == __NAMESPACE__) || $m == '/') {
            if (!isset($this->registry[''][$var])) {
                $SQL_query = "SELECT * FROM " . $this->dbprefix . "registry WHERE m = ''";
                try {
                    $SQL_result = $this->SQL->get($SQL_query);
                } catch (\Exception $e) {
                    $SQL_result = null;
                }
                foreach ((array)$SQL_result as $row) {
                    $this->registry[''][$row['name']] = $row['value'];
                }
            }
            return isset($this->registry[''][$var]) ? $this->registry[''][$var] : null;
        } elseif ($NSArray[0] == 'RAAS') {
            if (!isset($this->registry[$m][$var])) {
                $SQL_query = "SELECT * FROM " . $this->dbprefix . "registry WHERE m = ?";
                try {
                    $SQL_result = $this->SQL->get(array($SQL_query, $m));
                } catch (\Exception $e) {
                    $SQL_result = null;
                }
                foreach ((array)$SQL_result as $row) {
                    $this->registry[$m][$row['name']] = $row['value'];
                }
            }
            return isset($this->registry[$m][$var]) ? $this->registry[$m][$var] : null;
        }
    }


    /**
     * Запись значения в реестр относительно вызывающего класса
     * @param string $var наименование записи
     * @param string $val значение записи
     * @param object|null $Sender отправитель запроса
     * @return bool true, если вызов произведен успешно и значение записано, false в противном случае
     */
    public function registrySet($var, $val, $Sender = null)
    {
        if (!$Sender || !is_object($Sender)) {
            $Sender = $this;
        }
        $m = $Sender->mid;
        $c = \SOME\Namespaces::getClass($Sender);
        $NS = \SOME\Namespaces::getNS($Sender);
        $NSArray = \SOME\Namespaces::getNSArray($Sender);

        $arr = array('name' => $var, 'value' => $val);
        if (get_class($Sender) == __CLASS__) {
            if ($val === null) {
                $SQL_query = "DELETE FROM " . $this->dbprefix . "registry WHERE m = '' AND name = ?";
                $this->SQL->query(array($SQL_query, $var));
                unset($this->registry[''][$var]);
            } else {
                $this->SQL->add($this->dbprefix . "registry", $arr, $arr);
                $this->registry[''][$var] = $val;
            }
            return true;
        } elseif (($NS == __NAMESPACE__) || $m == '/') {
            $SQL_query = "SELECT * FROM " . $this->dbprefix . "registry WHERE m = '' AND name = ?";
            $SQL_result = $this->SQL->getline(array($SQL_query, $var));
            if (!$SQL_result || !isset($SQL_result['locked']) || !$SQL_result['locked']) {
                if ($val === null) {
                    $SQL_query = "DELETE FROM " . $this->dbprefix . "registry WHERE m = '' AND name = ?";
                    $this->SQL->query(array($SQL_query, $var));
                    unset($this->registry[''][$var]);
                } else {
                    $this->SQL->add($this->dbprefix . "registry", $arr, $arr);
                    $this->registry[''][$var] = $val;
                }
                return true;
            }
        } elseif ($NSArray[0] == 'RAAS') {
            $SQL_query = "SELECT value FROM " . $this->dbprefix . "registry WHERE m = ? AND name = ?";
            $SQL_result = $this->SQL->getline(array($SQL_query, (string)$m, $var));
            if (!$SQL_result || !isset($SQL_result['locked']) || !$SQL_result['locked']) {
                if ($val === null) {
                    $SQL_query = "DELETE FROM " . $this->dbprefix . "registry WHERE m = ? AND name = ?";
                    $this->SQL->query(array($SQL_query, (string)$m, $var));
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
            $SQL_query = (is_file($this->installFile) ? file_get_contents($this->installFile) : "");
            if ($SQL_query) {
                $this->SQL->query($this->prepareSQL($SQL_query));
            }
            $this->registrySet('installDate', date('Y-m-d H:i:s'));

            $Set = Attachment::getSet();
            foreach ($Set as $row) {
                if (!is_file($row->file)) {
                    if (is_file($old_file = $this->filesDir . '/' . $row->realname)) {
                        rename($old_file, $row->file);
                    } else {
                        Attachment::delete($row);
                    }
                }
                if ($row->image) {
                    if ($row->tn && !is_file($row->tn)) {
                        if (is_file($old_file = $this->filesDir . '/' . pathinfo($row->realname, PATHINFO_FILENAME) . '_tn.jpg')) {
                            rename($old_file, $row->tn);
                        } else {
                            $row->createThumbnail();
                        }
                    }
                    if ($row->small && !is_file($row->small)) {
                        if (is_file($old_file = $this->filesDir . '/' . pathinfo($row->realname, PATHINFO_FILENAME) . '_small.' . $row->ext)) {
                            rename($old_file, $row->small);
                        } else {
                            $row->createThumbnail();
                        }
                    }
                    $row->createThumbnail();
                }
            }
        }
    }
    
    
    public function prepareSQL($SQL_query)
    {
        $SQL_query = str_replace('{$DBPREFIX$}', $this->dbprefix, $SQL_query);
        return $SQL_query;
    }


    /**
     * Инициализация загруженных пакетов
     */
    public function initPackages()
    {
        $this->packages['/'] = General\Package::i();
        $m = $this;
        $callback = function($x) use ($m) { return $x[0] != '.' && is_dir($m->modulesDir . '/' . $x); };
        $packages = \SOME\File::scandir($this->modulesDir, $callback);
        foreach ((array)$packages as $package) {
            if (class_exists($classname = 'RAAS\\' . ucfirst($package) . '\\Package')) {
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
     * @param bool $treatSlashAsApplication при установке в true по строке "/" возвращает приложение, в противном случае корневой пакет     
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
            return isset($this->packages[$p]->modules[$m]) ? $this->packages[$p]->modules[$m] : null;
        } else {
            return isset($this->packages[$mid]) ? $this->packages[$mid] : null;
        }
    }


    /**
     * Получение параметров конфигурации из файла конфигурации
     */
    private function getConfig()
    {
        if (is_file($this->configFile)) {
            @include_once ($this->configFile);
            foreach (self::$configVars as $var) {
                $this->config[$var] = $$var;
            }
        }
    }
    
    
    /**
     * Отправка почты
     * @param array|string $to_arr Получатель или список получателей
     * @param array|string $subject Текст заголовка письма либо массив array(string Шаблон, array Подстановки) -
     *        Шаблон: текст с переменными вида {%VAR%}; Подстановки - массив соответственно вида array('var' => 'значение переменной', ...)
     * @param array|string $message Текст письма либо массив array(string Шаблон, array Подстановки) -
     *        Шаблон: текст с переменными вида {%VAR%}; Подстановки - массив соответственно вида array('var' => 'значение переменной', ...)
     * @param string|null $from Отправитель (по умолчанию - полное имя текущего пользователя)
     * @param string|null $from_email Обратный e-mail адрес (по умолчанию - e-mail текущего пользователя)
     * @param bool $is_html Отправлять сообщение в формате HTML
     * @param array $attach Массив вложений вида array(array('tmp_name' => путь к реальному файлу, 'name' => имя файла, 'type' => MIME-тип файла), ...)     
     */         
    public function sendmail($to_arr, $subject, $message, $from = null, $from_email = null, $is_html = true, $attach = array())
    {
        $to_arr = (array)$to_arr;
        if (!$from) {
            $from = $this->user->name;
        }
        if (!$from_email) {
            $from_email = $this->user->email;
        }                    
        if (is_array($subject)) {
            $subject[1] = array_merge($_SERVER, (array)$subject[1]);
            foreach ((array)$subject[1] as $key => $val) {
                $subject[0] = str_replace('{%' . strtoupper($key) . '%}', $val, $subject[0]);
            }
            $subject = $subject[0];
        }
        if (is_array($message)) {
            $message[1] = array_merge($_SERVER, (array)$message[1]);
            foreach ((array)$message[1] as $key => $val) {
                $message[0] = str_replace('{%' . strtoupper($key) . '%}', $val, $message[0]);
            }
            $message = $message[0];
        }
        
        $mail = new \PHPMailer();
        $mail->IsMail();
        $mail->From = $from_email;
        $mail->CharSet = "utf-8";
        $mail->FromName = $from;
        $mail->IsHTML($is_html);
        $mail->Subject = $subject;
        $mail->Body = $message;
        $mail->AltBody = "";
        foreach ($attach as $file) {
            if (is_array($file['name'])) {
                foreach($file['name'] as $key => $val) {
                    $mail->AddAttachment($file['tmp_name'][$key], $file['name'][$key], 'base64', $file['type'][$key]);
                } 
            } else {
                $mail->AddAttachment($file['tmp_name'], $file['name'], 'base64', $file['type']);
            } 
        }
        $mail->SingleTo = true; 
    
        foreach ((array)$to_arr as $to) {
            $mail->AddAddress($to, $to);
            $mail->AddReplyTo($from_email);
        }
        $mail->Send();
        return true;
    } 



    /**
     * Функция автозагрузки классов
     * @param string $class наименование класса с пространством имен
     */
    public function autoload($class)
    {
        $NS = \SOME\Namespaces::getNSArray($class);
        $classname = \SOME\Namespaces::getClass($class);
        if (is_array($NS) && $NS && $NS[0] == 'RAAS') {
            if (isset($NS[1])) {
                $p = $NS[1];
                if ($p == 'General') {
                    if (is_file($this->systemDir . '/general/classes/package.class.php')) {
                        require_once ($this->systemDir . '/general/classes/package.class.php');
                        General\Package::i();
                    }
                } else {
                    if (is_file($this->modulesDir . '/' . strtolower($p) . '/common/classes/package.class.php')) {
                        require_once ($this->modulesDir . '/' . strtolower($p) . '/common/classes/package.class.php');
                        $classname = 'RAAS\\' . $p . '\\Package';
                        $classname::i();
                    }
                }
            } else {
                $rdi = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator(__DIR__));
                foreach ($rdi as $f) {
                    if (($f->getFileName() == strtolower($classname) . '.class.php') || ($f->getFileName() == strtolower($classname) . '.interface.php')) {
                        require_once $f->getPathName();
                        break;
                    }
                }
            }
        } else {
            switch ($classname) {
                case 'PHPMailer':
                    require_once $this->includeDir . '/class.phpmailer.php';
                    break;
                case 'phpQuery':
                    require_once $this->includeDir . '/phpQuery-onefile.php';
                    break;
                case 'Mustache_Engine':
                    require_once $this->includeDir . '/mustache/src/Mustache/Autoloader.php';
                    \Mustache_Autoloader::register();
                    break;
            }
        }
    }
}