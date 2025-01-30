<?php
/**
 * @package RAAS.General
 */
namespace RAAS\General;

use SOME\HTTP;
use RAAS\Abstract_Sub_Controller;
use RAAS\Application;
use RAAS\Form;
use RAAS\FieldContainer;
use RAAS\IRightsContext;
use RAAS\Level;
use RAAS\Module;
use RAAS\Package as AbstractPackage;
use RAAS\Redirector;
use RAAS\StdSub;

class Sub_Modules extends Abstract_Sub_Controller
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


    public function run()
    {
        $this->view->submenu = $this->view->getModulesMenu();
        switch ($this->action) {
            case 'edit':
            case 'edit_level':
                $this->{$this->action}();
                break;
            case 'levels':
                $Context = $this->getContext();
                $this->view->levels([
                    'Context' => $Context,
                    'contextURL' => $this->getContextURL($Context)
                ]);
                break;
            case 'repair':
                $Context = $this->getContext(false);
                StdSub::registrySet(
                    $Context,
                    $this->url,
                    true,
                    isset($Context),
                    'installDate',
                    null
                );
                break;
            case 'move_up_level':
                $Item = new Level((int)$this->id);
                $Context = ($Item->id && ($Item->Context instanceof IRightsContext))
                         ? $Item->Context
                         : $this->getContext();
                StdSub::move_up(
                    $Item,
                    $this->url . '&action=levels&mid=' . $Context->mid,
                    true,
                    (get_class($Item->Context) == get_class($Context))
                );
                break;
            case 'move_down_level':
                $Item = new Level((int)$this->id);
                $Context = ($Item->id && ($Item->Context instanceof IRightsContext))
                         ? $Item->Context
                         : $this->getContext();
                StdSub::move_down(
                    $Item,
                    $this->url . '&action=levels&mid=' . $Context->mid,
                    true,
                    (get_class($Item->Context) == get_class($Context))
                );
                break;
            case 'delete_level':
                $Item = new Level((int)$this->id);
                $Context = ($Item->id && ($Item->Context instanceof IRightsContext))
                         ? $Item->Context
                         : $this->getContext();
                StdSub::delete(
                    $Item,
                    $this->url . '&action=levels&mid=' . $Context->mid,
                    true,
                    (
                        !$Item->locked &&
                        (get_class($Item->Context) == get_class($Context))
                    )
                );
                break;
            default:
                $this->view->showlist();
                break;
        }
    }


    private function edit()
    {
        $Context = $this->getContext(false);
        if ($Context instanceof Package) {
            $Context = Application::i();
        }
        $CONTENT = [];
        $CONTENT['levels'][] = [
            'value' => (int)Level::REVOKE_ALL,
            'caption' => $this->view->_('REVOKE_ALL')
        ];
        foreach ((array)$Context->levels as $row) {
            $CONTENT['levels'][] = [
                'value' => (int)$row->id,
                'caption' => $row->name
            ];
        }
        $CONTENT['levels'][] = [
            'value' => (int)Level::GRANT_ALL,
            'caption' => $this->view->_('GRANT_ALL')
        ];
        $t = $this;
        $children[] = [
            'name' => 'installDate',
            'readonly' => 'readonly',
            'caption' => $this->view->_('INSTALL_DATE')
        ];
        if (!($Context instanceof Package) && !($Context instanceof Application)) {
            $children[] = [
                'type' => 'checkbox',
                'name' => 'isActive',
                'caption' => $this->view->_('IS_ACTIVE')
            ];
            $children[] = [
                'type' => 'select',
                'name' => 'defaultLevel',
                'caption' => $this->view->_('DEFAULT_ACCESS_LEVEL'),
                'default' => Level::REVOKE_ALL,
                'children' => $CONTENT['levels']
            ];
        }
        $children = array_merge($children, (array)$Context->controller->config());
        $Form = new Form([
            'actionMenu' => false,
            'commit' => function ($Form) use ($Context) {
                foreach ($Form->children as $row) {
                    if ($f = $row->export) {
                        $f($row);
                    } else {
                        if (!isset($_POST[$row->name])) {
                            $_POST[$row->name] = null;
                        }
                        if ($row->name == 'installDate') {
                            continue;
                        } elseif ($row->name == 'defaultLevel') {
                            $lev = new Level((int)$_POST[$row->name]);
                            if (!(
                                in_array(
                                    $_POST[$row->name],
                                    [Level::GRANT_ALL, Level::REVOKE_ALL]
                                ) ||
                                (
                                    $lev->id &&
                                    (get_class($lev->Context) == get_class($Context))
                                )
                            )) {
                                continue;
                            }
                            Access::flushRights();
                        } elseif (($row->type == 'password') && !$_POST[$row->name]) {
                            continue;
                        }
                        $Context->registrySet(
                            $row->name,
                            isset($_POST[$row->name]) ? $_POST[$row->name] : ''
                        );
                    }
                }
            },
            'import' => function ($Form) use ($Context) {
                if ($_SERVER['REQUEST_METHOD'] == 'POST') {
                    $DATA = $_POST;
                } else {
                    foreach ($Form->children as $row) {
                        if ($f = $row->import) {
                            if ($row instanceof FieldContainer) {
                                $DATA = array_merge($DATA, $f($row));
                            } else {
                                $DATA[$row->name] = $f($row);
                            }
                        } else {
                            if ($row instanceof FieldContainer) {
                                foreach ($row->children as $child) {
                                    $DATA[$child->name] = $Context->registryGet($child->name);
                                }
                            } else {
                                $DATA[$row->name] = $Context->registryGet($row->name);
                                if ($row->name == 'installDate') {
                                    $DATA[$row->name] = date(
                                        $Context->view->_('DATEFORMAT'),
                                        strtotime($DATA[$row->name])
                                    );
                                } elseif ($row->name == 'isActive') {
                                    $DATA[$row->name] = (int)$DATA[$row->name];
                                }
                            }
                        }
                    }
                }
                return $DATA;
            },
            'children' => $children
        ]);
        if ($Context instanceof Module) {
            $Form->caption = $this->application->view->_('CONFIG') . ': '
                           . $Context->view->_('__NAME');
        } elseif ($Context instanceof AbstractPackage) {
            $Form->caption = $this->application->view->_('CONFIG') . ': '
                           . $Context->view->_('__NAME');
        } else {
            $Form->caption = $this->application->view->_('APPLICATION_SETTINGS');
        }
        $IN = $Form->process();
        $IN['Context'] = $Context;
        $this->view->edit($IN);
    }


    private function edit_level()
    {
        $Item = new Level((int)$this->id);
        $Context = ($Item->id && ($Item->Context instanceof IRightsContext))
                 ? $Item->Context
                 : $this->getContext();
        if (!$Context ||
            $Item->locked ||
            !$Context->hasRights ||
            ($Item->id && (get_class($Item->Context) != get_class($Context)))
        ) {
            new Redirector($this->url);
        }
        $t = $this;
        $IN = (array)$Context->controller->rights($Item);
        $Form = new Form([
            'Item' => $Item,
            'caption' => $Item->id
                      ?  htmlspecialchars($Item->name)
                      :  $this->view->_('CREATE_LEVEL'),
            'parentUrl' => HTTP::queryString('action=levels&id='),
            'import' => function ($Form) use ($IN) {
                return array_merge($Form->importDefault(), (array)$IN['DATA']);
            },
            'commit' => function ($Form) use ($Context) {
                $Form->exportDefault();
                $Form->Item->Context = $Context;
                $Form->Item->commit();
            },
            'children' => [
                [
                    'name' => 'name',
                    'caption' => $this->view->_('NAME'),
                    'required' => 'required'
                ],
                [
                    'name' => 'rights',
                    'template' => str_replace('.', '/', $Context->mid)
                               .  '/rights.inc.tmp.php',
                    'import' => 'is_null',
                    'export' => function ($Field) use ($IN) {
                        $Field->Form->Item->rights = $IN['rights'];
                    }
                ]
            ]
        ]);
        $this->view->edit_level(array_merge(
            (array)$Form->process(),
            ['Context' => $Context]
        ));
    }
}
