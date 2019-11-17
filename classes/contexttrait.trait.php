<?php
/**
 * Класс трейта контекста
 */
namespace RAAS;

use ReflectionClass;
use SOME\Namespaces;

/**
 * Трейт контекста
 */
trait ContextTrait
{
    /**
     * Содержимое файла composer.json
     * @var array
     */
    protected $composerData = [];

    /**
     * Получает стандартную переменную контекста
     */
    public function getCommonContextVar($var)
    {
        switch ($var) {
            case 'application':
                return Application::i();
                break;
            case 'composer':
                if (!$this->composerData) {
                    $composerFile = $this->systemDir . '/composer.json';
                    if (is_file($composerFile)) {
                        $this->composerData = (array)json_decode(
                            file_get_contents($composerFile),
                            true
                        );
                    }
                }
                return $this->composerData;
                break;
            case 'phpVersionCompatible':
                if (!$this->composer['require']['php']) {
                    return true;
                }
                $requiredPHPVersion = preg_replace(
                    '/^.*?(\\d)/umi',
                    '$1',
                    $this->composer['require']['php']
                );
                $verCmp = version_compare($requiredPHPVersion, phpversion());
                return ($verCmp <= 0);
                break;
            case 'missedExt':
                if (!$this->composer['require']) {
                    return [];
                }
                $requiredExt = array_filter(
                    array_keys($this->composer['require']),
                    function ($x) {
                        return preg_match('/^ext-/umi', $x);
                    }
                );
                $requiredExt = array_map(function ($x) {
                    return preg_replace('/^ext-/umi', '', $x);
                }, $requiredExt);
                $extLoaded = array_map('trim', get_loaded_extensions());
                $extLoaded = array_values($extLoaded);
                $diff = array_diff($requiredExt, $extLoaded);
                return array_values($diff);
                break;
            case 'isCompatible':
                return $this->phpVersionCompatible && !$this->missedExt;
                break;
            case 'version':
            case 'versionName':
                $key = ($var == 'version' ? 'version' : 'description');
                if ($val = $this->composer[$key]) {
                    return $val;
                }
                break;
            case 'systemDir':
                $reflector = new ReflectionClass(static::class);
                return realpath(dirname($reflector->getFileName()) . '/..');
                break;
            case 'classesDir':
                return $this->systemDir . '/classes';
                break;
            case 'languagesDir':
                return $this->systemDir . '/languages';
                break;
            case 'publicDir':
                return $this->systemDir . '/public';
                break;
            case 'resourcesDir':
                return $this->systemDir . '/resources';
                break;
            case 'installFile':
                return $this->resourcesDir . '/install.' . Application::i()->dbtype . '.sql';
                break;
            case 'levels':
                return Level::getSet(['where' => [["m = ?", $this->mid]]]);
                break;
            case 'defaultLevel':
                $l = $this->registryGet('defaultLevel');
                $L = new Level((int)$l);
                if (($L instanceof Level) &&
                    (get_class($L->Context) == get_class($this))
                ) {
                    return $L;
                } else {
                    return (int)$l;
                }
                break;
            case 'hasRights':
                return method_exists($this->controller, 'rights');
                break;
            case 'mid':
                $ns = str_replace('\\', '.', Namespaces::getNS(static::class, 1));
                return strtolower($ns);
                break;
            case 'updater':
                $ns = Namespaces::getNS($this);
                $classname = $ns . '\\Updater';
                if (class_exists($classname)) {
                    $u = new $classname($this);
                    return $u;
                }
                break;
            case 'controller':
                $classname = Namespaces::getNS(static::class) . '\\'
                   . Namespaces::getClass(Application::i()->controller);
                return $classname::i();
                break;
            case 'view':
                return $this->controller->view;
                break;
        }
    }
}
