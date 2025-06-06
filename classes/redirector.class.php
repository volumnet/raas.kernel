<?php
/**
 * @package RAAS
 */
namespace RAAS;

/**
 * Мастер перенаправлений
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
                $this->setLocation($_SERVER['REQUEST_URI'] ?? '');
            } else {
                $this->setLocation($url);
            }
        }
    }

     /**
     * Перенаправляет обратно
     * @param string $default_location если не удалось получить HTTP_REFERER
     */
    private function goBack($default_location = '', $hash = '')
    {
        if ($_SERVER['HTTP_REFERER'] ?? '') {
            $url = $_SERVER['HTTP_REFERER'] ?? '';
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
        // 2025-04-14, AVS: добавил условие для исключения циклов
        if (($_SERVER['REQUEST_METHOD'] ?? '') == 'GET') {
            // 2025-04-23, AVS: проверяем, только если был GET, т.к. возврат с POST на GET это нормально
            $parsedUrl = parse_url($url);
            $oldRequestUri = $_SERVER['REQUEST_URI'] ?? null;
            if (
                (($parsedUrl['host'] ?? '') == ($_SERVER['SERVER_NAME'] ?? '')) &&
                (
                    ($url == $oldRequestUri) ||
                    ($parsedUrl['path'] . (($parsedUrl['query'] ?? null) ? ('?' . $parsedUrl['query']) : '') == $oldRequestUri)
                )
            ) {
                exit;
            }
        }
        header('Location: ' . $url);
        exit;
    }
}
