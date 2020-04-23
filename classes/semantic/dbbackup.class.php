<?php
/**
 * Файл класса резервной копии базы данных
 */
namespace RAAS;

/**
 * Класс резервной копии базы данных
 * @property-read string $filename Имя файла резервной копии
 */
class DBBackup extends Backup
{
    const TYPE = 'db';

    /**
     * Критический размер запроса (чтобы влез в SQL), байт
     */
    const DANGER_QUERY_SIZE = 100000;

    public function __get($var)
    {
        switch ($var) {
            case 'filename':
                $filename = $this->postDate . ' ' . static::TYPE . '.' . $this->id . '.sql.gz';
                return $filename;
                break;
            default:
                return parent::__get($var);
                break;
        }
    }


    public function commit()
    {
        if ($this->new) {
            $fp = gzopen($this->filepath, 'w');
            static::writeSQLDump($fp);
            fclose($fp);
        }
        parent::commit();
    }


    public function restore()
    {
        if (is_file($this->filepath)) {
            static::restoreSQLDump($this->filepath);
        }
    }


    /**
     * Записывает SQL-дамп текущей базы данных в поток
     * @param resource $fp Дескриптор потока
     */
    public static function writeSQLDump($fp)
    {
        $sqlQuery = "SHOW TABLES";
        $tables = Application::i()->SQL->getcol($sqlQuery);
        for ($i = 0; $i < count($tables); $i++) {
            $tablename = $tables[$i];
            if ($i) {
                fwrite(
                    $fp,
                    "\n\n" .
                    "-- *************************************************************\n"
                );
            }
            fwrite(
                $fp,
                "-- \n" .
                "-- Table structure: " . $tablename . "\n" .
                "-- \n" .
                "DROP TABLE IF EXISTS " . $tablename . ";\n"
            );

            $sqlQuery = "SHOW CREATE TABLE " . $tablename;
            $sqlResult = Application::i()->SQL->getline($sqlQuery);
            fwrite($fp, $sqlResult['Create Table'] . ";");
            $sqlQuery = "SELECT * FROM " . $tablename;
            $sqlResult = Application::i()->SQL->get($sqlQuery);
            $sqlQuery = "";

            $chunks = array();
            for ($j = 0, $k = 0, $size = 0; $j < count($sqlResult); $j++) {
                $size += strlen(json_encode($sqlResult[$j]));
                if (($size >= self::DANGER_QUERY_SIZE) || ($j == count($sqlResult) - 1)) {
                    $sqlQuery .= Application::i()->SQL->export($tablename, array_slice($sqlResult, $k, $j + 1 - $k), false) . ";\n";
                    $chunks[] = array($k, $j - $k + 1);
                    $k = $j + 1;
                    $size = 0;
                }
            }
            if (trim($sqlQuery)) {
                fwrite(
                    $fp,
                    "\n\n" .
                    "-- \n" .
                    "-- Table data: " . $tablename . "\n" .
                    "-- \n" .
                    $sqlQuery
                );
            }
        }
    }


    /**
     * Восстановить базу данных из дампа
     * @param string $filename Файл дампа
     * @return PDOStatement|false Результат выполнения запроса,
     *                            либо false, если неудачно
     */
    public function restoreSQLDump($filename)
    {
        if (!is_file($filename)) {
            return;
        }
        $sqlQuery = @file_get_contents($filename);
        if (mb_strtolower(pathinfo($filename, PATHINFO_EXTENSION)) == 'gz') {
            $sqlQuery = gzdecode($sqlQuery);
        }
        $result = Application::i()->SQL->query($sqlQuery);
        return $result;
    }
}
