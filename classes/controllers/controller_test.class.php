<?php
/**
 * Контроллер Cron
 */
namespace RAAS;

/**
 * Файл контроллера Cron
 */
class Controller_Test extends Abstract_Controller_Cron
{
    protected function fork()
    {
        $this->view = View_Web::i();
    }
}
