<?php
namespace RAAS\General;
use \RAAS\User as User;
use \RAAS\Group as Group;
use \RAAS\Level as Level;
use \RAAS\Redirector as Redirector;
use \RAAS\Application as Application;
use \RAAS\Update as Update;
use \RAAS\IContext as IContext;
use \RAAS\IRightsContext as IRightsContext;
use \RAAS\Form as Form;
use \RAAS\Field as Field;
use \RAAS\Option as Option;
use \RAAS\FormTab as FormTab;
use \RAAS\StdSub as StdSub;

class Sub_Modules extends \RAAS\Abstract_Sub_Controller
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
            case 'edit': case 'update': case 'edit_level':
                $this->{$this->action}();
                break;
            case 'levels': 
                $Context = $this->getContext();
                $this->view->levels(array('Context' => $Context, 'contextURL' => $this->getContextURL($Context)));
                break;
            case 'chvis': 
                $Context = $this->getContext();
                StdSub::registrySet($Context, $this->url, true, isset($Context), 'isActive', (int)!(int)$Context->registryGet('isActive'));
                break;
            case 'repair':
                $Context = $this->getContext(false);
                StdSub::registrySet($Context, $this->url, true, isset($Context), 'installDate', null);
                break;
            case 'format':
                $Context = $this->getContext();
                StdSub::uninstall($Context, $this->url, true, isset($Context), false);
                break;
            case 'delete': 
                $Context = $this->getContext();
                StdSub::uninstall($Context, $this->url, true, isset($Context), true);
                break;
            case 'move_up_level':
                $Item = new Level((int)$this->id);
                $Context = ($Item->id && ($Item->Context instanceof IRightsContext)) ? $Item->Context : $this->getContext();
                StdSub::move_up($Item, $this->url . '&action=levels&mid=' . $Context->mid, true, (get_class($Item->Context) == get_class($Context)));
                break;
            case 'move_down_level': 
                $Item = new Level((int)$this->id);
                $Context = ($Item->id && ($Item->Context instanceof IRightsContext)) ? $Item->Context : $this->getContext();
                StdSub::move_down($Item, $this->url . '&action=levels&mid=' . $Context->mid, true, (get_class($Item->Context) == get_class($Context)));
                break;
            case 'delete_level':
                $Item = new Level((int)$this->id);
                $Context = ($Item->id && ($Item->Context instanceof IRightsContext)) ? $Item->Context : $this->getContext();
                StdSub::delete($Item, $this->url . '&action=levels&mid=' . $Context->mid, true, !$Item->locked && (get_class($Item->Context) == get_class($Context)));
                break;
            default:
                $this->view->showlist();
                break;
        }
    }
     

    private function edit()
    {
        $Context = $this->getContext(false);
        if ($Context instanceof \RAAS\General\Package) {
            $Context = Application::i();
        }
        $CONTENT = array();
        $CONTENT['levels'][] = array('value' => (int)Level::REVOKE_ALL, 'caption' => $this->view->_('REVOKE_ALL'));
        foreach ((array)$Context->levels as $row) {
            $CONTENT['levels'][] = array('value' => (int)$row->id, 'caption' => $row->name);
        }
        $CONTENT['levels'][] = array('value' => (int)Level::GRANT_ALL, 'caption' => $this->view->_('GRANT_ALL'));
        $t = $this;
        $children[] = array('name' => 'installDate', 'readonly' => 'readonly', 'caption' => $this->view->_('INSTALL_DATE'));
        if (!($Context instanceof \RAAS\General\Package) && !($Context instanceof \RAAS\Application)) {
            $children[] = array('type' => 'checkbox', 'name' => 'isActive', 'caption' => $this->view->_('IS_ACTIVE'));
            $children[] = array(
                'type' => 'select', 
                'name' => 'defaultLevel', 
                'caption' => $this->view->_('DEFAULT_ACCESS_LEVEL'), 
                'default' => Level::REVOKE_ALL, 
                'children' => $CONTENT['levels']
            );
        }
        $children = array_merge($children, (array)$Context->controller->config());
        $Form = new Form(array(
            'actionMenu' => false,
            'commit' => function($Form) use ($Context) {
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
                            if (!(in_array($_POST[$row->name], array(Level::GRANT_ALL, Level::REVOKE_ALL)) || ($lev->id && (get_class($lev->Context) == get_class($Context))))) {
                                continue;
                            }
                            Access::flushRights();
                        }
                        $Context->registrySet($row->name, isset($_POST[$row->name]) ? $_POST[$row->name] : '');
                    }
                }
            },
            'import' => function($Form) use ($Context) {
                if ($_SERVER['REQUEST_METHOD'] == 'POST') {
                    $DATA = $_POST;
                } else {
                    foreach ($Form->children as $row) {
                        if ($f = $row->import) {
                            $DATA[$row->name] = $f($row);
                        } else {
                            $DATA[$row->name] = $Context->registryGet($row->name);
                            if ($row->name == 'installDate') {
                                $DATA[$row->name] = date($Context->view->_('DATEFORMAT'), strtotime($DATA[$row->name]));
                            } elseif ($row->name == 'isActive') {
                                $DATA[$row->name] = (int)$DATA[$row->name];
                            }
                        }
                    }
                }
                return $DATA;
            },
            'children' => $children
        ));
        if ($Context instanceof \RAAS\Module) {
            $Form->caption = $this->application->view->_('CONFIG') . ': ' . $Context->view->_('__NAME');
        } elseif ($Context instanceof \RAAS\Package) {
            $Form->caption = $this->application->view->_('CONFIG') . ': ' . $Context->view->_('__NAME');
        } else {
            $Form->caption = $this->application->view->_('APPLICATION_SETTINGS');
        }
        $IN = $Form->process();
        $IN['Context'] = $Context;
        $this->view->edit($IN);
    }
    
    
    private function update()
    {
        $localError = array();
        $OUT = array();
        $file = null;
        
        if ((($_SERVER['REQUEST_METHOD'] == 'POST') && isset($_FILES)) || (isset($_GET['mid']) && ($Context = $this->application->getContext($_GET['mid'], true)))) {
            
            if (isset($Context)) {
                $file = $this->model->downloadUpdate($Context);
                $doUpdate = true;
            } elseif (isset($_FILES['update']['tmp_name']) && is_uploaded_file($_FILES['update']['tmp_name'])) {
                $file = $_FILES['update']['tmp_name'];
                $doUpdate = isset($_POST['doUpdate']);
            }
            
            if ($file) {
                $Update = new Update($file);
                if ($Update->errors) {
                    if ($Update->errors & Update::ERR_NOFILE) {
                        $localError[] = array('name' => 'INVALID', 'value' => 'update', 'description' => 'NO_UPDATE_FILE_SELECTED');
                    }
                    if ($Update->errors & Update::ERR_INVALIDFILE) {
                        $localError[] = array('name' => 'INVALID', 'value' => 'update', 'description' => 'INVALID_UPDATE_FILE');
                    }
                    if ($doUpdate) {
                        if ($Update->errors & Update::ERR_NOPACKAGEINSTALLED) {
                            $localError[] = array('name' => 'INVALID', 'value' => 'update', 'description' => 'NO_PACKAGE_INSTALLED_TO_UPDATE_MODULE');
                        }
                        if ($Update->errors & Update::ERR_DEPRECATED) {
                            $localError[] = array('name' => 'INVALID', 'value' => 'update', 'description' => 'USED_DEPRECATED_UPDATE');
                        }
                    }
                }
                if (!$localError) {
                    if ($doUpdate) {
                        $Update->process();
                        $OUT['success'] = true;
                        new Redirector($this->url . '&action=update');
                    }
                    $OUT['Update'] = $Update;
                }
            } else {
                $localError[] = array('name' => 'INVALID', 'value' => 'update', 'description' => 'NO_UPDATE_FILE_SELECTED');
            }
        }
        
        $OUT['availableUpdates'] = $this->model->getAvailableUpdates();
        
        $OUT['localError'] = $localError;
        $this->view->{$this->action}($OUT);
    }
    
    
    private function edit_level()
    {
        $Item = new Level((int)$this->id);
        $Context = ($Item->id && ($Item->Context instanceof IRightsContext)) ? $Item->Context : $this->getContext();
        if (!$Context || $Item->locked || !$Context->hasRights || ($Item->id && (get_class($Item->Context) != get_class($Context)))) {
            new Redirector($this->url);
        }
        $t = $this;
        $IN = (array)$Context->controller->rights($Item);
        $Form = new Form(array(
            'Item' => $Item,
            'caption' => $Item->id ? htmlspecialchars($Item->name) : $this->view->_('CREATE_LEVEL'),
            'parentUrl' => \SOME\HTTP::queryString('action=levels&id='),
            'import' => function($Form) use ($IN) { return array_merge($Form->importDefault(), $IN['DATA']); },
            'commit' => function($Form) use ($Context) { 
                $Form->exportDefault(); 
                $Form->Item->Context = $Context; 
                $Form->Item->commit(); 
            },
            'children' => array(
                array('name' => 'name', 'caption' => $this->view->_('NAME'), 'required' => 'required'),
                array(
                    'name' => 'rights',
                    'template' => str_replace('.', '/', $Context->mid) . '/rights.inc.tmp.php',
                    'import' => 'is_null',
                    'export' => function($Field) use ($IN) { $Field->Form->Item->rights = $IN['rights']; }
                )
            )
        ));
        $this->view->edit_level(array_merge((array)$Form->process(), array('Context' => $Context)));
    }
}