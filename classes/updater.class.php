<?php
namespace RAAS;

class Updater 
{
    protected $Context;

    public function __get($var)
    {
        return $this->Context->$var;
    }

    public function __construct(IContext $Context)
    {
        $this->Context = $Context;
    }
}