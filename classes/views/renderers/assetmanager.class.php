<?php
/**
 * @package RAAS
 */
namespace RAAS;

/**
 * Менеджер статических файлов
 */
class AssetManager
{
    /**
     * URL подключенных JS-файлов
     * @var array <pre>array<
     *     string[] группа файлов => array<
     *         string[] URL файла => string URL файла
     *     >
     * ></pre>
     */
    protected static $requestedJS = [];

    /**
     * URL подключенных CSS-файлов
     * @var array <pre>array<
     *     string[] группа файлов => array<
     *         string[] URL файла => string URL файла
     *     >
     * ></pre>
     */
    protected static $requestedCSS = [];


    /**
     * Добавляет при наличии тег вставки скрипта/стиля
     * @param string|array<string> $fileURL Ссылка или массив ссылок на файл
     * @param string $alt Альтернативное описание у изображений
     * @param string $title Всплывающая подсказка у изображений
     * @param string $ext Расширение подключаемого файла (если нет в адресе)
     * @return string
     */
    public static function asset($fileURL, $alt = '', $title = '', $ext = '')
    {
        if (is_array($fileURL)) {
            $result = array_values(array_filter(array_map(
                function ($x) use ($alt, $title, $ext) {
                    return static::asset($x, $alt, $title, $ext);
                },
                $fileURL
            ), 'trim'));
            return implode("\n", $result);
        }
        $fileURL = str_replace('\\', '/', $fileURL);
        if ($fileURL[0] == '/') {
            $filepath = Application::i()->baseDir . rtrim($fileURL, '/');
        } else {
            $filepath = trim($fileURL, '/');
        }
        $isFile = is_file($filepath);
        if (stristr($fileURL, '//') || $isFile) {
            if (!$ext) {
                $ext = mb_strtolower(pathinfo($fileURL, PATHINFO_EXTENSION));
            }
            $version = '';
            if ($isFile) {
                $version = static::getVersionSuffix($filepath);
            }
            $link = $fileURL . $version;
            $renderer = new HTMLRenderer();
            $tagName = '';
            $attrs = [];
            switch ($ext) {
                case 'js':
                    $tagName = 'script';
                    $attrs = ['src' => $link];
                    break;
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                case 'webp':
                case 'svg':
                    $tagName = 'img';
                    $attrs = [
                        'src' => $link,
                        'alt' => $alt,
                        'title' => $title ?: $alt,
                    ];
                    break;
                case 'ico':
                    $tagName = 'link';
                    $attrs = [
                        'rel' => 'shortcut icon',
                        'type' => 'image/x-icon',
                        'href' => $link,
                    ];
                    break;
                case 'css':
                    $tagName = 'link';
                    $attrs = [
                        'rel' => 'stylesheet',
                        'href' => $link,
                    ];
                    break;
            }
            if ($tagName) {
                return $renderer->getElement($tagName, $attrs);
            }
        }
    }


    /**
     * Получает суффикс версии файла
     * @param string $filepath Путь к файлу
     * @return string
     */
    public static function getVersionSuffix(string $filepath): string
    {
        if (!is_file($filepath)) {
            return '';
        }
        $result = '?v=' . date('Y-m-d-H-i-s', filemtime($filepath));
        return $result;
    }


    /**
     * Запросить подключение файла(ов)
     * @param string|string[] $file Файл(ы) для подключения
     * @param string $var Название переменной для добавления
     * @param string $group Название группы для подключения
     */
    protected static function requestFile($file, $var, $group = '')
    {
        if (is_array($file)) {
            foreach ($file as $f) {
                static::requestFile($f, $var, $group);
            }
        } elseif (is_string($file) &&
            (stristr($file, '//') || is_file(Application::i()->baseDir . $file))
        ) {
            $val = &static::$$var;
            $val[$group][$file] = $file;
        }
    }


    /**
     * Запросить подключение JS-файла(ов)
     * @param string|string[] $file Файл(ы) для подключения
     * @param string $group Название группы для подключения
     */
    public static function requestJS($file, $group = '')
    {
        static::requestFile($file, 'requestedJS', $group);
    }


    /**
     * Запросить подключение CSS-файла(ов)
     * @param string|string[] $file Файл(ы) для подключения
     * @param string $group Название группы для подключения
     */
    public static function requestCSS($file, $group = '')
    {
        static::requestFile($file, 'requestedCSS', $group);
    }


    /**
     * Получает HTML-код для вставки запрошенных файлов
     * @param string $var Название переменной с добавленными файлами
     * @param string|null $group Название группы,
     *                           либо null для получения файлов из всех групп
     * @param string $ext Расширение подключаемого файла (если нет в адресе)
     * @return string
     */
    protected static function getRequestedFiles($var, $group = '', $ext = '')
    {
        $val = static::$$var;
        if ($group === null) {
            $result = array_reduce($val, 'array_merge', []);
        } else {
            $result = isset($val[$group]) ? $val[$group] : [];
        }

        return static::asset($result, '', '', $ext);
    }


    /**
     * Получает HTML-код для вставки запрошенных JS-файлов
     * @param string|null $group Название группы,
     *                           либо null для получения файлов из всех групп
     * @return string
     */
    public static function getRequestedJS($group = '')
    {
        return static::getRequestedFiles('requestedJS', $group, 'js');
    }


    /**
     * Получает HTML-код для вставки запрошенных CSS-файлов
     * @param string|null $group Название группы,
     *                           либо null для получения файлов из всех групп
     * @return string
     */
    public static function getRequestedCSS($group = '')
    {
        return static::getRequestedFiles('requestedCSS', $group, 'css');
    }


    /**
     * Очищает запрошенные файлы
     * @param string $var Название переменной с добавленными файлами
     * @param string|null $group Название группы,
     *                           либо null для очистки всех групп
     * @return string
     */
    protected static function clearRequestedFiles($var, $group = '')
    {
        if ($group === null) {
            static::$$var = [];
        } else {
            static::$$var[$group] = [];
        }
    }


    /**
     * Очищает запрошенны JS-файлы
     * @param string|null $group Название группы,
     *                           либо null для очистки всех групп
     * @return string
     */
    public static function clearRequestedJS($group = '')
    {
        return static::clearRequestedFiles('requestedJS', $group);
    }


    /**
     * Очищает запрошенны CSS-файлы
     * @param string|null $group Название группы,
     *                           либо null для очистки всех групп
     * @return string
     */
    public static function clearRequestedCSS($group = '')
    {
        return static::clearRequestedFiles('requestedCSS', $group);
    }
}
