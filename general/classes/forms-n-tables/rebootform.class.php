<?php
/**
 * Форма перезагрузки
 */
namespace RAAS\General;

use RAAS\Form;
use RAAS\Process;

/**
 * Класс формы перезагрузки
 */
class RebootForm extends Form
{
    protected $_view;

    public function __get($var)
    {
        switch ($var) {
            case 'view':
                return ViewSub_Processes::i();
                break;
            default:
                return parent::__get($var);
                break;
        }
    }


    public function __construct(array $params = array())
    {
        unset($params['view']);

        $defaultParams = array(
            'caption' => $this->view->_('SYSTEM_REBOOT'),
            'children' => [
                'password' => [
                    'type' => 'password',
                    'name' => 'password',
                    'autocomplete' => 'new-password',
                    'required' => true,
                    'caption' => $this->view->_('SSH_PASSWORD'),
                ],
            ],
            'check' => function (Form $form) {
                if ($localError = $form->getErrors()) {
                    return $localError;
                }
                $result = Process::reboot($_POST['password']);
                return [
                    [
                        'name' => 'INVALID',
                        'description' => $result ?: $this->view->_('CANNOT_REBOOT_SYSTEM')
                    ]
                ];
            }
        );
        $arr = array_merge($defaultParams, $params);
        parent::__construct($arr);
    }
}
