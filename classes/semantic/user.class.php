<?php
namespace RAAS;
class User extends \SOME\SOME implements IOwner
{
    protected static $tablename = 'users';
    protected static $cognizableVars = array(
        'isFirst', 'full_name', 'canAdminUsers', 'adminRights', 'associations', 'manageableGroups_ids', 'rights', 'preferences'
    );
    protected static $links = array('groups' => array('tablename' => 'users_groups_assoc', 'field_from' => 'uid', 'field_to' => 'gid', 'classname' => 'RAAS\\Group'));

    public function __set($var, $val)
    {
        switch ($var) {
            case 'preferences':
                $this->prefs = json_encode($val);
                break;
            default:
                return parent::__set($var, $val);
                break;
        }
    }

    public function commit()
    {
        Access::flushRights($this);
        parent::commit();
        if ($this->_SET_groups) {
            $this->add_groups($this->_SET_groups, true);
            unset($this->_SET_groups);
        }
        if ($this->_SET_rights) {
            foreach ((array)$this->_SET_rights as $mid => $lid) {
                if ($Context = Application::i()->getContext($mid)) {
                    $level = new Level($lid);
                    $this->access($Context)->setLevel($level->id ? $level : $lid);
                }
            }
            unset($this->_SET_rights);
        }
    }

    /**
     * Присоединение к множеству групп
     * @param array $groups Группы в виде массива [ID группы] => [0 - не присоединять, 1 - как пользователь, 2 - как администратор]
     * @param bool $clear Удалять старые группы
     */
    protected function add_groups(array $groups, $clear = false)
    {
        $temp = array();
        foreach ($groups as $key => $val) {
            if ($val) {
                $temp[] = array('uid' => (int)$this->id, 'gid' => (int)$key, 'group_admin' => ($val > 1));
            }
        }
        if ($clear) {
            self::$SQL->query(array("DELETE FROM " . User::_dbprefix() . "users_groups_assoc WHERE uid = ?", (int)$this->id));
        }
        if ($temp) {
            self::$SQL->add(User::_dbprefix() . "users_groups_assoc", $temp);
        }
    }

    public function sign(array $data)
    {
        ksort($data);
        $str = Model::i()->md5It(http_build_query($data) . $this->login . $this->password_md5);
        return $str;
    }

    public function ipFilter($ip)
    {
        if ($ips = $this->ip_filter) {
            $ips = preg_replace('/[^\\d\\.\\*]+/i', ',', $ips);
            $ips = explode(',', $ips);
            $callback = function($x) {
                $y = str_replace('.', '\\.', $x);
                $y = str_replace('*', '\\d+');
                $y = '(' . $y . ')';
                return $y;
            };
            $ips = array_map($callback, $ips);
            $ips = '/' . implode('|', $ips) . '/i';
            return preg_match($ips, $ip);
        }
        return true;
    }

    public function auth($login, $password_md5)
    {
        $SQL_query = "SELECT * FROM " . self::_tablename() . " WHERE login = ? AND password_md5 = ? ";
        $User = self::getSQLObject(array($SQL_query, $login, $password_md5));
        if ($User->id) {
            foreach ($User->getArrayCopy() as $key => $val) {
                $this->$key = $val;
            }
        }
        return (bool)$User->id;
    }

    public function authBySignature(array $data, $sign)
    {
        ksort($data);
        $str = http_build_query($data);
        $SQL_query = "SELECT * FROM " . self::_tablename() . " WHERE MD5(CONCAT(?, login, password_md5)) = ?";
        $User = self::getSQLObject(array($SQL_query, $str, $sign));
        if ($User->id) {
            $this->__construct($User);
        }
    }

    public function associate(Group $Group)
    {
        if ($this->id && $Group->id) {
            $SQL_query = " INSERT IGNORE INTO " . self::_dbprefix() . "users_groups_assoc (uid, gid) "
                       . " VALUES (" . (int)$this->id . ", " . (int)$Group->id . ") ";
            self::$SQL->query($SQL_query);
            $this->commit();
        }
    }

    public function deassociate(Group $Group)
    {
        if ($this->id && $Group->id) {
            $SQL_query = " DELETE FROM " . self::_dbprefix() . "users_groups_assoc WHERE uid = " . (int)$this->id . " AND gid = " . (int)$Group->id;
            self::$SQL->query($SQL_query);
            $this->commit();
        }
    }

    public function access(IRightsContext $Context)
    {
        $NS = \SOME\Namespaces::getNSArray(\get_class($Context));
        $classname = implode('\\', $NS) . '\\Access';
        return new $classname($this);
    }

    protected function _isFirst()
    {
        $SQL_query = "SELECT COUNT(*) FROM " . self::_tablename() . " WHERE root";
        $SQL_result = self::$SQL->getvalue($SQL_query);
        return !$SQL_result;
    }

    protected function _full_name()
    {
        $arr = array();
        if (trim($this->last_name)) {
            $arr[] = trim($this->last_name);
        }
        if (trim($this->first_name)) {
            $arr[] = trim($this->first_name);
        }
        if (trim($this->second_name)) {
            $arr[] = trim($this->second_name);
        }
        return implode(' ', $arr);
    }

    protected function _canAdminUsers()
    {
        return (bool)$this->root;
    }

    protected function _adminRights()
    {
        return (bool)$this->root;
    }

    protected function _associations()
    {
        $SQL_query = "SELECT * FROM " . self::$dbprefix . "users_groups_assoc WHERE uid = " . (int)$this->id;
        $SQL_result = self::$SQL->get($SQL_query);
        $temp = array();
        foreach ($SQL_result as $row) {
            $temp[(int)$row['gid']] = ($row['group_admin'] ? 2 : 1);
        }
        return $temp;
    }

    protected function _manageableGroups_ids()
    {
        if ($this->root) {
            $SQL_query = "SELECT id FROM " . self::$dbprefix . "groups";
        } else {
            $SQL_query = "SELECT gid FROM " . self::$dbprefix . "users_groups_assoc WHERE uid = " . (int)$this->id . " AND group_admin";
        }
        return self::$SQL->getcol($SQL_query);
    }

    protected function _rights()
    {
        return @json_decode($this->cache_rights, true);
    }

    protected function _preferences()
    {
        return (array)@json_decode($this->prefs, true);
    }
}
