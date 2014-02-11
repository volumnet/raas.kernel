<?php
namespace RAAS;

final class Update
{
    const ERR_NOFILE = 0x1;
    const ERR_INVALIDFILE = 0x2;
    const ERR_NOPACKAGEINSTALLED = 0x4;
    const ERR_DEPRECATED = 0x8;
    
    const packageFile = 'classes/package.class.php';
    const moduleFile = 'classes/module.class.php';
    const applicationFile = 'classes/application.class.php';
    
    private $errors = 0;
    private $file = '';
    private $archive;
    
    private $namespace;
    private $_systemDirCache;
    
    private $versionTime;
    private $description;
    private $moduleName;
    
    public function __get($var)
    {
        if ($var == 'errors') {
            return $this->errors;
        } elseif ($this->file) {
            switch ($var) {
                case 'file': case 'moduleName': case 'description': case 'archive':
                    return $this->$var;
                    break;
                case 'languageFile':
                    return 'languages/' . Application::i()->view->language . '.ini';
                    break;
                case 'updateScriptFile':
                    return 'resources/update.inc.php';
                    break;
                case 'versionTime':
                    return $this->versionTime;
                    break;
                case 'version':
                    return date('Y-m-d', $this->versionTime);
                    break; 
                case 'module':
                    $m = str_replace('\\', '.', trim(str_replace('RAAS', '', $this->namespace), '\\'));
                    if (!$m) {
                        $m = '/';
                    }
                    return $m;
                    break;
                case 'preContext':
                    if ($this->module == '/') {
                        return '/';
                    } elseif (strstr($this->module, '.')) {
                        list($p, $m) = explode('.', strtolower($this->module));
                        return array('p' => trim($p), 'm' => trim($m));
                    } else {
                        return array('p' => strtolower($this->module));
                    }
                    break;
                case 'Context':
                    if ($this->preContext == '/') {
                        return Application::i();
                    } elseif (isset($this->preContext['p'], $this->preContext['m'])) {
                        if (isset(Application::i()->packages[$this->preContext['p']]->modules[$this->preContext['m']])) {
                            return Application::i()->packages[$this->preContext['p']]->modules[$this->preContext['m']];
                        }
                    } elseif (isset($this->preContext['p'])) {
                        if (isset(Application::i()->packages[$this->preContext['p']])) {
                            return Application::i()->packages[$this->preContext['p']];
                        }
                    }
                    return null;
                    break;
                case 'systemDir':
                    if (!$this->_systemDirCache) {
                        if ($this->Context) {
                            $this->_systemDirCache = $this->Context->systemDir;
                        } elseif (isset($this->preContext['p'], $this->preContext['m'])) {
                            $this->_systemDirCache = Application::i()->modulesDir . '/' . strtolower($this->preContext['p']) . '/' . strtolower($this->preContext['m']);
                        } elseif (isset($this->preContext['p'])) {
                            $this->_systemDirCache = Application::i()->modulesDir . '/' . strtolower($this->preContext['p']) . '/common';
                        }
                    }
                    return $this->_systemDirCache;
                    break;
            }
        }
        return null;
    }
    
    public function __construct($file)
    {
        if (!is_file($file)) {
            $this->errors |= self::ERR_NOFILE;
            return;
        }
        $archive = new \SOME\ZipArchive();
        if ($archive->open($file) !== true) {
            $this->errors |= self::ERR_INVALIDFILE;
            return;
        }
        $this->file = $file;
        $this->archive = $archive;
        if (!$this->parse()) {
            $this->errors |= self::ERR_INVALIDFILE;
            return;
        }
        $this->getErrors();
    }
    
    private function parse()
    {
        // Определяем namespace и версию
        if ($txt = $this->archive->getFromName(self::applicationFile)) {
            $f = self::applicationFile;
        } elseif ($txt = $this->archive->getFromName(self::packageFile)) {
            $f = self::packageFile;
        } elseif ($txt = $this->archive->getFromName(self::moduleFile)) {
            $f = self::moduleFile;
        } else {
            return false;
        }
        if (preg_match('/\\s+namespace +([\\w+\\\\]+);\\s+/i', $txt, $regs)) {
            $this->namespace = $regs[1];
        } else {
            return false;
        }
        if (preg_match('/\\s+const +version += +(\'|")(\\d{4}-\\d{2}-\\d{2})(\'|");\\s+/i', $txt, $regs)) {
            $this->versionTime = strtotime($regs[2]);
        } elseif ($stat = $this->archive->statName($f)) {
            $this->versionTime = $stat['mtime'];
        } else {
            return false;
        }
        
        // Определяем наименование и описание
        if ($txt = $this->archive->getFromName($this->languageFile)) {
            $ini = parse_ini_string($txt);
            if (isset($ini['__NAME'])) {
                $this->moduleName = trim($ini['__NAME']);
            } else {
                return false;
            }
            $this->description = isset($ini['__DESCRIPTION']) ? trim($ini['__DESCRIPTION']) : '';
        } else {
            return false;
        }
        return true;
    }
    
    private function getErrors()
    {
        // Нет пакета для модуля
        if (isset($this->preContext['m']) && isset($this->preContext['p']) && !isset(Application::i()->packages[$this->preContext['p']])) {
            $this->errors |= self::ERR_NOPACKAGEINSTALLED;
        }
        
        // Устаревшая версия обновления
        if ($this->Context && ($this->Context->versionTime >= $this->versionTime)) {
            //$this->errors |= self::ERR_DEPRECATED;
        }
        
        return $this->errors;
    }
    
    public function process()
    {
        if (!$this->getErrors() && $this->archive && $this->Context) {
            // Удаляем старую директорию контекста
            \SOME\File::unlink($this->systemDir);
            // Копируем файлы
            $this->archive->extractTo($this->systemDir);
            // Обнуляем дату установки
            $this->Context->registrySet('installDate', null);
        }
    }
    
    public function __destruct()
    {
        if ($this->file) {
            $this->archive->close();
        }
    }
}