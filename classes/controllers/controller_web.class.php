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
            $this->authSession(trim($_POST['login']), $this->model->md5It(trim($_POST['password'])), (bool)$_POST['save_password']);
            new Redirector();
        }
    }
    
    
    /**
     * Функция проверки подключения к базе данных
     * @return bool true, если подключение прошло успешно, false в противном случае     
     */         
    protected function checkDB()
    {
        $localError = array();
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
        $CONTENT = array();
        foreach ($this->application->availableDatabases as $key => $val) {
            $CONTENT['databases'][] = array('value' => $key, 'caption' => $this->view->_($val));
        }
        $CONTENT['loginTypes'] = array(
            array('value' => 'session', 'caption' => $this->view->_('SESSION_LOGIN')), array('value' => 'http', 'caption' => $this->view->_('HTTP_LOGIN'))
        );
        $t = $this;
        $Form = new Form(array(
            'caption' => $this->view->_('CONFIGURE_DB'),
            'commit' => function() use ($t) { 
                $t->model->configureDB($_POST); 
                new Redirector();
            },
            'children' => array(
                array('type' => 'hidden', 'name' => 'dbtype', 'default' => 'mysql'),
                array(
                    'name' => 'dbhost', 
                    'required' => 'required', 
                    'caption' => $this->view->_('DBHOST'), 
                    'default' => ($this->model->dbhost ? $this->model->dbhost : '127.0.0.1')
                ),
                array('name' => 'dbuser', 'required' => 'required', 'caption' => $this->view->_('DBUSER'), 'default' => 'root'),
                array('type' => 'password', 'name' => 'dbpass', 'caption' => $this->view->_('DBPASS')),
                array('name' => 'dbname', 'required' => 'required', 'caption' => $this->view->_('DBNAME'), 'default' => $_SERVER['HTTP_HOST']),
                array('name' => 'dbprefix', 'caption' => $this->view->_('DBPREFIX'), 'default' => $this->model->dbprefix),
                array(
                    'type' => 'select', 
                    'name' => 'loginType', 
                    'caption' => $this->view->_('SELECT_LOGIN_TYPE'), 
                    'required' => 'required', 
                    'children' => $CONTENT['loginTypes'], 
                    'default' => $this->model->loginType
                )
            )
        ));
        $this->view->configureDB($Form->process());
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
                if (isset($_COOKIE['login']) && isset($_COOKIE['password_md5']) && $this->model->user->auth($_COOKIE['login'], $_COOKIE['password_md5'])) {
                    $this->authSession(trim($_COOKIE['login']), $_COOKIE['password_md5'], true);
                } else {
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
        $Form = new Form(array(
            'caption' => $this->view->_('USER_AUTHENTICATE'),
            'Item' => $this->model->user,
            'submitCaption' => $this->view->_('LOG_IN'),
            'template' => '/log_in',
            'actionMenu' => false,
            'check' => function($Form) use ($t) {
                if ($localError = $Form->getErrors()) {
                    $t->cleanSessionAuth();
                    return $localError;
                } else {
                    $t->model->user->auth(trim($_POST['login']), $t->model->md5It(trim($_POST['password'])));
                    if (!$t->model->user->id) {
                        return array('name' => 'INVALID', 'value' => 'login', 'description' => 'INVALID_LOGIN_OR_PASSWORD');
                    } elseif (!$t->model->user->ipFilter($_SERVER['REMOTE_ADDR'])) {
                        return array('name' => 'INVALID', 'value' => '%REMOTE_ADDR%', 'description' => 'INVALID_IP');
                    }
                }
            },
            'commit' => function() use ($t) { $t->authSession(trim($_POST['login']), $t->model->md5It(trim($_POST['password'])), (bool)$_POST['save_password']); },
            'import' => function() { return ($_SERVER['REQUEST_METHOD'] == 'POST') ? $_POST : array(); },
            'children' => array(
                array('name' => 'login', 'maxlength' => 16, 'required' => 'required', 'caption' => $this->view->_('LOGIN_NAME')), 
                array(
                    'type' => 'password', 
                    'name' => 'password', 
                    'maxlength' => 16, 
                    'required' => 'required', 
                    'caption' => $this->view->_('PASSWORD')
                ),
                array('type' => 'checkbox', 'name' => 'save_password', 'caption' => $this->view->_('REMEMBER_PASSWORD'), 'export' => 'intval')
            )
        ));
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
        setcookie('p', $this->packageName, time() + $this->model->registryGet('cookieLifetime') * 86400, '/');
        $this->model->activePackage = $this->model->packages['/'];
        if ($this->mode == 'logout') {
            $this->logout();
            return;
        } elseif (!in_array($this->mode, array('admin', 'manual'))) {
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
     * @param string $password_md5 MD5-хэш пароля
     * @param bool $save_password true, если требуется записать параметры авторизации в cookies               
     */         
    public function authSession($login, $password_md5, $save_password = false)
    {
        if ($this->model->loginType != 'http') {
            $_SESSION['login'] = trim($login);
            $_SESSION['password_md5'] = $password_md5;
            if ($save_password) {
                setcookie('login', $login, time() + $this->model->registryGet('cookieLifetime') * 86400, '/');
                setcookie('password_md5', $password_md5, time() + $this->model->registryGet('cookieLifetime') * 86400, '/');
            }
        }
    }
    
    
    /**
     * Очистка параметров авторизации из сессии и cookies
     */         
    public function cleanSessionAuth($clearSession = false)
    {
        setcookie('login', '', time() - 1, '/');
        setcookie('password_md5', '', time() - 1, '/');
        unset($_SESSION['login']);
        unset($_SESSION['password_md5']);
        if ($clearSession) {
            setcookie(session_name(), '', time() - 1, '/');
            session_destroy();
        }
    }
}