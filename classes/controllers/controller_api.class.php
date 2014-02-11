<?php
/**
 * Файл API-контроллера ядра RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */       
namespace RAAS;

/**
 * Класс API-контроллера ядра RAAS
 * @package RAAS
 */       
final class Controller_Api extends Abstract_Controller
{
    /**
     * Экземпляр класса
     * @var \RAAS\Controller_Api     
     */         
    protected static $instance;
    
    /**
     * Инициализатор класса
     */         
    protected function init()
    {
        if (isset($_GET['v'])) {
            switch ($_GET['v']) {
                case 'json':
                    $this->view = View_Api::i(View_Api::THEME_JSON);
                    break;
                default:
                    $this->view = View_Api::i(View_Api::THEME_XML);
                    break;
            }
        } else {
            $this->view = View_Api::i(View_Api::THEME_XML);
        }
        parent::init();
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
        } elseif ($_GET['config']) {
            $this->configureDB();
        } else {
            if (!$this->model->DSN) {
                $localError[] = array('name' => 'NO_DSN', 'value' => $this->model->dbtype, 'description' => 'NO_DSN');
            } else {
                foreach ($this->model->sqlExceptions as $e) {
                    $localError[] = array('name' => 'CANNOT_CONNECT_DB', 'value' => $e->getCode(), 'description' => $e->getMessage());
                }
            }
            $this->view->checkDB(array('localError' => $localError));
        }
        return false;
    }
    
    
    /**
     * Функция настройки подключения к базе данных
     */         
    protected function configureDB()
    {
        if (!($localError = $this->getConfigureDBErrors())) {
            $this->model->configureDB($_POST);
            $this->view->configureDB(array('ok' => true));
        }
        $this->view->configureDB(array('localError' => $localError));
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
        } else {
            $this->httpAuth();
        }
        if ($this->model->user->id && $this->model->user->ipFilter($_SERVER['REMOTE_ADDR'])) {
            return true;
        } else {
            $localError = array();
            if (!$_GET['sign']) {
                $localError[] = array('name' => 'MISSED', 'value' => 'sign', 'description' => 'SIGNATURE_MISSED');
            } elseif (!$this->model->user->id) {
                $localError[] = array('name' => 'INVALID', 'value' => 'sign', 'description' => 'INVALID_SIGNATURE');
            } elseif (!$this->model->user->ipFilter($_SERVER['REMOTE_ADDR'])) {
                $localError[] = array('name' => 'INVALID', 'value' => '%REMOTE_ADDR%', 'description' => 'INVALID_IP');
            }
            $this->view->login(array('localError' => $localError));
        }
        return false;
    }
    
    
    /**
     * Ветвление логики по модулям
     */         
    protected function fork()
    {
        $localError = array();
        if (in_array($this->mode, array('admin', 'manual'))) {
            $this->model->activePackage = $this->model->packages['/'];
        } elseif ($this->mode == 'set_language') {
            $this->set_language();
            return;
        } elseif ($this->packageName) {
            if (isset($this->model->packages[$this->packageName]) && ($pack = $this->model->packages[$this->packageName]) && $pack->registryGet('isActive')) {
                if ($this->model->user->access($pack)->canDo) {
                    $this->model->activePackage = $pack;
                    if ($this->moduleName) {
                        if (isset($pack->modules[$this->moduleName]) && ($mod = $pack->modules[$this->moduleName]) && $mod->model->registryGet('isActive')) {
                            if ($this->model->user->access($mod)->canDo) {
                                $this->model->activePackage->activeModule = $mod;
                            } else {
                                $localError[] = array('name' => 'ACCESS_DENIED', 'value' => $this->moduleName, 'description' => 'ACCESS_DENIED');
                            }
                        } else {
                            $localError[] = array('name' => 'MODULE_DOES_NOT_EXIST', 'value' => $this->moduleName, 'description' => 'PACKAGE_DOES_NOT_EXIST');
                        }
                    }
                } else {
                    $localError[] = array('name' => 'ACCESS_DENIED', 'value' => $this->packageName, 'description' => 'ACCESS_DENIED');
                }
            } else {
                $localError[] = array('name' => 'PACKAGE_DOES_NOT_EXIST', 'value' => $this->packageName, 'description' => 'PACKAGE_DOES_NOT_EXIST');
            }
        } else {
            $this->model->activePackage = $this->model->packages['/'];
        }
        
        $Context = $this->model->activeModule ? $this->model->activeModule : $this->model->activePackage;
        if (!$this->model->user->access($Context)->canDo($this->sub, $this->action, $this->id)) {
            $localError[] = array('name' => 'ACCESS_DENIED', 'value' => $this->packageName, 'description' => 'ACCESS_DENIED');
        } 
        
        if ($localError) {
            $this->view->errorModuleConnection(array('localError' => $localError));
        } else {
            if ($this->model->activePackage) {
                $this->model->activePackage->run();
            }
        }
    }
}