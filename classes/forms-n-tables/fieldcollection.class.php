<?php
/**
 * @package RAAS
 */
declare(strict_types=1);

namespace RAAS;

use ArrayObject;

/**
 * Коллекция полей
 * @property-read Form $Form Рабочая форма
 * @property FormElement $Parent Родительский элемент
 */
class FieldCollection extends ArrayObject
{
    /**
     * Родительский элемент
     * @var FormElement
     */
    protected $Parent;

    public function __get($var)
    {
        switch ($var) {
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
        switch ($var) {
            case 'Parent':
                if ($val instanceof FormElement) {
                    $this->$var = $val;
                }
                break;
        }
    }


    #[\ReturnTypeWillChange]
    public function append($val)
    {
        if ($val = $this->checkval($val)) {
            parent::append($val);
        }
    }


    #[\ReturnTypeWillChange]
    public function offsetSet($index, $val)
    {
        if ($val = $this->checkval($val)) {
            parent::offsetSet($index, $val);
        }
    }


    protected function checkval($val)
    {
        if (($val instanceof ArrayObject) || is_array($val)) {
            $val = new Field((array)$val);
        }
        if (($val instanceof Field) || ($val instanceof FieldContainer)) {
            $val->Parent = $this->Parent;
            return $val;
        } else {
            return null;
        }
    }
}
