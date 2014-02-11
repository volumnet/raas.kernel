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
     * @param \SOME\SOME $Item объект для перемещения
     * @param string url URL для перехода после выполнения действия
     * @param bool $conditionalBack если установлен в TRUE, функция будет проверять наличие переменной $_GET['back'] и при обнаружении ее 
     *                              автоматически заменять параметр $url на 'history:back'
     * @param callable|bool $filter дополнительное условие - для выполнения фактического действия должен быть TRUE, 
     *                              либо (если callable) возвращать TRUE от объекта $Item
     * @param \SOME\SOME $Parent родительский элемент для дополнительной фильтрации
     */         
    public static function move_up(\SOME\SOME $Item, $url = 'history::back', $conditionalBack = true, $filter = true, $Parent = null)
    {
        if ($Item->id && (is_callable($filter) ? $filter($Item) : (bool)$filter)) {
            $Item->reorder((isset($_GET['step']) && (int)$_GET['step']) ? -1 * abs((int)$_GET['step']) : -1, $Parent);
            $Item->commit();
        }
        new Redirector(($conditionalBack && isset($_GET['back'])) ? 'history:back' : $url);
    }


    /**
     * Перемещение объекта вниз по списку
     * @param \SOME\SOME $Item объект для перемещения
     * @param string url URL для перехода после выполнения действия
     * @param bool $conditionalBack если установлен в TRUE, функция будет проверять наличие переменной $_GET['back'] и при обнаружении ее 
     *                              автоматически заменять параметр $url на 'history:back'
     * @param callable|bool $filter дополнительное условие - для выполнения фактического действия должен быть TRUE, 
     *                              либо (если callable) возвращать TRUE от объекта $Item
     * @param \SOME\SOME $Parent родительский элемент для дополнительной фильтрации
     */         
    public static function move_down(\SOME\SOME $Item, $url = 'history::back', $conditionalBack = true, $filter = true, $Parent = null)
    {
        if ($Item->id && (is_callable($filter) ? $filter($Item) : (bool)$filter)) {
            $Item->reorder((isset($_GET['step']) && (int)$_GET['step']) ? abs((int)$_GET['step']) : 1, $Parent);
            $Item->commit();
        }
        new Redirector(($conditionalBack && isset($_GET['back'])) ? 'history:back' : $url);
    }


    /**
     * Смена видимости объекта
     * @param \SOME\SOME $Item объект для смены видимости
     * @param string url URL для перехода после выполнения действия
     * @param bool $conditionalBack если установлен в TRUE, функция будет проверять наличие переменной $_GET['back'] и при обнаружении ее 
     *                              автоматически заменять параметр $url на 'history:back'
     * @param callable|bool $filter дополнительное условие - для выполнения фактического действия должен быть TRUE, 
     *                              либо (если callable) возвращать TRUE от объекта $Item
     */         
    public static function chvis(\SOME\SOME $Item, $url = 'history::back', $conditionalBack = true, $filter = true)
    {
        if ($Item->id && (is_callable($filter) ? $filter($Item) : (bool)$filter)) {
            $Item->vis = (int)!$Item->vis;
            $Item->commit();
        }
        new Redirector(($conditionalBack && isset($_GET['back'])) ? 'history:back' : $url);
    }


    /**
     * Удаление объекта
     * @param \SOME\SOME $Item объект для удаления
     * @param string url URL для перехода после выполнения действия
     * @param bool $conditionalBack если установлен в TRUE, функция будет проверять наличие переменной $_GET['back'] и при обнаружении ее 
     *                              автоматически заменять параметр $url на 'history:back'
     * @param callable|bool $filter дополнительное условие - для выполнения фактического действия должен быть TRUE, 
     *                              либо (если callable) возвращать TRUE от объекта $Item
     */         
    public static function delete(\SOME\SOME $Item, $url = 'history::back', $conditionalBack = true, $filter = true)
    {
        if ($Item->id && (is_callable($filter) ? $filter($Item) : (bool)$filter)) {
            $classname = get_class($Item);
            $classname::delete($Item);
        }
        new Redirector(($conditionalBack && isset($_GET['back'])) ? 'history:back' : $url);
    }


    /**
     * Перемещение объекта к другому родителю
     * @param \SOME\SOME $Item объект для перемещения (в sprintf подставляется в любом случае $Item->pid)
     * @param \SOME\SOME $Parent новый родительский объект (должен быть того же типа)
     * @param string url URL для перехода после выполнения действия
     * @param bool $conditionalBack если установлен в TRUE, функция будет проверять наличие переменной $_GET['back'] и при обнаружении ее 
     *                              автоматически заменять параметр $url на 'history:back'
     * @param callable|bool $filter дополнительное условие - для выполнения фактического действия должен быть TRUE, 
     *                              либо (если callable) возвращать TRUE от объекта $Item
     */         
    public static function move(\SOME\SOME $Item, \SOME\SOME $Parent, $url = 'history::back', $conditionalBack = true, $filter = true)
    {
        $ok = true;
        if (get_class($Item) == get_class($Parent)) {
            $ok &= ($Parent->id != $Item->id) && ($Parent->id != $Item->pid) && !in_array($Parent->id, $Item->all_children_ids);
        }
        if ($Item->id && $ok && (is_callable($filter) ? $filter($Item) : (bool)$filter)) {
            $Item->pid = (int)$Parent->id;
            $Item->commit();
        }
        new Redirector(($conditionalBack && isset($_GET['back'])) ? 'history:back' : sprintf($url, (int)$Item->pid));
    }


    /**
     * Произвольное именованное действие с объектом
     * @param object $Item объект для действия
     * @param string url URL для перехода после выполнения действия
     * @param bool $conditionalBack если установлен в TRUE, функция будет проверять наличие переменной $_GET['back'] и при обнаружении ее 
     *                              автоматически заменять параметр $url на 'history:back'
     * @param callable|bool $filter дополнительное условие - для выполнения фактического действия должен быть TRUE, 
     *                              либо (если callable) возвращать TRUE от объекта $Item
     */         
    public static function __callStatic($f, $args)
    {
        if (isset($args[0]) && is_object($args[0])) {
            $Item = $args[0];
        } else {
            return false;
        }
        $url = isset($args[1]) ? (string)$args[1] : 'history:back';
        $conditionalBack = isset($args[2]) ? (bool)$args[2] : true;
        $filter = isset($args[3]) ? (bool)$args[3] : true;
        $arguments = (count($args) > 4) ? array_slice($args, 4) : array();
        if (($Item->id || !($Item instanceof \SOME\SOME)) && (is_callable($filter) ? $filter($Item) : (bool)$filter)) {
            call_user_func_array(array($Item, $f), $arguments);
        }
        new Redirector(($conditionalBack && isset($_GET['back'])) ? 'history:back' : $url);
    }
}