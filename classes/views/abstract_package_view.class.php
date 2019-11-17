<?php
/**
 * Файл абстрактного представления абстрактного пакета RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */
namespace RAAS;

use SOME\Namespaces;

/**
 * Класс абстрактного представления абстрактного пакета RAAS
 * @package RAAS
 * @property-read \RAAS\Package $model ссылка на экземпляр пакета
 * @property-read \RAAS\Abstract_View $parent ссылка на экземпляр активного представления ядра
 */
abstract class Abstract_Package_View extends \SOME\Singleton implements IAbstract_Context_View
{
    /**
     * Массив переводов
     * @var array
     */
    protected $translations;

    /**
     * Экземпляр класса
     * @var \RAAS\Abstract_Package_View
     */
    protected static $instance;

    public function __get($var)
    {
        switch ($var) {
            // MVC
            case 'application':
                return $this->package->application;
                break;
            case 'package':
            case 'model':
                $classname = Namespaces::getNS($this, 0, 2) . '\\Package';
                return $classname::i();
                break;
            case 'parent':
                return $this->application->view;
                break;

            // Файлы и папки
            case 'languagesDir':
                return $this->package->systemDir . '/languages';
                break;

            case 'versionName':
                return ($this->_('__VERSION') && ($this->_('__VERSION') != '__VERSION')) ? $this->_('__VERSION') : '';
                break;

            case 'url':
                return '?p=' . $this->packageName;
                break;
            default:
                return $this->parent->$var;
                break;
        }
    }

    public function __set($var, $val)
    {
        switch ($var) {
            default:
                $this->parent->$var = $val;
                break;
        }
    }

    /**
     * Конструктор класса
     */
    protected function init()
    {
        if (is_file($this->languagesDir . '/' . $this->language . '.ini')) {
            $this->translations = parse_ini_file($this->languagesDir . '/' . $this->language . '.ini');
        }
    }


    public function _($var)
    {
        if (isset($this->translations[$var])) {
            return $this->translations[$var];
        } elseif ($this->parent) {
            return $this->parent->_($var);
        }
    }


    public function exportLang()
    {
        foreach ((array)$this->translations as $key => $val) {
            $name = implode('\\', array_slice(Namespaces::getNSArray($this), 1)) . '\\' . $key;
            if (!defined($name)) {
                define($name, $val);
            }
        }
    }


    public function assignVars(array $IN = array())
    {
        return $this->parent->assignVars($IN);
    }
}
