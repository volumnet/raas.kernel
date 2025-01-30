<?php
/**
 * @package RAAS
 */
namespace RAAS;

/**
 * Контейнер опций
 * @property-read Field $Field Поле, к которому принадлежит опция
 */
class OptionContainer extends FormElement
{
	/**
     * Тип поля $children
     */
    const CHILDREN_TYPE = 'RAAS\OptionCollection';

    public function __get($var)
    {
        switch ($var) {
            case 'Field':
                if ($this->Parent instanceof Field) {
                    return $this->Parent;
                } elseif ($this->Parent instanceof self) {
                    return $this->Parent->Field;
                }
                break;
            default:
                return parent::__get($var);
                break;
        }
    }
}
