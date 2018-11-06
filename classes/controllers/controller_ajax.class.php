<?php
/**
 * Файл AJAX-контроллера модуля RAAS
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2012, Volume Networks
 */
namespace RAAS;

/**
 * Класс AJAX-контроллера модуля RAAS
 * @package RAAS
 */
final class Controller_Ajax extends Controller_Web
{
    /**
     * Экземпляр класса
     * @var \RAAS\Controller_AJAX
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
