<?php
/**
 * Форма редактирования задачи планировщика
 */
namespace RAAS\General;

use RAAS\Crontab;
use RAAS\Form;
use RAAS\Field;

/**
 * Класс формы редактирования задачи планировщика
 * @property-read ViewSub_Crontab $view Представление
 */
class EditCrontabForm extends Form
{
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
        $launchTimes = ['1' => 'LAUNCH_ONCE'];
        foreach ([5, 10, 15, 20, 30] as $mm) {
            $launchTimes[$mm . 'm'] = 'EVERY_' . $mm . '_MINUTES';
        }
        $launchTimes['1h'] = 'EVERY_HOUR';
        foreach ([2, 3, 6, 12] as $hh) {
            $launchTimes[$hh . 'h'] = 'EVERY_' . $hh . '_HOURS';
        }
        $launchTimes['1d'] = 'EVERY_DAY';
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

        $item = isset($params['Item']) ? $params['Item'] : null;
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
                    'required' => 'required',
                ],
                'time' => [
                    'type' => 'select',
                    'name' => 'time',
                    'caption' => $this->view->_('LAUNCH_TIME'),
                    'default' => '1',
                    'children' => $launchTimeChildren,
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
                    'children' => $commands,
                ],
                'command_line' => [
                    'name' => 'command_line',
                ],
                'args' => [
                    'name' => 'args',
                    'caption' => $this->view->_('ADDITIONAL_ARGUMENTS'),
                    'multiple' => true,
                    'export' => function ($field) {
                        $val = (array)$_POST[$field->name];
                        $val = array_map('trim', $val);
                        $field->Form->Item->{$field->name} = json_encode($val);
                    },
                    'import' => function ($field) {
                        $val = json_decode($field->Form->Item->{$field->name}, true);
                        $val = array_map('trim', $val);
                        return $val;
                    },
                ],

            ]
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
        $val = array_map('intval', (array)$_POST[$field->name]);
        $val = array_values(array_unique($val));
        sort($val);
        $val = implode(',', $val);
        $field->Form->Item->{$field->name} = $val;
    }


    /**
     * Импортирует данные из поля периодов
     * @param function $field Поле
     * @return string[] Набор значений
     */
    public function importVals(Field $field)
    {
        $val = trim($field->Form->Item->{$field->name});
        if ($val === '') {
            return [];
        }
        $val = explode(',', $val);
        $val = array_map('intval', $val);
        $val = array_values(array_unique($val));
        sort($val);
        return $val;
    }

}
