<?php
/**
 * Файл API-представления ядра RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */       
namespace RAAS;

/**
 * Класс API-представления ядра RAAS
 * @package RAAS
 * @property int $theme вид вывода (JSON или XML согласно одноименным константам класса)
 * @property array $tree древовидный массив для отображения пользователю
 * @method void checkDB(array $IN) - проверка подключения к базе данных. $IN - входные данные
 * @method void checkSOME(array $IN) - страница проверки совместимости движка SOME. $IN - входные данные
 * @method void configureDB(array $IN) - страница конфигурации базы данных. $IN - входные данные
 * @method void login(array $IN) - проверка входа в систему. $IN - входные данные
 */       
final class View_Api extends Abstract_View
{
    /**
     * Отображение данных в виде XML
     */         
    const THEME_XML = 0;
    
    /**
     * Отображение данных в виде JSON
     */         
    const THEME_JSON = 1;
    
    /**
     * Древовидный массив для отображения пользователю
     * @var \ArrayObject     
     */         
    protected $tree;
    
    /**
     * Вид вывода (JSON или XML согласно одноименным константам класса)
     * @var int     
     */         
    private $theme = self::THEME_XML;
    
    /**
     * Экземпляр класса
     * @var \RAAS\Abstract_View     
     */         
    protected static $instance;
    
    public function __get($var)
    {
        switch ($var) {
            case 'theme': case 'tree':
                return $this->$var;
                break;
            default:
                return parent::__get($var);
                break;
        }
    }
    
    public function __set($var, $val)
    {
        switch ($var) {
            case 'tree':
                $this->$var = $val;
                break;
        }
    }
    
    public function __call($name, $args)
    {
        switch ($name) {
            case 'checkDB': case 'checkSOME': case 'configureDB': case 'login': case 'set_language':
                $this->assignVars($args[0]);
                break;
        }
    }
    
    
    /**
     * Конструктор класса
     */         
    protected function init($theme = self::THEME_XML)
    {
        $this->tree = new \ArrayObject();
        parent::init();
        if (in_array($theme, array(self::THEME_XML, self::THEME_JSON))) {
            $this->theme = $theme;
        }
    }
    
    
    /**
     * Страница ошибки подключения модуля
     * @param array $IN входные данные
     */         
    public function errorModuleConnection(array $IN)
    {
        $this->tree['localError'] = array();
        if ($IN['localError']) {
            foreach ($IN['localError'] as $val) {
                $this->tree['localError'] = array(
                    'name' => $val['name'], 
                    'value' => $val['value'], 
                    'description' => sprintf($this->_($val['description']), $val['value'])
                );
            }
        }
    }
    
    
    /**
     * Страница проверки совместимости
     * @param array $IN входные данные
     */         
    public function checkCompatibility(array $IN)
    {
        $IN['localError'] = parent::checkCompatibility($IN);
        $this->assignVars($IN);
    }
    
    
    /**
     * Быстрое формирование контейнеров данных и строковых контейнеров из входных данных
     * @param array $IN данные для формирования переменных
     */         
    public function assignVars(array $IN)
    {
        if (isset($IN['localError'])) {
            foreach ($IN['localError'] as $e) {
                $this->tree['localError'][] = array('name' => $e['name'], 'value' => $e['value'], 'description' => $this->_($e['description']));
            }
        }
        if (isset($IN['ok'])) {
            $this->tree['ok'] = $this->_($IN['ok']);
        }
        unset($IN['localError'], $IN['ok']);
        $this->tree = new \ArrayObject(array_merge((array)$this->tree, (array)$IN));
    }
    
    
    /**
     * Преобразует SOME-объекты в ассоциативные массивы
     */
    private function prepareVars(array $IN)
    {
        foreach ($IN as $key => $val) {
            if ($val instanceof \SOME\SOME) {
                $IN[$key] = (array)$val->getArrayCopy();
            } elseif (($val instanceof \ArrayObject) || is_array($val)) {
                $IN[$key] = $this->prepareVars((array)$val);
                
            }
        }
        return $IN;
    }
    
    
    /**
     * Выводит данные конечному пользователю
     */         
    public function render()
    {
        $db = debug_backtrace(false);
        $this->tree['method'] = $db[1]['function'];
        $this->combineViews();
        
        ob_clean();
        header ('Cache-Control: no-cache, must-revalidate');
        header ('Pragma: no-cache');
        if ($this->theme == self::THEME_XML) {
            header('Content-Type: text/xml; charset=UTF-8');
            echo '<RAAS>' . \SOME\Text::serializeXML($this->tree) . '</RAAS>';
        } else {
            header('Content-Type: text/json; charset=UTF-8');
            $this->tree = $this->prepareVars((array)$this->tree);
            echo \json_encode($this->tree);
        }
    }
    
    /**
     * Комбинирует переменные из представлений ядра, пакетов и модулей
     */         
    protected function combineViews()
    {
        parent::combineViews();
        $this->tree = (array)$this->tree;
    }
}