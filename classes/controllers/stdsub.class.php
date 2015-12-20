<?php
/**
 * Файл стандартного подмодуля RAAS
 * 
 * Стандартный подмодуль объединяет типовые задачи, характерные для большинства SOME-объектов
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2013, Volume Networks
 */       
namespace RAAS;

/**
 * Класс стандартного подмодуля RAAS
 * @package RAAS
 */       
class StdSub extends Abstract_Sub_Controller
{
    /**
     * Экземпляр класса
     * @var \RAAS\StdSub     
     */         
    protected static $instance;
    

    /**
     * Конструктор класса
     */         
    protected function init() {}


    /**
     * Перемещение объекта вверх по списку
     * @param mixed $data Данные об объектах (обработка с помощью метода getItems - см. описание там)
     * @param string url URL для перехода после выполнения действия
     * @param bool $conditionalBack если установлен в TRUE, функция будет проверять наличие переменной $_GET['back'] и при обнаружении ее 
     *                              автоматически заменять параметр $url на 'history:back'
     * @param callable|bool $filter дополнительное условие - для выполнения фактического действия должен быть TRUE, 
     *                              либо (если callable) возвращать TRUE от объекта $Item
     * @param mixed $where Дополнительное условие для поиска, например, общность родительских элементов
     */         
    public static function move_up($data, $url = 'history::back', $conditionalBack = true, $filter = true, $where = null)
    {
        $items = self::getItems($data, $filter);
        foreach ($items as $Item) {
            $Item->reorder((isset($_GET['step']) && (int)$_GET['step']) ? -1 * abs((int)$_GET['step']) : -1, $where);
        }
        new Redirector(($conditionalBack && isset($_GET['back'])) ? 'history:back' : $url);
    }


    /**
     * Перемещение объекта вниз по списку
     * @param mixed $data Данные об объектах (обработка с помощью метода getItems - см. описание там)
     * @param string url URL для перехода после выполнения действия
     * @param bool $conditionalBack если установлен в TRUE, функция будет проверять наличие переменной $_GET['back'] и при обнаружении ее 
     *                              автоматически заменять параметр $url на 'history:back'
     * @param callable|bool $filter дополнительное условие - для выполнения фактического действия должен быть TRUE, 
     *                              либо (если callable) возвращать TRUE от объекта $Item
     * @param mixed $where Дополнительное условие для поиска, например, общность родительских элементов
     */         
    public static function move_down($data, $url = 'history::back', $conditionalBack = true, $filter = true, $where = null)
    {
        $items = self::getItems($data, $filter);
        foreach ($items as $Item) {
            $Item->reorder((isset($_GET['step']) && (int)$_GET['step']) ? abs((int)$_GET['step']) : 1, $where);
        }
        new Redirector(($conditionalBack && isset($_GET['back'])) ? 'history:back' : $url);
    }


    /**
     * Смена видимости объекта
     * @param mixed $data Данные об объектах (обработка с помощью метода getItems - см. описание там)
     * @param string url URL для перехода после выполнения действия
     * @param bool $conditionalBack если установлен в TRUE, функция будет проверять наличие переменной $_GET['back'] и при обнаружении ее 
     *                              автоматически заменять параметр $url на 'history:back'
     * @param callable|bool $filter дополнительное условие - для выполнения фактического действия должен быть TRUE, 
     *                              либо (если callable) возвращать TRUE от объекта $Item
     */         
    public static function chvis($data, $url = 'history::back', $conditionalBack = true, $filter = true)
    {
        $items = self::getItems($data, $filter);
        foreach ($items as $Item) {
            $Item->vis = (int)!$Item->vis;
            $Item->commit();
        }
        new Redirector(($conditionalBack && isset($_GET['back'])) ? 'history:back' : $url);
    }


    /**
     * Установка видимости объекта
     * @param mixed $data Данные об объектах (обработка с помощью метода getItems - см. описание там)
     * @param string url URL для перехода после выполнения действия
     * @param bool $conditionalBack если установлен в TRUE, функция будет проверять наличие переменной $_GET['back'] и при обнаружении ее 
     *                              автоматически заменять параметр $url на 'history:back'
     * @param callable|bool $filter дополнительное условие - для выполнения фактического действия должен быть TRUE, 
     *                              либо (если callable) возвращать TRUE от объекта $Item
     */         
    public static function vis($data, $url = 'history::back', $conditionalBack = true, $filter = true)
    {
        $items = self::getItems($data, $filter);
        foreach ($items as $Item) {
            $Item->vis = 1;
            $Item->commit();
        }
        new Redirector(($conditionalBack && isset($_GET['back'])) ? 'history:back' : $url);
    }


    /**
     * Снятие видимости объекта
     * @param mixed $data Данные об объектах (обработка с помощью метода getItems - см. описание там)
     * @param string url URL для перехода после выполнения действия
     * @param bool $conditionalBack если установлен в TRUE, функция будет проверять наличие переменной $_GET['back'] и при обнаружении ее 
     *                              автоматически заменять параметр $url на 'history:back'
     * @param callable|bool $filter дополнительное условие - для выполнения фактического действия должен быть TRUE, 
     *                              либо (если callable) возвращать TRUE от объекта $Item
     */         
    public static function invis($data, $url = 'history::back', $conditionalBack = true, $filter = true)
    {
        $items = self::getItems($data, $filter);
        foreach ($items as $Item) {
            $Item->vis = 0;
            $Item->commit();
        }
        new Redirector(($conditionalBack && isset($_GET['back'])) ? 'history:back' : $url);
    }


    /**
     * Удаление объекта
     * @param mixed $data Данные об объектах (обработка с помощью метода getItems - см. описание там)
     * @param string url URL для перехода после выполнения действия
     * @param bool $conditionalBack если установлен в TRUE, функция будет проверять наличие переменной $_GET['back'] и при обнаружении ее 
     *                              автоматически заменять параметр $url на 'history:back'
     * @param callable|bool $filter дополнительное условие - для выполнения фактического действия должен быть TRUE, 
     *                              либо (если callable) возвращать TRUE от объекта $Item
     */         
    public static function delete($data, $url = 'history::back', $conditionalBack = true, $filter = true)
    {
        $items = self::getItems($data, $filter);
        foreach ($items as $Item) {
            $classname = get_class($Item);
            $classname::delete($Item);
        }
        new Redirector(($conditionalBack && isset($_GET['back'])) ? 'history:back' : $url);
    }


    /**
     * Перемещение объекта к другому родителю
     * @param mixed $data Данные об объектах (обработка с помощью метода getItems - см. описание там)
     * @param \SOME\SOME $Parent новый родительский объект (должен быть того же типа)
     * @param string url URL для перехода после выполнения действия
     * @param bool $conditionalBack если установлен в TRUE, функция будет проверять наличие переменной $_GET['back'] и при обнаружении ее 
     *                              автоматически заменять параметр $url на 'history:back'
     * @param callable|bool $filter дополнительное условие - для выполнения фактического действия должен быть TRUE, 
     *                              либо (если callable) возвращать TRUE от объекта $Item
     */         
    public static function move($data, \SOME\SOME $Parent, $url = 'history::back', $conditionalBack = true, $filter = true)
    {
        $items = self::getItems($data, $filter);
        foreach ($items as $Item) {
            if (
                (get_class($Item) != get_class($Parent)) || 
                !in_array($Parent->id, array_merge(array((int)$Item->id, (int)$Item->pid), (array)$Item->all_children_ids))
            ) {
                $Item->pid = (int)$Parent->id;
                $Item->commit();
            }
        }
        new Redirector(($conditionalBack && isset($_GET['back'])) ? 'history:back' : sprintf($url, (int)$Item->pid));
    }


    /**
     * Произвольное именованное действие с объектом
     * @param mixed $data Данные об объектах (обработка с помощью метода getItems - см. описание там)
     * @param string url URL для перехода после выполнения действия
     * @param bool $conditionalBack если установлен в TRUE, функция будет проверять наличие переменной $_GET['back'] и при обнаружении ее 
     *                              автоматически заменять параметр $url на 'history:back'
     * @param callable|bool $filter дополнительное условие - для выполнения фактического действия должен быть TRUE, 
     *                              либо (если callable) возвращать TRUE от объекта $Item
     */         
    public static function __callStatic($f, $args)
    {
        if (isset($args[0])) {
            $data = $args[0];
        } else {
            return false;
        }
        $url = isset($args[1]) ? (string)$args[1] : 'history:back';
        $conditionalBack = isset($args[2]) ? (bool)$args[2] : true;
        $filter = isset($args[3]) ? $args[3] : true;
        $arguments = (count($args) > 4) ? array_slice($args, 4) : array();
        
        $items = self::getItems($data, $filter);
        foreach ($items as $Item) {
            call_user_func_array(array($Item, $f), $arguments);
        }
        new Redirector(($conditionalBack && isset($_GET['back'])) ? 'history:back' : $url);
    }


    /**
     * Получение объектов из входных данных
     * @param array[\SOME\SOME]|\SOME\SOME|object $data Входные данные
     * @param callable|bool $filter дополнительное условие - для выполнения фактического действия должен быть TRUE, 
     *                              либо (если callable) возвращать TRUE от объекта $Item
     * @return array[\SOME\SOME|object] массив объектов для обработки
     */
    public function getItems($data, $filter = true)
    {
        if (!$filter) {
            return array();
        }
        if (($data instanceof \SOME\SOME) || !is_array($data)) {
            $data = array($data);
        }

        $temp = array();
        foreach ($data as $row) {
            if ($row instanceof \SOME\SOME) {
                if ($row->id) {
                    $temp[] = $row;
                }
            } elseif (is_object($row)) {
                $temp[] = $row;
            }
        }
        if (is_callable($filter)) {
            $temp = array_filter($temp, $filter);
        }
        return $temp;
    }
}