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
 */
class Crontab extends SOME
{
    protected static $tablename = 'crontab';

    protected static $defaultOrderBy = "priority";

    protected static $aiPriority = true;

    protected static $cognizableVars = ['arguments', 'commandData'];

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
    public function _commandData()
    {
        return static::getCommandData($this->command_classname);
    }
}
