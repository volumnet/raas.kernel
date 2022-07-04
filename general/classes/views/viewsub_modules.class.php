<?php
namespace RAAS\General;

use RAAS\Abstract_Sub_View;
use RAAS\Application;
use RAAS\Level;
use RAAS\IRightsContext;
use RAAS\Table;
use RAAS\Column;
use RAAS\Module;
use RAAS\Package as AbstractPackage;

class ViewSub_Modules extends Abstract_Sub_View
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
        $this->path[] = ['name' => $this->_('MODULES'), 'href' => $this->url];
        if ($IN['Context'] instanceof IRightsContext) {
            $this->contextmenu = $this->getModuleContextMenu($IN['Context']);
        }
        $this->stdView->stdEdit($IN);
    }


    public function update(array $IN = [])
    {
        $this->assignVars($IN);
        $this->title = $this->_('SYSTEM_UPDATE');
        $this->path[] = ['name' => $this->_('MODULES'), 'href' => $this->url];
        $this->template = 'admin_modules_update';
    }


    public function levels(array $IN = [])
    {
        $view = $this;
        $IN['Table'] = new Table([
            'columns' => [
                'name' => [
                    'caption' => $this->_('NAME'),
                    'callback' => function ($row) use ($view, $IN) {
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
                ],
                ' ' => [
                    'callback' => function ($row, $i) use ($view, $IN) {
                        if ($row instanceof Level) {
                            return rowContextMenu($view->getLevelContextMenu(
                                $row,
                                $i - 1,
                                count($IN['Context']->levels)
                            ));
                        }
                    }
                ]
            ],
            'emptyString' => $this->_('NO_RIGHT_MANAGEMENT_AVAILABLE_IN_THIS_CONTEXT'),
        ]);
        if (!($IN['Context'] instanceof Application) &&
            !($IN['Context'] instanceof Package) &&
            $IN['Context']->hasRights
        ) {
            $IN['Table']->Set[] = $this->_('GRANT_ALL');
            foreach ($IN['Context']->levels as $row) {
                $IN['Table']->Set[] = $row;
            }
            $IN['Table']->Set[] = $this->_('REVOKE_ALL');
        }

        $this->assignVars($IN);
        $this->title = $this->application->view->_('ACCESS_LEVELS') . ': '
                     . $IN['Context']->view->_('__NAME');
        $this->path[] = ['name' => $this->_('MODULES'), 'href' => $this->url];
        $this->contextmenu = [
            [
                'name' => $this->_('ADD_LEVEL'),
                'href' => $this->url . $this->getcontextURL($IN['Context'])
                       .  '&action=edit_level',
                'icon' => 'plus'
            ]
        ];
        $this->template = $IN['Table']->template;
    }


    public function edit_level(array $IN = [])
    {
        $this->path[] = ['name' => $this->_('MODULES'), 'href' => $this->url];
        if (($IN['Context'] instanceof Module) ||
            ($IN['Context'] instanceof AbstractPackage)
        ) {
            $this->path[] = [
                'name' => $this->application->view->_('ACCESS_LEVELS') . ': '
                       .  $IN['Context']->view->_('__NAME'),
                'href' => $this->url . '&mid=' . $IN['Context']->mid
                       .  '&action=levels'
            ];
        }
        $this->stdView->stdEdit($IN, 'getLevelContextMenu');
    }


    public function showlist(array $IN = [])
    {
        $view = $this;
        $IN['Table'] = new Table([
            'columns' => [
                'name' => [
                    'caption' => $this->_('PACKAGE_OR_MODULE'),
                    'callback' => function ($row) use ($view) {
                        if ($row instanceof Package) {
                            return '<a href="' . $view->url . '&action=edit">' .
                                      $row->view->_('__NAME') .
                                   '</a>';
                        } elseif ($row instanceof AbstractPackage) {
                            return '<a href="' . $view->url . '&action=edit&mid=' . htmlspecialchars($row->mid) . '" class="' . ($row->registryGet('isActive') ? '' : 'muted') . '">' .
                                      $row->view->_('__NAME') . '
                                    </a>';
                        } elseif ($row instanceof Module) {
                            return '<a style="padding-left: 30px;" href="' . $view->url . '&action=edit&mid=' . htmlspecialchars($row->mid) . '">
                                      <span class="' . ($row->registryGet('isActive') ? '' : 'muted') . '">' .
                                        $row->view->_('__NAME') .
                                     '</span>
                                    </a>';
                        }
                    }
                ],
                'version' => [
                    'caption' => $this->_('VERSION'),
                    'callback' => function ($row) use ($view) {
                        if ($row instanceof Package) {
                            return Application::i()->version;
                        } else {
                            return '<span class="' . ($row->registryGet('isActive') ? '' : 'muted') . '">' .
                                      $row->version .
                                   '</span>';
                        }
                    }
                ],
                ' ' => ['callback' => function ($row) use ($view) {
                    return rowContextMenu($view->getModuleContextMenu($row));
                }]
            ],
            'class' => 'table-striped',
            'callback' => function ($Row) {
                if ($Row->source instanceof Package) {
                    $Row->class = 'info';
                } elseif ($Row->source instanceof AbstractPackage) {
                    $Row->class = 'success';
                }
            }
        ]);
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
        $arr = [];
        $repairConfirmation = (($Item instanceof Package) ? 'PACKAGE' : 'MODULE')
                            . '_REPAIR_CONFIRMATION' ;
        $edit = ($this->action == 'edit');
        $levels = ($this->action == 'levels');
        if (!(($Item instanceof Application) || ($Item instanceof Package))) {
            if (!$edit) {
                $arr[] = [
                    'name' => $this->_('EDIT'),
                    'href' => $this->url . '&action=edit&mid=' . $Item->mid,
                    'icon' => 'edit'
                ];
            }
            if ($Item->hasRights && !$levels) {
                $arr[] = [
                    'name' => $this->_('ACCESS_LEVELS'),
                    'href' => $this->url . '&action=levels&mid=' . $Item->mid,
                    'icon' => 'list'
                ];
            }
            $arr[] = [
                'name' => $this->_('REPAIR'),
                'href' => $this->url . '&action=repair&mid=' . $Item->mid
                       .  ($edit || $levels ? '' : '&back=1'),
                'icon' => 'refresh',
                'onclick' => 'return confirm(\'' . $this->_($repairConfirmation) . '\')'
            ];
        } else {
            $arr[] = [
                'name' => $this->_('REPAIR'),
                'href' => $this->url . '&action=repair'
                       .  ($edit || $levels ? '' : '&back=1'),
                'icon' => 'refresh',
                'onclick' => 'return confirm(\'' . $this->_($repairConfirmation) . '\')'
            ];
        }
        return $arr;
    }


    public function getLevelContextMenu(Level $Item, $i = 0, $c = 0)
    {
        $arr = [];
        if ($Item->id) {
            $edit = ($this->action == 'edit_level');
            if ($this->action != 'edit_level') {
                if (!$Item->locked) {
                    $arr[] = [
                        'name' => $this->_('EDIT'),
                        'href' => $this->url . '&action=edit_level&id='
                               .  (int)$Item->id,
                        'icon' => 'edit'
                    ];
                }
                if ($i) {
                    $arr[] = [
                        'name' => $this->_('MOVE_UP'),
                        'href' => $this->url . '&action=move_up_level&id='
                               .  (int)$Item->id . ($edit ? '' : '&back=1'),
                        'icon' => 'arrow-up'
                    ];
                }
                if ($i < $c - 1) {
                    $arr[] = [
                        'name' => $this->_('MOVE_DOWN'),
                        'href' => $this->url . '&action=move_down_level&id='
                               .  (int)$Item->id . ($edit ? '' : '&back=1'),
                        'icon' => 'arrow-down'
                    ];
                }
            }
            if (!$Item->locked) {
                $arr[] = [
                    'name' => $this->_('DELETE'),
                    'href' => $this->url . '&action=delete_level&id='
                           .  (int)$Item->id . ($edit ? '' : '&back=1'),
                    'icon' => 'remove',
                    'onclick' => 'return confirm(\'' . $this->_('PACKAGE_DELETE_CONFIRMATION') . '\')'
                ];
            }
        }
        return $arr;
    }

    public function getModulesMenu()
    {
        $submenu = [];
        $submenu[] = [
            'name' => $this->_('MODULES'),
            'href' => $this->url,
            'active' => !$this->action
                     || (isset($this->nav['mid']) && ($this->nav['mid']))
        ];
        $submenu[] = [
            'name' => $this->_('APPLICATION_SETTINGS'),
            'href' => $this->url . '&action=edit',
            'active' => ($this->action == 'edit')
                     && (!isset($this->nav['mid']) || ($this->nav['mid']) == ''),
        ];
        return $submenu;
    }
}
