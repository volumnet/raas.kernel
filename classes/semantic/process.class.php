<?php
/**
 * @package RAAS
 */
namespace RAAS;

use Exception;
use SOME\SOME;
use SOME\CSV;

/**
 * Процесс
 */
class Process extends SOME
{
    protected static $tablename = 'processes';

    protected static $defaultOrderBy = "post_date";

    /**
     * Отмечает процесс в базе
     * @return self
     */
    public static function checkIn()
    {
        $sqlArr = [
            'id' => getmypid(),
            'post_date' => date('Y-m-d H:i:s'),
        ];
        if (isset($_SERVER['REQUEST_URI'])) {
            $sqlArr['query'] = 'http' . ((isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] == 'on')) ? 's' : '') . '://'
                . ($_SERVER['HTTP_HOST'] ?? '') . ($_SERVER['REQUEST_URI'] ?? '');
            $sqlArr['user_agent'] = trim($_SERVER['HTTP_USER_AGENT'] ?? '');
            $sqlArr['ip'] = trim($_SERVER['REMOTE_ADDR'] ?? '');
        } else {
            $sqlArr['query'] = implode(" ", ($GLOBALS['argv'] ?? []));
        }
        try {
            static::_SQL()->add(static::_tablename(), $sqlArr);
        } catch (Exception $e) {
        }
        $process = new static($sqlArr);
        return $process;
    }


    /**
     * Получает список системных процессов
     * @return array <pre><code>array<
     *     string[] ID# процесса => [
     *         'pid' => int ID# процесса,
     *         'file' => string Имя файла,
     *         'mem' => int Использование памяти в байтах (для Windows),
     *         'mem%' => float Использование памяти в процентах (для UNIX),
     *         'cpu%' => float Использование CPU в процентах (для UNIX),
     *         'time' => int Время работы в секундах,
     *         'process' => self|null Процесс из базы
     *     ]
     * ></code></pre>
     */
    public static function getSystemTasks()
    {
        $tasks = [];
        if (stristr(PHP_OS, 'win')) {
            $cmd = 'tasklist /V /FO CSV';
        } else {
            // $cmd = 'ps ax -o %p, -o lstart -o ,%C, -o %mem -o ,%c';
            $cmd = 'ps ax -o pid=PID,lstart="Start_Time",pcpu="CPU%",pmem="MEM%",comm="Command" | awk \'
                    BEGIN {
                        OFS = ",";
                    }

                    NR == 1 {
                        # Сохраняем заголовки и выводим их как CSV
                        for (i = 1; i <= NF; i++) {
                            gsub(/"/, "\"\"", $i);   # Экранируем кавычки в заголовке
                            header = header (i==1 ? "" : OFS) "\"" $i "\""
                        }
                        print header;
                        next;
                    }

                    NR > 1 {
                        # Объединяем поля lstart (они разбиты на несколько слов)
                        start_time = "";
                        for (i = 2; i <= 6; i++) {
                            start_time = start_time (start_time == "" ? "" : " ") $i;
                        }

                        # Остальные поля
                        cpu = $7;
                        mem = $8;
                        command = "";
                        for (i = 9; i <= NF; i++) {
                            command = command (command == "" ? "" : " ") $i;
                        }

                        # Экранируем кавычки и оборачиваем в кавычки для CSV
                        gsub(/"/, "\"\"", command);

                        # Выводим CSV-строку
                        printf "\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n", $1, start_time, cpu, mem, command;
                    }\''; // 2025-05-20, AVS: обновленный формат
        }
        ob_start();
        system($cmd);
        $rawTaskList = trim(ob_get_clean());
        if (stristr(PHP_OS, 'win')) {
            $rawTaskList = iconv('cp866', 'UTF-8', $rawTaskList);
        }
        $csv = new CSV($rawTaskList, ',');
        // var_dump($csv->data); exit;
        for ($i = 1; $i < count($csv->data); $i++) {
            $row = $csv->data[$i];
            if (stristr(PHP_OS, 'win')) {
                $pid = (int)$row[1];
                $timeArr = array_reverse(explode(':', $row[7]));
                $time = 0;
                for ($j = 0; $j < count($timeArr); $j++) {
                    $time += $timeArr[$j] * pow(60, $j);
                }
                $task = [
                    'file' => $row[0],
                    'pid' => $pid,
                    'mem' => ((int)preg_replace('/\\D+/umis', '', $row[4]) * 1024),
                    'time' => $time,
                ];
            } else {
                $pid = (int)$row[0];
                $task = [
                    'file' => $row[4],
                    'pid' => $pid,
                    'mem%' => (float)$row[3],
                    'cpu%' => (float)$row[2],
                    'time' => time() - strtotime($row[1]),
                ];
            }
            $tasks[trim($pid)] = $task;
        }
        if ($tasks) {
            $sqlQuery = "DELETE FROM " . static::_tablename()
                      . " WHERE id NOT IN (" . implode(", ", array_map('intval', array_keys($tasks))) . ")";
            static::_SQL()->query($sqlQuery);
        } else { // 2025-05-20, AVS: если процессов нет, просто чистим таблицу
            $sqlQuery = "TRUNCATE TABLE " . static::_tablename();
            static::_SQL()->query($sqlQuery);
        }
        $set = static::getSet();
        foreach ($set as $item) {
            $tasks[trim($item->id)]['process'] = $item;
            $tasks[trim($item->id)]['time'] = time() - strtotime($item->post_date);
        }
        $tasks = array_filter($tasks, function ($x) {
            return stristr((string)($x['file'] ?? null), 'php') || ($x['process'] ?? false);
        });

        return $tasks;
    }


    /**
     * Удаляет процесс
     * @param int $id ID процесса
     */
    public static function kill($id)
    {
        if (stristr(PHP_OS, 'win')) {
            $cmd = 'taskkill /F /PID ' . (int)$id;
        } else {
            $cmd = 'kill ' . (int)$id;
        }
        $result = exec($cmd);
        if (stristr(PHP_OS, 'win')) {
            $result = iconv('cp866', 'UTF-8', $result);
        }

        static::_SQL()->update(
            Crontab::_tablename(),
            "pid = " . (int)$id,
            ['pid' => 0, 'start_time' => '0000-00-00 00:00:00']
        );

        $process = new static($id);
        if ($process->id) {
            static::delete($process);
        }
    }


    /**
     * Перезагрузка системы
     * @param string $password Пароль для SUDO
     */
    public static function reboot($password)
    {
        if (stristr(PHP_OS, 'win')) {
            return false;
        }
        $cmd = 'echo "' . $password . '" | sudo -S reboot';
        $result = exec($cmd, $output);
        return $result;
    }
}
