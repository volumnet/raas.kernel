<?php
/**
 * @package RAAS
 */       
namespace RAAS;

/**
 * Вкладка формы
 */       
class FormTab extends FieldContainer {
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
            include Application::i()->view->tmp('/formtab.inc.php');
            if ($template) {
                include Application::i()->view->context->tmp($template);
            }
            ob_start();
            $_RAASForm_FormTab($this);
            $result = ob_get_clean();
        }
        return $result;
    }
}
