<?php
/**
 * Файл мастера перенаправлений
 * @package RAAS
 * @version 4.1
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2011, Volume Networks
 */
namespace RAAS;

/**
 * Класс мастера перенаправлений
 * @package RAAS
 */
class Redirector
{
    /**
     * Конструктор класса
     * @param string $url Адрес для перенаправления, либо 'history:back' для возврата назад по HTTP_REFERER, либо null для ручного управления
     *        либо пустая строка для обновления страницы
     */
    public function __construct($url = '')
    {
        if ($url !== null) {
            if (preg_match('/^history:back/i', $url)) {
                $hash = str_replace('history:back', '', $url);
                $this->goBack('', $hash);
            } elseif (!$url) {
                $this->setLocation($_SERVER['REQUEST_URI']);
            } else {
                $this->setLocation($url);
            }
        }
    }

     /**
     * Перенаправляет обратно
     * @param string $defaut_location если не удалось получить HTTP_REFERER
     */
    private function goBack($defaut_location = '', $hash = '')
    {
        if ($_SERVER['HTTP_REFERER']) {
            $url = $_SERVER['HTTP_REFERER'];
        } elseif ($default_location) {
            $url = $default_location;
        } else {
            $url = '/';
        }
        $url .= $hash;
        $this->setLocation($url);
    }

    /**
     * Выдает заголовок для перенаправления и завершает работу скрипта
     * @param string $url куда перенаправляем
     */
    private function setLocation($url)
    {
        if ($url[0] == '/') {
            $url = 'http' . (($_SERVER['HTTPS'] ?? '') == 'on' ? 's' : '') . '://' . ($_SERVER["SERVER_NAME"] ?? '') . $url;
        }
        header('Location: ' . $url);
        exit;
    }
}
