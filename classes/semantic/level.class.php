<?php
/**
 * @package RAAS
 */
namespace RAAS;

use SOME\SOME;

/**
 * Уровень доступа
 */
class Level extends SOME
{
    const GRANT_ALL = -1;
    const REVOKE_ALL = -2;

    protected static $tablename = 'levels';
    protected static $defaultOrderBy = "priority";
    protected static $aiPriority = true;
    protected static $cognizableVars = array('Context', 'rights');

    public function __set($var, $val)
    {
        switch ($var) {
            case 'Context':
                if ($val instanceof IRightsContext) {
                    $this->m = $val->mid;
                }
                break;
            default:
                parent::__set($var, $val);
                break;
        }
    }

    public function commit()
    {
        $this->access = @json_encode($this->meta['rights']);
        Access::flushRights();
        parent::commit();
    }

    protected function _Context()
    {
        return Application::i()->getContext($this->m);
    }

    protected function _rights()
    {
        return @json_decode($this->access, true);
    }
}
