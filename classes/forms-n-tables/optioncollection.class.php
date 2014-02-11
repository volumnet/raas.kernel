<?php
/**
 * Файл класса коллекции опций
 * @package RAAS
 * @version 4.2
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2013, Volume Networks
 */       
namespace RAAS;

/**
 * Класс коллекции опций
 * @package RAAS
 * @property-read Form $Form Рабочая форма
 * @property FormElement $Parent Родительский элемент
 */       
class OptionCollection extends \ArrayObject
{
    /**
     * Родительский элемент
     * @var FormElement
     */
    protected $Parent;

    public function __get($var)
    {
        switch($var) {
            case 'Form':
                return $this->Parent->__get('Form');
                break;
            default:
                if (isset($this->$var)) {
                    return $this->$var;
                }
                break;
        }
    }

    public function __set($var, $val)
    {
        switch ($var){
            case 'Parent':
                if ($val instanceof FormElement) {
                    $this->$var = $val;
                }
                break;
        }
    }

    public function append($val)
    {
        if ($val = $this->checkval($val)) {
            parent::append($val);
        }
    }

    public function offsetSet($index, $val) 
    {
        if ($val = $this->checkval($val)) {
            parent::offsetSet($index, $val);
        }
    }

    protected function checkval($val) 
    {
        if (($val instanceof \ArrayObject) || is_array($val)) {
            $val = new Option((array)$val);
        }
        if (($val instanceof Option) || ($val instanceof OptionContainer)) {
            $val->Parent = $this->Parent;
            return $val;
        } else {
            return null;
        }
    }
}