<?php
/**
 * Файл абстрактного представления ядра RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */       
namespace RAAS;

/**
 * Класс абстрактного представления ядра RAAS
 * @package RAAS
 * @property-read \RAAS\Application $model ссылка на экземпляр приложения
 * @property-read \RAAS\IAbstract_Context_View $context представление текущего пакета/модуля
 * @property-read array $translations массив переводов
 * @property-read string|null $mode режим работы (обычный, админка, справка и т.д.)
 * @property-read string|null $packageName идентификатор активного пакета
 * @property-read string|null $moduleName идентификатор активного модуля
 * @property-read string|null $nav массив прочих навигационных параметров
 * @property-read string|null $sub идентификатор активного подмодуля
 * @property-read string|null $action идентификатор действия
 * @property-read int|null $id идентификатор активного объекта
 * @property-read string $language код текущего языка
 */       
abstract class Abstract_View extends \SOME\Singleton implements IAbstract_Context_View
{
    /**
     * Язык по умолчанию
     */         
    const default_language = 'ru';
    
    /**
     * Код текущего языка
     * @var string     
     */         
    protected $language;
    
    /**
     * Массив переводов
     * @var array     
     */         
    protected $translations;
    
    /**
     * Экземпляр класса
     * @var \RAAS\Abstract_View     
     */         
    protected static $instance;
    
    public function __get($var)
    {
        switch ($var) {
            // MVC
            case 'application': case 'model':
                return Application::i();
                break;
            case 'context':
                return Application::i()->context->view;
                break;
            
            // Файлы и директории
            case 'languagesDir':
                return realpath(__DIR__ . '/../../languages');
                break;
            
            case 'mode': case 'packageName': case 'moduleName': case 'nav': case 'sub': case 'action': case 'id':
                return $this->application->controller->$var;
                break;
                
            case 'language':
                return $this->$var;
                break;
                
            case 'availableLanguages':
                $dir = (array)\SOME\File::scandir($this->languagesDir);
                $temp = array();
                foreach ($dir as $row) {
                    $arr = parse_ini_file($this->languagesDir . '/' . $row);
                    $temp[pathinfo($row, PATHINFO_FILENAME)] = isset($arr['__LANG']) ? $arr['__LANG'] : '';
                }
                return $temp;
                break;
            default:
                break;
        }
    }
    
    /**
     * Инициализатор класса
     */         
    protected function init()
    {
        mb_internal_encoding('UTF-8');
        if (!$this->language) {
            preg_match('/\w+/i', $_SERVER['HTTP_ACCEPT_LANGUAGE'], $regs);
            $this->loadLanguage($regs[0]);
        }
        if (!$this->language) {
            $this->loadLanguage(static::default_language);
        }
    }
    
    
    public function _($var)
    {
        if (isset($this->translations[$var])) {
            return $this->translations[$var];
        } else {
            return $var;
        }
    }
    
    
    /**
     * Формирует набор констант из массива переводов
     */         
    public function exportLang()
    {
        foreach ((array)$this->translations as $key => $val) {
            if (!defined($key)) {
                define($key, $val);
            }
        }
    }
    
    
    /**
     * Загрузка переводов для языка
     * @param string|null $language язык, который выбираем в качестве активного. Если null, активный язык не меняется
     * @return bool true, если перевод загружен, false в противном случае
     */         
    public function loadLanguage($language = null)
    {
        if ($language) {
            $this->language = $language;
        }
        if (is_file($this->languagesDir . '/' . $this->language . '.ini')) {
            $this->translations = parse_ini_file($this->languagesDir . '/' . $this->language . '.ini');
            return true;
        }
        $this->language = null;
        return false;
    }
    
    
    /**
     * Страница проверки совместимости
     * @param array $IN входные данные
     * @return array список ошибок в стандартном RAAS-виде ('name' => внутреннее имя, 'value' => наименование ошибочного параметра, 'description' => человеко-читаемое описание ошибки)     
     */         
    public function checkCompatibility(array $IN)
    {
        $localError = array();
        $key = 'PHP_VERSION_INCOMPATIBLE';
        if ($IN[$key]) {
            $localError[] = array('name' => $key, 'value' => $IN[$key], 'description' => sprintf($this->_($key), Application::requiredPHPVersion));
        }
        $key = 'PHP_EXTENSION_REQUIRED';
        if (isset($IN[$key])) {
            foreach ((array)$IN[$key] as $val) {
                $localError[] = array('name' => $key, 'value' => $val, 'description' => sprintf($this->_($key), $val));
            }
        }
        return $localError;
    }
    
    
    public function assignVars(array $IN)
    {
    }
    
    
    /**
     * Выводит данные конечному пользователю
     */         
    abstract public function render();
    
    
    /**
     * Комбинирует переменные из представлений ядра, пакетов и модулей
     */         
    protected function combineViews()
    {
        foreach ($this->model->packages as $tmp_p) {
            $tmp_p->controller->view->exportLang();
            foreach ((array)$tmp_p->modules as $tmp_m) {
                $tmp_m->controller->view->exportLang();
            }
        }
        foreach ((array)$this->dataContainer as $key) {
            $this->$key = (array)$this->$key;
        }
    }
}