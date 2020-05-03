<?php
/**
 * Задача планировщика
 */
namespace RAAS;

use Exception;
use ReflectionClass;
use phpDocumentor\Reflection\DocBlockFactory;
use SOME\SOME;

/**
 * Класс задачи планировщика
 * @property-read CrontabLog[] $logs Набор логов
 * @property mixed[] $arguments Набор аргументов в виде массива
 * @property-read array|null $commandData <pre>[
 *     'caption' => string Наименование команды,
 *     'args' => array<[
 *         'var' => string Переменная аргумента,
 *         'type' => string Тип данных,
 *         'phpType' => string Оригинальный тип данных,
 *         'caption' => string Наименование аргумента,
 *         'default' => mixed Значение по умолчанию
 * ]</pre>, Данные по текущей команде либо null, если заданный класс - не команда
 * @param mixed[] $commandArguments Реальные аргументы для выполнения команды
 *                                  (с учетом значений по умолчанию)
 */
class Crontab extends SOME
{
    protected static $tablename = 'crontab';

    protected static $defaultOrderBy = "priority";

    protected static $aiPriority = true;

    protected static $children = [
        'children' => [
            'classname' => CrontabLog::class,
            'FK' => 'pid'
        ]
    ];

    protected static $cognizableVars = [
        'arguments',
        'commandData',
        'commandArguments'
    ];

    public function __set($var, $val)
    {
        switch ($var) {
            case 'arguments':
                $val = (array)$val;
                for ($i = count($val) - 1; $i >= 0; $i--) {
                    if ($val[$i] === null) {
                        unset($val[$i]);
                    } else {
                        break;
                    }
                }
                $this->args = json_encode((array)$val);
                break;
            default:
                return parent::__set($var, $val);
                break;
        }
    }


    public function commit()
    {
        if ($this->command_classname) {
            $this->command_line = '';
        }
        parent::commit();
    }


    /**
     * Определяет, подходящее ли время сейчас для выполнения команды
     * @param int|null $timestamp UNIX-timestamp времени (null для текущего времени)
     * @return bool
     */
    public function isProperTime($timestamp = null)
    {
        if ($timestamp === null) {
            $timestamp = time();
        }
        foreach ([
            'minutes' => 'i',
            'hours' => 'H',
            'days' => 'd',
            'weekdays' => 'w'
        ] as $prop => $dateProp) {
            $commandVal = $this->$prop;
            if ($commandVal != '*') {
                $dateVal = (int)date($dateProp, $timestamp);
                if (preg_match('/^\\*\\/(\\d+)$/umis', $commandVal, $regs)) {
                    if ($dateVal % $regs[1]) {
                        return false;
                    }
                } else {
                    $vals = array_map('intval', explode(',', $commandVal));
                    if (!in_array($dateVal, $vals)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }


    /**
     * Выполняет задачу
     * @param Abstract_Controller_Cron $controller Контроллер выполнения
     *                                             cron-задач
     * @param int|null|true $timestamp UNIX-timestamp времени
     *                                 (null для текущего времени,
     *                                 true для отсуствия проверки)
     * @return Возвращает вывод STDOUT выполнения команды
     */
    public function process(Abstract_Controller_Cron $controller, $timestamp = null)
    {
        if (!($timestamp === true) && !$this->isProperTime($timestamp)) {
            return;
        }
        $this->start_time = date('Y-m-d H-i-s');
        $this->commit();

        $result = '';
        ob_start(function ($x) use (&$result) {
            $result .= $x;
            return $x;
        }, 2); // 2 байта, т.к. значение 1 используется как системное
        $this->processCommand($controller);
        ob_end_flush();

        if ($result = trim($result)) {
            if ($this->save_log) {
                $logTime = time();
                $log = new CrontabLog([
                    'pid' => (int)$this->id,
                    'post_date' => date('Y-m-d H:i:s', $logTime)
                ]);
                $filename = date('Y-m-d H-i-s', $logTime) . ' task' . (int)$this->id
                          . '_' . uniqid('') . '.txt';
                $filepath = sys_get_temp_dir() . '/' . $filename;
                file_put_contents($filepath, $result);
                $attachment = Attachment::createFromFile(
                    $filepath,
                    $log,
                    null,
                    null,
                    'text/plain'
                );
                $log->attachment_id = (int)$attachment->id;
                $log->commit();
            }
            if ($this->email_log) {
                $toArr = preg_split('/(,|;| )/umis', $this->email_log);
                $toArr = array_filter($toArr, 'trim');
                $subject = date('Y-m-d H:i:s');
                if ($_SERVER['HTTP_HOST']) {
                    $subject .= ', ' . $_SERVER['HTTP_HOST'];
                }
                $subject .= ': ' . $this->name . ' log';
                Application::i()->sendmail(
                    $toArr,
                    $subject,
                    $result,
                    null,
                    null,
                    false
                );
            }
        }

        $this->start_time = '';
        if ($this->once) {
            $this->vis = 0;
        }
        $this->commit();
    }


    /**
     * Выполняет команду в чистом виде
     * @param Abstract_Controller_Cron $controller Контроллер выполнения
     *                                             cron-задач
     * @return mixed
     */
    public function processCommand(Abstract_Controller_Cron $controller)
    {
        if ($classname = $this->command_classname) {
            $command = new $classname($controller);
            $result = call_user_func_array(
                [$command, 'process'],
                $this->commandArguments
            );
        } elseif ($cmd = $this->command_line) {
            system($cmd);
        }
        return $result;
    }


    /**
     * Получает данные о команде
     * @param string $classname Класс команды
     * @return array|null <pre>[
     *     'caption' => string Наименование команды,
     *     'args' => array<[
     *         'var' => string Переменная аргумента,
     *         'type' => string Тип данных,
     *         'phpType' => string Оригинальный тип данных,
     *         'caption' => string Наименование аргумента,
     *         'default' => mixed Значение по умолчанию
     * ]</pre>, либо null, если заданный класс - не команда
     */
    public static function getCommandData($classname)
    {
        if (!is_subclass_of($classname, Command::class)) {
            return null;
        }
        $reflectionClass = new ReflectionClass($classname);
        $caption = '';
        try {
            $docBlockFactory  = DocBlockFactory::createInstance();
            $docBlock = $docBlockFactory->create($reflectionClass->getDocComment());
            $caption = $docBlock->getSummary();
        } catch (Exception $e) {
        }
        $reflectionMethod = $reflectionClass->getMethod('process');
        $args = $reflectionMethod->getParameters();
        $docBlockTags = [];
        try {
            $docBlockFactory  = DocBlockFactory::createInstance();
            $docBlock = $docBlockFactory->create($reflectionMethod->getDocComment());
            foreach ($docBlock->getTags() as $tag) {
                if ($tag->getName() == 'param') {
                    $tagVarName = $tag->getVariableName();
                    $tagType = trim($tag->getType());
                    if (preg_match('/bool/umis', $tagType)) {
                        $tagType = 'checkbox';
                    } elseif (preg_match('/int|float|real|double/umis', $tagType)) {
                        $tagType = 'number';
                    } else {
                        $tagType = 'text';
                    }
                    $tagDescription = $tag->getDescription()->render();
                    $docBlockTags[$tagVarName] = [
                        'type' => $tagType,
                        'phpType' => $tag->getType(),
                        'caption' => $tagDescription,
                    ];
                }
            }
        } catch (Exception $e) {
        }
        $params = [];
        foreach ($args as $arg) {
            $argName = $arg->getName();
            $default = $arg->getDefaultValue();
            $param = [
                'var' => $argName,
                'type' => '',
                'caption' => '',
                'default' => $default,
            ];
            if (isset($docBlockTags[$argName])) {
                $param = array_merge($param, (array)$docBlockTags[$argName]);
            }
            $params[] = $param;
        }
        $result = [
            'caption' => $caption,
            'args' => $params,
        ];
        return $result;
    }


    /**
     * Получает набор аргументов текущей задачи в виде массива
     * @return mixed[]
     */
    protected function _arguments()
    {
        $result = (array)json_decode($this->args, true);
        return $result;
    }


    /**
     * Получает данные о текущей команде
     * @param string $classname Класс команды
     * @return array|null <pre>[
     *     'caption' => string Наименование команды,
     *     'args' => array<[
     *         'var' => string Переменная аргумента,
     *         'type' => string Тип данных,
     *         'phpType' => string Оригинальный тип данных,
     *         'caption' => string Наименование аргумента,
     *         'default' => mixed Значение по умолчанию
     * ]</pre>, либо null, если заданный класс - не команда
     */
    protected function _commandData()
    {
        return static::getCommandData($this->command_classname);
    }


    /**
     * Получаент реальные аргументы для выполнения команды
     * (с учетом значений по умолчанию)
     * @return mixed[]
     */
    protected function _commandArguments()
    {
        $result = [];
        for ($i = 0; $i < count((array)$this->arguments); $i++) {
            $val = $this->arguments[$i];
            if ($val === null) {
                $val = $this->commandData['args'][$i]['default'];
            }
            $result[] = $val;
        }
        return $result;
    }
}
