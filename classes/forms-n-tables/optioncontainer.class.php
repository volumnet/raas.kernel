<?php
/**
 * Файл класса контейнера опций
 * @package RAAS
 * @version 4.2
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2013, Volume Networks
 */       
namespace RAAS;

/**
 * Класс контейнера опций
 * @package RAAS
 * @property-read Field $Field Поле, к которому принадлежит опция
 */       
class OptionContainer extends FormElement
{
	/**
     * Тип поля $children
     */
    const childrenType = 'RAAS\OptionCollection';
    
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