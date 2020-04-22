<?php
namespace RAAS\General;

use RAAS\User as User;
use RAAS\Group as Group;
use RAAS\Level as Level;
use RAAS\IRightsContext as IRightsContext;
use RAAS\IContext as IContext;
use RAAS\Application as Application;

class Package extends \RAAS\Package
{
    const dangerQuerySize = 100000;

    protected static $instance;

    public function __get($var)
    {
        switch ($var) {
            case 'baseDir':
                return $this->application->systemDir . '/general';
                break;
            case 'systemDir':
                return $this->baseDir;
                break;
            case 'alias':
            case 'Mid':
            case 'mid':
                return '/';
                break;
            case 'version':
                return Application::i()->version;
                break;
            case 'versionTime':
                return Application::i()->versionTime;
                break;
            default:
                return parent::__get($var);
                break;
        }
    }


    public function initModules()
    {
        return;
    }


    public function admin_users_showlist(Group $Group, array $IN)
    {
        $Pages = new \SOME\Pages((isset($IN['page']) ? $IN['page'] : 1), Application::i()->registryGet('rowsPerPage'));
        $from = $where = array();
        if (isset($IN['search_string'])) {
            $where[] = array("(login LIKE :search_string OR CONCAT(last_name, ' ', first_name, ' ', second_name) LIKE :search_string)", array(':search_string' => "%" . $this->SQL->escape_like($IN['search_string']) . "%"));
        }
        if ($Group->id && (!isset($IN['search_string']) || isset($IN['group_only']))) {
            $from[] = User::_dbprefix() . "users_groups_assoc AS tUGA ON tUGA.uid = User.id";
            $where[] = "tUGA.gid = " . (int)$Group->id;
        }
        switch (isset($IN['sort']) ? $IN['sort'] : null) {
            case 'email':
            case 'last_name':
                $sort = "User." . $_GET['sort'];
                break;
            default:
                $sort = "User.login";
                break;
        }
        if (strtolower(isset($IN['order']) ? $IN['order'] : null) == 'desc') {
            $order = 'DESC';
        } else {
            $order = 'ASC';
        }
        $Set = User::getSet(array('from' => $from, 'where' => $where, 'orderBy' => $sort . " " . $order), $Pages);

        $GSet = $Group->getChildSet('children');
        return array('Set' => $Set, 'Pages' => $Pages, 'GSet' => $GSet);
    }


    public function checkLoginExists($login, $id = 0)
    {
        $SQL_query = "SELECT COUNT(*) FROM " . User::_tablename() . " WHERE login = ?";
        $SQL_bind = array($login);
        if ($id) {
            $SQL_query .= " AND id != ?";
            $SQL_bind[] = (int)$id;
        }
        $SQL_result = $this->SQL->getvalue(array($SQL_query, $SQL_bind));
        return (bool)$SQL_result;
    }


    public function backupSQL()
    {
        $sql = Application::i()->getSQLDump();
        header('Content-Type: text/plain;encoding=UTF-8');
        header('Content-Disposition: attachment; filename="' . date('Y-m-d H-i') . ' ' . $this->dbname . '.sql"');
        echo $sql;
    }

    public function backupFiles()
    {
        $tmpname = tempnam(sys_get_temp_dir(), '');
        $z = new \SOME\ZipArchive();
        $z->open($tmpname, \SOME\ZipArchive::CREATE);
        $dir = \SOME\File::scandir($this->application->baseFilesDir);
        foreach ($dir as $f) {
            $z->addFile($this->application->baseFilesDir . '/' . $f, $f);
        }
        $z->close();
        header('Content-Type: application/zip');
        header('Content-Disposition: attachment; filename="' . $_SERVER['HTTP_HOST'] . '.zip"');
        echo file_get_contents($tmpname);
    }
}
