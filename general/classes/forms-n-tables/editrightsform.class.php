<?php
/**
 * Форма прав доступа
 */
namespace RAAS\General;

use RAAS\Application;
use RAAS\Form;
use RAAS\User;

class EditRightsForm extends Form
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
        unset($params['view']);
        $item = isset($params['Item']) ? $params['Item'] : null;
        $context = isset($params['Context']) ? $params['Context'] : null;

        if ($item instanceof User) {
            $name = $item->full_name ? $item->full_name : $item->login;
        } else {
            $name = $item->name;
        }

        $defaultParams = [
            'caption' => Application::i()->view->_('EDIT_RIGHTS') . ': ' . htmlspecialchars($name),
            'import' => function ($form) use ($params) {
                return $params['DATA'];
            },
            'commit' => function ($form) use ($params, $context, $item) {
                $item->access($context)->setRights($params['rights']);
            },
            'children' => [
                [
                    'name' => 'rights',
                    'template' => str_replace('.', '/', $context->mid) . '/rights.inc.tmp.php',
                    'import' => 'is_null',
                    'export' => 'is_null'
                ],
            ],
        ];
        $arr = array_merge($defaultParams, $params);
        parent::__construct($arr);
    }
}
