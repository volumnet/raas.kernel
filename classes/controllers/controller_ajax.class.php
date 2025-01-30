<?php
/**
 * @package RAAS
 */
namespace RAAS;

/**
 * Класс AJAX-контроллера модуля RAAS
 */
final class Controller_Ajax extends Controller_Web
{
    /**
     * Экземпляр класса
     * @var Controller_Ajax
     */
    protected static $instance;

    /**
     * Инициализатор класса
     */
    protected function init()
    {
        if (isset($_GET['v'])) {
            switch ($_GET['v']) {
                case 'xml':
                    $this->view = View_Api::i(View_Api::THEME_XML);
                    break;
                case 'chunk':
                    $this->view = View_Chunk::i();
                    break;
                case 'web':
                    $this->view = View_Web::i();
                    break;
                default:
                    $this->view = View_Api::i(View_Api::THEME_JSON);
                    break;
            }
        } else {
            $this->view = View_Api::i(View_Api::THEME_JSON);
        }
        parent::init();
    }
}
