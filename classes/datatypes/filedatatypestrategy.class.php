<?php
/**
 * Стратегия типа данных "Файл"
 */
namespace RAAS;

use InvalidArgumentException;

/**
 * Класс файла стратегии типа данных "Файл"
 *
 * <pre><code>
 * Предустановленные типы данных:
 * <ФАЙЛ> => [
 *     'tmp_name' => string Путь к файлу,
 *     'name' => string Названия файлов,
 *     'type' => string MIME-типы файлов,
 * ]
 * </code></pre>
 */
class FileDatatypeStrategy extends DatatypeStrategy
{
    protected static $instance;

    /**
     * Получает запись массива по набору ключей
     * @param array|string $arr Исходный массив или значение
     * @param string[]|int[] Список ключей для "проваливания" внутрь
     * @return mixed
     */
    protected function getArrayEntry($arr, array $keys = [])
    {
        $result = $arr;
        foreach ($keys as $key) {
            $result = $result[$key] ?? null;
        }
        return $result;
    }


    /**
     * Получает массив файлов по вложенным ключам
     * @param array $filesData <pre><code>[
     *     'tmp_name' => string|array<string|рекурсивно> Пути к файлам,
     *     'name' => string|array<string|рекурсивно> Названия файлов,
     *     'type' => string|array<string|рекурсивно> MIME-типы файлов,
     * ]</code></pre> Массив FILES-данных
     * @param array $metaData <pre><code>array<
     *     string[] Ключ метаданных => string|array<string|рекурсивно>
     * ></code></pre>
     * @param string[]|int[] Список ключей для "проваливания" внутрь
     * @return array <pre><code><ФАЙЛ>|array<string[]|int[] Ключ массива => <ФАЙЛ>|рекурсивно></code></pre>
     */
    protected function getFilesEntry(array $filesData, array $metaData = [], array $keys = []): array
    {
        // Найдем, есть ли в данных или метаданных файлов массивы
        $initialArrays = [];
        foreach ([$filesData, $metaData] as $arr) {
            foreach ($arr as $key => $val) {
                $val = $this->getArrayEntry($val ?? null, $keys);
                if (is_array($val)) {
                    $initialArrays[] = $val;
                }
            }
        }

        $result = [];
        if ($initialArrays) { // Есть массивы в исходной итерации
            $initialArrays = array_reduce($initialArrays, function ($carry, $item) {
                return $carry + $item; // Чтобы сохранить ключи
            }, []);
            foreach ($initialArrays as $key => $val) {
                $result[$key] = $this->getFilesEntry($filesData, $metaData, array_merge($keys, [$key]));
            }
        } else {
            foreach ($filesData as $key => $val) {
                $result[$key] = $this->getArrayEntry($val ?? null, $keys);
            }
            foreach ($metaData as $key => $val) {
                $result['meta'][$key] = $this->getArrayEntry($val ?? null, $keys);
            }
        }
        return $result;
    }


    /**
     * Получает POST-метаданные для поля
     * @param string $fieldName Название (URN поля)
     * @param array|null $postData POST-данные для явного указания
     * @return mixed
     */
    protected function getRawFilesMetaData(string $fieldName, array $postData = [])
    {
        $result = [];
        foreach (['attachment' => $fieldName] as $key => $val) {
            if (isset($postData[$val])) {
                $result[$key] = $postData[$val];
            }
        }
        return $result;
    }


    /**
     * Возвращает данные файлов для поля
     * @param Field|CustomFfield|string $field Поле для получения данных
     * @param bool $forceArray Привести к массиву
     * @param bool $withMetaData С дополнительными мета-данными из POST-массива
     * @param array|null $filesData FILES-данные для явного указания
     * @param array|null $postData POST-данные для явного указания
     * @return mixed
     * @throws InvalidArgumentException В случае если $field неподходящего типа
     */
    public function getFilesData($field, $forceArray = false, bool $withMetaData = false, array $filesData = null, array $postData = null): array
    {
        if ($postData === null) {
            $postData = $_POST;
        }
        if ($filesData === null) {
            $filesData = $_FILES;
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
        $filesData = (array)($filesData[$fieldName] ?? []);
        $filesMetaData = [];
        if ($withMetaData) {
            $filesMetaData = $this->getRawFilesMetaData($fieldName, $postData);
        }
        $isArray = is_array($filesData['tmp_name'] ?? null) || (is_array($filesMetaData['attachment'] ?? null)); // Множественное значение

        $result = $this->getFilesEntry($filesData, $filesMetaData);

        if ($forceArray && (isset($result['meta']) || isset($result['tmp_name']))) { // Если есть записи tmp_name или meta - то это не массив
            $result = [$result];
        }
        // var_dump($result, $isArray); exit;
        return $result;
    }


    /**
     * Проверяет, загружен ли файл
     * @param string $filepath Путь к файлу для проверки
     * @param bool $debug Режим отладки (проверяет только существование файла)
     * @return bool
     */
    public function isFileLoaded(string $filepath, bool $debug = false): bool
    {
        if ($debug) {
            return is_file($filepath);
        } else {
            return is_uploaded_file($filepath);
        }
    }


    /**
     * Проверяет заполненность поля
     * @param mixed $value Значение для проверки
     * @param bool $debug Режим отладки
     * @return boolean
     */
    public function isFilled($value, bool $debug = false): bool
    {
        if (!DatatypeStrategy::isFilled($value)) {
            return false;
        }
        return $this->isFileLoaded(trim($value), $debug);
    }


    /**
     * Проверяет запись файла
     * @param array $value <pre><code><ФАЙЛ></code></pre> запись файла для проверки
     * @param Field $field Поле для проверки
     */
    public function validate($value, Field $field = null): bool
    {
        if (!is_scalar($value['tmp_name'] ?? null) || (trim($value['tmp_name'] ?? '') === '')) {
            return true;
        }
        if ($field) {
            if ($field->pattern) {
                if (!preg_match('/' . $field->pattern . '/umi', $value['name'])) {
                    throw new DatatypePatternMismatchException();
                }
            }
            if ($field->accept) {
                $accept = explode(',', mb_strtolower($field->accept));
                $accept = array_map(function ($x) {
                    $y = trim($x);
                    if ($y[0] == '.') {
                        $y = mb_substr($y, 1);
                    }
                    return $y;
                }, $accept);
                $ext = mb_strtolower(pathinfo($value['name'], PATHINFO_EXTENSION));
                $accept = array_filter($accept);
                if ($accept) {
                    $matchAccept = false;
                    foreach ($accept as $fileType) {
                        if (stristr($fileType, '/')) {
                            $fileTypeRx = $fileType;
                            $fileTypeRx = str_replace('*', '[\\w|\\-]*', $fileTypeRx);
                            $fileTypeRx = str_replace('/', '\\/', $fileTypeRx);
                            if (preg_match('/^' . $fileTypeRx . '$/umis', $value['type'])) {
                                $matchAccept = true;
                                break;
                            }
                        } else {
                            if ($ext == $fileType) {
                                $matchAccept = true;
                                break;
                            }
                        }
                    }
                    if (!$matchAccept) {
                        throw new DatatypeFileTypeMismatchException();
                    }
                }
            }
        }
        return true;
    }


    /**
     * Обработка значения для сохранения в базу данных
     * @param Attachment $value Значение для сохранения
     * @return mixed
     * @throws InvalidArgumentException В случае, если переданное значение $value не является вложением
     */
    public function export($value)
    {
        if (!($value instanceof Attachment)) {
            throw new InvalidArgumentException('Value must be an attachment');
        }
        return (int)$value->id;
    }


    /**
     * Обработка значения, импортированного из базы данных
     * @param mixed $value Импортированное значение
     * @return Attachment|null
     */
    public function import($value)
    {
        if ($value) {
            return new Attachment((int)$value);
        }
        return null;
    }


    /**
     * Массовая обработка получения списка ID# вложений по значениям, импортированным из базы данных
     * @param array $values Импортированные значения
     * @return int[]
     */
    public function batchImportAttachmentsIds(array $values): array
    {
        $result = array_values(array_unique(array_filter(array_map('intval', $values))));

        return $result;
    }


    /**
     * Массовая обработка значений, импортированных из базы данных
     * @param array $values Импортированные значения
     * @return Attachment[]
     */
    public function batchImport(array $values): array
    {
        $isIndexedArray = !array_filter(array_keys($values), function ($key) {
            return !is_numeric($key);
        });
        $ids = $this->batchImportAttachmentsIds($values);

        $result = [];

        if ($ids) {
            $sqlResult = Attachment::getSet(['where' => "id IN (" . implode(", ", $ids) . ")"]);
            $attachments = [];
            foreach ($sqlResult as $attachment) {
                $attachments[trim($attachment->id)] = $attachment;
            }
            foreach ($values as $key => $value) {
                if (isset($attachments[trim($value)])) {
                    $result[$key] = $attachments[trim($value)];
                }
            }
        }
        if ($isIndexedArray) {
            $result = array_values($result);
        }
        return $result;
    }


    public function isMedia(): bool
    {
        return true;
    }
}
