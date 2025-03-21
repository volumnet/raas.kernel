<?php
/**
 * @package RAAS
 */       
namespace RAAS;

/**
 * Группа полей
 */       
class FieldSet extends FieldContainer
{
    /**
     * Рендерит группу полей
     * @return string
     */
    public function render(): string
    {
        $template = $this->template ?? null;
        if (is_callable($template)) {
            $result = $template($this);
        } else {
            include Application::i()->view->tmp('/form.inc.php'); // Для совместимости с $_RAAS_attrs
            include Application::i()->view->tmp('/fieldset.inc.php');
            if ($template) {
                include Application::i()->view->context->tmp($template);
            }
            ob_start();
            $_RAASForm_FieldSet($this);
            $result = ob_get_clean();
        }
        return $result;
    }
}
