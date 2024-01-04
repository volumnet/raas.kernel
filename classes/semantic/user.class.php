<?php
/**
 * Пользователь системы
 */
declare(strict_types=1);

namespace RAAS;

use SOME\Namespaces;
use SOME\SOME;

/**
 * Класс пользователя системы
 * @property-read bool $isFirst Первый пользователь в системе
 * @property-read string $full_name Полное имя
 * @property-read bool $canAdminUsers Может редактировать пользователей
 * @property-read bool $adminRights Администраторские права
 * @property-read array $associations <pre><code>array<
 *     string[] ID# группы => int 2 - администратор группы, 1 - рядовой пользователь
 * ></code></pre> Ассоциации пользователя с группами
 * @property-read int[] $manageableGroups_ids Список ID# групп, где пользователь является администратором группы
 * @property-read mixed $rights Права пользователя согласно классу доступа
 * @property mixed $preferences Предпочтения пользователя
 * @property-read Group[] $groups Группы пользователя
 */
class User extends SOME implements IOwner
{
    protected static $tablename = 'users';

    protected static $cognizableVars = [
        'isFirst',
        'full_name',
        'canAdminUsers',
        'adminRights',
        'associations',
        'manageableGroups_ids',
        'rights',
        'preferences'
    ];
    protected static $links = [
        'groups' => [
            'tablename' => 'users_groups_assoc',
            'field_from' => 'uid',
            'field_to' => 'gid',
            'classname' => Group::class
        ],
    ];

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
     * @param array $groups <pre><code>array<
     *     string[] ID# группы => int 0 - не присоединять, 1 - как пользователь, 2 - как администратор
     * ></code></pre> Группы для присоединения
     * @param bool $clear Удалять старые группы
     */
    protected function add_groups(array $groups, $clear = false)
    {
        $temp = [];
        foreach ($groups as $key => $val) {
            if ($val) {
                $temp[] = ['uid' => (int)$this->id, 'gid' => (int)$key, 'group_admin' => ($val > 1)];
            }
        }
        if ($clear) {
            $sqlQuery = "DELETE FROM " . User::_dbprefix() . "users_groups_assoc WHERE uid = ?";
            self::$SQL->query([$sqlQuery, (int)$this->id]);
        }
        if ($temp) {
            self::$SQL->add(User::_dbprefix() . "users_groups_assoc", $temp);
        }
    }

    /**
     * Подпись массива данных паролем пользователя
     * @param array $data Данные для подписи
     * @return string Хэш подписи
     */
    public function sign(array $data)
    {
        ksort($data);
        $str = Model::i()->md5It(http_build_query($data) . $this->login . $this->password_md5);
        return $str;
    }

    /**
     * Возвращает, проходит ли пользователь фильтрацию по IP, если есть
     * @param string $ip IP-адрес пользователя
     * @return bool
     */
    public function ipFilter($ip)
    {
        if ($ips = $this->ip_filter) {
            $ips = preg_replace('/[^\\d\\.\\*]+/i', ',', $ips);
            $ips = explode(',', $ips);
            $callback = function ($x) {
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

    /**
     * Авторизует пользователя по логину и MD5-хэшу пароля
     * @param string $login Логин
     * @param string $passwordMD5 MD5-хэш пароля
     * @return bool Прошла ли авторизация
     */
    public function auth($login, $passwordMD5)
    {
        $sqlQuery = "SELECT * FROM " . self::_tablename() . " WHERE login = ? AND password_md5 = ? ";
        $user = self::getSQLObject([$sqlQuery, $login, $passwordMD5]);
        if ($user->id) {
            foreach ($user->getArrayCopy() as $key => $val) {
                $this->$key = $val;
            }
        }
        return (bool)$user->id;
    }

    /**
     * Авторизует пользователя по данным и их подписи, заполняет данными
     * @param array $data Данные для входа
     * @param string $sign Подпись данных
     */
    public function authBySignature(array $data, $sign)
    {
        ksort($data);
        $str = http_build_query($data);
        $sqlQuery = "SELECT * FROM " . self::_tablename() . " WHERE MD5(CONCAT(?, login, password_md5)) = ?";
        $user = self::getSQLObject([$sqlQuery, $str, $sign]);
        if ($user->id) {
            $this->__construct($user);
        }
    }


    /**
     * Привязывает пользователя к группе
     * @param Group $group Группа для привязки
     */
    public function associate(Group $group)
    {
        if ($this->id && $group->id) {
            $sqlQuery = " INSERT IGNORE INTO " . self::_dbprefix() . "users_groups_assoc (uid, gid) "
                       . " VALUES (" . (int)$this->id . ", " . (int)$group->id . ") ";
            self::$SQL->query($sqlQuery);
            $this->commit();
        }
    }


    /**
     * Отвязывает пользователя от группы
     * @param Group $group Группа для отвязки
     */
    public function deassociate(Group $group)
    {
        if ($this->id && $group->id) {
            $sqlQuery = " DELETE FROM " . self::_dbprefix() . "users_groups_assoc
                           WHERE uid = " . (int)$this->id
                      . "    AND gid = " . (int)$group->id;
            self::$SQL->query($sqlQuery);
            $this->commit();
        }
    }


    /**
     * Получает класс доступа к контексту
     * @param IRightsContext $context Контекст
     * @return Access
     */
    public function access(IRightsContext $context)
    {
        $NS = Namespaces::getNSArray(get_class($context));
        $classname = implode('\\', $NS) . '\\Access';
        return new $classname($this);
    }


    /**
     * Возвращает, является ли пользователь первым в системе
     * @return bool
     */
    protected function _isFirst()
    {
        $sqlQuery = "SELECT COUNT(*) FROM " . self::_tablename() . " WHERE root";
        $sqlResult = self::$SQL->getvalue($sqlQuery);
        return !$sqlResult;
    }


    /**
     * Возвращает полное имя пользователя
     * @return string
     */
    protected function _full_name()
    {
        $arr = [];
        if (trim($this->last_name ?: '')) {
            $arr[] = trim($this->last_name);
        }
        if (trim($this->first_name ?: '')) {
            $arr[] = trim($this->first_name);
        }
        if (trim($this->second_name ?: '')) {
            $arr[] = trim($this->second_name);
        }
        return implode(' ', $arr);
    }


    /**
     * Возвращает, может ли пользователь редактировать других пользователей
     * @return bool
     */
    protected function _canAdminUsers()
    {
        return (bool)$this->root;
    }


    /**
     * Возвращает, имеет ли пользователь администраторские права
     * @return bool
     */
    protected function _adminRights()
    {
        return (bool)$this->root;
    }

    /**
     * Возвращает ассоциации пользователя с группами
     * @return array <pre><code>array<
     *     string[] ID# группы => int 2 - администратор группы, 1 - рядовой пользователь
     * ></code></pre>
     */
    protected function _associations()
    {
        $sqlQuery = "SELECT * FROM " . self::$dbprefix . "users_groups_assoc WHERE uid = " . (int)$this->id;
        $sqlResult = self::$SQL->get($sqlQuery);
        $temp = [];
        foreach ($sqlResult as $row) {
            $temp[$row['gid']] = ($row['group_admin'] ? 2 : 1);
        }
        return $temp;
    }


    /**
     * Возвращает список ID# администрируемых групп
     * @return int[]
     */
    protected function _manageableGroups_ids()
    {
        if ($this->root) {
            $sqlQuery = "SELECT id FROM `" . self::$dbprefix . "groups`";
        } else {
            $sqlQuery = "SELECT gid
                           FROM " . self::$dbprefix . "users_groups_assoc
                          WHERE uid = " . (int)$this->id
                      . "   AND group_admin";
        }
        $sqlResult = self::$SQL->getcol($sqlQuery);
        $sqlResult = array_map('intval', $sqlResult);
        return $sqlResult;
    }


    /**
     * Возвращает права пользователя согласно классу доступа
     * @return mixed
     */
    protected function _rights()
    {
        return @json_decode($this->cache_rights ?? '', true);
    }


    /**
     * Возвращает предпочтения
     * @return mixed
     */
    protected function _preferences()
    {
        return (array)@json_decode($this->prefs ?? '', true);
    }
}
