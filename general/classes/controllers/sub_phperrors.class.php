<?php
/**
 * @package RAAS.General
 */
namespace RAAS\General;

use RAAS\Abstract_Sub_Controller;
use RAAS\PHPErrorLogParser;
use RAAS\Redirector;

/**
 * Класс модуля ошибок PHP
 */
class Sub_PHPErrors extends Abstract_Sub_Controller
{
    protected static $instance;

    public function run()
    {
        $filename = ini_get('error_log');
        switch ($this->action) {
            case 'delete':
                if ($filename && is_file($filename)) {
                    @unlink($filename);
                }
                new Redirector('?mode=admin&sub=' . $this->sub);
                break;
            default:
                $errors = [];
                if ($filename && is_file($filename)) {
                    $text = file_get_contents($filename);
                    $parser = new PHPErrorLogParser();
                    $errors = $parser->parse($text);
                }
                while (ob_get_level()) {
                    ob_end_clean();
                }
                header('Content-Type: application/json');
                echo json_encode($errors, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                exit;

                break;
        }
    }
}
