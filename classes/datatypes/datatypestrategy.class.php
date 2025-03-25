<?php
/**
 * @package RAAS
 */
declare(strict_types=1);

namespace RAAS;

use InvalidArgumentException;
use SOME\AbstractStrategy;

/**
 * Стратегия типа данных
 */
abstract class DatatypeStrategy extends AbstractStrategy
{
    protected static $registeredStrategies = [];

    public static function spawn(?string $key = null): AbstractStrategy
    {
        if (!$key || !isset(static::$registeredStrategies[$key])) {
            $key = 'text';
        }
        return parent::spawn($key);
    }


    /**
     * Возвращает POST-данные для поля
     * @param Field|CustomField|string $field Поле для получения данных
     * @param bool $forceArray Привести к массиву
     * @param ?array $postData POST-данные для явного указания
     * @return mixed
     * @throws InvalidArgumentException В случае если $field неподходящего типа
     */
    public function getPostData($field, $forceArray = false, ?array $postData = null)
    {
        if ($postData === null) {
            $postData = $_POST;
        }

        if ($field instanceof Field) {
            $fieldName = $field->name;
        } elseif ($field instanceof CustomField) {
            $fieldName = $field->urn;
        } elseif (is_string($field)) {
            $fieldName = trim($field);
        } else {
            throw new InvalidArgumentException('Param $field must be Field|CustomField|string');
        }
        $rawPostData = $postData[$fieldName] ?? null;

        $isArray = is_array($rawPostData);
        $result = $rawPostData;
        if ($forceArray && !$isArray) {
            $result = (array)$result;
        }
        return $result;
    }


    /**
     * Проверяет заполненность поля
     * @param mixed $value Значение для проверки
     * @return boolean
     */
    public function isFilled($value): bool
    {
        if (is_scalar($value)) {
            if (trim((string)$value) === '') {
                return false;
            }
        } elseif (!$value) {
            return false;
        }
        return true;
    }


    /**
     * Проверка корректности значения согласно установленному типу данных
     * @param mixed $value Значение для проверки
     * @param ?Field $field Поле для проверки
     * @return bool true, если значение признано корректным
     * @throws DatatypeInvalidValueException в случае, если значение некорректно
     */
    public function validate($value, ?Field $field = null): bool
    {
        if (!is_scalar($value) || (trim((string)$value) === '')) {
            return true;
        }
        if ($field && $field->pattern) {
            if (!preg_match('/' . $field->pattern . '/umi', $value)) {
                throw new DatatypePatternMismatchException();
            }
        }
        return true;
    }


    /**
     * Обработка значения для сохранения в базу данных
     * @param mixed $value Значение для сохранения
     * @return mixed
     */
    public function export($value)
    {
        return trim((string)$value);
    }


    /**
     * Массовая обработка значений для сохранения в базу данных
     * (удаляет null-значения, в случае индексированного массива реиндексирует)
     * @param array $values Значения для сохранения
     * @return array
     */
    public function batchExport(array $values): array
    {
        $isIndexedArray = !array_filter(array_keys($values), function ($key) {
            return !is_numeric($key);
        });
        $result = array_map(function ($x) {
            return $this->export($x);
        }, $values);
        $result = array_filter($result, function ($x) {
            return $x !== null;
        });
        if ($isIndexedArray) {
            $result = array_values($result);
        }
        return $result;
    }


    /**
     * Обработка значения, импортированного из базы данных
     * @param mixed $value Импортированное значение
     * @return mixed
     */
    public function import($value)
    {
        return $value;
    }


    /**
     * Обработка значения, импортированного из базы данных, для вывода в JSON
     * @param mixed $value Импортированное значение
     * @return mixed
     */
    public function importForJSON($value)
    {
        return $value;
    }


    /**
     * Массовая обработка значений, импортированных из базы данных
     * (удаляет null-значения, в случае индексированного массива реиндексирует)
     * @param array $values Импортированные значения
     * @return array
     */
    public function batchImport(array $values): array
    {
        $isIndexedArray = !array_filter(array_keys($values), function ($key) {
            return !is_numeric($key);
        });
        $result = array_map(function ($x) {
            return $this->import($x);
        }, $values);
        $result = array_filter($result, function ($x) {
            return $x !== null;
        });
        if ($isIndexedArray) {
            $result = array_values($result);
        }
        return $result;
    }


    /**
     * Является ли тип данных медиа-типом
     * @return bool
     */
    public function isMedia(): bool
    {
        return false;
    }
}
