<?php

namespace RAAS;

use DirectoryIterator;
use Exception;
use SOME\File;
use SOME\Text;
use SOME\Thumbnail;

/**
 * Файловый менеджер
 * @property-read IContext $context Текущий контекст приложения
 */
class FileManager
{
    /**
     * Режим отладки (без проверки на то что файлы реально были загружены)
     */
    public bool $debug = false;

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
        'optipic-orig',
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
            case 'rootUrl':
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
            if (in_array($action, ['mkdir', 'delete', 'rename', 'move', 'upload']) &&
                (($_SERVER['REQUEST_METHOD'] ?? '') != 'POST')
            ) {
                throw new Exception('FILEMANAGER_METHOD_NOT_ALLOWED', 405);
            }
            switch ($action) {
                case 'mkdir':
                    $dirName = (string)($_POST['name'] ?? '');
                    $result = $this->makeDir($path, $dirName);
                    break;
                case 'delete':
                    $result = $this->delete($path);
                    break;
                case 'rename':
                    $newName = (string)($_POST['name'] ?? '');
                    $result = $this->rename($path, $newName);
                    break;
                case 'move':
                    $newPath = $this->getPath($_POST['to'] ?? '');
                    $result = $this->move($path, $newPath);
                    break;
                case 'upload':
                    $files = FileDatatypeStrategy::i()->getFilesData('files', false, false, $_FILES);
                    // var_dump($_FILES, $files);
                    $result = $this->upload($path, $files);
                    break;
                default:
                    $result = $this->pathInfo($path, true);
                    break;
            }
            return ['result' => $result];
        } catch (Exception $e) {
            // @codeCoverageIgnoreStart
            if (!$this->debug) {
                http_response_code($e->getCode());
            }
            // @codeCoverageIgnoreEnd
            return ['error' => [
                'code' => $e->getCode(),
                'message' => $this->view->_($e->getMessage()),
            ]];
        }
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
            throw new Exception('FILEMANAGER_PATH_NOT_FOUND', 404);
        }
        $rawPath = str_replace('\\', '/', $rawPath);
        if (preg_match('/(^|\\/)\\.\\.(\\/|$)/umis', $rawPath)) {
            throw new Exception('FILEMANAGER_UPPER_DIRS_NOT_ALLOWED', 403);
        }
        if (!preg_match('/^(file|image)(\\/|$)/umis', $rawPath)) {
            throw new Exception('FILEMANAGER_PATH_NOT_FOUND', 404);
        }
        if (preg_match('/\\/\\./umis', $rawPath)) {
            throw new Exception('ACCESS_DENIED', 403);
        }
        $path = realpath($this->rootDir . '/' . $rawPath);
        if (!$path || !file_exists($path)) {
            throw new Exception('FILEMANAGER_PATH_NOT_FOUND', 404);
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
            'path' => $path,
            'datetime' => date('Y-m-d H:i:s', filemtime($path)),
            'datetimeFormatted' => date($this->view->_('DATETIMEFORMAT'), filemtime($path)),
        ];

        $relPath = File::relpath($this->rootDir, $path);
        $relPath = str_replace('\\', '/', $relPath);
        $relPath = trim($relPath, '/');
        $url = $this->rootUrl . '/' . $relPath;
        $result['path'] = $relPath;
        $result['url'] = $url . ($entryType == 'dir' ? '/' : '');

        if ($entryType == 'file') {
            $result['size'] = filesize($path);
        }
        if (is_dir($path)) {
            if ($extended) {
                $glob = glob($path . '/*');
                $glob = array_filter($glob, function ($childPath) {
                    // @codeCoverageIgnoreStart
                    // glob, предположительно, не выдает файлы, начинающиеся с '.' . На всякий случай проверку оставляю
                    if ($childPath[0] == '.') {
                        return false;
                    }
                    // @codeCoverageIgnoreEnd
                    if (is_file($childPath) && in_array(pathinfo($childPath, PATHINFO_EXTENSION), static::$deniedExts)) {
                        return false;
                    }
                    return true;
                });
                $glob = array_values($glob);
                $children = array_map(fn ($childPath) => $this->pathInfo($childPath), $glob);
                usort($children, function ($a, $b) {
                    if (($a['type'] == 'dir') && ($b['type'] != 'dir')) {
                        return -1;
                    }
                    if (($a['type'] != 'dir') && ($b['type'] == 'dir')) {
                        return 1;
                    }
                    return strnatcasecmp($a['name'], $b['name']);
                });
                $result['children'] = $children;
                $result['hasSubfolders'] = (bool)array_filter($children, fn ($child) => $child['type'] == 'dir');
            } else {
                $result['hasSubfolders'] = $this->dirHasSubfolders($path);
            }
        }

        return $result;
    }


    /**
     * Создает папку
     * @param string $path Путь
     * @param string $dirName Название папки
     * @return array Данные по созданной папке
     * @throws Exception Если не удалось создать
     */
    public function makeDir(string $path, string $dirName): array
    {
        if (!is_dir($path)) {
            throw new Exception('FILEMANAGER_PATH_IS_NOT_DIR', 400);
        }
        $dirPath = $this->validateName($path, $dirName, true);

        if (file_exists($dirPath)) {
            throw new Exception('FILEMANAGER_DIR_OR_FILE_ALREADY_EXISTS', 403);
        }
        $result = @mkdir($dirPath, 0777);
        // @codeCoverageIgnoreStart
        // Не могу воспроизвести ситуацию, когда было бы невозможно создать, т.к. название бьютифицируется
        if (!$result) {
            throw new Exception('FILEMANAGER_CANNOT_CREATE_DIR', 500);
        }
        // @codeCoverageIgnoreEnd
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
        if (is_dir($path)) {
            if (glob($path . '/*')) {
                throw new Exception('FILEMANAGER_CANNOT_DELETE_DIR_NOT_EMPTY', 403);
            }
            $result = @rmdir($path);
        } else {
            $result = @unlink($path);
        }
        if (!$result) {
            throw new Exception('ACCESS_DENIED', 403);
        }
        return true;
    }


    /**
     * Переименовывает файл или папку
     * @param string $path Путь
     * @param string $newName Новое имя
     * @return array Данные файла или папки
     * @throws Exception Если не удалось переименовать
     */
    public function rename(string $path, string $newName): array
    {
        $relPath = trim(File::relpath($this->rootDir, $path), '/');
        $relArr = explode('/', $relPath);
        if (count($relArr) <= 1) {
            throw new Exception('FILEMANAGER_CANNOT_RENAME_OR_MOVE_ROOT_DIR', 403);
        }
        $newPath = $this->validateName(dirname($path), $newName, true);
        $result = @rename($path, $newPath);
        if (!$result) {
            throw new Exception('ACCESS_DENIED', 403);
        }
        return $this->pathInfo($newPath, true);
    }


    /**
     * Переносит файл или папку
     * @param string $path Путь
     * @param string $newPath Новый путь для переноса
     * @return array Данные файла или папки
     * @throws Exception Если не удалось перенести
     */
    public function move(string $path, string $newPath): array
    {
        $relPath = trim(File::relpath($this->rootDir, $path), '/');
        $relArr = explode('/', $relPath);
        if (count($relArr) <= 1) {
            throw new Exception('FILEMANAGER_CANNOT_RENAME_OR_MOVE_ROOT_DIR', 403);
        }
        if (!is_dir($newPath)) {
            throw new Exception('FILEMANAGER_TARGET_PATH_IS_NOT_DIR', 400);
        }
        $newFilePath = $newPath . '/' . basename($path);
        $result = @rename($path, $newFilePath);
        if (!$result) {
            throw new Exception('ACCESS_DENIED', 403);
        }
        return $this->pathInfo($newFilePath, true);
    }


    /**
     * Загружает файлы в папку
     * @param string $path Путь к папке
     * @param array $files <pre><code>array<
     *     'tmp_name' => string,
     *     'name' => string,
     * ></code></pre> Данные загружаемых файлов
     * @return array Данные загруженных файлов
     * @throws Exception Если не удалось загрузить ни один файл
     */
    public function upload(string $path, array $files): array
    {
        $uploadedFiles = [];
        $isNotAnImageError = false;
        $relPath = trim(File::relpath($this->rootDir, $path), '/');
        $relArr = explode('/', $relPath);

        // var_dump($files);
        // exit;
        foreach ($files as $file) {
            $tmpName = $file['tmp_name'];
            $origName = $file['name'];
            // @codeCoverageIgnoreStart
            if (!$this->debug && !is_uploaded_file($tmpName)) {
                continue;
            }
            // @codeCoverageIgnoreEnd
            $ext = pathinfo($origName, PATHINFO_EXTENSION);
            $imgSize = getimagesize($tmpName);
            if (($relArr[0] == 'image') && !$imgSize && ($ext != 'svg')) {
                $isNotAnImageError = true;
                continue;
            }

            // var_dump($file);
            if ($imgSize && in_array($imgSize[2], [IMAGETYPE_GIF, IMAGETYPE_PNG, IMAGETYPE_JPEG, IMAGETYPE_WEBP])) {
                $origNameWOExt = pathinfo($origName, PATHINFO_FILENAME);
                $newExt = image_type_to_extension($imgSize[2], false);
                $newExt = strtolower($newExt);
                if ($newExt == 'jpeg') {
                    $newExt = 'jpg';
                }
                $newPath = $this->validateName($path, $origNameWOExt . '.' . $newExt, false, true);
                $maxSize = (int)Application::i()->context->registryGet('maxsize');
                if ($maxSize && (($maxSize < $imgSize[0]) || ($maxSize < $imgSize[1]))) {
                    Thumbnail::make($tmpName, $newPath, $maxSize ?: INF, $maxSize ?: -1);
                    // @codeCoverageIgnoreStart
                    if (!$this->debug) {
                        unlink($tmpName);
                    }
                    // @codeCoverageIgnoreEnd
                } elseif ($this->debug) {
                    copy($tmpName, $newPath);
                    // @codeCoverageIgnoreStart
                } else {
                    move_uploaded_file($tmpName, $newPath);
                }
                // @codeCoverageIgnoreEnd
            } else {
                $newPath = $this->validateName($path, $origName, false, true);
                if ($this->debug) {
                    copy($tmpName, $newPath);
                    // @codeCoverageIgnoreStart
                } else {
                    move_uploaded_file($tmpName, $newPath);
                }
                // @codeCoverageIgnoreEnd
            }
            chmod($newPath, 0777);
            if (is_file($newPath)) {
                $uploadedFiles[] = $newPath;
            }
        }
        if (count($uploadedFiles) != count($files)) {
            if (count($files) == 1 && $isNotAnImageError) {
                throw new Exception('FILEMANAGER_FILE_IS_NOT_IMAGE', 400);
            } else {
                throw new Exception('FILEMANAGER_CANNOT_UPLOAD_ONE_OR_MORE_FILES', 400);
            }
        }
        return array_map(fn ($file) => $this->pathInfo($file, true), $uploadedFiles);
    }


    /**
     * Проверяет и бьютифицирует название новой папки/файла
     * @param string $path Родительский путь
     * @param string $name Название папки/файла
     * @param bool $isDir Является ли папкой
     * @param bool $findName Найти новое имя, если это занято
     * @return string Полный путь
     * @throws Exception
     */
    public function validateName(string $path, string $name, bool $isDir, bool $findName = false): string
    {
        if (!$name) {
            throw new Exception($isDir ? 'DIRNAME_REQUIRED' : 'FILENAME_REQUIRED', 400);
        }
        if (preg_match('/(\\\\|\\/|\\+|\\:)/umis', $name)) {
            throw new Exception('FILEMANAGER_INVALID_DIR_OR_FILE_NAME', 400);
        }
        if ($name[0] == '.') {
            throw new Exception('ACCESS_DENIED', 403);
        }
        $ext = pathinfo($name, PATHINFO_EXTENSION);
        if (in_array($ext, static::$deniedExts)) {
            throw new Exception('ACCESS_DENIED', 403);
        }
        $name = trim($name, '.');
        $arr = explode('.', $name);
        $arr = array_map(fn ($x) => Text::beautify($x), $arr);
        $arr = array_values(array_filter($arr));
        $name = implode('.', $arr);
        if ($findName) {
            while (file_exists($path . '/' . $name)) {
                $chunkIndex = max(0, count($arr) - 2);
                $arr[$chunkIndex] = Application::i()->getNewURN($arr[$chunkIndex]);
                $name = implode('.', $arr);
            }
        }
        $result = $path . '/' . $name;
        return $result;
    }


    /**
     * Проверяет что папка имеет дочерние папки
     * @param string $path Путь к папке
     * @return bool
     */
    public function dirHasSubfolders(string $path): bool
    {
        if (!is_dir($path)) {
            return false;
        }
        $path = rtrim($path, '/');
        $iterator = new DirectoryIterator($path);
        foreach ($iterator as $fileinfo) {
            if (!$fileinfo->isDot() && $fileinfo->isDir()) {
                return true; // Найден хотя бы один элемент-папка
            }
        }
        return false;
    }
}
