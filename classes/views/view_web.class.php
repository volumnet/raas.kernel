<?php
/**
 * @package RAAS
 */
declare(strict_types=1);

namespace RAAS;

use ArrayObject;
use SOME\File;

/**
 * Web-представление ядра RAAS
 * @property ArrayObject Верхнее меню, пункты в виде array('name' => 'текст ссылки', ['href' => 'ссылка', ...прочие аттрибуты тега <a...></a>...])
 * @property ArrayObject Левое меню, пункты в виде array('name' => 'текст ссылки', ['href' => 'ссылка', ...прочие аттрибуты тега <a...></a>...])
 * @property ArrayObject Строка навигации, пункты в виде array('name' => 'текст ссылки', ['href' => 'ссылка', ...прочие аттрибуты тега <a...></a>...])
 * @property-read string themeDir путь к папке темы оформления
 * @property-read string themeURL URL папки с темой оформления
 * @property-read string templateType текущая группа шаблонов
 * @property-read string publicURL URL общей папки
 * @property-read IContext_View_Web $context представление текущего пакета/модуля
 */
class View_Web extends Abstract_View implements IContext_View_Web
{
    use WidgetTrait;

    /**
     * Признак определения мобильных браузеров по регулярным выражениям в USER-AGENT
     */
    const rxMobile = '/Mobile/i';

    /**
     * Пользовательские данные
     * @var array
     */
    protected $data;

    /**
     * Справочные данные
     * @var ArrayObject
     */
    protected $content;

    /**
     * Локальные (пользовательские) ошибки
     * @var ArrayObject
     */
    protected $localError;

    /**
     * Основной шаблон содержимого
     * @var string
     */
    protected $template = '';

    /**
     * Заголовок страницы
     * @var string
     */
    protected $title;

    /**
     * Подзаголовок страницы
     * @var string
     */
    protected $subtitle;

    /**
     * Верхнее меню, пункты в виде array('name' => 'текст ссылки', ['href' => 'ссылка', ...прочие аттрибуты тега <a...></a>...])
     * @var ArrayObject
     */
    protected $menu;

    /**
     * Левое меню, пункты в виде array('name' => 'текст ссылки', ['href' => 'ссылка', ...прочие аттрибуты тега <a...></a>...])
     * @var ArrayObject
     */
    protected $submenu;

    /**
     * Контекстное меню страницы в виде array('name' => 'текст ссылки', ['href' => 'ссылка', ...прочие аттрибуты тега <a...></a>...])
     * @var ArrayObject
     */
    protected $contextmenu;

    /**
     * Строка навигации, пункты в виде array('name' => 'текст ссылки', ['href' => 'ссылка', ...прочие аттрибуты тега <a...></a>...])
     * @var ArrayObject
     */
    protected $path;

    /**
     * Набор подключаемых CSS-файлов
     * @var ArrayObject
     */
    protected $css;

    /**
     * Набор подключаемых JS-файлов после документа
     * @var ArrayObject
     */
    protected $js;

    /**
     * Набор подключаемых JS-файлов в шапке
     * @var ArrayObject
     */
    protected $head_js;

    /**
     * Начался рендеринг шаблонов
     * @var bool
     */
    protected $renderStarted = false;

    /**
     * Текущая группа шаблонов
     * @var string
     */
    private $templateType = '';

    /**
     * Текущая тема оформления
     * @var string
     */
    private $theme;

    /**
     * Имена контейнеров-массивов
     * @var array
     */
    private static $arrayContainers = [
        'data',
        'content',
        'localError',
        'css',
        'js',
        'head_js'
    ];

    /**
     * Имена контейнеров-строк
     * @var array
     */
    private static $stringContainers = ['template', 'title', 'subtitle'];

    /**
     * Экземпляр класса
     * @var View_Web
     */
    protected static $instance;

    public function __get($var)
    {
        switch ($var) {
            case 'themeDir':
                if ($this->theme) {
                    return $this->application->baseDir . '/themes/' .
                           $this->theme;
                }
                return $this->application->publicDir;
                break;

            case 'modulesURL':
                return 'modules';
                break;
            case 'themeURL':
                if ($this->theme && ($this->theme != '/')) {
                    return 'themes/' . $this->theme;
                }
                return $this->publicURL;
                break;
            case 'publicURL':
                if (stristr(Application::i()->publicDir, Application::i()->baseDir)) {
                    return mb_substr(
                        Application::i()->publicDir,
                        mb_strlen(Application::i()->baseDir)
                    );
                } elseif (Application::i()->composer['name']) {
                    return '/vendor/' . Application::i()->composer['name'] . '/public';
                } else {
                    return '/vendor/volumnet/raas.kernel/public';
                }
                break;

            case 'templateType':
            case 'data':
            case 'content':
            case 'localError':
            case 'menu':
            case 'submenu':
            case 'contextmenu':
            case 'path':
            case 'theme':
            case 'renderStarted':
                return $this->$var;
                break;
            case 'availableThemes':
                $dir = [];
                if (is_dir($this->application->baseDir . '/themes')) {
                    $dir = (array)@File::scandir(
                        $this->application->baseDir . '/themes'
                    );
                }
                $temp = ['/' => $this->_('DEFAULT_THEME')];
                foreach ($dir as $row) {
                    $filename = $this->application->baseDir . '/themes/'
                              . $row . '/theme.ini';
                    if (is_file($filename)) {
                        $arr = parse_ini_file($filename);
                        $temp[$row] = $arr[$this->language];
                    }
                }
                return $temp;
                break;
            default:
                if (in_array($var, self::$arrayContainers) ||
                    in_array($var, self::$stringContainers)
                ) {
                    return $this->$var;
                } else {
                    return parent::__get($var);
                }
                break;
        }
    }

    public function __set($var, $val)
    {
        if (in_array($var, self::$arrayContainers) ||
            in_array($var, self::$stringContainers) ||
            in_array($var, ['menu', 'submenu', 'contextmenu', 'path'])
        ) {
            $this->$var = $val;
        } else {
            switch ($var) {
                case 'theme':
                    if (isset($this->availableThemes[$val])) {
                        $this->theme = $val;
                    } else {
                        $this->theme = '';
                    }
                    break;
            }
        }
    }


    /**
     * Конструктор класса
     */
    protected function init()
    {
        foreach (self::$arrayContainers as $key) {
            $this->$key = new ArrayObject();
        }
        $this->menu = new ArrayObject();
        $this->submenu = new ArrayObject();
        $this->contextmenu = new ArrayObject();
        $this->path = new ArrayObject();
        parent::init();
    }


    /**
     * Страница проверки совместимости
     * @param array $IN входные данные
     */
    public function checkCompatibility(array $IN)
    {
        $IN['localError'] = parent::checkCompatibility($IN);
        $this->assignVars($IN);
        $this->title = $this->_('CHECK_COMPATIBILITY');
    }


    /**
     * Страница конфигурации базы данных
     * @param array $IN входные данные
     */
    public function configureDB(array $IN)
    {
        $this->assignVars($IN);
        $this->title = $IN['Form']->caption;
        $this->template = $IN['Form']->template;
    }


    /**
     * Страница проверки совместимости движка SOME
     * @param array $IN входные данные
     */
    public function checkSOME(array $IN)
    {
        $this->title = $this->_('CHECK_COMPATIBILITY');
        if ($IN['localError']) {
            $this->localError[] = $this->_('SOME_CORRUPTED');
        }
    }


    /**
     * Страница входа в систему
     * @param array $IN входные данные
     */
    public function login(array $IN)
    {
        $this->assignVars($IN);
        $this->title = $IN['Form']->caption;
        $this->template = $IN['Form']->template;
    }


    public function assignVars(array $IN = [])
    {
        if (isset($IN['localError'])) {
            foreach ($IN['localError'] as $e) {
                $this->localError[] = $this->context->_($e['description']);
            }
        }
        if (isset($IN['DATA'])) {
            $this->data = array_merge((array)$this->data, (array)$IN['DATA']);
        }
        if (isset($IN['CONTENT'])) {
            $this->content = array_merge(
                (array)$this->content,
                (array)$IN['CONTENT']
            );
        }
        unset($IN['localError'], $IN['DATA'], $IN['CONTENT']);
        $this->content = array_merge((array)$this->content, (array)$IN);
    }


    /**
     * При необходимости обрабатывает данные XSLT-преобразованием
     */
    public function processXSLT($content)
    {
        if ($this->theme &&
            ($this->theme != '/') &&
            is_file($this->themeDir . '/theme.xsl')
        ) {
        }
        return $content;
    }


    /**
     * Выводит данные конечному пользователю
     */
    public function render()
    {
        $this->combineViews();
        $this->renderStarted = true;
        extract($this->prepareVars(), EXTR_SKIP);

        if ($this->application->debug &&
            (
                $this->application->exceptions ||
                $this->application->sqlExceptions
            )
        ) {
            foreach (array_merge(
                (array)$this->application->exceptions,
                (array)$this->application->sqlExceptions
            ) as $e) {
                array_unshift($localError, $this->debugShowException($e));
            }
        }

        header('Cache-Control: no-cache, must-revalidate');
        header('Pragma: no-cache');
        header('Content-Type: text/html; charset=UTF-8');
        header('X-XSS-Protection: 1');
        $csp = 'Content-Security-Policy:'
             . ' default-src'
             . ' \'self\''
             . ' \'unsafe-inline\''
             . ' \'unsafe-eval\''
             . ' data:'
             . ' https://*.googleapis.com'
             . ' http://*.googleapis.com'
             . ' https://*.gstatic.com'
             . ' https://*.yandex.ru'
             . ' https://*.yandex.net'
             . ' https://yandex.ru'
             . ' https://*.yastatic.net'
             . ' https://yastatic.net'
             . ' https://*.youtube.com'
             . ' https://*.ckeditor.com'
             . ' https://cloud.flmngr.com'
             . ' https://cloud.n1ed.com'
             . ' https://n1ed.com'
             . ' https://*.n1ed.com'
             . ' http://*.webspellchecker.net;';
        header($csp);
        if (!Application::i()->debug) {
            ob_clean();
        }
        include $this->tmp('index');
        $content = ob_get_contents();
        ob_end_clean();
        echo $this->processXSLT($content);
    }

    /**
     * Системное отображение исключения
     * @param \Exception $e исключение
     */
    public function debugShowException(\Exception $e)
    {
        $text = $e->getMessage() . $e->getTraceAsString();
        return $text;
    }


    public function tmp($file)
    {
        // 2023-01-31, AVS: сделал замену, чтобы не ломалось при передаче реального файла
        $file = str_replace('\\', '/', $file);
        // 2023-01-31, AVS: сделал заглушку, чтобы сразу возвращался реальный файл
        if (is_file($file)) {
            return $file;
        }
        $temp = explode('/', ltrim($file, '/'));
        if (count($temp) >= 3) {
            $p = ($temp[0] == '.' ? '/' : $temp[0]);
            $m = $temp[1];
            $f = $temp[count($temp) - 1];
            $dir = $this->model->packages[$p]->modules[$m]->publicDir;
        } elseif (count($temp) == 2) {
            $p = ($temp[0] == '.' ? '/' : $temp[0]);
            $f = $temp[1];
            $dir = $this->model->packages[$p]->publicDir;
        } else {
            $f = $temp[0];
            $dir = $this->application->publicDir;
        }
        if (!strstr($f, '.')) {
            $f .= '.tmp.php';
        }

        if ($this->templateType &&
            is_file($dir . '/' . $this->templateType . '/' . $f)
        ) {
            return $dir . '/' . $this->templateType . '/' . $f;
        } elseif (is_file($dir . '/' . $f)) {
            return $dir . '/' . $f;
        } elseif (is_file($file)) {
            return $file;
        }
    }


    public function getMenu(array $SUBMENU = [])
    {
        $menu = [];
        foreach ($SUBMENU as $i => $item) {
            if (is_array($item)) {
                $row = $item;
                unset($row['submenu']);
            } else {
                $row = ['name' => (string)$item];
            }
            if (isset($row, $row['href']) && $row && $row['href']) {
                $A = $this->nav;
                $B = parse_url($row['href'] ?? '');
                parse_str(isset($B['query']) ? $B['query'] : '', $temp);
                $B = $temp;
                if (!isset($A['p'])) {
                    $A['p'] = $this->application->activePackage->alias;
                }
                if (!isset($B['p'])) {
                    $B['p'] = $this->application->activePackage->alias;
                }
                unset($temp);
                $AmB = @array_diff_assoc($A, $B); // т.к. сравнивает построчно, а массивы могут иметь размерность более 1
                $BmA = @array_diff_assoc($B, $A); // т.к. сравнивает построчно, а массивы могут иметь размерность более 1
                if (isset($row['active']) && ($row['active'] !== null)) {
                    $row['active'] = (bool)$row['active'];
                } elseif (!$BmA) {
                    $row['active'] = true;
                }
                if (isset($item['submenu'])) {
                    $row['submenu'] = $this->getMenu($item['submenu']);
                }
            }
            $menu[] = $row;
        }
        return $menu;
    }

    /**
     * Готовит основные переменные для экспорта перед выводом данных, также "раскатывает" переводы
     * @return array массив переменных для последующего экспорта и использования в шаблонах
     */
    protected function prepareVars()
    {
        $temp = [];
        $this->exportLang();
        foreach (array_merge(
            self::$arrayContainers,
            self::$stringContainers
        ) as $key) {
            $temp[
                (strtolower($key) == $key) ?
                strtoupper($key) :
                $key
            ] = $this->$key;
        }
        $temp['USER'] = $this->model->user;
        $temp['APPLICATION'] = $this->application;
        $temp['NAV'] = $this->application->controller->nav;
        $temp['CONTEXT'] = $this->application->context;
        $temp['VIEW'] = $this->application->view;
        $temp['MENU'] = $this->getMenu((array)$this->menu);
        $temp['SUBMENU'] = $this->getMenu((array)$this->submenu);
        $temp['CONTEXTMENU'] = $this->getMenu((array)$this->contextmenu);
        $temp['PATH'] = $this->getMenu((array)$this->path);
        $temp = array_merge($temp, (array)$this->content);
        return $temp;
    }

    /**
     * Комбинирует переменные из представлений ядра, пакетов и модулей
     */
    protected function combineViews()
    {
        parent::combineViews();
        foreach (self::$arrayContainers as $key) {
            $this->$key = (array)$this->$key;
        }
    }
}
