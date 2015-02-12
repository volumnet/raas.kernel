<?php
namespace RAAS\General;
use \RAAS\User as User;
use \RAAS\Group as Group;
use \RAAS\Level as Level;
use \RAAS\IContext as IContext;
use \RAAS\IRightsContext as IRightsContext;
use \RAAS\Table as Table;
use \RAAS\Column as Column;
use \RAAS\Row as Row;

class ViewSub_Modules extends \RAAS\Abstract_Sub_View
{
    protected static $instance;
    
    public function __get($var)
    {
        switch ($var) {
            case 'url':
                return '?mode=admin&sub=' . $this->sub;
                break;
            default:
                return parent::__get($var);
                break;
        }
    }

    
    public function edit(array $IN)
    {
        $this->path[] = array('name' => $this->_('MODULES'), 'href' => $this->url);
        if ($IN['Context'] instanceof IRightsContext) {
            $this->contextmenu = $this->getModuleContextMenu($IN['Context']);
        }
        $this->stdView->stdEdit($IN);
    }

    
    public function update(array $IN = array())
    {
        $this->assignVars($IN);
        $this->title = $this->_('SYSTEM_UPDATE');
        $this->path[] = array('name' => $this->_('MODULES'), 'href' => $this->url);
        $this->template = 'admin_modules_update';
    }
    

    public function levels(array $IN = array())
    {
        $view = $this;
        $IN['Table'] = new Table(array(
            'columns' => array(
                'name' => array(
                    'caption' => $this->_('NAME'), 
                    'callback' => function($row) use ($view, $IN) {
                        if ($row instanceof Level) {
                            if ($row->locked) {
                                return htmlspecialchars($row->name);
                            } else {
                                return '<a href="' . $view->url . $view->getContextURL($IN['Context']) . '&action=edit_level&id=' . (int)$row->id . '">' 
                                     .    htmlspecialchars($row->name) 
                                     . '</a>';
                            }
                        } else {
                            return htmlspecialchars($row);
                        }
                    },
                ),
                ' ' => array(
                    'callback' => function($row, $i) use ($view, $IN) { 
                        if ($row instanceof Level) { return rowContextMenu($view->getLevelContextMenu($row, $i - 1, count($IN['Context']->levels))); } 
                    }
                )
            ),
            'emptyString' => $this->_('NO_RIGHT_MANAGEMENT_AVAILABLE_IN_THIS_CONTEXT'),
        ));
        if (!($IN['Context'] instanceof \RAAS\Application) && !($IN['Context'] instanceof \RAAS\General\Package) && $IN['Context']->hasRights) {
            $IN['Table']->Set[] = $this->_('GRANT_ALL');
            foreach ($IN['Context']->levels as $row) {
                $IN['Table']->Set[] = $row;
            }
            $IN['Table']->Set[] = $this->_('REVOKE_ALL');
        }

        $this->assignVars($IN);
        $this->title = $this->application->view->_('ACCESS_LEVELS') . ': ' . $IN['Context']->view->_('__NAME');
        $this->path[] = array('name' => $this->_('MODULES'), 'href' => $this->url);
        $this->contextmenu = array(
            array('name' => $this->_('ADD_LEVEL'), 'href' => $this->url . $this->getcontextURL($IN['Context']) . '&action=edit_level', 'icon' => 'plus')
        );
        $this->template = $IN['Table']->template;
    }
    

    public function edit_level(array $IN = array())
    {
        $this->path[] = array('name' => $this->_('MODULES'), 'href' => $this->url);
        if (($IN['Context'] instanceof \RAAS\Module) || ($IN['Context'] instanceof \RAAS\Package)) {
            $this->path[] = array('name' => $this->application->view->_('ACCESS_LEVELS') . ': ' . $IN['Context']->view->_('__NAME'), 'href' => $this->url . '&mid=' . $IN['Context']->mid . '&action=levels');
        }
        $this->stdView->stdEdit($IN, 'getLevelContextMenu');
    }
    

    public function showlist(array $IN = array())
    {
        $view = $this;
        $IN['Table'] = new Table(array(
            'columns' => array(
                'name' => array(
                    'caption' => $this->_('PACKAGE_OR_MODULE'),
                    'callback' => function($row) use ($view) { 
                        if ($row instanceof \RAAS\General\Package) {
                            return '<a href="' . $view->url . '&action=edit">' . $row->view->_('__NAME') . '</a>';
                        } elseif ($row instanceof \RAAS\Package) {
                            return '<a href="' . $view->url . '&action=edit&mid=' . htmlspecialchars($row->mid) . '" class="' . ($row->registryGet('isActive') ? '' : 'muted') . '">
                                    ' . $row->view->_('__NAME') . '
                                  </a>';
                        } elseif ($row instanceof \RAAS\Module) {
                            return '<a style="padding-left: 30px;" href="' . $view->url . '&action=edit&mid=' . htmlspecialchars($row->mid) . '">
                                    <span class="' . ($row->registryGet('isActive') ? '' : 'muted') . '">' . $row->view->_('__NAME') . '</span>
                                  </a>';
                        }
                    }
                ),
                'version' => array(
                    'caption' => $this->_('VERSION'),
                    'callback' => function($row) use ($view) { 
                        if ($row instanceof \RAAS\General\Package) {
                            return date($view->_('DATEFORMAT'), $row->application->versionTime); 
                        } else {
                            return '<span class="' . ($row->registryGet('isActive') ? '' : 'muted') . '">' . date($view->_('DATEFORMAT'), $row->versionTime) . '</span>'; 
                        }
                    } 
                ),
                ' ' => array('callback' => function($row) use ($view) { return rowContextMenu($view->getModuleContextMenu($row)); })
            ),
            'class' => 'table-striped',
            'callback' => function($Row) {
                if ($Row->source instanceof \RAAS\General\Package) {
                    $Row->class = 'info';
                } elseif ($Row->source instanceof \RAAS\Package) {
                    $Row->class = 'success';
                }
            }
        ));
        foreach ($this->application->packages as $key => $row) {
            $IN['Table']->Set[] = $row;
            foreach ($row->modules as $row2) { 
                $IN['Table']->Set[] = $row2;
            }
        }
        $this->assignVars($IN);
        $this->title = $this->_('MODULES');
        $this->template = $IN['Table']->template;
    }


    public function getModuleContextMenu(IRightsContext $Item)
    {
        $arr = array();
        if (!(($Item instanceof \RAAS\Application) || ($Item instanceof \RAAS\General\Package))) {
            $edit = ($this->action == 'edit');
            $levels = ($this->action == 'levels');
            if (!$edit) {
                $arr[] = array('name' => $this->_('EDIT'), 'href' => $this->url . '&action=edit&mid=' . $Item->mid, 'icon' => 'edit');
            }
            if ($Item->hasRights && !$levels) {
                $arr[] = array('name' => $this->_('ACCESS_LEVELS'), 'href' => $this->url . '&action=levels&mid=' . $Item->mid, 'icon' => 'list');
            }
            $arr[] = array(
                'name' => $this->_((int)$Item->registryGet('isActive') ? 'ACTIVE' : 'INACTIVE'), 
                'href' => $this->url . '&action=chvis&mid=' . $Item->mid . '&back=1', 
                'icon' => (int)$Item->registryGet('isActive') ? 'ok' : '',
                'title' => $this->_((int)$Item->registryGet('isActive') ? 'DEACTIVATE' : 'ACTIVATE')
            );
            $arr[] = array(
                'name' => $this->_('REPAIR'), 
                'href' => $this->url . '&action=repair&mid=' . $Item->mid . ($edit || $levels ? '' : '&back=1'), 
                'icon' => 'refresh', 
                'onclick' => 'return confirm(\'' . $this->_($Item instanceof Package ? 'PACKAGE_REPAIR_CONFIRMATION' : 'MODULE_REPAIR_CONFIRMATION') . '\')'
            );
            // $arr[] = array(
            //     'name' => $this->_('FORMAT'), 
            //     'href' => $this->url . '&action=format&mid=' . $Item->mid . ($edit || $levels ? '' : '&back=1'), 
            //     'icon' => 'warning-sign', 
            //     'onclick' => 'return confirm(\'' . $this->_($Item instanceof Package ? 'PACKAGE_FORMAT_CONFIRMATION' : 'MODULE_FORMAT_CONFIRMATION') . '\')'
            // );
            // $arr[] = array(
            //     'name' => $this->_('DELETE'), 
            //     'href' => $this->url . '&action=delete&mid=' . $Item->mid . ($edit || $levels ? '' : '&back=1'), 
            //     'icon' => 'remove', 
            //     'onclick' => 'return confirm(\'' . $this->_($Item instanceof Package ? 'PACKAGE_DELETE_CONFIRMATION' : 'MODULE_DELETE_CONFIRMATION') . '\')'
            // );
        } else {
            $arr[] = array(
                'name' => $this->_('REPAIR'), 
                'href' => $this->url . '&action=repair' . ($edit || $levels ? '' : '&back=1'), 
                'icon' => 'refresh', 
                'onclick' => 'return confirm(\'' . $this->_($Item instanceof Package ? 'PACKAGE_REPAIR_CONFIRMATION' : 'MODULE_REPAIR_CONFIRMATION') . '\')'
            );
        }
        return $arr;
    }


    public function getLevelContextMenu(Level $Item, $i = 0, $c = 0)
    {
        $arr = array();
        if ($Item->id) {
            $edit = ($this->action == 'edit_level');
            if ($this->action != 'edit_level') {
                if (!$Item->locked) { 
                    $arr[] = array('name' => $this->_('EDIT'), 'href' => $this->url . '&action=edit_level&id=' . (int)$Item->id, 'icon' => 'edit');
                }
                if ($i) {
                    $arr[] = array(
                        'name' => $this->_('MOVE_UP'), 'href' => $this->url . '&action=move_up_level&id=' . (int)$Item->id . ($edit ? '' : '&back=1'), 'icon' => 'arrow-up'
                    );
                }
                if ($i < $c - 1) { 
                    $arr[] = array(
                        'name' => $this->_('MOVE_DOWN'), 'href' => $this->url . '&action=move_down_level&id=' . (int)$Item->id . ($edit ? '' : '&back=1'), 'icon' => 'arrow-down'
                    );
                }
            }
            if (!$Item->locked) { 
                $arr[] = array(
                    'name' => $this->_('DELETE'), 
                    'href' => $this->url . '&action=delete_level&id=' . (int)$Item->id . ($edit ? '' : '&back=1'), 
                    'icon' => 'remove',
                    'onclick' => 'return confirm(\'' . $this->_('PACKAGE_DELETE_CONFIRMATION') . '\')'
                );
            }
        }
        return $arr;
    }
    
    public function getModulesMenu()
    {
        $submenu = array();
        $submenu[] = array('name' => $this->_('MODULES'), 'href' => $this->url, 'active' => !$this->action || (isset($this->nav['mid']) && ($this->nav['mid'])));
        $submenu[] = array(
            'name' => $this->_('APPLICATION_SETTINGS'), 
            'href' => $this->url . '&action=edit',
            'active' => ($this->action == 'edit') && (!isset($this->nav['mid']) || ($this->nav['mid']) == ''),
        );
        // $submenu[] = array('name' => $this->_('SYSTEM_UPDATE'), 'href' => $this->url . '&action=update');
        return $submenu;
    }
}