<?php
/**
 * @package RAAS
 */
namespace RAAS;

/**
 * Стандартное отображения-подмодуля RAAS
 *
 * Стандартное отображение-подмодуль объединяет типовые задачи отображения, характерные для большинства SOME-объектов
 */
class View_StdSub
{
    /**
     * Экземпляр представления
     * @var \RAAS\View_StdSub     
     */         
    protected $view;

    public function __get($var)
    {
        switch ($var) {
            case 'view':
                return $this->$var;
                break;
        }
    }

    
    public function __construct($view)
    {
        $this->view = $view;
    }

    /**
     * Быстрое формирование меню
     * @param array $menuData массив вида array(array('url перехода', 'наименование константы текста отображения', [array('активирующие action-ы', ...))[]])
     */
    public static function quickMenu(array $menuData = array())
    {
        $submenu = array();
        foreach ($menuData as $arr) {
            $row = array();
            $row['href'] = $arr[0];
            $row['name'] = $arr[1];
            if (isset($arr[2])) {
                $row['active'] = in_array(Application::i()->controller->action, (array)$arr[2]);
            }
            $submenu[] = $row;
        }
        return $submenu;
    }


    /**
     * Стандартное отображение списка (наименование, контекстное меню)
     * @param array $IN входные данные от контроллера (обязательно наличие $IN['Set'], возможно $IN['Pages'])
     * @param string $title заголовок страницы
     * @param string $editAction действие для редактирования
     * @param string $contextMenuName наименование метода, возвращающего контекстное меню для данного объекта
     * @param string $emptyString наименование константы перевода для текста, когда отсутствуют объекты
     * @param string $addString наименование константы перевода для текста "добавить ..."
     */
    public function stdShowlist(array $IN, $title, $editAction, $contextMenuName, $emptyString, $addString, $addAction = null)
    {
        if (!$addAction) {
            $addAction = $editAction;
        }
        $view = $this;
        $IN['Table'] = new Table(array(
            'columns' => array(
                'name' => array(
                    'caption' => $this->view->_('NAME'), 
                    'callback' => function($row) use ($view, $editAction) { 
                        return '<a href="' . $view->view->url . '&action=' . $editAction . '&id=' . (int)$row->id . '">' . htmlspecialchars($row->name) . '</a>'; 
                    }
                ),
                ' ' => array(
                    'callback' => function ($row, $i) use ($view, $contextMenuName, $IN) { return rowContextMenu($view->view->$contextMenuName($row, $i, count($IN['Set']))); }
                )
            ),
            'Set' => $IN['Set'],
            'Pages' => $IN['Pages'],
            'emptyString' => $this->view->_($emptyString)
        ));
        $this->view->assignVars($IN);
        $this->view->title = $this->view->_($title);
        $this->view->contextmenu = array(array('href' => $this->view->url . '&action=' . $addAction, 'name' => $this->view->_($addString), 'icon' => 'plus'));
        $this->view->template = $IN['Table']->template;
    }


    /**
     * Стандартное отображение редактирования (согласно формы, переданной от контроллера)
     * @param array $IN входные данные от контроллера (обязательно наличие $IN['Form'], $IN['Item'])
     * @param string $contextMenuName наименование метода, возвращающего контекстное меню для данного объекта
     */
    public function stdEdit(array $IN, $contextMenuName = null)
    {
        $this->view->assignVars($IN);
        $this->view->title = $IN['Form']->caption;
        $this->view->template = $IN['Form']->template;
        if ($contextMenuName) {
            $this->view->contextmenu = $this->view->$contextMenuName($IN['Item']);
        }
    }


    /**
     * Стандартное контекстное меню
     */
    public function stdContextMenu(\SOME\SOME $Item, $i, $c, $editAction, $showListAction, $deleteAction, $moveUpAction = null, $moveDownAction = null) 
    {
        $arr = array();
        if ($Item->id) {
            $edit = ($this->view->action == $editAction);
            $showlist = ($this->view->action == $showListAction);
            if (!$edit) {
                $arr[] = array('href' => $this->view->url . '&action=' . $editAction . '&id=' . (int)$Item->id, 'name' => $this->view->_('EDIT'), 'icon' => 'edit');
            }
            if ($Item->_defaultOrderBy() == 'priority') {
                if ($i && $moveUpAction) {
                    $arr[] = array(
                        'href' => $this->view->url . '&action=' . $moveUpAction . '&id=' . (int)$Item->id . ($edit || $showlist ? '' : '&back=1'), 'name' => $this->view->_('MOVE_UP'), 'icon' => 'arrow-up'
                    );
                }
                if (($i < $c - 1) && $moveDownAction) {
                    $arr[] = array(
                        'href' => $this->view->url . '&action=' . $moveDownAction . '&id=' . (int)$Item->id . ($edit || $showlist ? '' : '&back=1'), 'name' => $this->view->_('MOVE_DOWN'), 'icon' => 'arrow-down'
                    );
                }
            }
            $arr[] = array(
                'href' => $this->view->url . '&action=' . $deleteAction . '&id=' . (int)$Item->id . ($showlist ? '&back=1' : ''), 
                'name' => $this->view->_('DELETE'), 
                'icon' => 'remove',
                'onclick' => 'return confirm(\'' . $this->view->_('DELETE_TEXT') . '\')'
            );
        }
        return $arr;
    }
}
