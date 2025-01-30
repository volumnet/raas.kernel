<?php
/**
 * @package RAAS
 */
namespace RAAS;

/**
 * Контроллер Cron
 */
class Controller_Test extends Abstract_Controller_Cron
{
    protected function fork()
    {
        $this->view = View_Web::i();
    }
}
