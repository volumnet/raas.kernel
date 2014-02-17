<?php
namespace RAAS;
abstract class Access
{
    private $Owner;
    private $mask = 0;
    private $rights = null;
    
    public function __get($var)
    {
        switch ($var) {
            case 'Owner': case 'rights': case 'mask':
                return $this->$var;
                break;
            case 'oidN':
                if ($this->Owner instanceof User) {
                    return 'uid';
                } elseif ($this->Owner instanceof Group) {
                    return 'gid';
                }
                break;
            case 'levelsTableN':
                if ($this->Owner instanceof User) {
                    return $this->dbprefix . 'users_levels_assoc';
                } elseif ($this->Owner instanceof Group) {
                    return $this->dbprefix . 'groups_levels_assoc';
                }
                break;
            case 'rightsTableN':
                if ($this->Owner instanceof User) {
                    return $this->dbprefix . 'users_rights';
                } elseif ($this->Owner instanceof Group) {
                    return $this->dbprefix . 'groups_rights';
                }
                break;
            case 'Context':
                $NS = \SOME\Namespaces::getNSArray(\get_called_class());
                if (count($NS) == 3) {
                    $classname = implode('\\', $NS) . '\\Module';
                } elseif (count($NS) == 2) {
                    $classname = implode('\\', $NS) . '\\Package';
                } else {
                    $classname = 'RAAS\\Application';
                }
                return $classname::i();
                break;
            case 'application':
                return Application::i();
                break;
            case 'dbprefix': case 'SQL':
                return $this->application->$var;
                break;
            case 'level':
                $SQL_query = "SELECT lid FROM " . $this->levelsTableN . " WHERE " . $this->oidN . " = ? AND m = ?";
                $SQL_result = $this->SQL->getvalue(array($SQL_query, $this->Owner->id, $this->Context->mid));
                $level = new Level($SQL_result);
                if ($level->id) {
                    return $level;
                } else {
                    return (int)$SQL_result;
                }
                break;
            case 'selfRights':
                $SQL_query = "SELECT access FROM " . $this->rightsTableN . " WHERE " . $this->oidN . " = ? AND m = ?";
                $SQL_result = $this->SQL->getvalue(array($SQL_query, (int)$this->Owner->id, $this->Context->mid));
                return @json_decode($SQL_result, true);
                break;
            case 'canDo':
                return $this->canDo();
                break;
            case 'canView':
                if ($this->Context instanceof Module) {
                    return $this->canDo();
                } elseif ($this->Context instanceof Package) {
                    if ($this->canDo()) {
                        return true;
                    }
                    foreach ($this->Context->modules as $key => $mod) {
                        $NS = \SOME\Namespaces::getNSArray(\get_class($mod));
                        $classname = implode('\\', $NS) . '\\Access';
                        $a = new $classname($this->Owner);
                        if ($a->canView()) {
                            return true;
                        }
                    }
                }
                return false;
                break;
        }
    }
    
    
    final public function __construct(IOwner $Owner)
    {
        $this->Owner = $Owner;
        $this->_rights();
    }
    
    
    final public function setLevel($Level = null)
    {
        if (!($Level instanceof Level) || (get_class($this->Context) == get_class($Level->Context))) {
            if ($Level && (($Level instanceof Level) || (int)$Level)) {
                $arr = array('m' => (string)$this->Context->mid, 'lid' => ($Level instanceof Level ? $Level->id : (int)$Level), $this->oidN => (int)$this->Owner->id);
                $this->SQL->add($this->levelsTableN, $arr);
            } else {
                $SQL_query = "DELETE FROM " . $this->levelsTableN . " WHERE " . $this->oidN . " = ? AND m = ?";
                $this->SQL->query(array($SQL_query, (int)$this->Owner->id, $this->Context->mid));
            }
            $this->flush();
        }
    }
    
    
    final public function setRights($rights = null)
    {
        $this->deleteRights($this->Context);
        $arr = array($this->oidN => (int)$this->Owner->id, 'm' => $this->Context->mid, 'access' => json_encode($rights));
        $this->SQL->add($this->rightsTableN, $arr);
        $this->flush();
    }
    
    
    final public function deleteRights()
    {
        $SQL_query = "DELETE FROM " . $this->rightsTableN . " WHERE " . $this->oidN . " = ? AND m = ?";
        $this->SQL->query(array($SQL_query, (int)$this->Owner->id, $this->Context->mid));
        $this->flush();
    }
    
    
    final public static function flushRights(User $User = null)
    {
        $SQL_query = "UPDATE " . User::_tablename() . " SET cache_rights = '' WHERE 1";
        if ($User && $User->id) {
            $SQL_query .= " AND id = " . (int)$User->id;
        }
        Application::i()->SQL->query($SQL_query);
    }
    
    public function canDo($sub = null, $action = null, $id = null)
    {
        return (($this->Owner instanceof User) && $this->Owner->root) || ($this->mask == 1);
    }
    
    
    final public function A($href)
    {
        @parse_str($href, $arr);
        $sub = isset($arr['sub']) ? $arr['sub'] : null;
        $action = isset($arr['action']) ? $arr['action'] : null;
        $id = isset($arr['id']) ? $arr['id'] : null;
        return $this->canDo($sub, $action, $id);
    }
    
    
    protected static function inherit($child, $parent)
    {
        return array_merge((array)$parent, (array)$child);
    }
    
    
    protected static function merge($a, $b)
    {
        $temp = array();
        foreach ((array)$a as $key => $val) {
            $temp[$key] = (isset($temp[$key]) ? $temp[$key] : 0) + $val;
        }
        foreach ((array)$b as $key => $val) {
            $temp[$key] = (isset($temp[$key]) ? $temp[$key] : 0) + $val;
        }
        return $temp;
    }
    
    
    final private function _rights()
    {
        if (($this->Owner instanceof User) && $this->Owner->rights) {
            $this->rights = $this->Owner->rights['rights'];
            $this->mask = $this->Owner->rights['mask'];
        } else {
            // Собственные права
            $this->rights = $this->selfRights;
            $this->mask = 0;
            $level = $this->level;
            
            // Маскированные права
            if ($level instanceof Level) {
                $this->rights = static::inherit($this->rights, $level->rights); 
            } else {
                if ($level === Level::GRANT_ALL) {
                    $this->mask = 1;
                } elseif ($level === Level::REVOKE_ALL) {
                    $this->mask = -1;
                } 
            }
            
            // Наследуемые права
            if (!$this->mask) {
                if ($this->Owner instanceof User) {
                    $groupRights = null;
                    $groupMask = null;
                    foreach ($this->Owner->groups as $row) {
                        $parentAccess = new static($row);
                        $groupRights = static::merge($groupRights, $parentAccess->rights);
                        if (!$groupMask || ($parentAccess->mask > $groupMask)) {
                            $groupMask = $parentAccess->mask;
                        }
                    }
                    
                    $this->rights = static::inherit($this->rights, $groupRights);
                    $this->mask = $groupMask;
                } elseif (($this->Owner instanceof Group) && $this->Owner->parent && $this->Owner->parent->id) {
                    $parentAccess = new static($this->Owner->parent);
                    $this->rights = static::inherit($this->rights, $parentAccess->rights);
                    $this->mask = $parentAccess->mask;
                }
            }
            
            // Наследуем уровень по умолчанию
            if (!$this->mask) {
                $level = new Level((int)$this->Context->registryGet('defaultLevel'));
                if (!$level->id) {
                    $level = (int)$this->Context->registryGet('defaultLevel');
                }
                if ($level instanceof Level) {
                    $this->rights = static::inherit($this->rights, $level->rights); 
                } else {
                    if ($level === Level::GRANT_ALL) {
                        $this->mask = 1;
                    } elseif ($level === Level::REVOKE_ALL) {
                        $this->mask = -1;
                    } 
                }
            }
            
            // Если не определена маска, запрещаем по умолчанию
            if (!$this->mask) {
                $this->mask = -1;
            }
            
            if (($this->Owner instanceof User) && $this->Owner->id) {
                $this->Owner->cache_rights = json_encode(array('rights' => $this->rights, 'mask' => $this->mask));
                $this->Owner->commit();
            }
        }
    }
    
    
    final private function flush()
    {
        if ($this->Owner instanceof User) {
            static::flushRights($this->Owner);
        } else {
            static::flushRights();
        }
    }
}