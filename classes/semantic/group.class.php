<?php 
namespace RAAS;
class Group extends \SOME\SOME implements IOwner
{
    protected static $tablename = 'groups';
    protected static $defaultOrderBy = "name";
    protected static $cognizableVars = array();

    protected static $references = array('parent' => array('FK' => 'pid', 'classname' => 'RAAS\\Group', 'cascade' => true));
    protected static $parents = array('parents' => 'parent');
    protected static $children = array('children' => array('classname' => 'RAAS\\Group', 'FK' => 'pid'));
    protected static $links = array('users' => array('tablename' => 'users_groups_assoc', 'field_from' => 'gid', 'field_to' => 'uid', 'classname' => 'RAAS\\User'));
    
    public function access(IRightsContext $Context)
    {
        $NS = \SOME\Namespaces::getNSArray(\get_class($Context));
        $classname = implode('\\', $NS) . '\\Access';
        return new $classname($this);
    }
    
    public function commit()
    {
        parent::commit();
        if (isset($this->_SET_rights)) {
            foreach ((array)$this->_SET_rights as $mid => $lid) {
                if ($Context = Application::i()->getContext($mid)) {
                    $level = new Level($lid);
                    $this->access($Context)->setLevel($level->id ? $level : $lid);
                }
            }
            unset($this->_SET_rights);
        }
    }
}