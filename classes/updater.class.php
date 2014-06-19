<?php
namespace RAAS;

class Updater 
{
    protected $Context;

    public function __get($var)
    {
        switch ($var) {
            case 'tables':
                return $this->SQL->getcol("SHOW TABLES");
                break;
            default:
                return $this->Context->$var;
                break;
        }
    }

    public function __construct(IContext $Context)
    {
        $this->Context = $Context;
    }

    public function columns($table)
    {
        return array_map(function($x) { return $x['Field']; }, $this->SQL->get("SHOW FIELDS FROM " . $table));
    }
}