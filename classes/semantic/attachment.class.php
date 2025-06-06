<?php
/**
 * @package RAAS
 */
declare(strict_types=1);

namespace RAAS;

use SOME\Namespaces;
use SOME\SOME;
use SOME\Text;
use SOME\Thumbnail;
use RAAS\IContext;

/**
 * Вложение
 * @property-read IContext $model Контекст-модель
 * @property-read string $dirpath Путь к папке, где размещается файл
 * @property-read string $dirURL URL папки, где размещается файл
 * @property-read string $ext Расширение реального файла
 * @property-read string $fileURL URL файла
 * @property-read string $tnURL URL стандартного эскиза, описанного около квадрата
 * @property-read string $smallURL URL стандартного эскиза, вписанного в квадрат
 * @property-read string $file Путь к файлу
 * @property-read string $tn Путь к стандартному эскизу, описанному около квадрата
 * @property-read string $small Путь к стандартному эскизу, вписанному в квадрат
 * @property SOME $parent Родительский объект
 */
class Attachment extends SOME
{
    /**
     * Стандартный размер эскиза
     */
    const tnsize = 300;

    protected static $tablename = 'attachments';

    protected static $objectCascadeDelete = true;

    protected static $cognizableVars = ['parent'];

    public function __get($var)
    {
        switch ($var) {
            case 'model':
                if ($this->classname) {
                    $NS = Namespaces::getNSArray($this->classname);
                    switch (count($NS)) {
                        case 3:
                            $classname = implode('\\', $NS) . '\\Module';
                            break;
                        case 2:
                            $classname = implode('\\', $NS) . '\\Package';
                            break;
                        default:
                            $classname = '\\RAAS\\Application';
                            break;
                    }
                    if (class_exists($classname)) {
                        return $classname::i();
                    }
                }
                return Application::i();
                break;
            case 'dirpath':
                return $this->model->filesDir;
                break;
            case 'dirURL':
                return $this->model->filesURL;
                break;
            case 'ext':
                return pathinfo((string)$this->realname, PATHINFO_EXTENSION);
                break;
            case 'fileURL':
                if (!$this->realname) {
                    return false;
                }
                return $this->dirURL . '/' . $this->realname;
                break;
            case 'tnURL':
                if (!$this->image) {
                    return false;
                }
                if (stristr((string)$this->mime, 'svg')) {
                    return $this->fileURL;
                }
                return $this->dirURL . '/' . pathinfo((string)$this->realname, PATHINFO_FILENAME) . '_tn.jpg';
                break;
            case 'smallURL':
                if (!$this->image) {
                    return false;
                }
                if (stristr((string)$this->mime, 'svg')) {
                    return $this->fileURL;
                }
                return $this->dirURL . '/' . pathinfo((string)$this->realname, PATHINFO_FILENAME) . '_small.'
                    . $this->ext;
                break;
            case 'file':
                if (!$this->realname) {
                    return false;
                }
                return $this->dirpath . '/' . $this->realname;
                break;
            case 'tn':
                if (!$this->image) {
                    return false;
                }
                return $this->dirpath . '/' . pathinfo((string)$this->realname, PATHINFO_FILENAME) . '_tn.jpg';
                break;
            case 'small':
                if (!$this->image) {
                    return false;
                }
                return $this->dirpath . '/' .
                    pathinfo((string)$this->realname, PATHINFO_FILENAME) . '_small.' .
                    $this->ext;
                break;
            default:
                return parent::__get($var);
                break;
        }
    }


    public function __set($var, $val)
    {
        switch ($var) {
            case 'parent':
                if ($val instanceof SOME) {
                    $this->classname = get_class($val);
                    $this->pid = $val->_id;
                }
                break;
            default:
                return parent::__set($var, $val);
                break;
        }
    }


    public function commit()
    {
        if ($this->upload && is_file($this->upload)) {
            $this->deleteFile();
            if ($this->image && !stristr((string)$this->mime, 'svg')) {
                $this->uploadImage();
                $this->createThumbnail();
            } else {
                $this->realname = $this->getUniqueFilename();
                $this->uploadFile();
            }
            parent::commit();
            $this->upload = null;
        } elseif ($this->filename && $this->touchFile) {
            $this->realname = $this->getUniqueFilename();
            parent::commit();
            touch($this->file);
            $this->touchFile = false;
        }
    }


    public static function batchDelete(array $items)
    {
        static::batchDeleteFiles($items);
        parent::batchDelete($items);
    }


    /**
     * Проверяет, есть ли другие вложения, использующие те же файлы
     * @param self[] $items Вложения для удаления
     * @return array <pre><code>array<string[] Имя файла => string Имя файла></code></pre> Поля realname для вложений,
     *     использующих те же файлы
     */
    public static function checkSharedFiles(array $items): array
    {
        if (!$items) {
            return [];
        }
        $sqlQuery = "SELECT DISTINCT(realname)
                       FROM " . static::_tablename()
                  . " WHERE realname IN (" . implode(", ", array_fill(0, count($items), "?")) . ")
                        AND id NOT IN (" . implode(", ", array_fill(0, count($items), "?")) . ")";
        $sqlBind = array_merge(
            array_map(function ($x) {
                return $x->realname;
            }, $items),
            array_map(function ($x) {
                return (int)$x->id;
            }, $items)
        );
        $sqlResult = static::_SQL()->getcol([$sqlQuery, $sqlBind]);
        $result = [];
        foreach ($sqlResult as $sqlValue) {
            $result[$sqlValue] = $sqlValue;
        }
        return $result;
    }


    /**
     * Удаляет файлы у группы вложений
     * @param self[] $items Вложения для удаления
     */
    public static function batchDeleteFiles(array $items)
    {
        // 2022-12-27, AVS: сделал дополнительную проверку на существование других вложений, ссылающихся на данный файл
        // Если они обнаружены, файл не удаляется
        // (хотя такого быть не должно, практика показывает что такое встречается)
        $checkShared = static::checkSharedFiles($items);
        foreach ($items as $item) {
            // 2025-03-05, AVS: заменил, т.к. должно проверяться по каждому файлу (было в целом)
            if (isset($checkShared[(string)$item->realname])) {
                continue;
            }
            if (is_file($item->dirpath . '/' . $item->realname)) {
                unlink($item->dirpath . '/' . $item->realname);
            }
            if ($item->image) {
                if (is_file($item->tn)) {
                    unlink($item->tn);
                }
                if (is_file($item->small)) {
                    unlink($item->small);
                }
                if ($item->realname) {
                    $pathinfo = pathinfo((string)$item->realname);
                    $glob = glob($item->dirpath . '/' . $pathinfo['filename'] . '.*.' . $pathinfo['extension']);
                    foreach ($glob as $val) {
                        if (is_file($val)) {
                            unlink($val);
                        }
                    }
                }
            }
        }
    }


    /**
     * Удаляет файлы вложения
     */
    protected function deleteFile()
    {
        static::batchDeleteFiles([$this]);
    }


    /**
     * Загружает файл вложения
     */
    protected function uploadFile()
    {
        if ($this->copy) {
            copy($this->upload, $this->file);
        } else {
            rename($this->upload, $this->file);
        }
        chmod($this->file, 0777);
    }


    /**
     * Загружает изображение
     */
    protected function uploadImage()
    {
        $type = @getimagesize($this->upload);
        $types = [
            IMAGETYPE_GIF => 'gif',
            IMAGETYPE_JPEG => 'jpg',
            IMAGETYPE_PNG => 'png',
            IMAGETYPE_WEBP => 'webp',
        ];
        if (!($type && isset($type[2]) && isset($types[$type[2]]))) {
            return false;
        }
        $this->mime = image_type_to_mime_type($type[2]);
        // 2020-03-10, AVS: Заменил pathinfo, т.к. некорректно работает
        // с русскими буквами
        $filenameWOext = preg_replace('/\\.\\w+$/umi', '', (string)$this->filename);
        $this->filename = $filenameWOext . '.' . $types[$type[2]];
        $this->realname = $this->getUniqueFilename();
        if (($this->maxWidth && ($this->maxWidth < $type[0])) ||
            ($this->maxHeight && ($this->maxHeight < $type[1]))
        ) {
            Thumbnail::make(
                $this->upload,
                $this->file,
                $this->maxWidth ? $this->maxWidth : INF,
                $this->maxHeight ? $this->maxHeight : -1
            );
            if (!$this->copy) {
                unlink($this->upload);
            }
            chmod($this->file, 0777);
        } else {
            $this->uploadFile();
        }
    }


    /**
     * Создает эскизы изображения
     */
    public function createThumbnail()
    {
        if (is_file($this->file) && $this->image) {
            $tnSize = $this->tnsize ?: self::tnsize;
            Thumbnail::make($this->file, $this->tn, $tnSize, -1, Thumbnail::THUMBNAIL_CROP, true);
            if (is_file($this->tn)) {
                chmod($this->tn, 0777);
            }
            Thumbnail::make($this->file, $this->small, $tnSize, -1, Thumbnail::THUMBNAIL_FRAME, true);
            if (is_file($this->small)) {
                chmod($this->small, 0777);
            }
        }
    }


    /**
     * Чистит "потерянные" вложения (у которых нет файлов)
     */
    public static function clearLostAttachments()
    {
        $Set = static::getSet();
        foreach ($Set as $row) {
            if (!is_file($row->file)) {
                $old_file = Application::i()->filesDir . '/' . $row->realname;
                if (is_file($old_file)) {
                    rename($old_file, $row->file);
                } else {
                    static::delete($row);
                }
            }
            if ($row->image) {
                if ($row->tn && !is_file($row->tn)) {
                    $old_file = Application::i()->filesDir . '/' .
                        pathinfo((string)$row->realname, PATHINFO_FILENAME) . '_tn.jpg';
                    if (is_file($old_file)) {
                        rename($old_file, $row->tn);
                    } else {
                        $row->createThumbnail();
                    }
                }
                if ($row->small && !is_file($row->small)) {
                    $old_file = Application::i()->filesDir . '/' .
                        pathinfo((string)$row->realname, PATHINFO_FILENAME) .
                        '_small.' . $row->ext;
                    if (is_file($old_file)) {
                        rename($old_file, $row->small);
                    } else {
                        $row->createThumbnail();
                    }
                }
                // 2015-02-09, AVS: закомментировал
                // $row->createThumbnail();
            }
        }
    }


    /**
     * Чистит "потерянные" файлы вложений (для которых нет вложений)
     * @param string $dirname Путь к папке, где чистить
     */
    public static function clearLostFiles($dirname = null)
    {
        if (!$dirname) {
            $dirname = Application::i()->filesDir;
        }
        $Set = static::getSet();
        $temp = [];
        foreach ($Set as $row) {
            if (is_file($row->file)) {
                $temp[] = preg_replace(
                    '/\\.\\w+$/umi',
                    '',
                    realpath((string)$row->file)
                );
            }
        }
        $Set = $temp;
        $temp = glob($dirname . '/*');
        $temp = array_filter($temp, 'is_file');
        $temp = array_map('realpath', $temp);
        $toDelete = [];
        foreach ($temp as $val) {
            $file = preg_replace('/\\.\\w+$/umi', '', realpath((string)$val));
            $file = preg_replace('/_(small|tn)$/umi', '', $file);
            if (!in_array($file, $Set)) {
                $toDelete[] = $val;
            }
        }
        foreach ($toDelete as $val) {
            if (is_file($val)) {
                unlink($val);
            }
        }
    }


    /**
     * Возвращает родительский объект
     * @return SOME
     */
    protected function _parent()
    {
        $classname = $this->classname;
        if (class_exists($classname)) {
            return new $classname((int)$this->pid);
        }
        return null;
    }


    /**
     * Получает уникальное имя файла (которого еще нет, на основе загружаемого)
     * @param bool $ignoreExtension Считать существующим имя при наличии файла
     *     с таким именем и любым расширением (false - только с таким же)
     * @return string Сгенерированное имя
     */
    protected function getUniqueFilename($ignoreExtension = true): string
    {
        // 2020-03-10, AVS: Заменил pathinfo, т.к. некорректно работает с русскими буквами
        // 2023-05-02, AVS: убрал $initialFilename = $this->realname, т.к. иначе проблематично поменять имя уже загруженного файла
        // if ($this->realname) {
        //     $initialFilename = $this->realname;
        // } else {
            $initialFilename = (string)$this->filename;
        // }
        $filenameWOext = preg_replace('/\\.\\w+$/umi', '', $initialFilename);
        $filename = Text::beautify($filenameWOext);
        $ext = Text::beautify(pathinfo((string)$this->filename, PATHINFO_EXTENSION));
        for ($i = 0; glob($this->dirpath . '/' . $filename . '.' . ($ignoreExtension ? '*' : $ext)); $i++) {
            $filename = Application::i()->getNewURN($filename, !$i);
        }
        return $filename . '.' . $ext;
    }


    /**
     * Создает вложение из файла
     * @param string $filename Файл, из которого нужно создать вложение
     * @param ?SOME $parentField Родительский объект
     * @param int $maxSize Максимальный размер полноразмерного изображения
     * @param int $tnSize Размер эскиза
     * @param string $mime MIME-тип вложения
     */
    public static function createFromFile(
        string $filename,
        ?SOME $parentField = null,
        int $maxSize = 1920,
        int $tnSize = 300,
        string $mime = 'application/octet-stream'
    ) {
        $att = new static();
        $basename = basename($filename);
        $basenameWOExt = pathinfo((string)$filename, PATHINFO_FILENAME);
        $oldExt = pathinfo((string)$filename, PATHINFO_EXTENSION);
        if (!is_file($filename)) {
            $text = file_get_contents($filename);
            if (!$text) {
                return false;
            }
            $att->upload = tempnam(sys_get_temp_dir(), 'raas');
            file_put_contents($att->upload, $text);
        } else {
            $att->copy = true;
            $att->upload = $filename;
        }
        $att->filename = $basename;

        if ($newMime = @mime_content_type($filename)) {
            $att->mime = $newMime;
        } else {
            $att->mime = $mime;
        }

        $type = getimagesize($att->upload);
        if ($type) {
            $newExt = image_type_to_extension($type[2], false);
            $newExt = strtolower($newExt);
            if (in_array($newExt, ['jpeg', 'pjpeg'])) {
                $newExt = 'jpg';
            }
            if (in_array($newExt, ['jpg', 'png', 'gif', 'webp'])) {
                $att->filename = $basenameWOExt . '.' . $newExt;
                $att->mime = image_type_to_mime_type($type[2]);
                $att->image = 1;
                $att->maxWidth = $att->maxHeight = $maxSize;
                $att->tnsize = $tnSize;
            }
        }
        if ($parentField) {
            $att->parent = $parentField;
        }
        $att->commit();
        return $att;
    }
}
