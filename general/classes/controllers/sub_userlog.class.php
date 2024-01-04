<?php
/**
 * Файл модуля пользовательских логов
 */
declare(strict_types=1);

namespace RAAS\General;

use SOME\SOME;
use SOME\Pages;
use RAAS\Abstract_Sub_Controller;
use RAAS\Application;
use RAAS\Crontab;
use RAAS\CrontabLog;
use RAAS\Redirector;
use RAAS\StdSub;
use RAAS\User;
use RAAS\UserLog;

/**
 * Класс модуля пользовательских логов
 */
class Sub_UserLog extends Abstract_Sub_Controller
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
        $filters = [];
        $tFrom = $tTo = 0;
        if ($_GET['date_from'] ?? null) {
            $tFrom = strtotime($_GET['date_from']);
        }
        if ($tFrom <= 0) {
            $tFrom = time();
        }
        if ($_GET['date_to'] ?? null) {
            $tTo = strtotime($_GET['date_to']);
        }
        if ($tTo <= 0) {
            $tTo = time();
        }
        $OUT['DATA']['date_from'] = $dateFrom = date('Y-m-d', $tFrom);
        $OUT['DATA']['date_to'] = $dateTo = date('Y-m-d', $tTo);

        if ($_GET['uid'] ?? null) {
            $OUT['DATA']['uid'] = (array)$_GET['uid'];
            $filters[] = function ($x) {
                return in_array($x->uid, (array)$_GET['uid']);
            };
        }
        if (trim($_GET['ip'] ?? '')) {
            $OUT['DATA']['ip'] = trim($_GET['ip']);
            $filters[] = function ($x) {
                return stristr($x->ip, trim($_GET['ip']));
            };
        }
        if ($_GET['filter_method'] ?? null) {
            $OUT['DATA']['filter_method'] = (array)$_GET['filter_method'];
            $filters[] = function ($x) {
                return in_array($x->method, (array)$_GET['filter_method']);
            };
        }
        if ($_GET['filter_package'] ?? null) {
            $OUT['DATA']['filter_package'] = (array)$_GET['filter_package'];
            $filters[] = function ($x) {
                return in_array($x->package, (array)$_GET['filter_package']);
            };
        }
        if ($_GET['filter_module'] ?? null) {
            $OUT['DATA']['filter_module'] = (array)$_GET['filter_module'];
            $filters[] = function ($x) {
                return in_array($x->module, (array)$_GET['filter_module']);
            };
        }
        if ($_GET['filter_sub'] ?? null) {
            $OUT['DATA']['filter_sub'] = (array)$_GET['filter_sub'];
            $filters[] = function ($x) {
                return in_array($x->sub, (array)$_GET['filter_sub']);
            };
        }
        if (trim($_GET['action_name'] ?? '')) {
            $OUT['DATA']['action_name'] = trim($_GET['action_name']);
            $filters[] = function ($x) {
                return stristr($x->actionName, trim($_GET['action_name']));
            };
        }
        if ($_GET['element_id'] ?? null) {
            $OUT['DATA']['element_id'] = (int)$_GET['element_id'];
            $filters[] = function ($x) {
                return stristr($x->elementId, (string)(int)$_GET['element_id']);
            };
        }
        $pages = new Pages(
            ($_GET['page'] ?? 1) ?: 1,
            Application::i()->registryGet('rowsPerPage')
        );
        $fullSet = UserLog::getSet($dateFrom, $dateTo);
        $set = UserLog::getSet($dateFrom, $dateTo, $filters);

        $usersIds = array_map(function ($x) {
            return (int)$x->uid;
        }, $fullSet);
        $users = [];
        if ($usersIds) {
            $users = User::getSet([
                'where' => "id IN (" . implode(", ", $usersIds) . ")",
                'orderBy' => 'login',
            ]);
        }
        $OUT['users'] = $users;

        $methods = array_values(array_unique(array_map(function ($x) {
            return trim($x->method);
        }, $fullSet)));
        $OUT['methods'] = $methods;

        $packages = array_values(array_unique(array_map(function ($x) {
            return trim($x->package);
        }, $fullSet)));
        $OUT['packages'] = $packages;

        $modules = array_values(array_unique(array_map(function ($x) {
            return trim($x->module);
        }, $fullSet)));
        $OUT['modules'] = $modules;

        $subs = array_values(array_unique(array_map(function ($x) {
            return trim($x->sub);
        }, $fullSet)));
        $OUT['subs'] = $subs;

        $actions = array_values(array_unique(array_map(function ($x) {
            return trim($x->actionName);
        }, $fullSet)));
        $OUT['actions'] = $actions;

        $set = SOME::getArraySet($set, $pages);

        $OUT['Set'] = $set;
        $OUT['Pages'] = $pages;
        $this->view->showlist($OUT);
    }
}
