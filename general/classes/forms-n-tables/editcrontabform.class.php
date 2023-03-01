<?php
/**
 * Форма редактирования задачи планировщика
 */
namespace RAAS\General;

use ReflectionClass;
use RAAS\Application;
use RAAS\Command;
use RAAS\Crontab;
use RAAS\Form;
use RAAS\Field;

/**
 * Класс формы редактирования задачи планировщика
 * @property-read ViewSub_Crontab $view Представление
 */
class EditCrontabForm extends Form
{
    /**
     * Аргументы из POST-массива
     * @var mixed[]
     */
    protected $postArgs = [];

    public function __get($var)
    {
        switch ($var) {
            case 'view':
                return ViewSub_Crontab::i();
                break;
            default:
                return parent::__get($var);
                break;
        }
    }


    public function __construct(array $params = [])
    {
        $launchTimes = [];
        foreach ([5, 10, 15, 20, 30] as $mm) {
            $launchTimes[$mm . 'm'] = 'EVERY_' . $mm . '_MINUTES';
        }
        $launchTimes['1h'] = 'EVERY_HOUR';
        foreach ([2, 3, 6, 8, 12] as $hh) {
            $launchTimes[$hh . 'h'] = 'EVERY_' . $hh . '_HOURS';
        }
        $launchTimes['1d'] = 'EVERY_DAY';
        $launchTimes['1'] = 'LAUNCH_ONCE';
        $launchTimes[''] = 'CUSTOM';
        $launchTimeChildren = [];
        foreach ($launchTimes as $val => $caption) {
            $launchTimeChildren[] = [
                'value' => $val,
                'caption' => $this->view->_($caption)
            ];
        }
        $mmChildren = $mmChildren = $ddChildren = $wwChildren = [];
        for ($i = 0; $i < 60; $i += 5) {
            $mmChildren[] = ['value' => $i, 'caption' => $i];
        }
        for ($i = 0; $i < 24; $i++) {
            $hhChildren[] = ['value' => $i, 'caption' => $i];
        }
        for ($i = 1; $i <= 31; $i++) {
            $ddChildren[] = ['value' => $i, 'caption' => $i];
        }
        foreach ([
            'SUNDAY',
            'MONDAY',
            'TUESDAY',
            'WEDNESDAY',
            'THURSDAY',
            'FRIDAY',
            'SHABBAT',
        ] as $i => $ww) {
            $wwChildren[] = ['value' => $i, 'caption' => $this->view->_($ww)];
        }
        $commands = $this->getCommands();
        $commandsChildren = [];
        foreach ($commands as $command => $commandData) {
            $commandsChildren[] = [
                'value' => $command,
                'caption' => $commandData['caption'] . ' (' . $command . ')',
            ];
        }


        $item = isset($params['Item']) ? $params['Item'] : null;
        if ($item->id) {
            $command = $item->command_classname;
            $commandOnChange = 'if (confirm(\'' . addslashes($this->view->_('CHANGE_COMMAND_EXISTING_CONFIRM')) . '\')) { '
                             .    ' $(\'[data-command-arg]\').val(\'\'); '
                             .    ' $(\'[name="name"]\').val(\'\'); '
                             .    ' this.form.submit(); '
                             . '}';
        } else {
            $command = $params['command'];
            $commandOnChange = 'if (confirm(\'' . addslashes($this->view->_('CHANGE_COMMAND_NEW_CONFIRM')) . '\')) { '
                             .    ' var url = document.location.href; '
                             .    ' url = url.replace(/(&|\\?)command=[\\w\\\\]+/, \'\'); '
                             .    ' url += (/\\?/.test(url) ? \'&\' : \'?\') + \'command=\' + this.value; '
                             .    ' document.location.href = url; '
                             . '}';
        }
        $defaultParams = [
            'caption' => $this->view->_('EDIT_TASK'),
            'parentUrl' => Sub_Crontab::i()->url,
            'children' => [
                'vis' => [
                    'type' => 'checkbox',
                    'name' => 'vis',
                    'caption' => $this->view->_('ACTIVE'),
                    'default' => true,
                ],
                'name' => [
                    'name' => 'name',
                    'caption' => $this->view->_('NAME'),
                ],
                'time' => [
                    'type' => 'select',
                    'name' => 'time',
                    'caption' => $this->view->_('LAUNCH_TIME'),
                    'default' => '5m',
                    'children' => $launchTimeChildren,
                    'import' => function ($field) {
                        $item = $field->Form->Item;
                        if ($item->once) {
                            return '1';
                        } elseif (preg_match('/\\*(\\/(\\d+))?/umi', $item->minutes, $regs) &&
                            ($item->hours == '*')
                        ) {
                            if (in_array($regs[2] ?? '', ['', '1', '5'])) {
                                return '5m';
                            } elseif (in_array($regs[2] ?? '', ['10', '15', '20', '30'])) {
                                return ($regs[2] ?? '') . 'm';
                            }
                        } elseif (($item->minutes == '0') &&
                            preg_match('/\\*(\\/(\\d+))?/umi', $item->hours, $regs)
                        ) {
                            if (in_array($regs[2] ?? '', ['', '1'])) {
                                return '1h';
                            } elseif (in_array($regs[2] ?? '', ['2', '3', '6', '8', '12'])) {
                                return ($regs[2] ?? '') . 'h';
                            }
                        } elseif (($item->minutes == '0') &&
                            ($item->hours == '0')
                        ) {
                            return '1d';
                        }
                        return '';
                    },
                    'export' => function ($field) {
                        $item = $field->Form->Item;
                        if ($_POST[$field->name] == '1') {
                            $item->once = 1;
                        } else {
                            $item->once = 0;
                        }
                        if (preg_match(
                            '/(\\d+)m/umis',
                            $_POST[$field->name],
                            $regs
                        )) {
                            $minutes = '*';
                            if ((int)$regs[1] > 5) {
                                $minutes .= '/' . (int)$regs[1];
                            }
                            $item->minutes = $minutes;
                            $item->hours = '*';
                        } elseif (preg_match(
                            '/(\\d+)h/umis',
                            $_POST[$field->name],
                            $regs
                        )) {
                            $item->minutes = '0';
                            $hours = '*';
                            if ((int)$regs[1] > 1) {
                                $hours .= '/' . (int)$regs[1];
                            }
                            $item->hours = $hours;
                        } elseif (preg_match(
                            '/1d/umis',
                            $_POST[$field->name],
                            $regs
                        )) {
                            $item->minutes = '0';
                            $item->hours = '0';
                        }
                    }
                ],
                'minutes' => [
                    'type' => 'select',
                    'name' => 'minutes',
                    'caption' => $this->view->_('MINUTES'),
                    'multiple' => true,
                    'children' => $mmChildren,
                    'export' => [$this, 'exportVals'],
                    'import' => [$this, 'importVals'],
                ],
                'hours' => [
                    'type' => 'select',
                    'name' => 'hours',
                    'caption' => $this->view->_('HOURS'),
                    'multiple' => true,
                    'children' => $hhChildren,
                    'export' => [$this, 'exportVals'],
                    'import' => [$this, 'importVals'],
                ],
                'days' => [
                    'type' => 'select',
                    'name' => 'days',
                    'caption' => $this->view->_('DAYS'),
                    'multiple' => true,
                    'children' => $ddChildren,
                    'export' => [$this, 'exportVals'],
                    'import' => [$this, 'importVals'],
                ],
                'weekdays' => [
                    'type' => 'select',
                    'name' => 'weekdays',
                    'caption' => $this->view->_('WEEKDAYS'),
                    'multiple' => true,
                    'children' => $wwChildren,
                    'export' => [$this, 'exportVals'],
                    'import' => [$this, 'importVals'],
                ],
                'command_classname' => [
                    'type' => 'select',
                    'name' => 'command_classname',
                    'caption' => $this->view->_('COMMAND'),
                    'children' => $commandsChildren,
                    'placeholder' => $this->view->_('ARBITRARY_COMMAND_LINE'),
                    'onchange' => $commandOnChange,
                    'default' => $command,
                ],
            ],
            'export' => function ($form) {
                $item = $form->Item;
                $this->postArgs = [];
                $form->exportDefault();
                $item->arguments = $this->postArgs;
            }
        ];
        if ($command) {
            $commandData = Crontab:: getCommandData($command);
            for ($i = 0; $i < count($commandData['args']); $i++) {
                $arg = $commandData['args'][$i];
                $defaultParams['children']['args_' . $arg['var']] = [
                    'type' => ($arg['type'] == 'checkbox') ? 'select' : 'text',
                    'name' => 'args_' . $arg['var'],
                    'caption' => $arg['caption']
                              ?  ($arg['caption'] . ' ($' . $arg['var'] . ')')
                              : '$' . $arg['var'],
                    'placeholder' => $arg['default'],
                    'data-command-arg' => 1,
                    'import' => function ($field) use ($commandData, $i) {
                        $item = $field->Form->Item;
                        $itemArgs = $item->arguments;
                        $arg = $commandData['args'][$i];
                        $itemArg = $itemArgs[$i] ?? '';
                        if ($arg['type'] == 'checkbox') {
                            $itemArg = $itemArg ? 1 : -1;
                        }
                        return $itemArg;
                    },
                    'export' => function ($field) use ($commandData, $i) {
                        $val = null;
                        $arg = $commandData['args'][$i];
                        $postVal = trim($_POST[$field->name]);
                        if ($postVal !== '') {
                            switch ($arg['type']) {
                                case 'checkbox':
                                    $val = ($postVal > 0);
                                    break;
                                case 'number':
                                    if (preg_match('/\\d/umis', $postVal)) {
                                        if (in_array(
                                            $arg['phpType'],
                                            ['float', 'real', 'double']
                                        )) {
                                            $val = (float)$postVal;
                                        } else {
                                            $val = (int)$postVal;
                                        }
                                    }
                                    break;
                                default:
                                    $val = $postVal;
                                    break;
                            }
                        }
                        $this->postArgs[$i] = $val;
                    },
                ];
                if ($arg['type'] == 'checkbox') {
                    $defaultParams['children']['args_' . $arg['var']]['placeholder'] = '--';
                    $defaultParams['children']['args_' . $arg['var']]['children'] = [
                        ['value' => '1', 'caption' => $this->view->_('_YES')],
                        ['value' => '-1', 'caption' => $this->view->_('_NO')],
                    ];
                }
            }
            $defaultParams['children']['additional_args'] = [
                'name' => 'additional_args',
                'caption' => $this->view->_('ADDITIONAL_ARGUMENTS'),
                'multiple' => true,
                'data-command-arg' => 1,
                'import' => function ($field) use ($commandData) {
                    $item = $field->Form->Item;
                    $itemArgs = $item->arguments;
                    $val = array_slice($itemArgs, count($commandData['args']));
                    $val = array_map('trim', $val);
                    return $val;
                },
                'export' => function ($field) use ($commandData) {
                    $vals = array_map(function ($x) {
                        return (trim($x) !== '') ? trim($x) : null;
                    }, (array)$_POST[$field->name]);
                    $this->postArgs = array_merge($this->postArgs, $vals);
                }
            ];
        } else {
            $defaultParams['children']['command_line'] = [
                'name' => 'command_line',
            ];
        }
        $defaultParams['children']['save_log'] = [
            'type' => 'checkbox',
            'name' => 'save_log',
            'caption' => $this->view->_('SAVE_LOG'),
        ];
        $defaultParams['children']['email_log'] = [
            'name' => 'email_log',
            'caption' => $this->view->_('EMAIL_LOG'),
        ];
        $arr = array_merge($defaultParams, $params);
        parent::__construct($arr);
    }


    /**
     * Экспортирует данные в поле периодов
     * @param Field $field Поле
     */
    public function exportVals(Field $field)
    {
        if (in_array($_POST['time'], ['1', '']) ||
            !in_array($field->name, ['minutes', 'hours'])
        ) {
            $field->Form->Item->{$field->name} = $this->compactValues(
                (array)$_POST[$field->name],
                $field->name
            );
        }
    }


    /**
     * Импортирует данные из поля периодов
     * @param function $field Поле
     * @return string[] Набор значений
     */
    public function importVals(Field $field)
    {
        $val = trim($field->Form->Item->{$field->name});
        $val = $this->expandValues($val, $field->name);
        return $val;
    }


    /**
     * По возможности сокращает запись данных
     * @param int[] $data Данные
     * @param string $fieldName Наименование поля
     * @return string
     */
    protected function compactValues(array $data, $fieldName)
    {
        if (!$data) {
            return '*';
        }
        $data = array_map('intval', $data);
        sort($data);
        $from = $to = 0;
        $steps = [];
        switch ($fieldName) {
            case 'minutes':
                $from = 0;
                $to = 60;
                $steps = [5, 10, 15, 20, 30];
                break;
            case 'hours':
                $from = 0;
                $to = 24;
                $steps = [1, 2, 3, 4, 6, 12];
                break;
        }
        if ($steps) {
            $steps = array_reverse($steps);
            foreach ($steps as $step) {
                $range = range($from, $to - 1, $step);
                if ($data == $range) {
                    if ((($fieldName == 'minutes') && ($step == 5)) ||
                        (($fieldName == 'hours') && ($step == 1))
                    ) {
                        return '*';
                    } else {
                        return '*/' . $step;
                    }
                }
            }
        }
        return implode(',', $data);
    }


    /**
     * Разворачивает данные из строки в массив
     * @param string $data Данные в виде строки
     * @param string $fieldName Наименование поля
     * @return string
     */
    protected function expandValues($data, $fieldName)
    {
        if (($data === '') ||
            ($data == '*') ||
            (($fieldName == 'minutes') && ($data == '*/5'))
        ) {
            return [];
        }
        if (preg_match('/\\*\\/(\\d+)/umis', $data, $regs)) {
            switch ($fieldName) {
                case 'minutes':
                    $from = 0;
                    $to = 59;
                    break;
                case 'hours':
                    $from = 0;
                    $to = 23;
                    break;
                case 'days':
                    $from = 1;
                    $to = 31;
                    break;
                case 'weekdays':
                    $from = 0;
                    $to = 6;
                    break;
            }
            return range($from, $to, (int)$regs[1]);
        }
        $vals = explode(',', $data);
        $vals = array_map('intval', $vals);
        sort($vals);
        return $vals;
    }


    /**
     * Получает список команд
     * @return array <pre>array<string[] Класс команды => [
     *     'caption' => string Наименование команды,
     *     'args' => array<[
     *         'var' => string Переменная аргумента,
     *         'type' => string Тип данных,
     *         'phpType' => string Оригинальный тип данных,
     *         'caption' => string Наименование аргумента,
     *         'default' => mixed Значение по умолчанию
     *     ]>
     * ]></pre>
     */
    public function getCommands()
    {
        $result = [];
        $classMapFile = Application::i()->baseDir
                      . '/vendor/composer/autoload_classmap.php';
        if (is_file($classMapFile)) {
            $classnames = include $classMapFile;
            $classnames = array_filter(array_keys($classnames), function ($x) {
                return stristr($x, 'Command') &&
                       is_subclass_of($x, Command::class);
            });
            foreach ($classnames as $command) {
                $reflectionClass = new ReflectionClass($command);
                if ($reflectionClass->isAbstract()) {
                    continue;
                }
                $result[$command] = Crontab::getCommandData($command);
            }
        }
        return $result;
    }



}
