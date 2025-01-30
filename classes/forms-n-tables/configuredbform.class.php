<?php
/**
 * @package RAAS
 */
namespace RAAS;

use SOME\DB;

/**
 * Форма настройки базы данных
 * @property-read ViewSub_Dev $view Представление
 */
class ConfigureDBForm extends Form
{
    public function __get($var)
    {
        switch ($var) {
            case 'view':
                return View_Web::i();
                break;
            default:
                return parent::__get($var);
                break;
        }
    }


    public function __construct(array $params = [])
    {
        // $databases = [];
        // foreach ($this->application->availableDatabases as $key => $val) {
        //     $databases[] = [
        //         'value' => $key,
        //         'caption' => $this->view->_($val)
        //     ];
        // }

        $defaultParams = [
            'caption' => $this->view->_('CONFIGURE_DB'),
            'check' => function ($form) {
                if ($localError = $form->getErrors()) {
                    return $localError;
                }
                $dsn = null;
                $projectName = array_filter(
                    explode('.', $_SERVER['HTTP_HOST']),
                    function ($x) {
                        return $x != 'www';
                    }
                );
                $projectName = array_shift($projectName);

                switch ($_POST['dbtype']) {
                    case 'mysql':
                    case 'mssql':
                        $dsn = $_POST['dbtype']
                             . ':host=' . $_POST['dbhost']
                             . ';dbname=' . $_POST['dbname'];
                        break;
                    case 'pgsql':
                        $dsn = 'pgsql:host=' . $_POST['dbhost']
                             . ' dbname=' . $_POST['dbname']
                             . ' user=' . $_POST['dbuser']
                             . ' password=' . $_POST['dbpass'];
                        break;
                }
                try {
                    $tempDB = new DB(
                        $dsn,
                        $_POST['dbuser'],
                        $_POST['dbpass'],
                        'utf8',
                        function ($e) {
                            throw $e;
                        }
                        // [$this, 'queryHandler']
                    );
                } catch (\Exception $e) {
                    $errMsg = $e->getMessage();
                    if (preg_match('/access denied/umis', $errMsg)) {
                        $localError[] = [
                            'name' => 'INVALID',
                            'value' => 'dbuser',
                            'description' => $this->view->_('INVALID_LOGIN_OR_PASSWORD'),
                        ];
                    } elseif (preg_match('/unknown database/umis', $errMsg)) {
                        $localError[] = [
                            'name' => 'INVALID',
                            'value' => 'dbname',
                            'description' => $this->view->_('INVALID_DATABASE_NAME'),
                        ];
                    } else {
                        $localError[] = [
                            'name' => 'INVALID',
                            'description' => $this->view->_('UNABLE_TO_CONNECT_TO_DATABASE_CHECK_CREDENTIALS')
                                           . ' (' . $e->getMessage() . ')'
                        ];
                    }

                }
                return $localError;
            },
            'commit' => function () {
                Application::i()->configureDB($_POST);
                // sleep(1);
                new Redirector();
            },
            'children' => [
                [
                    'type' => 'hidden',
                    'name' => 'dbtype',
                    'default' => 'mysql'
                ],
                [
                    'name' => 'dbhost',
                    'required' => 'required',
                    'caption' => $this->view->_('DBHOST'),
                    'default' => (
                        Application::i()->dbhost ?
                        Application::i()->dbhost :
                        '127.0.0.1'
                    )
                ],
                [
                    'name' => 'dbuser',
                    'required' => 'required',
                    'caption' => $this->view->_('DBUSER'),
                    'default' => (Application::i()->dbuser ?: 'root')
                ],
                [
                    'type' => 'password',
                    'name' => 'dbpass',
                    'caption' => $this->view->_('DBPASS')
                ],
                [
                    'name' => 'dbname',
                    'required' => 'required',
                    'caption' => $this->view->_('DBNAME'),
                    'default' => (Application::i()->dbname ?: $_SERVER['HTTP_HOST'])
                ],
                [
                    'name' => 'dbprefix',
                    'caption' => $this->view->_('DBPREFIX'),
                    'default' => Application::i()->dbprefix
                ],
                [
                    'type' => 'select',
                    'name' => 'loginType',
                    'caption' => $this->view->_('SELECT_LOGIN_TYPE'),
                    'required' => 'required',
                    'children' => [
                        [
                            'value' => 'session',
                            'caption' => $this->view->_('SESSION_LOGIN')
                        ],
                        [
                            'value' => 'http',
                            'caption' => $this->view->_('HTTP_LOGIN')
                        ]
                    ],
                    'default' => Application::i()->loginType
                ],
                [
                    'type' => 'checkbox',
                    'name' => 'prod',
                    'caption' => $this->view->_('PRODUCTION_SERVER'),
                    'export' => 'boolval',
                    'default' => Application::i()->prod
                ],
                [
                    'type' => 'checkbox',
                    'name' => 'crossDomainSession',
                    'caption' => $this->view->_('CROSSDOMAIN_SESSION'),
                    'export' => 'boolval',
                    'default' => Application::i()->crossDomainSession
                ],
            ]
        ];
        $arr = array_merge($defaultParams, $params);
        parent::__construct($arr);
    }
}
