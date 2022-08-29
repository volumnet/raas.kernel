<?php
/**
 * Файл класса поля формы
 * @package RAAS
 * @version 4.2
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2013, Volume Networks
 */
namespace RAAS;

use SOME\SOME;

/**
 * Класс поля формы
 * @package RAAS
 * @property mixed $default значение по умолчанию
 * @property-read bool $isFilled заполнено ли поле
 * @property-read bool|array $validate проверка на правильность заполнения поля - true в случае успешной проверки,
 *                           в случае неуспешной - для multiple - массив числовых индексов ошибочных полей (с нуля), для остальных - false
 * @property-read bool $matchConfirm совпадают ли пароли с подтверждениями (для не паролей - всегда true)
 * @property-read bool $required поле обязательно для заполнения
 * @property-read bool $multiple поле допускает множественные значения
 * @property callable $check Кастомизированный метод проверки ошибок. Возвращает array массив ошибок формата метода getErrors - см. описание там
 * @property callable $export Кастомизированный метод назначения переменной для сохранения.
 * @property callable $import Кастомизированный метод импорта переменной.
 * @property callable $oncommit Кастомизированный метод, вызываемый после коммита формы.
 * @property-write OptionCollection|array|string|null $children либо наследуемое значение для установки поля $children, либо массив "$x" в формате аргументов
 *                                                    метода parseSet(
 *                                                               $x['Set'], $x['name'], $x['level'], $x['children'], $x['additional'], $x['useOptionGroups']
 *                                                           ) - см. описание там
 * @property string $errorEmptyString Идентификатор строки перевода "Необходимо заполнить поле %s"
 * @property string $errorInvalidString Идентификатор строки перевода "Поле %s заполнено неправильно"
 * @property string $errorDoesntMatch Идентификатор строки перевода "Пароль и его подтверждение не совпадают"
 */
class Field extends OptionContainer
{
    /**
     * Допустимые типы полей
     */
    public static $fieldTypes = [
        'text',
        'color',
        'date',
        'datetime-local',
        'email',
        'number',
        'range',
        'tel',
        'time',
        'url',
        'month',
        /*'week', */
        'password',
        'checkbox',
        'radio',
        'file',
        'image',
        'select',
        'textarea',
        'htmlarea',
        'template',
    ];

    /**
     * Значение по умолчанию
     * @var mixed
     */
    protected $default;

    /**
     * Идентификатор строки перевода "Необходимо заполнить поле %s"
     * @var string
     */
    protected $errorEmptyString;

    /**
     * Идентификатор строки перевода "Поле %s заполнено неправильно"
     * @var string
     */
    protected $errorInvalidString;

    /**
     * Идентификатор строки перевода "Необходимо загрузить %s"
     * @var string
     */
    protected $errorEmptyFileString = '';

    /**
     * Идентификатор строки перевода "Файл %s недопустимого формата"
     * @var string
     */
    protected $errorInvalidFileString = '';

    /**
     * Идентификатор строки перевода "Пароль и его подтверждение не совпадают"
     * @var string
     */
    protected $errorDoesntMatch;

    /**
     * Кастомизированный метод проверки ошибок
     * @var callable
     */
    protected $check;

    /**
     * Кастомизированный метод назначения переменной для сохранения
     * @var callable
     */
    protected $export;

    /**
     * Кастомизированный метод импорта переменной
     * @var callable
     */
    protected $import;

    public function __get($var)
    {
        switch ($var) {
            case 'isFilled':
                switch ($this->type) {
                    case 'file':
                    case 'image':
                        $val = isset($_FILES[$this->name]['tmp_name']) ? $_FILES[$this->name]['tmp_name'] : null;
                        break;
                    default:
                        $val = isset($_POST[$this->name]) ? $_POST[$this->name] : null;
                        break;
                }
                if ($this->multiple) {
                    $row = $this;
                    return (bool)array_filter(array_map(function ($x) use ($row) {
                        return $row->_isFilled($x);
                    }, (array)$val), 'intval');
                } else {
                    return $this->_isFilled($val);
                }
                break;
            case 'matchConfirm':
                if ($this->type != 'password') {
                    return true;
                }
                if ($val === null) {
                    $val = isset($_POST[$this->name]) ? $_POST[$this->name] : null;
                }
                $conf = isset($_POST[$this->name . '@confirm']) ? $_POST[$this->name . '@confirm'] : null;
                return $val == $conf;
                break;
            case 'validate':
                switch ($this->type) {
                    case 'file':
                    case 'image':
                        $val = isset($_FILES[$this->name]['tmp_name']) ? $_FILES[$this->name]['tmp_name'] : null;
                        break;
                    default:
                        $val = isset($_POST[$this->name]) ? $_POST[$this->name] : null;
                        break;
                }
                if ($this->multiple) {
                    $row = $this;
                    $v = array_filter(array_map(function ($x) use ($row) {
                        return !$row->_validate($x);
                    }, (array)$val), 'intval');
                    return $v ? array_keys($v) : true;
                } else {
                    return $this->_validate($val);
                }
                break;
            case 'multiple':
            case 'required':
                return (isset($this->attrs[$var]) && $this->attrs[$var]);
                break;
            case 'errorEmptyString':
            case 'errorInvalidString':
            case 'errorEmptyFileString':
            case 'errorInvalidFileString':
            case 'errorDoesntMatch':
                return (string)($this->$var ? $this->$var : $this->Parent->__get($var));
                break;
            default:
                return parent::__get($var);
                break;
        }
    }

    public function __set($var, $val)
    {
        switch ($var) {
            case 'children':
                if (is_array($val) && isset($val['Set']) && is_array($val['Set'])) {
                    $Set = $val['Set'];
                    $nameN = isset($val['name']) ? (string)$val['name'] : 'name';
                    $level = isset($val['level']) ? (int)$val['level'] : null;
                    $childrenN = isset($val['children']) ? (string)$val['children'] : null;
                    $additionalF = isset($val['additional']) && is_callable($val['additional']) ? $val['additional'] : null;
                    $useOptionGroups = isset($val['useOptionGroups']) && $val['useOptionGroups'] ? $val['useOptionGroups'] : false;
                    $filter = isset($val['filter']) && is_callable($val['filter']) ? $val['filter'] : null;
                    $this->children = $this->parseSet($Set, $nameN, $level, $childrenN, $additionalF, $useOptionGroups, $filter);
                } else {
                    parent::__set($var, $val);
                }
                break;
            case 'check':
            case 'export':
            case 'import':
            case 'oncommit':
                if (is_callable($val)) {
                    $this->$var = $val;
                }
                break;
            case 'errorEmptyString':
            case 'errorInvalidString':
            case 'errorEmptyFileString':
            case 'errorInvalidFileString':
            case 'errorDoesntMatch':
                $this->$var = (string)$val;
                break;
            case 'default':
                $this->$var = $val;
                break;
            default:
                parent::__set($var, $val);
                break;
        }
    }


    /**
     * Проверка ошибок
     * @return array массив ошибок вида ['name' => 'код ошибки', 'value' => 'имя поля', 'description' => 'текстовое описание ошибки'];
     */
    public function getErrors()
    {
        $localError = [];
        if (!$this->isFilled) {
            if ($this->required) {
                if (!(in_array($this->type, ['file', 'image']) && isset($this->Form->Item) && ($this->Form->Item instanceof SOME) && $this->Form->Item->__id())) {
                    if (in_array($this->type, ['file', 'image'])) {
                        $localError[] = [
                            'name' => 'MISSED',
                            'value' => $this->name,
                            'description' => sprintf(
                                $this->view->_(
                                    $this->__get('errorEmptyFileString')
                                ),
                                $this->caption
                            )
                        ];
                    } else {
                        $localError[] = [
                            'name' => 'MISSED',
                            'value' => $this->name,
                            'description' => sprintf(
                                $this->view->_(
                                    $this->__get('errorEmptyString')
                                ),
                                $this->caption
                            )
                        ];
                    }
                }
            }
        } elseif ($this->confirm && !$this->matchConfirm) {
            $localError[] = [
                'name' => 'INVALID',
                'value' => $this->name,
                'description' => sprintf(
                    $this->view->_(
                        $this->__get('errorDoesntMatch')
                    ),
                    $this->caption
                )
            ];
        } else {
            $v = $this->validate;
            if ($v !== true) {
                if (in_array($this->type, ['file', 'image'])) {
                    $e = [
                        'name' => 'INVALID',
                        'value' => $this->name,
                        'description' => sprintf(
                            $this->view->_(
                                $this->__get('errorInvalidFileString')
                            ),
                            $this->caption
                        )
                    ];
                } else {
                    $e = [
                        'name' => 'INVALID',
                        'value' => $this->name,
                        'description' => sprintf(
                            $this->view->_(
                                $this->__get('errorInvalidString')
                            ),
                            $this->caption
                        )
                    ];
                }
                if ($this->multiple) {
                    $e['indexes'] = $v;
                }
                $localError[] = $e;
            }
        }
        return $localError;
    }


    /**
     * Проверка заполненности значения согласно установленному типу данных
     * @param string $val Значение для проверки
     * @return bool true, если значение признано заполненным, false в противном случае
     */
    public function _isFilled($val = null)
    {
        if (is_scalar($val)) {
            if (trim($val) === '') {
                return false;
            }
        } elseif (!$val) {
            return false;
        }
        switch ($this->datatype) {
            case 'date':
                return ($val != '0000-00-00');
                break;
            case 'datetime':
            case 'datetime-local':
                return !preg_match('/^0000-00-00( |T)00:00(:00(\\.00)?)?$/i', $val);
                break;
            case 'month':
                return ($val != '0000-00');
                break;
            case 'week':
                return ($val != '0000-W00');
                break;
            case 'image':
            case 'file':
                return is_uploaded_file($val);
                break;
            case 'number':
                return (float)str_replace(',', '.', $val);
                break;
            default:
                return true;
                break;
        }
    }


    /**
     * Проверка корректности значения согласно установленному типу данных
     * @param string $val Значение для проверки
     * @return bool true, если значение признано корректным, false в противном случае
     */
    public function _validate($val = null)
    {
        if (is_scalar($val)) {
            if (trim($val) === '') {
                return true;
            }
        } else {
            return true;
        }
        if ($this->pattern) {
            if (!preg_match('/' . $this->pattern . '/umi', $val)) {
                return false;
            }
        }
        switch ($this->type) {
            case 'color':
                return (bool)preg_match('/^(#[0-9A-F]{3})|(#[0-9A-F]{6})|#[0-9A-F]{8}$/i', $val);
                break;
            case 'date':
                return $this->checkDate($val);
                break;
            case 'datetime':
            case 'datetime-local':
                if (!preg_match('/^(.*?)( |T)(.*?)$/i', $val, $regs)) {
                    return false;
                }
                if (!$this->checkDate($regs[1])) {
                    return false;
                }
                if (!$this->checkTime($regs[3])) {
                    return false;
                }
                return true;
                break;
            case 'email':
                return (bool)filter_var($val, FILTER_VALIDATE_EMAIL);
                break;
            case 'number':
            case 'range':
                $val = str_replace(',', '.', (float)$val);
                if (!is_numeric($val)) {
                    return false;
                } elseif ($this->min_val && ($val < $this->min_val)) {
                    return false;
                } elseif ($this->max_val && ($val > $this->max_val)) {
                    return false;
                }
                return true;
                break;
            case 'time':
                return $this->checkTime($val);
                break;
            case 'url':
                return (bool)filter_var($val, FILTER_VALIDATE_URL);
                break;
            case 'month':
                return $this->checkDate($val . '-01');
                break;
            case 'week':
                return (bool)preg_match('/^\\d{4}-W\\d{2}$/i', $val);
                break;
            case 'image':
                if ($val) {
                    $type = @getimagesize($val);
                    if (in_array($type[2], [
                        IMAGETYPE_GIF,
                        IMAGETYPE_PNG,
                        IMAGETYPE_JPEG,
                        IMAGETYPE_WEBP,
                    ])) {
                        return true;
                    } else {
                        $mime = mime_content_type($val);
                        if (stristr($mime, 'svg')) {
                            return true;
                        }
                    }
                    return false;
                }
                if ($val && !in_array($type[2], [
                    IMAGETYPE_GIF,
                    IMAGETYPE_PNG,
                    IMAGETYPE_JPEG,
                    IMAGETYPE_WEBP,
                ])) {
                    return false;
                }
                return true;
                break;
            default:
                return true;
                break;
        }
    }


    /**
     * Проверяет на корректность дату
     * @param string $date Дата в формате ДД.ММ.ГГГГ
     * @return bool
     */
    public function checkDate($date)
    {
        if (!preg_match('/^(\\d{4})-(\\d{2})-(\\d{2})$/mi', $date, $regs)) {
            return false;
        }
        if (!checkdate((int)$regs[2], (int)$regs[3], (int)$regs[1])) {
            return false;
        }
        return true;
    }


    /**
     * Проверяет на корректность дату
     * @param string $time Время в формате ЧЧ:ММ:(СС(.МММ)?)?
     * @return bool
     */
    public function checkTime($time)
    {
        if (!preg_match('/^(\\d{2}):(\\d{2})(:(\\d{2})(\\.\\d+)?)?$/mi', $time, $regs)) {
            return false;
        }
        if ((int)$regs[1] > 23) {
            return false;
        }
        if ((int)$regs[2] > 59) {
            return false;
        }
        if ((int)$regs[4] > 59) {
            return false;
        }
        return true;
    }


    /**
     * Обработка массива SOME объектов
     * @param [[SOME]] массив объектов для обработки
     * @param string $nameN имя свойства, где хранится наименование объекта
     * @param int|null $levelN уровень обработки дочерних элементов, null - не ограничено
     * @param string|null $childrenN свойство, где хранятся дочерние элементы, null - определить автоматически
     * @param callable|null $additionalF - Функция, которой передается на вход объект, на выходе дополнительные атрибуты для элемента в виде
     *                                     'имя атрибута' => 'значение атрибута'. NULL - не обрабатывать дополнительные значения
     * @param bool $useOptionGroups - Если установлен в TRUE, каждая опция, содержащая дочерние, будет представлена как OptGroup, если FALSE - то как Option
     * @param callable|null $filter - Функция для фильтрации элементов - принимает в качестве единственного аргумента SOME-объект для фильтрации,
     *                                Возвращает TRUE, если элемент удовлетворяет критерию фильтрации или FALSE в противном случае. NULL - не фильтровать.
     * @return [[Option]] массив опций
     */
    protected function parseSet(
        array $Set = [],
        $nameN = 'name',
        $level = null,
        $childrenN = null,
        $additionalF = null,
        $useOptionGroups = false,
        $filter = null
    ) {
        $options = new OptionCollection();
        $options->Parent = $this;
        foreach ($Set as $row) {
            if ($row instanceof SOME) {
                $classname = get_class($row);
                $children = null;
                if (($level === null) || ($level > 0)) {
                    if (!$childrenN) {
                        $tmp_ch = (array)$classname::_children();
                        if ($tmp_ch = array_filter($tmp_ch, function ($x) use ($classname) {
                            return $x['classname'] == $classname;
                        })) {
                            $tmpChKeys = array_keys($tmp_ch);
                            $childrenN = array_shift($tmpChKeys);
                        }
                    }
                    if ($childrenN && $row->$childrenN && is_array($row->$childrenN)) {
                        $children = $row->$childrenN;
                        if ($filter) {
                            $children = array_filter($children, $filter);
                        }
                        $children = $this->parseSet($children, $nameN, $level === null ? $level : $level - 1, $childrenN, $additionalF, $useOptionGroups, $filter);
                    }
                }

                $idN = $classname::_idN();
                if ($useOptionGroups && $children) {
                    $optionClassName = 'RAAS\OptGroup';
                } else {
                    $optionClassName = 'RAAS\Option';
                }
                $Option = new $optionClassName([
                    'value' => (string)$row->$idN,
                    'caption' => (string)$row->$nameN
                ]);
                if ($additionalF) {
                    $add = $additionalF($row);
                    foreach ($add as $key => $val) {
                        $Option->$key = $val;
                    }
                }
                if ($children) {
                    $Option->children = $children;
                }
                $options[] = $Option;
            }
        }
        return $options;
    }

    /**
     * Экспорт значения
     */
    public function exportDefault()
    {
        switch ($this->type) {
            case 'date':
                $f = function ($x) {
                    return strtotime($x) > 0 ? date('Y-m-d', strtotime($x)) : '0000-00-00';
                };
                break;
            case 'datetime':
            case 'datetime-local':
                $f = function ($x) {
                    return strtotime(str_replace('T', ' ', $x)) > 0 ? date('Y-m-d H:i:s', strtotime(str_replace('T', ' ', $x))) : '0000-00-00 00:00:00';
                };
                break;
            case 'year':
                $f = 'intval';
                break;
            case 'number':
            case 'range':
                $f = function ($x) {
                    return floatval(str_replace(',', '.', $x));
                };
                break;
            case 'time':
                $f = function ($x) {
                    return strtotime($x) > 0 ? date('H:i:s', strtotime($x)) : '00:00:00';
                };
                break;
            case 'month':
                $f = function ($x) {
                    return strtotime($x . '-01') > 0 ? date('Y-m-d', strtotime($x . '-01')) : '0000-00-00';
                };
                break;
            case 'checkbox':
                $f = $this->multiple ? 'trim' : 'intval';
                break;
            case 'image':
            case 'file':
                break;
            default:
                $f = 'trim';
                break;
        }
        switch ($this->type) {
            case 'file':
            case 'image':
                break;
            default:
                $Item = $this->Form->Item;
                if (is_array($_POST[$this->name])) {
                    $Item->{$this->name} = array_values(array_unique(array_map($f, $_POST[$this->name])));
                } else {
                    $Item->{$this->name} = call_user_func($f, $_POST[$this->name]);
                }
                break;
        }
    }

    /**
     * Импорт значения
     * @return mixed
     */
    public function importDefault()
    {
        switch ($this->type) {
            case 'file':
            case 'image':
                break;
            case 'date':
                $x = $this->Form->Item->{$this->name};
                if (strtotime($x) > 0) {
                    return date('Y-m-d', strtotime($x));
                }
                break;
            case 'time':
                $x = $this->Form->Item->{$this->name};
                if (strtotime($x) > 0) {
                    return date('H:i', strtotime($x));
                }
                return '';
                break;
            case 'datetime':
            case 'datetime-local':
                $x = $this->Form->Item->{$this->name};
                if (strtotime($x) > 0) {
                    return date('Y-m-d H:i', strtotime($x));
                }
                return '';
                break;
            case 'number':
                $x = (float)$this->Form->Item->{$this->name};
                $x = str_replace(',', '.', $x);
                return $x;
                break;
            default:
                return $this->Form->Item->{$this->name};
                break;
        }
    }

    /**
     * Функция, выполняемая после коммита полей
     */
    public function oncommitDefault()
    {
        if (in_array($this->type, ['image', 'file'])) {
            $Item = $this->Form->Item;
            $Field = $this;
            $f = function ($x) use ($Item, $Field) {
                if (is_uploaded_file($x['tmp_name'])) {
                    $var = isset($Field->meta['attachmentVar']) ? $Field->meta['attachmentVar'] : 'attachments';
                    if (!$Field->multiple && $Item->$var) {
                        $a = $Item->$var;
                        if (is_array($a)) {
                            $a = $a[0];
                        }
                    } else {
                        $a = new Attachment();
                    }
                    $a->upload = $x['tmp_name'];
                    $a->filename = $x['name'];
                    $a->parent = $Item;
                    $a->mime = $x['type'];
                    $a->image = ($Field->type == 'image');
                    $a->commit();
                    return $a->id;
                }
                return null;
            };
            if (is_array($_FILES[$this->name]['tmp_name'])) {
                $arr = [];
                foreach ($_FILES[$this->name]['tmp_name'] as $key => $val) {
                    if (is_uploaded_file($_FILES[$this->name]['tmp_name'][$key])) {
                        $arr[] = [
                            'name' => $_FILES[$this->name]['name'][$key],
                            'tmp_name' => $_FILES[$this->name]['tmp_name'][$key],
                            'type' => $_FILES[$this->name]['type'][$key]
                        ];
                    }
                }
                if ($v = array_filter(array_map($f, $arr))) {
                    $Item->{$this->name} = $v;
                }
            } else {
                if ($v = call_user_func($f, $_FILES[$this->name])) {
                    $Item->{$this->name} = $v;
                }
            }
            $Item->commit();
        }
    }
}
