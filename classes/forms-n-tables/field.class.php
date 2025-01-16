<?php
/**
 * Файл класса поля формы
 * @package RAAS
 * @version 4.2
 * @author Alex V. Surnin <info@volumnet.ru>
 * @copyright 2013, Volume Networks
 *
 * <pre><code>
 * Предустановленные типы:
 *
 * <ОШИБКА> => [
 *     'name' => string Код ошибки,
 *     'value' => string Имя поля,
 *     'description' => string Текстовое описание ошибки
 * ]
 * </code></pre>
 */
declare(strict_types=1);

namespace RAAS;

use SOME\SOME;

/**
 * Класс поля формы
 * @package RAAS
 * @property mixed $default значение по умолчанию
 * @property-read bool $isFilled заполнено ли поле
 * @property-read bool|array $validate проверка на правильность заполнения поля - true в случае успешной проверки,
 *     в случае неуспешной - для multiple - массив числовых индексов ошибочных полей (с нуля), для остальных - false
 * @property-read bool $matchConfirm совпадают ли пароли с подтверждениями (для не паролей - всегда true)
 * @property-read bool $required поле обязательно для заполнения
 * @property-read bool $multiple поле допускает множественные значения
 * @property callable $check <pre><code>function (self $field): array<<ОШИБКА>></code></pre>
 *     Кастомизированный метод проверки ошибок
 * @property callable $export <pre><code>function (self $field): void</code></pre>
 *     Кастомизированный метод назначения переменной для сохранения.
 * @property callable $import <pre><code>function (self $field): mixed</code></pre>
 *     Кастомизированный метод импорта переменной.
 * @property callable $oncommit <pre><code>function (self $field): void</code></pre>
 *     Кастомизированный метод, вызываемый после коммита формы.
 * @property-write OptionCollection|array|string|null $children либо наследуемое значение для установки поля $children,
 *     либо массив "$x" в формате аргументов метода
 *     parseSet($x['Set'], $x['name'], $x['level'], $x['children'], $x['additional'], $x['useOptionGroups']) -
 *     см. описание там
 * @property string $errorEmptyString Идентификатор строки перевода "Необходимо заполнить поле %s"
 * @property string $errorInvalidString Идентификатор строки перевода "Поле %s заполнено неправильно"
 * @property string $errorEmptyFileString Идентификатор строки перевода "Необходимо загрузить файл %s"
 * @property string $errorInvalidFileString Идентификатор строки перевода "Файл %s недопустимого формата"
 * @property string $errorInvalidFileWithExtensionsString Идентификатор строки перевода "Файл %s недопустимого формата. Допустимые форматы: %s"
 * @property string $errorInvalidImageString Идентификатор строки перевода "Некорректный формат изображения. Доступные форматы: GIF, JPG, PNG"
 * @property string $errorDoesntMatch Идентификатор строки перевода "Пароль и его подтверждение не совпадают"
 * @property string $datatypeStrategyURN URN стратегии типа данных
 * @property callable $isMediaFilled <pre><code>function (self $field): bool</code></pre>
 *     Кастомизированный метод проверки заполненности медиа-поля
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
     * Идентификатор строки перевода "Файл %s недопустимого формата. Допустимые форматы: %s"
     * @var string
     */
    protected $errorInvalidFileWithExtensionsString = '';

    /**
     * Идентификатор строки перевода "Некорректный формат изображения. Доступные форматы: GIF, JPG, PNG"
     * @var string
     */
    protected $errorInvalidImageString = '';

    /**
     * Идентификатор строки перевода "Пароль и его подтверждение не совпадают"
     * @var string
     */
    protected $errorDoesntMatch;

    /**
     * Кастомизированный метод проверки ошибок
     * @var callable <pre><code>function (self $field): array<<ОШИБКА>></code></pre>
     */
    protected $check;

    /**
     * Кастомизированный метод назначения переменной для сохранения
     * @var callable <pre><code>function (self $field): void</code></pre>
     */
    protected $export;

    /**
     * Кастомизированный метод импорта переменной
     * @var callable <pre><code>function (self $field): mixed</code></pre>
     */
    protected $import;

    /**
     * URN стратегии типа данных (если пусто, то совпадает с типом)
     * @var string
     */
    protected $datatypeStrategyURN;

    /**
     * Кастомизированный метод проверки заполненности медиа-поля
     * @var callable <pre><code>function (self $field): bool</code></pre>
     */
    protected $isMediaFilled;

    /**
     * Кастомизированный метод, вызываемый после коммита формы
     * @var ?callable <pre><code>function (self $field): void</code></pre>
     */
    protected $oncommit;

    public function __get($var)
    {
        switch ($var) {
            case 'isFilled':
                $datatypeStrategy = $this->datatypeStrategy;
                if ($this->datatypeStrategy->isMedia()) {
                    $filesArr = $this->datatypeStrategy->getFilesData($this, true);
                    foreach ($filesArr as $fileEntry) {
                        if ($datatypeStrategy->isFilled($fileEntry['tmp_name'] ?? null, Application::i()->debug)) {
                            return true;
                        }
                    }
                    if ($mediaFilledFunction = $this->isMediaFilled) {
                        $mediaFilled = $mediaFilledFunction($this);
                    } else {
                        $mediaFilled = $this->isMediaFilledDefault();
                    }
                    if ($mediaFilled) {
                        return true;
                    }
                } else {
                    $postArr = $this->datatypeStrategy->getPostData($this, true);
                    foreach ($postArr as $value) {
                        if ($datatypeStrategy->isFilled($value)) {
                            return true;
                        }
                    }
                }
                return false;
                break;
            case 'matchConfirm':
                if ($this->type != 'password') {
                    return true;
                }
                // 2023-11-30, AVS:
                // Нельзя просто делать clone $this, т.к. ArrayObject'ы, через которые задаются свойства, привяжутся
                // к обоим объектам, и попытка поменять имя у второго поменяет его у первого
                $confirmField = new static([
                    'datatype' => $this->datatype,
                    'name' => $this->name . '@confirm',
                ]);

                $val = $this->datatypeStrategy->getPostData($this);
                $conf = $this->datatypeStrategy->getPostData($confirmField);
                return $val == $conf;
                break;
            case 'validate':
                if ($this->datatypeStrategy->isMedia()) {
                    $value = $this->datatypeStrategy->getFilesData($this, (bool)$this->multiple);
                } else {
                    $value = $this->datatypeStrategy->getPostData($this, (bool)$this->multiple);
                }
                if ($this->multiple) {
                    $incorrectValues = array_filter(array_map(function ($x) {
                        try {
                            return !$this->datatypeStrategy->validate($x, $this);
                        } catch (DatatypeInvalidValueException $e) {
                            return true;
                        }
                    }, $value));
                    if ($incorrectValues) {
                        $incorrectIndexes = array_keys($incorrectValues);
                        return $incorrectIndexes;
                    } else {
                        return true;
                    }
                } else {
                    try {
                        return $this->datatypeStrategy->validate($value, $this);
                    } catch (DatatypeInvalidValueException $e) {
                        return false;
                    }
                }
                break;
            case 'multiple':
            case 'required':
                return (bool)($this->attrs[$var] ?? false);
                break;
            case 'errorEmptyString':
            case 'errorInvalidString':
            case 'errorEmptyFileString':
            case 'errorInvalidFileString':
            case 'errorInvalidFileWithExtensionsString':
            case 'errorInvalidImageString':
            case 'errorDoesntMatch':
                if ($val = $this->$var) {
                    return $val;
                }
                if ($this->Parent) {
                    return $this->Parent->__get($var);
                }
                break;
            case 'datatypeStrategyURN':
                return (string)$this->$var;
                break;
            case 'datatypeStrategy':
                return DatatypeStrategy::spawn($this->datatypeStrategyURN ?: $this->type);
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
                    $this->children = $this->parseSet(
                        $val['Set'],
                        (string)($val['name'] ?? 'name'),
                        isset($val['level']) ? (int)$val['level'] : null,
                        isset($val['children']) ? (string)$val['children'] : null,
                        is_callable($val['additional'] ?? null) ? $val['additional'] : null,
                        (bool)($val['useOptionGroups'] ?? false),
                        is_callable($val['filter'] ?? null) ? $val['filter'] : null
                    );
                } else {
                    parent::__set($var, $val);
                }
                break;
            case 'check':
            case 'export':
            case 'import':
            case 'oncommit':
            case 'isMediaFilled':
                if (is_callable($val)) {
                    $this->$var = $val;
                }
                break;
            case 'errorEmptyString':
            case 'errorInvalidString':
            case 'errorEmptyFileString':
            case 'errorInvalidFileString':
            case 'errorInvalidFileWithExtensionsString':
            case 'errorInvalidImageString':
            case 'errorDoesntMatch':
            case 'datatypeStrategyURN':
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
     * Стандартная функция, определяющая, заполнено ли медиа-поле ранее
     * @return bool
     */
    public function isMediaFilledDefault(): bool
    {
        if (!$this->datatypeStrategy->isMedia()) {
            return false;
        }
        $item = $this->Form ? $this->Form->Item : null;
        if (!($item instanceof SOME)) {
            return false;
        }
        $attachmentVar = $this->meta['attachmentVar'] ?? 'attachments';

        $attachment = null;
        if ($item->$attachmentVar) {
            $attachment = $item->$attachmentVar;
            if (is_array($attachment)) {
                $attachment = $attachment[0];
            }
        }
        return ($attachment instanceof Attachment) && $attachment->id;
    }


    /**
     * Проверка ошибок
     * @return array <pre><code>array<[
     *     'name' => string Код ошибки,
     *     'value' => string Имя поля,
     *     'description' => string Текстовое описание ошибки
     * ]></code></pre> массив ошибок;
     */
    public function getErrors()
    {
        $localError = [];
        if (!$this->isFilled) {
            if ($this->required) {
                if (!($this->datatypeStrategy->isMedia() &&
                    isset($this->Form->Item) &&
                    ($this->Form->Item instanceof SOME) &&
                    $this->Form->Item->__id()
                )) {
                    if ($this->datatypeStrategy->isMedia()) {
                        $errMsgKey = 'errorEmptyFileString';
                    } else {
                        $errMsgKey = 'errorEmptyString';
                    }
                    $errMsgKey = $this->__get($errMsgKey);
                    $errMsg = $this->view->_($errMsgKey);
                    $errMsg = sprintf($errMsg, $this->caption);
                    $localError[] = ['name' => 'MISSED', 'value' => $this->name, 'description' => $errMsg];
                }
            }
        } elseif ($this->confirm && !$this->matchConfirm) {
            $errMsgKey = $this->__get('errorDoesntMatch');
            $errMsg = $this->view->_($errMsgKey);
            $errMsg = sprintf($errMsg, $this->caption);
            $localError[] = ['name' => 'INVALID', 'value' => $this->name, 'description' => $errMsg];
        } else {
            $allowableTypes = [];
            if ($this->datatypeStrategy->isMedia()) {
                $values = $this->datatypeStrategy->getFilesData($this, true);
            } else {
                $values = $this->datatypeStrategy->getPostData($this, true);
            }
            foreach ($values as $key => $value) {
                $errMsgKey = null;
                try {
                    $this->datatypeStrategy->validate($value, $this);
                } catch (DatatypeImageTypeMismatchException $e) {
                    $errMsgKey = 'errorInvalidImageString';
                } catch (DatatypeFileTypeMismatchException $e) {
                    if ($this->accept) {
                        $allowableTypes = explode(',', $this->accept);
                        $allowableTypes = array_map(function ($x) {
                            $y = trim($x);
                            if ($y[0] == '.') {
                                $y = mb_substr($y, 1);
                            }
                            $y = mb_strtoupper($y);
                            return $y;
                        }, $allowableTypes);
                        $errMsgKey = 'errorInvalidFileWithExtensionsString';
                    } else {
                        $errMsgKey = 'errorInvalidFileString';
                    }
                } catch (DatatypeInvalidValueException $e) {
                    $errMsgKey = 'errorInvalidString';
                }
                if ($errMsgKey) {
                    if (!isset($localError[$errMsgKey])) {
                        $errMsgKeyString = $this->__get($errMsgKey);
                        $errMsg = $this->view->_($errMsgKeyString);
                        if ($allowableTypes) {
                            $errMsg = sprintf($errMsg, $this->caption, implode(', ', $allowableTypes));
                        } else {
                            $errMsg = sprintf($errMsg, $this->caption);
                        }
                        $error = ['name' => 'INVALID', 'value' => $this->name, 'description' => $errMsg];
                    }
                    if ($this->multiple) {
                        $error['indexes'][$key] = $key;
                    }
                    $localError[$errMsgKey] = $error;
                }
            }

            if ($localError) {
                $localError = array_map(function ($error) {
                    $result = $error;
                    if ($result['indexes'] ?? null) {
                        $result['indexes'] = array_values($result['indexes']);
                    }
                    return $result;
                }, $localError);
                $localError = array_values($localError);
            }
        }
        return $localError;
    }


    /**
     * Проверка заполненности значения согласно установленному типу данных
     * @param mixed $value Значение для проверки
     * @return bool true, если значение признано заполненным, false в противном случае
     * @deprecated 2023-11-28, AVS: Использовать $this->datatypeStrategy->isFilled
     * @codeCoverageIgnore
     */
    public function _isFilled($value = null): bool
    {
        return $this->datatypeStrategy->isFilled($value, Application::i()->debug);
    }


    /**
     * Проверка корректности значения согласно установленному типу данных
     * @param mixed $value Значение для проверки
     * @return bool true, если значение признано корректным, false в противном случае
     * @deprecated 2023-11-28, AVS: Использовать $this->datatypeStrategy->validate
     * @codeCoverageIgnore
     */
    public function _validate($value = null)
    {
        try {
            if ($this->datatypeStrategy->isMedia()) {
                $value = ['tmp_name' => $value];
            }
            return $this->datatypeStrategy->validate($value, $this);
        } catch (DatatypeInvalidValueException $e) {
            return false;
        }
    }


    /**
     * Проверяет на корректность дату
     * @param string $date Дата в формате ДД.ММ.ГГГГ
     * @return bool
     * @deprecated 2023-11-28, AVS: Использовать DateTimeDatatypeStrategy::checkDate
     * @codeCoverageIgnore
     */
    public function checkDate(string $date): bool
    {
        return DateTimeDatatypeStrategy::checkDate($date);
    }


    /**
     * Проверяет на корректность дату
     * @param string $time Время в формате ЧЧ:ММ:(СС(.МММ)?)?
     * @return bool
     * @deprecated 2023-11-28, AVS: Использовать DateTimeDatatypeStrategy::checkTime
     * @codeCoverageIgnore
     */
    public function checkTime(string $time): bool
    {
        return DateTimeDatatypeStrategy::checkTime($time);
    }



    /**
     * Обработка массива SOME объектов
     * @param SOME[] массив объектов для обработки
     * @param string $nameN имя свойства, где хранится наименование объекта
     * @param ?int $levelN уровень обработки дочерних элементов, null - не ограничено
     * @param ?string $childrenN свойство, где хранятся дочерние элементы, null - определить автоматически
     * @param ?callable $additionalF - Функция, которой передается на вход объект, на выходе дополнительные атрибуты
     *     для элемента в виде 'имя атрибута' => 'значение атрибута'. NULL - не обрабатывать дополнительные значения
     * @param bool $useOptionGroups - Если установлен в TRUE, каждая опция, содержащая дочерние,
     *     будет представлена как OptGroup, если FALSE - то как Option
     * @param ?callable $filter - Функция для фильтрации элементов - принимает в качестве единственного аргумента
     *     SOME-объект для фильтрации. Возвращает TRUE, если элемент удовлетворяет критерию фильтрации,
     *     или FALSE в противном случае. NULL - не фильтровать.
     * @return [[Option]] массив опций
     */
    public function parseSet(
        array $Set = [],
        string $nameN = 'name',
        ?int $level = null,
        ?string $childrenN = null,
        ?callable $additionalF = null,
        bool $useOptionGroups = false,
        ?callable $filter = null
    ) {
        $options = new OptionCollection();
        $options->Parent = $this;
        foreach ($Set as $row) {
            if ($row instanceof SOME) {
                $classname = get_class($row);
                $children = null;
                if (($level === null) || ($level > 1)) {
                    if (!$childrenN) {
                        $tmpCh = (array)$classname::_children();
                        $tmpCh = array_filter($tmpCh, function ($x) use ($classname) {
                            return $x['classname'] == $classname;
                        });
                        if ($tmpCh) {
                            $tmpChKeys = array_keys($tmpCh);
                            $childrenN = array_shift($tmpChKeys);
                        }
                    }
                    if ($childrenN && $row->$childrenN && is_array($row->$childrenN)) {
                        $children = $row->$childrenN;
                        if ($filter) {
                            $children = array_filter($children, $filter);
                        }
                        $children = $this->parseSet(
                            $children,
                            $nameN,
                            ($level === null) ? $level : ($level - 1),
                            $childrenN,
                            $additionalF,
                            $useOptionGroups,
                            $filter
                        );
                    }
                }

                $idN = $classname::_idN();
                if ($useOptionGroups && $children) {
                    $optionClassName = OptGroup::class;
                } else {
                    $optionClassName = Option::class;
                }
                $Option = new $optionClassName(['value' => (string)$row->$idN, 'caption' => (string)$row->$nameN]);
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
        if ($this->datatypeStrategy->isMedia()) {
            return;
        }
        $Item = $this->Form->Item;
        $value = $this->datatypeStrategy->getPostData($this);
        if (is_array($value)) {
            $valueToSet = array_map(function ($x) {
                return $this->datatypeStrategy->export($x);
            }, $value);
            $valueToSet = array_filter($valueToSet, function ($x) {
                return $x !== null;
            });
            if (!$valueToSet) {
                $valueToSet = null;
            }
        } else {
            $valueToSet = $this->datatypeStrategy->export($value);
        }
        if ($valueToSet !== null) {
            $Item->{$this->name} = $valueToSet;
        }
    }


    /**
     * Импорт значения
     * @return mixed
     */
    public function importDefault()
    {
        if ($this->datatypeStrategy->isMedia()) {
            return;
        }
        $value = $this->Form->Item->{$this->name};
        if (is_array($value)) {
            $result = array_map(function ($x) {
                return $this->datatypeStrategy->import($x);
            }, $value);
            $result = array_filter($result, function ($x) {
                return $x !== null;
            });
            if (!$result) {
                $result = null;
            }
        } else {
            $result = $this->datatypeStrategy->import($value);
        }
        return $result;
    }


    /**
     * Создает либо обрабатывает существующее вложение для сущности
     * @param array $fileData <pre><code>[
     *     'tmp_name' => string Путь к файлу,
     *     'name' => string Название файла,
     *     'type' => string MIME-тип файла
     * ]</code></pre>
     * @param SOME $entity Сущность, для которой создается вложение
     * @return Attachment|null
     */
    protected function processAttachment(array $fileData, SOME $entity)
    {
        if ($this->datatypeStrategy->isFileLoaded($fileData['tmp_name'] ?? '', Application::i()->debug)) {
            $attachmentVar = $this->meta['attachmentVar'] ?? 'attachments';
            $attachment = null;
            if (!$this->multiple && $entity->$attachmentVar) {
                $attachment = $entity->$attachmentVar;
                if (is_array($attachment)) {
                    $attachment = $attachment[0];
                }
            }
            if (!$attachment || !($attachment instanceof Attachment)) {
                $attachment = new Attachment();
            }
            $attachment->upload = $fileData['tmp_name'];
            if (!is_uploaded_file($fileData['tmp_name'])) {
                $attachment->copy = true;
            }
            $attachment->filename = $fileData['name'];
            $attachment->parent = $entity;
            $attachment->mime = $fileData['type'];
            $attachment->image = ($this->type == 'image');
            $attachment->commit();
            return $attachment;
        }
        return null;
    }


    /**
     * Функция, выполняемая после коммита полей
     */
    public function oncommitDefault()
    {
        if (!$this->datatypeStrategy->isMedia()) {
            return;
        }
        $item = $this->Form->Item;
        $values = [];
        $filesData = $this->datatypeStrategy->getFilesData($this, true);
        foreach ($filesData as $fileData) {
            $attachment = $this->processAttachment($fileData, $item);
            if ($attachment) {
                $values[] = $this->datatypeStrategy->export($attachment);
            }
        }
        if ($this->multiple) {
            $item->{$this->name} = $values;
        } elseif ($values) {
            $item->{$this->name} = $values[0];
        }
        $item->commit();
    }
}
