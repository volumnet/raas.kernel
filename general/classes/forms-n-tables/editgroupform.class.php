<?php
namespace RAAS\General;
use \RAAS\Application;
use \RAAS\FormTab;

class EditGroupForm extends \RAAS\Form
{
    protected $_view;

    public function __get($var)
    {
        switch ($var) {
            case 'view':
                return ViewSub_Users::i();
                break;
            default:
                return parent::__get($var);
                break;
        }
    }


    public function __construct(array $params = array())
    {
        $view = $this->view;
        $t = $this;
        unset($params['view']);
        $Item = isset($params['Item']) ? $params['Item'] : null;

        $defaultParams = array(
            'Item' => $Item,
            'caption' => $Item->id ? htmlspecialchars($Item->name) : $this->view->_('ADD_GROUP'),
            'parentUrl' => urldecode(\SOME\HTTP::queryString('id=%s&action=')) . '#groups',
            'children' => array(
                new FormTab(array(
                    'name' => 'edit', 
                    'caption' => $this->view->_('EDIT_GROUP'), 
                    'children' => array(
                        array('name' => 'name', 'caption' => $this->view->_('NAME'), 'required' => 'required'),
                        array('type' => 'textarea', 'name' => 'description', 'caption' => $this->view->_('DESCRIPTION')),
                    )
                )),
                new FormTab(array(
                    'name' => 'rights',
                    'caption' => $this->view->_('RIGHTS'), 
                    'template' => 'rights', 
                    'children' => array(array(
                        'type' => 'select', 
                        'name' => 'rights', 
                        'multiple' => 'multiple',
                        'export' => function($Field) use ($t) { $Field->Form->Item->_SET_rights = $_POST[$Field->name]; },
                        'import' => function($Field) use ($t) {
                            $DATA = array();
                            $Item = $Field->Form->Item;
                            foreach (Application::i()->packages as $row) {
                                $level = $Item->access($row)->level;
                                $DATA[$row->mid] = (int)($level instanceof Level ? $level->id : $level);
                                foreach ($row->modules as $row2) {
                                    $level = $Item->access($row2)->level;
                                    $DATA[$row2->mid] = (int)($level instanceof Level ? $level->id : $level);
                                }
                            }
                            return $DATA;
                        }
                    ))
                ))
            )
        );
        $arr = array_merge($defaultParams, $params);
        parent::__construct($arr);
    }
}