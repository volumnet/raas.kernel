<?php
/**
 * Файл класса контейнера полей
 */
declare(strict_types=1);

namespace RAAS;

/**
 * Класс контейнера полей
 * @property callable $check Кастомизированный метод проверки ошибок. Возвращает array массив ошибок формата метода Field::getErrors - см. описание там
 * @property callable $export Кастомизированный метод назначения переменных для сохранения.
 * @property callable $import Кастомизированный метод импорта переменных.
 * @property callable $oncommit Кастомизированный метод, вызываемый после коммита формы.
 * @property string $errorEmptyString Идентификатор строки перевода "Необходимо заполнить поле %s"
 * @property string $errorInvalidString Идентификатор строки перевода "Поле %s заполнено неправильно"
 * @property string $errorEmptyFileString Идентификатор строки перевода "Необходимо загрузить файл %s"
 * @property string $errorInvalidFileString Идентификатор строки перевода "Файл %s недопустимого формата"
 * @property string $errorInvalidFileWithExtensionsString Идентификатор строки перевода "Файл %s недопустимого формата. Допустимые форматы: %s"
 * @property string $errorInvalidImageString Идентификатор строки перевода "Некорректный формат изображения. Доступные форматы: GIF, JPG, PNG"
 * @property string $errorDoesntMatch Идентификатор строки перевода "Пароль и его подтверждение не совпадают"
 */
class FieldContainer extends FormElement
{
    /**
     * Тип поля $children
     */
    const CHILDREN_TYPE = 'RAAS\FieldCollection';

    /**
     * Кастомизированный метод проверки ошибок
     * @var callable
     */
    protected $check;

    /**
     * Кастомизированный метод назначения переменных для сохранения
     * @var callable
     */
    protected $export;

    /**
     * Кастомизированный метод импорта переменных
     * @var callable
     */
    protected $import;

    /**
     * Кастомизированный метод, вызываемый после коммита формы
     * @var callable
     */
    protected $oncommit;

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

    public function __set($var, $val)
    {
        switch ($var) {
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
            case 'errorInvalidFileWithExtensionsString':
            case 'errorInvalidImageString':
            case 'errorHasntUploadedString':
                $this->$var = (string)$val;
                break;
            default:
                parent::__set($var, $val);
                break;
        }
    }

    public function __get($var)
    {
        switch ($var) {
            case 'errorEmptyString':
            case 'errorInvalidString':
            case 'errorEmptyFileString':
            case 'errorInvalidFileString':
            case 'errorInvalidFileWithExtensionsString':
            case 'errorInvalidImageString':
            case 'errorDoesntMatch':
                return (string)($this->$var ? $this->$var : $this->Parent->__get($var));
                break;
            default:
                return parent::__get($var);
                break;
        }
    }


    /**
     * Проверка ошибок
     * @return array массив ошибок вида array('name' => 'код ошибки', 'value' => 'имя поля', 'description' => 'текстовое описание ошибки');
     */
    public function getErrors()
    {
        $localError = array();
        foreach ($this->children as $row) {
            if ($f = $row->check) {
                $e = call_user_func($f, $row);
                if (isset($e) && is_array($e) && (array_values($e) != $e)) {
                    $e = array($e);
                }
            } else {
                $e = $row->getErrors();
            }
            if ($e) {
                $localError = array_merge($localError, $e);
            }
        }
        return $localError;
    }

    /**
     * Назначение полей
     */
    public function exportDefault()
    {
        foreach ($this->children as $row) {
            if ($f = $row->export) {
                call_user_func($f, $row);
            } else {
                $row->exportDefault();
            }
        }
    }

    /**
     * Импорт значений из полей
     */
    public function importDefault()
    {
        $DATA = array();
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $DATA = $_POST;
        } elseif ($this->Form->Item && $this->Form->Item->__id()) {
            foreach ($this->children as $row) {
                if ($row instanceof Field) {
                    if ($row->name) {
                        if ($f = $row->import) {
                            // 2019-10-24, AVS: поддержка полей с числовыми наименованиями
                            $DATA[trim($row->name)] = call_user_func($f, $row);
                        } else {
                            // 2019-10-24, AVS: поддержка полей с числовыми наименованиями
                            $DATA[trim($row->name)] = $row->importDefault();
                        }
                    }
                } else {
                    if ($f = $row->import) {
                        // 2019-10-24, AVS: поддержка полей с числовыми наименованиями
                        $DATA += (array)call_user_func($f, $row);
                    } else {
                        // 2019-10-24, AVS: поддержка полей с числовыми наименованиями
                        $DATA += (array)$row->importDefault();
                    }
                }
            }
        } else {
            foreach ($this->children as $row) {
                if ($row instanceof Field) {
                    if ($row->default !== null) {
                        $DATA[$row->name] = $row->default;
                    }
                } else {
                    $DATA = array_merge($DATA, (array)$row->importDefault());
                }
            }
        }
        return $DATA;
    }

    /**
     * Функция, выполняемая после коммита полей
     */
    public function oncommitDefault()
    {
        foreach ($this->children as $row) {
            if ($f = $row->oncommit) {
                call_user_func($f, $row);
            } else {
                $row->oncommitDefault();
            }
        }
    }
}
