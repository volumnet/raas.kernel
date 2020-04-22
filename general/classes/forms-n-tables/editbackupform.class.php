<?php
/**
 * Файл формы редактирования резервной копии
 */
namespace RAAS\General;

use RAAS\Application;
use RAAS\Form;
use RAAS\Redirector;

/**
 * Класс формы редактирования резервной копии
 */
class EditBackupForm extends Form
{
    protected $_view;

    public function __get($var)
    {
        switch ($var) {
            case 'view':
                return ViewSub_Backup::i();
                break;
            default:
                return parent::__get($var);
                break;
        }
    }


    public function __construct(array $params = [])
    {
        unset($params['view']);
        $item = isset($params['Item']) ? $params['Item'] : null;
        $this->Item = $item;

        $defaultParams = [
            'Item' => $item,
            'caption' => $this->view->_('EDIT_BACKUP'),
            'parentUrl' => $this->view->url,
            'children' => [
                [
                    'name' => 'name',
                    'caption' => $this->view->_('NAME')
                ],
                'preserveFromDeletion' => [
                    'type' => 'checkbox',
                    'name' => 'preserveFromDeletion',
                    'caption' => $this->view->_('PRESERVE_FROM_DELETION')
                ],
            ],
            'import' => function ($form) {
                $item = $form->Item;
                return [
                    'name' => trim($item->name),
                    'preserveFromDeletion' => (int)$item->preserveFromDeletion,
                ];
            },
            'export' => function ($form) {
                $item = $form->Item;
                $item->name = trim($_POST['name']);
                $item->preserveFromDeletion = (bool)(int)$_POST['preserveFromDeletion'];
            },
            'redirect' => function () {
                new Redirector($this->view->url);
                exit;
            },
            'actionMenu' => false,
        ];
        $arr = array_merge($defaultParams, $params);
        parent::__construct($arr);
    }
}
