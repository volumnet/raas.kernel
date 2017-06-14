<?php
/**
 * Файл класса формы
 * @package RAAS
 * @version 4.2
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2013, Volume Networks
 */
namespace RAAS;

/**
 * Класс формы
 * @package RAAS
 * @property-read Form $Form Возвращает текущую форму
 * @property \SOME\SOME $Item Объект для сохранения
 * @property string $selfUrl Шаблон адреса текущего документа для sprintf с подстановкой %s - ID текущего документа
 * @property string $parentUrl Шаблон адреса родительского документа для sprintf с подстановкой %s - ID родительского документа
 * @property string $newUrl Шаблон адреса нового документа для sprintf с подстановкой %s - ID родительского документа
 * @property string $submitCaption Кастомизированный текст кнопки submit
 * @property string $resetCaption Кастомизированный текст кнопки reset
 * @property bool $actionMenu Использовать меню действий
 * @property callable $commit Функция сохранения
 * @property callable $redirect Функция переадресации
 * @property callable $cancel Функция отмены
 */
class Form extends FieldContainer
{
    /**
     * Действие после сохранения: возврат в родительский список
     */
    const ONCOMMIT_RETURN = 0;

    /**
     * Действие после сохранения: редактирование текущего элемента
     */
    const ONCOMMIT_EDIT = 1;

    /**
     * Действие после сохранения: создание нового элемента
     */
    const ONCOMMIT_NEW = 2;

    /**
     * Объект для сохранения
     * @var \SOME\SOME|null
     */
    protected $Item = null;

    /**
     * Массив ошибок в виде array(
     *                          [array(array('name' => 'текстовая константа-код ошибки', 'value' => 'имя поля', 'description' => 'человеко-читаемое описание ошибки')]
     *                      )
     * @var array
     */
    protected $localError = array();

    /**
     * Массив данных для присвоения полям
     * @var array
     */
    protected $DATA = array();

    /**
     * Шаблон адреса текущего документа для sprintf с подстановкой %s - ID текущего документа
     * @var string
     */
    protected $selfUrl = '';

    /**
     * Шаблон адреса родительского документа для sprintf с подстановкой %s - ID родительского документа
     * @var string
     */
    protected $parentUrl = '';

    /**
     * Шаблон адреса нового документа для sprintf с подстановкой %s - ID родительского документа
     * @var string
     */
    protected $newUrl = '';

    /**
     * Шаблон для отображения элемента в формате шаблонов RAAS
     * @var string
     */
    protected $template = '/form';

    /**
     * Кастомизированный метод импорта переменной
     * @var callable
     */
    protected $commit;

    /**
     * Кастомизированный метод переадресации
     * @var callable
     */
    protected $redirect;

    /**
     * Кастомизированный метод отмены
     * @var callable
     */
    protected $cancel;

    /**
     * Идентификатор строки перевода "Необходимо заполнить поле %s"
     * @var string
     */
    protected $errorEmptyString = 'ERR_CUSTOM_FIELD_REQUIRED';

    /**
     * Идентификатор строки перевода "Поле %s заполнено неправильно"
     * @var string
     */
    protected $errorInvalidString = 'ERR_CUSTOM_FIELD_INVALID';

    /**
     * Идентификатор строки перевода "Необходимо загрузить %s"
     * @var string
     */
    protected $errorEmptyFileString = 'ERR_CUSTOM_FILE_REQUIRED';

    /**
     * Идентификатор строки перевода "Файл %s недопустимого формата"
     * @var string
     */
    protected $errorInvalidFileString = 'ERR_CUSTOM_FILE_INVALID';

    /**
     * Идентификатор строки перевода "Пароль и его подтверждение не совпадают"
     * @var string
     */
    protected $errorDoesntMatch = 'ERR_CUSTOM_PASSWORD_DOESNT_MATCH_CONFIRM';

    /**
     * Кастомизированный текст кнопки submit
     * @var string
     */
    protected $submitCaption = '';

    /**
     * Кастомизированный текст кнопки reset
     * @var string
     */
    protected $resetCaption = '';

    /**
     * Использовать меню действий
     * @var bool
     */
    protected $actionMenu = true;

    /**
     * Флаг успешного сохранения формы
     * @var string
     */
    protected $success = false;

    /**
     * Флаг POST-запроса
     */
    protected $isPost = false;

    public function __get($var)
    {
        switch ($var) {
            case 'Form':
                return $this;
                break;
            case 'selfUrl':
            case 'parentUrl':
            case 'newUrl':
                if ($this->Item) {
                    $classname = get_class($this->Item);
                    $idN = $classname::_idN();
                    $refs = $classname::_references();
                    if (count($refs) > 1) {
                        $refs = array_filter($refs, function ($x) use ($classname) {
                            return $x['classname'] == $classname;
                        });
                    }
                    $refs = array_values($refs);
                    $pidN = $refs ? $refs[0]['FK'] : '';
                    if ($this->$var) {
                        return sprintf($this->$var, ($var == 'selfUrl') ? $this->Item->__id() : $this->Item->$pidN);
                    } else {
                        $selfUrl = sprintf(urldecode(\SOME\HTTP::queryString($idN . '=%s' . ($pidN ? '&' . $pidN . '=' : ''))), $this->Item->__id());
                        $parentUrl = sprintf(urldecode(\SOME\HTTP::queryString($idN . '=' . ($pidN ? '%s' : '') . '&action=')), $this->Item->$pidN);
                        $newUrl = sprintf(urldecode(\SOME\HTTP::queryString($idN . '=' . ($pidN ? '&' . $pidN . '=%s' : '') . '&action=' . (isset($_GET['action']) ? $_GET['action'] : 'edit'))), $this->Item->$pidN);
                        return $$var;
                    }
                } else {
                    $selfUrl = $parentUrl = $newUrl = \SOME\HTTP::queryString() . '&action=' . (isset($_GET['action']) ? $_GET['action'] : 'edit');
                    return $$var;
                }
                break;
            default:
                return parent::__get($var);
                break;
        }
    }

    public function __set($var, $val)
    {
        switch ($var) {
            case 'Item':
                if ($val instanceof \SOME\SOME) {
                    $this->Item = $val;
                } elseif (is_string($val)) {
                    $this->$var = new $val(isset($_GET['id']) && (int)$_GET['id'] ? (int)$_GET['id'] : null);
                }
                break;
            case 'commit':
            case 'redirect':
            case 'cancel':
                if (is_callable($val)) {
                    $this->$var = $val;
                }
                break;
            case 'selfUrl':
            case 'parentUrl':
            case 'newUrl':
            case 'submitCaption':
            case 'resetCaption':
                $this->$var = (string)$val;
                break;
            case 'actionMenu':
                $this->$var = (bool)$val;
                break;
            default:
                parent::__set($var, $val);
                break;
        }
    }

    /**
     * Конструктор класса
     * @param array([[имя параметра] => mixed]) $params массив дополнительных свойств, доступных для установки
     */
    public function __construct(array $params = array())
    {
        if (!isset($params['action'])) {
            $params['action'] = '';
        }
        if (!isset($params['method'])) {
            $params['method'] = 'post';
        }
        if (!isset($params['enctype'])) {
            $params['enctype'] = 'multipart/form-data';
        }
        parent::__construct($params);
    }

    /**
     * Обработка формы
     */
    public function process()
    {
        $this->success = false;
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $this->isPost = true;
            if (isset($_POST['@cancel'])) {
                if ($f = $this->cancel) {
                    call_user_func($f, $this);
                } elseif ($f = $this->redirect) {
                    call_user_func($f, $this);
                } else {
                    $this->redirectDefault();
                }
            } else {
                if ($f = $this->check) {
                    $this->localError = call_user_func($f, $this);
                } else {
                    $this->localError = $this->getErrors();
                }
                if (isset($this->localError) && is_array($this->localError) && (array_values($this->localError) != $this->localError)) {
                    $this->localError = array($this->localError);
                }
                if (!$this->localError) {
                    if ($f = $this->commit) {
                        call_user_func($f, $this);
                    } elseif ($this->Item) {
                        if ($f = $this->export) {
                            call_user_func($f, $this);
                        } else {
                            $this->exportDefault();
                        }
                        $this->Item->commit();
                    }
                    $this->success = true;

                    if ($f = $this->oncommit) {
                        call_user_func($f, $this);
                    } else {
                        $this->oncommitDefault();
                    }
                    if ($f = $this->redirect) {
                        call_user_func($f, $this);
                    } else {
                        $this->redirectDefault();
                    }
                }
            }
        }
        if ($f = $this->import) {
            $this->DATA = call_user_func($f, $this);
        } else {
            $this->DATA = $this->importDefault();
        }
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $this->DATA['@oncommit'] = $_POST['@oncommit'];
        } else {
            $this->DATA['@oncommit'] = isset($_COOKIE['RAASForm@oncommit']) ? $_COOKIE['RAASForm@oncommit'] : null;
        }
        $OUT = array();
        $OUT['Form'] = $this;
        $OUT['Item'] = $this->Item;
        $OUT['localError'] = $this->localError;
        $OUT['DATA'] = $this->DATA;
        return $OUT;
    }

    /**
     * Стандартная переадресация
     */
    public function redirectDefault()
    {
        if (isset($_POST['@oncommit'])) {
            setcookie('RAASForm@oncommit', $_POST['@oncommit'], time() + Application::i()->registryGet('cookieLifetime') * 86400, '/');
            switch ($_POST['@oncommit']) {
                case self::ONCOMMIT_EDIT:
                    new Redirector($this->__get('selfUrl'));
                    break;
                case self::ONCOMMIT_NEW:
                    new Redirector($this->__get('newUrl'));
                    break;
                case self::ONCOMMIT_RETURN:
                    new Redirector($this->__get('parentUrl'));
                    break;
            }
        } elseif (isset($_POST['@cancel']) || (Application::i()->controller instanceof Controller_Web)) {
            new Redirector($this->__get('selfUrl'));
        }
    }
}
