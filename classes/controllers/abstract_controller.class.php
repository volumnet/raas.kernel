<?php
/**
 * @package RAAS
 */
declare(strict_types=1);

namespace RAAS;

use SOME\Singleton;

/**
 * Абстрактный контроллер ядра RAAS
 * @property-read Application $model ссылка на экземпляр приложения
 * @property-read Abstract_View $view ссылка на экземпляр текущего
 *                                    представления ядра
 * @property-read IAbstract_Context_Controller $context контроллер контекста
 * @property-read string|null $mode режим работы
 *                                  (обычный, админка, справка и т.д.)
 * @property-read string|null $packageName идентификатор активного пакета
 * @property-read string|null $moduleName идентификатор активного модуля
 * @property-read string|null $sub идентификатор активного подмодуля
 * @property-read string|null $action идентификатор действия
 * @property-read int|null $id идентификатор активного объекта
 * @property-read string|null $nav массив прочих навигационных параметров
 */
abstract class Abstract_Controller extends Singleton implements IAbstract_Context_Controller
{
    /**
     * Ссылка на экземпляр текущего представления ядра
     * @var Abstract_View
     */
    protected $view;

    /**
     * Экземпляр класса
     * @var Abstract_Controller
     */
    protected static $instance;

    public function __get($var)
    {
        switch ($var) {
            // MVC
            case 'application':
            case 'model':
                return Application::i();
                break;
            case 'view':
                return $this->view;
                break;
            case 'context':
                return Application::i()->context->controller;
                break;
            case 'packageName':
                $packageName = '';
                if (isset($_GET['p'])) {
                    $packageName = strtolower(trim($_GET['p']));
                } elseif (isset($_COOKIE['p'])) {
                    $packageName = strtolower(trim($_COOKIE['p']));
                }
                if ($packageName == '/') {
                    $packageName = '';
                }
                return $packageName;
                break;
            case 'moduleName':
                $moduleName = '';
                if (isset($_GET['m'])) {
                    $moduleName = strtolower(trim($_GET['m']));
                }
                if ($moduleName == '/') {
                    $moduleName = '';
                }
                return $moduleName;
                break;
            case 'sub':
            case 'action':
            case 'mode':
                return isset($_GET[$var]) ? strtolower(trim($_GET[$var])) : '';
                break;
            case 'id':
                if (isset($_GET['id'])) {
                    if (is_array($_GET['id'])) {
                        return array_map('intval', $_GET['id']);
                    } else {
                        return (int)$_GET['id'];
                    }
                }
                return 0;
                break;
            case 'nav':
                return $_GET;
                break;
        }
    }


    /**
     * Инициализатор класса
     */
    protected function init()
    {
        if (!$this->view) {
            exit;
        }
    }


    public function run()
    {
        if ($this->checkCompatibility()) {
            if ($this->checkDB()) {
                if ($this->checkSOME()) {
                    $this->model->install();
                    Process::checkIn();
                    if ($this->auth()) {
                        $this->applyPersonalSettings();
                        $this->model->initPackages();
                        $this->fork();
                        $this->close();
                    }
                }
            }
        }
        $this->view->render();
    }


    protected function checkCompatibility()
    {
        $arr = [];
        if (!$this->model->phpVersionCompatible) {
            $arr['PHP_VERSION_INCOMPATIBLE'] = Application::i()->requiredPHPVersion;
        }
        if ($missedExt = $this->model->missedExt) {
            $arr['PHP_EXTENSION_REQUIRED'] = $missedExt;
        }
        if ($arr) {
            $this->view->checkCompatibility($arr);
            return false;
        }
        return true;
    }


    /**
     * Функция проверки подключения к базе данных
     */
    abstract protected function checkDB();


    /**
     * Функция получения возможных ошибок при настройке подключения к базе данных
     * @return array<[
     *             'name' => string внутреннее имя,
     *             'value' => string наименование ошибочного параметра,
     *             'description' => string человеко-читаемое описание ошибки
     *         ]> список ошибок в стандартном RAAS-виде
     */
    protected function getConfigureDBErrors()
    {
        $localError = [];
        if (!$_POST['dbtype']) {
            $localError[] = [
                'name' => 'MISSED',
                'value' => 'dbtype',
                'description' => 'DBTYPE_MISSED'
            ];
        }
        if (!$_POST['dbhost']) {
            $localError[] = [
                'name' => 'MISSED',
                'value' => 'dbhost',
                'description' => 'DBHOST_MISSED'
            ];
        }
        if (!$_POST['dbuser']) {
            $localError[] = [
                'name' => 'MISSED',
                'value' => 'dbuser',
                'description' => 'DBUSER_MISSED'
            ];
        }
        if (!$_POST['dbname']) {
            $localError[] = [
                'name' => 'MISSED',
                'value' => 'dbname',
                'description' => 'DBNAME_MISSED'
            ];
        }
        return $localError;
    }


    /**
     * Функция настройки подключения к базе данных
     */
    abstract protected function configureDB();


    /**
     * Проверка подключения движка SOME
     */
    protected function checkSOME()
    {
        if ($this->model->initSOME()) {
            return true;
        } else {
            $localError = [];
            foreach ($this->model->sqlExceptions as $e) {
                $localError[] = [
                    'name' => 'SOME_CORRUPTED',
                    'value' => $e->getCode(),
                    'description' => $e->getMessage()
                ];
            }
            $this->view->checkSOME(['localError' => $localError]);
        }
    }


    /**
     * Авторизация пользователя
     */
    protected function auth()
    {
        $this->model->user = new User();
    }


     /**
     * Применение персональных настроек пользователя
     */
    protected function applyPersonalSettings()
    {
        if ($this->model->user->preferences['lang'] ?? '') {
            $this->view->loadLanguage(
                (string)$this->model->user->preferences['lang']
            );
        } else {
            $prefs = $this->model->user->preferences;
            $prefs['lang'] = $this->view->language;
            $this->model->user->preferences = $prefs;
        }
    }


    /**
     * Логика приложения, если пользователь первый в системе
     * @return bool true, если пользователь успешно зарегистрировал
     *              себя в системе, false в противном случае
     */
    protected function isFirst()
    {
        $t = $this;
        $Form = new Form([
            'caption' => $this->view->_('USER_AUTHENTICATE'),
            'Item' => $this->model->user,
            'submitCaption' => $this->view->_('LOG_IN'),
            'template' => '/log_in',
            'actionMenu' => false,
            'export' => function ($Form) use ($t) {
                $Form->exportDefault();
                $Form->Item->register_date = date('Y-m-d H:i:s');
                $Form->Item->root = 1;
            },
            'import' => function () {
                return ($_SERVER['REQUEST_METHOD'] == 'POST') ? $_POST : [];
            },
            'redirect' => function () {
            },
            'children' => [
                [
                    'name' => 'login',
                    'required' => 'required',
                    'caption' => $this->view->_('LOGIN_NAME')
                ],
                [
                    'type' => 'password',
                    'name' => 'password',
                    'required' => 'required',
                    'caption' => $this->view->_('PASSWORD'),
                    'check' => function ($Field) use ($t) {
                        if ($localError = $Field->getErrors()) {
                            return $localError;
                        } elseif (mb_strlen(trim($_POST[$Field->name])) < $t->model->registryGet('minPasswordLength')) {
                            return [
                                'name' => 'INVALID',
                                'value' => $Field->name,
                                'description' => sprintf(
                                    $t->view->_('ERR_PASSWORD_IS_TOO_SHORT'),
                                    (int)$t->model->registryGet('minPasswordLength')
                                )
                            ];
                        }
                    },
                    'export' => function ($Field) use ($t) {
                        $Field->Form->Item->password_md5 = $t->model->md5It(
                            trim($_POST[$Field->name])
                        );
                    },
                    'confirm' => true
                ],
                [
                    'name' => 'email',
                    'type' => 'email',
                    'required' => 'required',
                    'caption' => $this->view->_('EMAIL')
                ],
                [
                    'type' => 'checkbox',
                    'name' => 'save_password',
                    'caption' => $this->view->_('REMEMBER_PASSWORD'),
                    'export' => 'is_null'
                ]
            ],
        ]);
        $OUT = $Form->process();
        if (($_SERVER['REQUEST_METHOD'] == 'POST') && !$OUT['localError']) {
            return true;
        } else {
            $this->view->login(array_merge($OUT, ['firstUser' => true]));
            return false;
        }
    }


    /**
     * Установка текущего языка
     */
    protected function set_language()
    {
        if (isset($_GET['lang']) &&
            isset($this->view->availableLanguages[$_GET['lang']])
        ) {
            $prefs = $this->model->user->preferences;
            $prefs['lang'] = $_GET['lang'];
            $this->model->user->preferences = $prefs;
            $this->model->user->commit();
            if ($_GET['referer']) {
                new Redirector($_GET['referer']);
            } elseif ($_GET['back']) {
                new Redirector('history:back');
            } else {
                new Redirector('?');
            }
        }
    }

    /**
     * Установка текущей темы оформления
     */
    protected function set_theme()
    {
        if (isset($_GET['theme']) &&
            isset($this->view->availableThemes[$_GET['theme']])
        ) {
            $prefs = $this->model->user->preferences;
            $prefs['theme'] = $_GET['theme'];
            $this->model->user->preferences = $prefs;
            $this->model->user->commit();
            if ($_GET['referer']) {
                new Redirector($_GET['referer']);
            } elseif ($_GET['back']) {
                new Redirector('history:back');
            } else {
                new Redirector('?');
            }
        }
    }

    /**
     * Завершение сеанса
     */
    public function close()
    {
        $this->model->user->commit();
    }


    public function config()
    {
        $CONTENT = [];
        $temp = [
            1 => 'DAY1',
            2 => 'DAY2',
            5 => 'DAY5',
            7 => 'WEEK1',
            14 => 'WEEK2',
            30 => 'MONTH1',
            60 => 'MONTH2',
            90 => 'MONTH3',
            365 => 'YEAR1'
        ];
        foreach ($temp as $i => $val) {
            $CONTENT['cookieLifetime'][] = [
                'value' => $i,
                'caption' => $this->view->_($val)
            ];
        }
        for ($i = 0; $i <= 10; $i++) {
            $CONTENT['minPasswordLength'][] = [
                'value' => $i,
                'caption' => $i
            ];
        }
        foreach ([
            5,
            10,
            15,
            20,
            25,
            30,
            40,
            50,
            75,
            100,
            150,
            200,
            250,
            500,
            1000,
            2000,
            2500,
            5000,
            10000
        ] as $i) {
            $CONTENT['rowsPerPage'][] = ['value' => $i, 'caption' => $i];
        }
        return [
            [
                'type' => 'select',
                'class' => 'span2',
                'name' => 'cookieLifetime',
                'caption' => $this->view->_('COOKIE_LIFETIME_DAYS'),
                'children' => $CONTENT['cookieLifetime']
            ],
            [
                'name' => 'subdomainCookies',
                'caption' => $this->view->_('SUBDOMAIN_COOKIES'),
                'data-hint' => $this->view->_('SUBDOMAIN_COOKIES_HINT'),
            ],
            [
                'type' => 'select',
                'class' => 'span2',
                'name' => 'minPasswordLength',
                'caption' => $this->view->_('MINIMAL_PASSWORD_LENGTH'),
                'children' => $CONTENT['minPasswordLength']
            ],
            [
                'type' => 'select',
                'class' => 'span2',
                'name' => 'rowsPerPage',
                'caption' => $this->view->_('ROWS_PER_PAGE'),
                'children' => $CONTENT['rowsPerPage']
            ],
            [
                'type' => 'email',
                'name' => 'email_from',
                'caption' => $this->view->_('SENDING_EMAIL'),
                'placeholder' => 'info@' . $_SERVER['HTTP_HOST'],
            ],
            [
                'type' => 'select',
                'name' => 'smtp_encryption',
                'caption' => $this->view->_('SMTP_ENCRYPTION'),
                'children' => [
                    ['value' => '', 'caption' => $this->view->_('_NONE')],
                    ['value' => 'ssl', 'caption' => 'SSL'],
                    ['value' => 'tls', 'caption' => 'TLS'],
                ],
            ],
            [
                'type' => 'text',
                'name' => 'smtp_username',
                'autocomplete' => 'new-password',
                'caption' => $this->view->_('SMTP_USERNAME'),
                'placeholder' => $this->view->_('FILL_TO_USE_SMTP')
            ],
            [
                'type' => 'password',
                'name' => 'smtp_password',
                'autocomplete' => 'new-password',
                'caption' => $this->view->_('SMTP_PASSWORD'),
            ],
            [
                'type' => 'text',
                'name' => 'smtp_host',
                'caption' => $this->view->_('SMTP_HOST'),
                'placeholder' => 'ssl://' . $_SERVER['HTTP_HOST'],
            ],
            [
                'type' => 'number',
                'name' => 'smtp_port',
                'caption' => $this->view->_('SMTP_PORT'),
            ],
            [
                'type' => 'checkbox',
                'name' => 'smtp_force_local',
                'caption' => $this->view->_('SMTP_FORCE_LOCAL'),
            ],
            [
                'type' => 'text',
                'name' => 'php_command',
                'caption' => $this->view->_('PHP_COMMAND'),
                'placeholder' => 'php',
            ],
            [
                'type' => 'text',
                'name' => 'mysqldump_command',
                'caption' => $this->view->_('MYSQLDUMP_COMMAND'),
                'placeholder' => 'mysqldump',
            ],
        ];
    }


    /**
     * Ветвление логики по модулям
     */
    abstract protected function fork();

    /**
     * Авторизация по HTTP-протоколу
     */
    protected function httpAuth()
    {
        foreach ($_SERVER as $key => $val) {
            if (preg_match('/^(REDIRECT_)+/i', $key)) {
                $nkey = preg_replace('/^(REDIRECT_)+/i', '', $key);
                if (!isset($_SERVER[$nkey])) {
                    $_SERVER[$nkey] = $val;
                }
            }
        }
        if (!($_SERVER['PHP_AUTH_USER'] ?? false) || !($_SERVER['PHP_AUTH_PW'] ?? false)) {
            $authStr = '';
            foreach (['HTTP_AUTHORIZATION', 'REMOTE_USER'] as $srvKey) {
                if (isset($_SERVER[$srvKey])) {
                    $authStr = $_SERVER[$srvKey];
                    break;
                }
            }
            if ($authStr) {
                $authArr = explode(':', base64_decode(substr($authStr, 6)));
                if ($authArr) {
                    list(
                        $_SERVER['PHP_AUTH_USER'],
                        $_SERVER['PHP_AUTH_PW']
                    ) = $authArr;
                }
            }
        }
        if (!(
            ($_SERVER['PHP_AUTH_USER'] ?? false) &&
            ($_SERVER['PHP_AUTH_PW'] ?? false) &&
            $this->model->user->auth(
                trim((string)$_SERVER['PHP_AUTH_USER']),
                $this->model->md5It(trim((string)$_SERVER['PHP_AUTH_PW']))
            )
        )) {
            header('WWW-Authenticate: Basic realm="Restricted Area"');
            header("HTTP/1.0 401 Unauthorized");
            exit;
        }
    }
}
