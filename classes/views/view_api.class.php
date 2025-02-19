<?php
/**
 * @package RAAS
 */
declare(strict_types=1);

namespace RAAS;

use ArrayObject;
use SOME\SOME;
use SOME\Text;

/**
 * API-представление ядра RAAS
 * @property int $theme вид вывода (JSON или XML согласно одноименным константам класса)
 * @property array $tree древовидный массив для отображения пользователю
 * @method void checkDB(array $in) - проверка подключения к базе данных. $in - входные данные
 * @method void checkSOME(array $in) - страница проверки совместимости движка SOME. $in - входные данные
 * @method void configureDB(array $in) - страница конфигурации базы данных. $in - входные данные
 * @method void login(array $in) - проверка входа в систему. $in - входные данные
 */
class View_Api extends View_Web
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
     * @var ArrayObject
     */
    protected $tree;
    
    /**
     * Вид вывода (JSON или XML согласно одноименным константам класса)
     * @var int
     */
    private $theme = self::THEME_JSON;
    
    /**
     * Экземпляр класса
     * @var Abstract_View
     */
    protected static $instance;
    
    public function __get($var)
    {
        switch ($var) {
            case 'theme':
            case 'tree':
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
            case 'checkDB':
            case 'checkSOME':
            case 'configureDB':
            case 'login':
            case 'set_language':
                $this->assignVars($args[0]);
                break;
        }
    }
    
    
    /**
     * Конструктор класса
     */
    protected function init($theme = self::THEME_JSON)
    {
        $this->tree = new ArrayObject();
        parent::init();
        if (in_array($theme, [self::THEME_XML, self::THEME_JSON])) {
            $this->theme = $theme;
        }
    }
    
    
    /**
     * Страница ошибки подключения модуля
     * @param array $in входные данные
     */
    public function errorModuleConnection(array $in)
    {
        $this->tree['localError'] = [];
        if ($in['localError']) {
            foreach ($in['localError'] as $val) {
                $this->tree['localError'] = [
                    'name' => $val['name'],
                    'value' => $val['value'],
                    'description' => sprintf($this->_($val['description']), $val['value'])
                ];
            }
        }
    }
    
    
    /**
     * Страница проверки совместимости
     * @param array $in входные данные
     */
    public function checkCompatibility(array $in)
    {
        $in['localError'] = parent::checkCompatibility($in);
        $this->assignVars($in);
    }
    
    
    /**
     * Быстрое формирование контейнеров данных и строковых контейнеров из входных данных
     * @param array $in данные для формирования переменных
     */
    public function assignVars(array $in = [])
    {
        if (isset($in['localError'])) {
            foreach ($in['localError'] as $e) {
                $this->tree['localError'][] = [
                    'name' => $e['name'],
                    'value' => $e['value'],
                    'description' => $this->_($e['description'])
                ];
            }
        }
        if (isset($in['ok'])) {
            $this->tree['ok'] = $this->_($in['ok']);
        }
        unset($in['localError'], $in['ok']);
        $this->tree = new ArrayObject(array_merge((array)$this->tree, (array)$in));
    }
    
    
    /**
     * Преобразует SOME-объекты в ассоциативные массивы
     */
    protected function prepareVars(array $in = [])
    {
        foreach ($in as $key => $val) {
            if ($val instanceof SOME) {
                $in[$key] = (array)$val->getArrayCopy();
            } elseif (($val instanceof ArrayObject) || is_array($val)) {
                $in[$key] = $this->prepareVars((array)$val);
            }
        }
        return $in;
    }
    
    
    /**
     * Выводит данные конечному пользователю
     */
    public function render()
    {
        $db = debug_backtrace(0);
        $this->tree['method'] = $db[1]['function'];
        $this->combineViews();
        
        ob_clean();
        header('Cache-Control: no-cache, must-revalidate');
        header('Pragma: no-cache');
        if ($this->theme == self::THEME_XML) {
            header('Content-Type: text/xml; charset=UTF-8');
            echo '<RAAS>' . Text::serializeXML($this->tree) . '</RAAS>';
        } else {
            header('Content-Type: text/json; charset=UTF-8');
            $this->tree = $this->prepareVars((array)$this->tree);
            echo json_encode($this->tree);
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
