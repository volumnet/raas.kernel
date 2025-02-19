<?php
/**
 * @todo
 */
namespace RAAS;

use DateTime;
use SOME\File;

/**
 * Парсер лога ошибок PHP
 */
class PHPErrorLogParser
{
    /**
     * Разбирает текст по ошибкам
     * @param string $text Текст лога
     * @return array <pre><code>array<[
     *     'file' => string Относительный путь файла (относительно корня сайта),
     *     'line' => int Строка в файле,
     *     'evalLine' ?=> int Строка выполняемого eval-выражения,
     *     'type' => string Тип ошибки,
     *     'datetime' => string Дата/время последней ошибки,
     *     'description' => string Описание ошибки,
     *     'count' => int Количество ошибок
     * ]></code></pre>
     */
    public function parse(string $text): array
    {
        $rawErrors = $this->splitErrors($text);
        $errors = array_map(fn($x) => $this->parseError($x), $rawErrors);
        $result = $this->mergeErrors($errors);
        return $result;
    }


    /**
     * Разбивает текст по текстам ошибок
     * @param string $text Текст лога
     * @return string[] Тексты ошибок
     */
    public function splitErrors(string $text): array
    {
        $text = trim($text);
        $result = [];
        $lines = explode("\n", $text);
        $errorArr = [];
        $parseStarted = false;
        for ($i = 0; $i < count($lines); $i++) {
            $line = $lines[$i];
            $trimmedLine = trim($line);
            if (($trimmedLine[0] ?? '') == '[') {
                if ($parseStarted) {
                    $result[] = trim(implode("\n", $errorArr));
                    $errorArr = [];
                } else {
                    $parseStarted = true;
                }
            }
            if ($parseStarted) {
                $errorArr[] = $line;
            }
        }
        if ($parseStarted && $errorArr) {
            $result[] = trim(implode("\n", $errorArr));
        }
        return $result;
    }


    /**
     * Парсит текст ошибки
     * @param string $error Текст ошибки
     * @return array <pre><code>[
     *     'file' => string Относительный путь файла (относительно корня сайта),
     *     'line' => int Строка в файле,
     *     'evalLine' ?=> int Строка выполняемого eval-выражения,
     *     'type' => string Тип ошибки,
     *     'datetime' => string Дата/время ошибки,
     *     'description' => string Описание ошибки,
     * ]</code></pre>
     */
    public function parseError(string $error): array
    {
        $result = [];
        $text = trim($error);
        // Найдем дату/время
        $indexOfOpenSquareBracket = mb_strpos($text, '[');
        $indexOfCloseSquareBracket = mb_strpos($text, ']', (int)$indexOfOpenSquareBracket + 1);
        if (($indexOfOpenSquareBracket !== false) && ($indexOfCloseSquareBracket !== false)) {
            $timeRawString = mb_substr(
                $text,
                $indexOfOpenSquareBracket + 1,
                $indexOfCloseSquareBracket - $indexOfOpenSquareBracket - 1
            );
            $text = mb_substr($text, 0, $indexOfOpenSquareBracket) . mb_substr($text, $indexOfCloseSquareBracket + 1);
            $datetime = new DateTime($timeRawString);
            $result['datetime'] = $datetime->format(DateTime::ATOM);
        }

        // Найдем тип ошибки
        $indexOfPHP = mb_strpos($text, ' PHP ');
        $indexOfColon = mb_strpos($text, ':', (int)$indexOfPHP + 1);
        if (($indexOfPHP !== false) && ($indexOfColon !== false)) {
            $errorTypeString = trim(mb_substr($text, $indexOfPHP + 5, $indexOfColon - $indexOfPHP - 5));
            $text = trim(mb_substr($text, 0, $indexOfPHP) . mb_substr($text, $indexOfColon + 1));
            $result['type'] = $errorTypeString;
        }

        // Найдем оригинальную строку (с конца)
        $text = trim($text);
        $indexOfOnLine = mb_strrpos($text, ' on line ');
        $originalLine = '';
        if ($indexOfOnLine !== false) {
            $originalLine = mb_substr($text, $indexOfOnLine + 9);
            $text = trim(mb_substr($text, 0, $indexOfOnLine));
        }

        // Найдем оригинальный файл (с конца)
        $text = trim($text);
        $indexOfFile = mb_strrpos($text, ' in ');
        $originalFile = '';
        if ($indexOfFile !== false) {
            $originalFile = mb_substr($text, $indexOfFile + 4);
            $text = trim(mb_substr($text, 0, $indexOfFile));
        }


        if (($indexOfEvaldCode = mb_strpos($originalFile, ' : eval()\'d code')) !== false) {
            // eval-выражение
            $result['evalLine'] = (int)$originalLine;
            $originalFile = mb_substr($originalFile, 0, $indexOfEvaldCode);
            $indexOfOpenBracket = mb_strrpos($originalFile, '(');
            $indexOfCloseBracket = mb_strpos($originalFile, ')', (int)$indexOfOpenBracket + 1);
            if (($indexOfOpenBracket !== false) && ($indexOfCloseBracket !== false)) {
                $fileLine = mb_substr(
                    $originalFile,
                    $indexOfOpenBracket + 1,
                    $indexOfCloseBracket - $indexOfOpenBracket - 1
                );
                $originalFile = mb_substr($originalFile, 0, $indexOfOpenBracket);
                $result['line'] = (int)$fileLine;
            }
        } else {
            // Обычный файл
            $result['line'] = (int)$originalLine;
        }

        $realFile = realpath($originalFile);
        $realFile = str_replace('\\', '/', (string)$realFile);
        $realFile = preg_replace_callback('/^\\w+/umis', fn($regs) => mb_strtolower($regs[0]), $realFile);
        $baseDir = realpath(Application::i()->baseDir);
        $baseDir = str_replace('\\', '/', (string)$baseDir);
        $baseDir = preg_replace_callback('/^\\w+/umis', fn($regs) => mb_strtolower($regs[0]), $baseDir);
        if ($realFile && $baseDir && (mb_stripos($realFile, $baseDir) === 0)) {
            $result['file'] = mb_substr($realFile, mb_strlen($baseDir));
        } else {
            $result['file'] = str_replace('\\', '/', (string)$originalFile);
            $result['file'] = preg_replace_callback(
                '/^\\w+/umis',
                fn($regs) => mb_strtolower($regs[0]),
                $result['file']
            );
        }

        // Уберем Stack trace
        $indexOfStackTrace = mb_strpos($text, 'Stack trace:');
        if ($indexOfStackTrace !== false) {
            $text = mb_substr($text, 0, $indexOfStackTrace);
        }

        // Уберем оригинальную строку (с конца)
        $text = trim($text);
        $indexOfOnLine = mb_strrpos($text, ' on line ');
        if ($indexOfOnLine !== false) {
            $text = trim(mb_substr($text, 0, $indexOfOnLine));
        }

        // Уберем оригинальный файл (с конца)
        $text = trim($text);
        $indexOfFile = mb_strrpos($text, ' in ');
        if ($indexOfFile !== false) {
            $text = trim(mb_substr($text, 0, $indexOfFile));
        }

        $result['description'] = trim($text);

        return $result;
    }


    /**
     * Объединяет ошибки
     * @param array $errors <pre><code>array<[
     *     'file' => string Относительный путь файла (относительно корня сайта),
     *     'line' => int Строка в файле,
     *     'evalLine' ?=> int Строка выполняемого eval-выражения,
     *     'type' => string Тип ошибки,
     *     'datetime' => string Дата/время ошибки,
     *     'description' => string Описание ошибки,
     * ]></code></pre> Ошибки
     * @return array <pre><code>array<[
     *     'file' => string Относительный путь файла (относительно корня сайта),
     *     'line' => int Строка в файле,
     *     'evalLine' ?=> int Строка выполняемого eval-выражения,
     *     'type' => string Тип ошибки,
     *     'datetime' => string Дата/время последней ошибки,
     *     'description' => string Описание ошибки,
     *     'count' => int Количество ошибок
     * ]></code></pre>
     */
    public function mergeErrors(array $errors): array
    {
        $result = [];
        foreach ($errors as $error) {
            $key = $error['type'] . '@' . $error['file'] . ':' . $error['line'];
            if ($error['evalLine'] ?? null) {
                $key .= ':' . $error['evalLine'];
            }
            if (!isset($result[$key])) {
                $result[$key] = $error;
                $result[$key]['count'] = 0;
            }
            $result[$key]['datetime'] = $error['datetime'];
            $result[$key]['count']++;
        }

        $result = array_values($result);
        return $result;
    }
}
