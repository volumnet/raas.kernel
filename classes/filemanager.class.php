<?php

namespace RAAS;

use DirectoryIterator;
use Exception;
use SOME\File;
use SOME\Text;

/**
 * Файловый менеджер
 */
class FileManager
{
    /**
     * Запрещенные расширения
     */
    protected static $deniedExts = [
        'exe',
        'com',
        'msi',
        'bat',
        'cgi',
        'pl',
        'php',
        'phps',
        'phtml',
        'php3',
        'php4',
        'php5',
        'php6',
        'py',
        'pyc',
        'pyo',
        'pcgi',
        'pcgi3',
        'pcgi4',
        'pcgi5',
        'pchi6',
    ];

    public function __get($var)
    {
        switch ($var) {
            case 'context':
                return Application::i()->activePackage;
                break;
            case 'view':
                return $this->context->view;
                break;
            case 'rootDir':
                return realpath($this->context->filesDir);
                break;
            case 'rootURL':
                return '/' . $this->context->filesURL;
                break;
        }
    }

    /**
     * Обработка запроса
     * @return array
     */
    public function process(): array
    {
        try {
            $path = $this->getPath($_GET['path'] ?? '');
            $action = (string)($_GET['action'] ?? '');
            switch ($action) {
                case 'mkdir':
                    $result = $this->makeDir($path);
                    break;
                case 'delete':
                    $result = $this->delete($path);
                    break;
                case 'rename':
                    $result = $this->rename($path);
                    break;
                case 'move':
                    $result = $this->move($path);
                    break;
                case 'upload':
                    $result = $this->upload($path);
                    break;
                default:
                    $result = $this->pathInfo($path, true);
                    break;
            }
            return ['result' => $result];
        } catch (Exception $e) {
            http_response_code($e->getCode());
            return ['error' => [
                'code' => $e->getCode(),
                'message' => $this->view->_($e->getMessage()),
            ]];
        }
        return ['filemanager' => true];
    }


    /**
     * Получает рабочий путь
     * @param string $rawPath "Сырой" путь
     * @return string
     * @throws Exception Если путь не найден или запрещен
     */
    public function getPath(string $rawPath): string
    {
        $rawPath = trim($rawPath, '/');
        if (!$rawPath) {
            throw new Exception('PATH_NOT_FOUND', 404);
        }
        $rawPath = str_replace('\\', '/', $rawPath);
        if (preg_match('/(^|\\/)\\.\\.(\\/|$)/umis', $rawPath)) {
            throw new Exception('UPPER_DIRS_NOT_ALLOWED', 403);
        }
        if (!preg_match('/^(file|image)(\\/|$)/umis', $rawPath)) {
            throw new Exception('PATH_NOT_FOUND', 403);
        }
        if (preg_match('/\\/\\./umis', $rawPath)) {
            throw new Exception('ACCESS_DENIED', 403);
        }
        $path = realpath($this->rootDir . '/' . $rawPath);
        if (!$path || !file_exists($path)) {
            throw new Exception('PATH_NOT_FOUND', 404);
        }
        if (in_array(pathinfo($path, PATHINFO_EXTENSION), static::$deniedExts)) {
            throw new Exception('ACCESS_DENIED', 403);
        }
        return $path;
    }




    /**
     * Получает информацию о пути
     * @param string $path Путь
     * @param bool $extended Расширенное представление (с URL и дочерними элементами для папок)
     * @return array
     */
    public function pathInfo(string $path, bool $extended = false): array
    {
        $entryType = is_dir($path) ? 'dir' : 'file';
        $result = [
            'type' => $entryType,
            'name' => basename($path),
            'datetime' => date('Y-m-d H:i:s', filemtime($path)),
        ];
        if ($extended) {
            $relPath = File::relpath($this->rootDir, $path);
            $relPath = str_replace('\\', '/', $relPath);
            $relPath = trim($relPath, '/');
            $url = $this->rootURL . '/' . $relPath;
            $result['url'] = $url;
        }
        if ($entryType == 'file') {
            $result['size'] = filesize($path);
        }
        if (is_dir($path)) {
            if ($extended) {
                $glob = glob($path . '/*');
                $glob = array_filter($glob, function ($childPath) {
                    if ($childPath[0] == '.') {
                        return false;
                    }
                    if (is_file($childPath) && in_array(pathinfo($childPath, PATHINFO_EXTENSION), static::$deniedExts)) {
                        return false;
                    }
                    return true;
                });
                $glob = array_values($glob);
                $children = array_map(fn ($childPath) => $this->pathInfo($childPath), $glob);
                $result['children'] = $children;
            } else {
                $result['hasSubfolders'] = $this->dirHasSubfolders($path);
            }
        }

        return $result;
    }


    /**
     * Создает папку
     * @param string $path Путь
     * @return array Данные по созданной папке
     * @throws Exception Если не удалось создать
     */
    public function makeDir(string $path): array
    {
        if ($_SERVER['REQUEST_METHOD'] != 'POST') {
            throw new Exception('METHOD_NOT_ALLOWED', 405);
        }
        if (!is_dir($path)) {
            throw new Exception('PATH_IS_NOT_DIR', 400);
        }
        $dirName = (string)($_POST['name'] ?? '');
        $dirPath = $this->validateName($path, $dirName, true);

        if (file_exists($dirPath)) {
            throw new Exception('DIR_OR_FILE_ALREADY_EXISTS', 403);
        }
        $result = mkdir($dirPath, 0777);
        if (!$result) {
            throw new Exception('CANNOT_CREATE_DIR', 500);
        }
        return $this->pathInfo($dirPath, true);
    }


    /**
     * Удаляет папку
     * @param string $path Путь
     * @return true Если успешно удалено
     * @throws Exception Если не удалось удалить
     */
    public function delete(string $path): bool
    {
        if ($_SERVER['REQUEST_METHOD'] != 'POST') {
            throw new Exception('METHOD_NOT_ALLOWED', 405);
        }
        if (is_dir($path)) {
            if (glob($path . '/*')) {
                throw new Exception('CANNOT_DELETE_DIR_NOT_EMPTY', 403);
            }
            $result = rmdir($path);
        } else {
            $result = unlink($path);
        }
        if (!$result) {
            throw new Exception('ACCESS_DENIED', 403);
        }
        return true;
    }


    /**
     * Переименовывает файл или папку
     * @param string $path Путь
     * @return array Данные файла или папки
     * @throws Exception Если не удалось переименовать
     */
    public function rename(string $path): array
    {
        if ($_SERVER['REQUEST_METHOD'] != 'POST') {
            throw new Exception('METHOD_NOT_ALLOWED', 405);
        }
        $relPath = trim(File::relpath($this->rootDir, $path), '/');
        $relArr = explode('/', $relPath);
        if (count($relArr) <= 1) {
            throw new Exception('CANNOT_RENAME_OR_MOVE_ROOT_DIR', 403);
        }
        $newName = (string)($_POST['name'] ?? '');
        $newPath = $this->validateName(dirname($path), $newName, true);
        $result = rename($path, $newPath);
        if (!$result) {
            throw new Exception('ACCESS_DENIED', 403);
        }
        return $this->pathInfo($newPath, true);
    }


    /**
     * Переносит файл или папку
     * @param string $path Путь
     * @return array Данные файла или папки
     * @throws Exception Если не удалось перенести
     */
    public function move(string $path): array
    {
        if ($_SERVER['REQUEST_METHOD'] != 'POST') {
            throw new Exception('METHOD_NOT_ALLOWED', 405);
        }
        $relPath = trim(File::relpath($this->rootDir, $path), '/');
        $relArr = explode('/', $relPath);
        if (count($relArr) <= 1) {
            throw new Exception('CANNOT_RENAME_OR_MOVE_ROOT_DIR', 403);
        }
        $newPath = $this->getPath($_POST['to'] ?? '');
        if (!is_dir($newPath)) {
            throw new Exception('TARGET_PATH_IS_NOT_DIR', 400);
        }
        $newFilePath = $newPath . '/' . basename($path);
        $result = rename($path, $newFilePath);
        if (!$result) {
            throw new Exception('ACCESS_DENIED', 403);
        }
        return $this->pathInfo($newFilePath, true);
    }


    /**
     * Загружает файлы в папку
     * @param string $path Путь к папке
     * @return array Данные файлов
     * @throws Exception Если не удалось загрузить ни один файл
     */
    public function upload(string $path): array
    {
        if ($_SERVER['REQUEST_METHOD'] != 'POST') {
            throw new Exception('METHOD_NOT_ALLOWED', 405);
        }
        // @todo
        throw new Exception('NOT_IMPLEMENTED', 501);
    }


    /**
     * Проверяет и бьютифицирует название новой папки/файла
     * @param string $path Родительский путь
     * @param string $name Название папки/файла
     * @param bool $isDir Является ли папкой
     * @return string Полный путь
     * @throws Exception
     */
    public function validateName(string $path, string $name, bool $isDir): string
    {
        if (!$name) {
            throw new Exception($isDir ? 'DIRNAME_REQUIRED' : 'FILENAME_REQUIRED', 400);
        }
        if (preg_match('/(\\\\|\\/|\\+|\\:)/umis', $name)) {
            throw new Exception('INVALID_DIR_OR_FILE_NAME', 400);
        }
        if ($name[0] == '.') {
            throw new Exception('INVALID_DIR_OR_FILE_NAME', 403);
        }
        if (in_array(pathinfo($name, PATHINFO_EXTENSION), static::$deniedExts)) {
            throw new Exception('ACCESS_DENIED', 403);
        }
        $name = trim($name, '.');
        $arr = explode('.', $name);
        $arr = array_map(fn ($x) => Text::beautify($x), $arr);
        $arr = array_values(array_filter($arr));
        $name = implode('.', $arr);

        $result = $path . '/' . $name;
        return $result;
    }


    /**
     * Проверяет что папка имеет дочерние папки
     * @param string $path Путь к папке
     * @return bool
     */
    protected function dirHasSubfolders(string $path): bool
    {
        if (!is_dir($path)) {
            return false;
        }
        $iterator = new DirectoryIterator($path);
        foreach ($iterator as $fileinfo) {
            if (!$fileinfo->isDot() && $fileinfo->isDir()) {
                return true; // Найден хотя бы один элемент
            }
        }
        return false;
    }
}
