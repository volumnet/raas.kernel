<?php
namespace RAAS\General;
use \RAAS\Application;
use \RAAS\User;

class EditUserRightsForm extends \RAAS\Form
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
        $Context = isset($params['Context']) ? $params['Context'] : null;

        if ($Item instanceof User) {
            $name = $Item->full_name ? $Item->full_name : $Item->login;
        } else {
            $name = $Item->name;
        }

        $defaultParams = array(
            'caption' => $this->application->view->_('EDIT_RIGHTS') . ': ' . htmlspecialchars($name),
            'import' => function($Form) use ($params) { return $params['DATA']; },
            'commit' => function($Form) use ($params, $Context, $Item) { $Item->access($Context)->setRights($params['rights']); },
            'children' => array(
                array('name' => 'rights', 'template' => str_replace('.', '/', $Context->mid) . '/rights.inc.tmp.php', 'import' => 'is_null', 'export' => 'is_null')
            )
        );
        $arr = array_merge($defaultParams, $params);
        parent::__construct($arr);
    }
}