<?php
/**
 * Файл web-контроллера модуля RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2012, Volume Networks
 */
namespace RAAS;

/**
 * Класс web-контроллера модуля RAAS
 * @package RAAS
 */
class Controller_Web extends Abstract_Controller
{
    /**
     * Экземпляр класса
     * @var \RAAS\Controller_Web
     */
    protected static $instance;

    /**
     * Инициализатор класса
     */
    protected function init()
    {
        if (get_class($this) == __CLASS__) {
            $this->view = View_Web::i();

            if (isset($_COOKIE['p'])) {
                $this->packageName = strtolower($_COOKIE['p']);
            }
        }
        parent::init();
    }


    /**
     * Логика приложения, если пользователь первый в системе
     */
    public function isFirst()
    {
        if (parent::isFirst()) {
            $this->authSession(
                trim($_POST['login']),
                $this->model->md5It(trim($_POST['password'])),
                (bool)$_POST['save_password']
            );
            new Redirector();
        }
    }


    /**
     * Функция проверки подключения к базе данных
     * @return bool true, если подключение прошло успешно,
     *              false в противном случае
     */
    protected function checkDB()
    {
        $localError = [];
        if ($this->model->DSN && $this->model->initDB()) {
            return true;
        } else {
            $this->configureDB();
        }
        return false;
    }


    /**
     * Функция настройки подключения к базе данных
     */
    protected function configureDB()
    {
        $form = new ConfigureDBForm();
        $this->view->configureDB($form->process());
    }


    /**
     * Авторизация пользователя
     * @return bool true, если пользователь успешно авторизован, false в противном случае
     */
    protected function auth()
    {
        parent::auth();
        if ($this->model->user->isFirst) {
            $this->isFirst();
            return;
        } elseif ($this->model->loginType == 'http') {
            $this->httpAuth();
        } else {
            if (!(isset($_SESSION['login']) && isset($_SESSION['password_md5']) && $this->model->user->auth($_SESSION['login'], $_SESSION['password_md5']))) {
                $cookieAuth = false;
                if (isset($_COOKIE['login']) && isset($_COOKIE['password_md5'])) {
                    $cookieLogin = $_COOKIE['login'];
                    $cookiePassword = substr($_COOKIE['password_md5'], 0, 32);
                    $cookieCheck = substr($_COOKIE['password_md5'], 32);
                    if ($cookieCheck == Application::i()->md5It($cookiePassword . Application::COOKIES_SALT . '1')) {
                        if ($this->model->user->auth($cookieLogin, $cookiePassword)) {
                            $cookieAuth = true;
                            $this->authSession($cookieLogin, $cookiePassword, true);
                        }
                    }
                }
                if (!$cookieAuth) {
                    $this->cleanSessionAuth();
                }
            } elseif (isset($_POST['save_password']) && (int)$_POST['save_password']) {
                $this->authSession(trim($_SESSION['login']), $_SESSION['password_md5'], true);
            }
        }
        if ($this->model->user->id && $this->model->user->ipFilter($_SERVER['REMOTE_ADDR'])) {
            return true;
        } else {
            $this->login();
        }
        return false;
    }


    /**
     * Логика входа в систему с использованием комбинации логина/пароля
     */
    protected function login()
    {
        $t = $this;
        $Form = new Form([
            'caption' => $this->view->_('USER_AUTHENTICATE'),
            'Item' => $this->model->user,
            'submitCaption' => $this->view->_('LOG_IN'),
            'template' => '/log_in',
            'actionMenu' => false,
            'check' => function ($Form) use ($t) {
                if ($localError = $Form->getErrors()) {
                    $t->cleanSessionAuth();
                    return $localError;
                } else {
                    $t->model->user->auth(trim($_POST['login']), $t->model->md5It(trim($_POST['password'])));
                    if (!$t->model->user->id) {
                        return ['name' => 'INVALID', 'value' => 'login', 'description' => 'INVALID_LOGIN_OR_PASSWORD'];
                    } elseif (!$t->model->user->ipFilter($_SERVER['REMOTE_ADDR'])) {
                        return ['name' => 'INVALID', 'value' => '%REMOTE_ADDR%', 'description' => 'INVALID_IP'];
                    }
                }
            },
            'commit' => function () use ($t) {
                $t->authSession(
                    trim($_POST['login']),
                    $t->model->md5It(trim($_POST['password'])),
                    (bool)$_POST['save_password']
                );
                new Redirector();
            },
            'import' => function () {
                return ($_SERVER['REQUEST_METHOD'] == 'POST') ? $_POST : [];
            },
            'children' => [
                ['name' => 'login', 'maxlength' => 16, 'required' => 'required', 'caption' => $this->view->_('LOGIN_NAME')],
                [
                    'type' => 'password',
                    'name' => 'password',
                    'maxlength' => 16,
                    'required' => 'required',
                    'caption' => $this->view->_('PASSWORD')
                ],
                ['type' => 'checkbox', 'name' => 'save_password', 'caption' => $this->view->_('REMEMBER_PASSWORD'), 'export' => 'intval']
            ]
        ]);
        $this->view->login($Form->process());
    }


    /**
     * Логика выхода из системы
     */
    protected function logout()
    {
        $this->cleanSessionAuth(true);
        new Redirector('?');
    }

    /**
     * Применение персональных настроек пользователя
     */
    protected function applyPersonalSettings()
    {
        if (isset($this->model->user->preferences['theme']) && ($this->model->user->preferences['theme'] != '/')) {
            $this->view->theme = $this->model->user->preferences['theme'];
        } else {
            $this->view->theme = '';
        }
        parent::applyPersonalSettings();
    }


    /**
     * Ветвление логики по модулям
     */
    protected function fork()
    {
        $log = new UserLog();
        $log->commit();
        Application::i()->setcookie('p', $this->packageName);
        $this->model->activePackage = $this->model->packages['/'];
        if ($this->mode == 'logout') {
            $this->logout();
            return;
        } elseif (!in_array($this->mode, ['admin', 'manual'])) {
            if ($this->packageName && isset($this->model->packages[$this->packageName]) && ($pack = $this->model->packages[$this->packageName])) {
                if ($pack->registryGet('isActive') && $pack->isCompatible) {
                    if ($this->model->user->access($pack)->canDo) {
                        $this->model->activePackage = $pack;
                        if ($this->moduleName && isset($pack->modules[$this->moduleName]) && ($mod = $pack->modules[$this->moduleName])) {
                            if ($mod->registryGet('isActive') && $mod->isCompatible) {
                                if ($this->model->user->access($mod)->canDo) {
                                    $this->model->activePackage->activeModule = $mod;
                                }
                            }
                        }
                    }
                }
            }
        }

        $Context = $this->model->activeModule ? $this->model->activeModule : $this->model->activePackage;
        if (!$this->model->user->access($Context)->canDo($this->sub, $this->action, $this->id)) {
            $this->id = null;
            $this->action = null;
            if (!$this->model->user->access($Context)->canDo($this->sub)) {
                $this->sub = null;
            }
        }

        if ($this->model->activePackage) {
            $this->model->activePackage->view->header();
            foreach ((array)$this->model->activePackage->modules as $module) {
                if ($module->registryGet('isActive') && $module->isCompatible) {
                    $module->view->header();
                }
            }

            if ($this->mode == 'set_language') {
                $this->set_language();
            } elseif ($this->mode == 'set_theme') {
                $this->set_theme();
            } else {
                $Context->run();
            }
        }
    }


    /**
     * Запись параметров авторизации в сессию и/или cookies
     * @param string $login имя пользователя (логин)
     * @param string $passwordMD5 MD5-хэш пароля
     * @param bool $savePassword true, если требуется записать параметры авторизации в cookies
     */
    public function authSession($login, $passwordMD5, $savePassword = false)
    {
        if ($this->model->loginType != 'http') {
            $_SESSION['login'] = trim($login);
            $_SESSION['password_md5'] = $passwordMD5;
            if ($savePassword) {
                Application::i()->setcookie('login', $login);
                Application::i()->setcookie(
                    'password_md5',
                    $passwordMD5 . Application::i()->md5It($passwordMD5 . Application::COOKIES_SALT)
                );
            }
        }
    }


    /**
     * Очистка параметров авторизации из сессии и cookies
     */
    public function cleanSessionAuth($clearSession = false)
    {
        Application::i()->setcookie('login', null);
        Application::i()->setcookie('password_md5', null);
        unset($_SESSION['login']);
        unset($_SESSION['password_md5']);
        if ($clearSession) {
            Application::i()->setcookie(session_name(), null);
            session_destroy();
        }
    }
}
