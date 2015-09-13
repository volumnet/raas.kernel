<?php
namespace RAAS;

class Attachment extends \SOME\SOME
{
    const tnsize = 300;
    
    protected static $tablename = 'attachments';
    protected static $objectCascadeDelete = true;
    protected static $cognizableVars = array('parent');
    
    public function __get($var)
    {
        switch ($var) {
            case 'model':
                if ($this->classname) {
                    $NS = \SOME\Namespaces::getNSArray($this->classname);
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
                return pathinfo($this->realname, PATHINFO_EXTENSION);
                break;
            case 'fileURL':
                return $this->dirURL . '/' . $this->realname;
                break;
            case 'tnURL':
                if (!$this->image) {
                    return false;
                }
                return $this->dirURL . '/' . pathinfo($this->realname, PATHINFO_FILENAME) . '_tn.jpg';
                break;
            case 'smallURL':
                if (!$this->image) {
                    return false;
                }
                return $this->dirURL . '/' . pathinfo($this->realname, PATHINFO_FILENAME) . '_small.' . $this->ext;
                break;
            case 'file':
                return $this->dirpath . '/' . $this->realname;
                break;
            case 'tn':
                if (!$this->image) {
                    return false;
                }
                $pathinfo = pathinfo($this->realname);
                return $this->dirpath . '/' . pathinfo($this->realname, PATHINFO_FILENAME) . '_tn.jpg';
                break;
            case 'small':
                if (!$this->image) {
                    return false;
                }
                $pathinfo = pathinfo($this->realname);
                return $this->dirpath . '/' . pathinfo($this->realname, PATHINFO_FILENAME) . '_small.' . $this->ext;
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
                if ($val instanceof \SOME\SOME) {
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
            if ($this->image) {
                $this->uploadImage();
                $this->createThumbnail();
            } else {
                $this->realname = $this->getUniqueFilename();
                $this->uploadFile();
            }
            parent::commit();
        }
    }
    
    
    public static function delete(self $Item)
    {
        $Item->deleteFile();
        parent::delete($Item);
    }
    
    
    protected function deleteFile()
    {
        $temp = pathinfo($this->realname);
        $temp = glob($this->dirpath . '/' . $temp['filename'] . '.*.' . $temp['extension']);
        if (is_file($this->dirpath . '/' . $this->realname)) {
            unlink($this->dirpath . '/' . $this->realname);
        }
        if (is_file($this->dirpath . '/' . pathinfo($this->realname, PATHINFO_FILENAME) . '_tn.jpg')) {
            unlink($this->dirpath . '/' . pathinfo($this->realname, PATHINFO_FILENAME) . '_tn.jpg');
        }
        if (is_file($this->dirpath . '/' . pathinfo($this->realname, PATHINFO_FILENAME) . '_small.' . pathinfo($this->realname, PATHINFO_EXTENSION))) {
            unlink($this->dirpath . '/' . pathinfo($this->realname, PATHINFO_FILENAME) . '_small.' . pathinfo($this->realname, PATHINFO_EXTENSION));
        }
        foreach ($temp as $val) {
            if (is_file($val)) {
                unlink($val);
            }
        }
    }
    
    
    protected function uploadFile()
    {
        if ($this->copy) {
            copy($this->upload, $this->file);
        } else {
            rename($this->upload, $this->file);
        }
        chmod($this->file, 0777);
    }
    
    
    protected function uploadImage()
    {
        $type = @getimagesize($this->upload);
        $types = array(IMAGETYPE_GIF => 'gif', IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png');
        if (!($type && isset($type[2]) && isset($types[$type[2]]))) {
            return false;
        }
        $this->mime = image_type_to_mime_type($type[2]);
        $this->realname = $this->getUniqueFilename();
        if (($this->maxWidth && ($this->maxWidth < $type[0])) || ($this->maxHeight && ($this->maxHeight < $type[1]))) {
            \SOME\Thumbnail::make($this->upload, $this->file, $this->maxWidth ? $this->maxWidth : INF, $this->maxHeight ? $this->maxHeight : -1);
            if (!$this->copy) {
                unlink($this->upload);
            }
            chmod($this->file, 0777);
        } else {
            $this->uploadFile();
        }
    }
    
    
    public function createThumbnail()
    {
        if (is_file($this->file) && $this->image) {
            \SOME\Thumbnail::make($this->file, $this->tn, $this->tnsize ? $this->tnsize : self::tnsize, -1, \SOME\Thumbnail::THUMBNAIL_CROP, true);
            if ($this->tn) {
                chmod($this->tn, 0777);
            }
            \SOME\Thumbnail::make($this->file, $this->small, $this->tnsize ? $this->tnsize : self::tnsize, -1, \SOME\Thumbnail::THUMBNAIL_FRAME, true);
            if ($this->small) {
                chmod($this->small, 0777);
            }
        }
    }


    public static function clearLostAttachments()
    {
        $Set = static::getSet();
        foreach ($Set as $row) {
            if (!is_file($row->file)) {
                if (is_file($old_file = Application::i()->filesDir . '/' . $row->realname)) {
                    rename($old_file, $row->file);
                } else {
                    static::delete($row);
                }
            }
            if ($row->image) {
                if ($row->tn && !is_file($row->tn)) {
                    if (is_file($old_file = Application::i()->filesDir . '/' . pathinfo($row->realname, PATHINFO_FILENAME) . '_tn.jpg')) {
                        rename($old_file, $row->tn);
                    } else {
                        $row->createThumbnail();
                    }
                }
                if ($row->small && !is_file($row->small)) {
                    if (is_file($old_file = Application::i()->filesDir . '/' . pathinfo($row->realname, PATHINFO_FILENAME) . '_small.' . $row->ext)) {
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


    public static function clearLostFiles($dirname = null)
    {
        if (!$dirname) {
            $dirname = Application::i()->filesDir;
        }
        $Set = static::getSet();
        $temp = array();
        foreach ($Set as $row) {
            if (is_file($row->file)) {
                $temp[] = preg_replace('/\\.\\w+$/umi', '', realpath($row->file));
            }
        }
        $Set = $temp;
        $temp = glob($dirname . '/*');
        $temp = array_filter($temp, 'is_file');
        $temp = array_map('realpath', $temp);
        $toDelete = array();
        foreach ($temp as $val) {
            $file = preg_replace('/\\.\\w+$/umi', '', realpath($val));
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
    
    
    protected function _parent()
    {
        $classname = $this->classname;
        if (class_exists($classname)) {
            return new $classname((int)$this->pid);
        }
        return null;
    }


    protected function getUniqueFilename()
    {
        $filename = \SOME\Text::beautify(pathinfo($this->filename, PATHINFO_FILENAME));
        $ext = \SOME\Text::beautify(pathinfo($this->filename, PATHINFO_EXTENSION));
        for ($i = 0; is_file($this->dirpath . '/' . $filename . '.' . $ext); $i++) {
            $filename = Application::i()->getNewURN($filename, !$i);
        }
        return $filename . '.' . $ext;
    }
}