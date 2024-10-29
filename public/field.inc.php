<?php
/**
 * Шаблоны полей
 */
namespace RAAS;

use SOME\HTTP;

/**
 * Шаблон набора опций
 * @param OptionCollection $options Набор опций
 * @param int $level Уровень вложенности
 */
$_RAASForm_Options = function (
    OptionCollection $options,
    $level = 0
) use (
    &$_RAASForm_Options,
    &$_RAASForm_Attrs
) {
    foreach ($options as $row) {
        switch (get_class($row)) {
            case OptGroup::class:
                include Application::i()->view->context->tmp('/optgroup.inc.php');
                break;
            case Option::class:
                include Application::i()->view->context->tmp('/option.inc.php');
                break;
        }
        if ($row->template) {
            include Application::i()->view->context->tmp($row->template);
        }
        switch (get_class($row)) {
            case OptGroup::class:
                $_RAASForm_OptGroup($row, $level);
                break;
            case Option::class:
                $_RAASForm_Option($row, $level);
                break;
            default:
                $_RAASForm_Options($row->children, $level + 1);
                break;
        }
    }
};

$_RAASForm_Source = function (
    OptionCollection $options,
    $level = 0
) use (&$_RAASForm_Source) {
    $result = [];
    foreach ((array)$options as $option) {
        $optionData = (array)$option->attrs;
        $optionData['name'] = $option->caption;
        foreach (['checked', 'multiple', 'type'] as $key) {
            unset($optionData[$key]);
        }
        if ($children = $option->children) {
            $optionData['children'] = $_RAASForm_Source($children, $level + 1);
        }
        $result[] = $optionData;
    }
    return $result;
};

/**
 * Шаблон флажков
 * @param OptionCollection $options Набор опций
 * @param int $level Уровень вложенности
 * @return string
 */
$_RAASForm_Checkbox = function (
    OptionCollection $options,
    $level = 0
) use (
    &$_RAASForm_Checkbox,
    &$_RAASForm_Attrs,
    &$_RAASForm_Source
) {
    $field = $options->Parent;
    $originalOptions = $options;
    $options = (array)$options;
    $attrs = [];
    $text = '';
    $plain = !$level && !array_filter($options, function ($x) {
        return (bool)(array)$x->children;
    }) && (count($options) < 16);
    // foreach ($options as $row) {
    //     $attrs = $row->attrs;
    //     foreach (['type', 'name', 'multiple'] as $key) {
    //         $attrs[$key] = $field->$key;
    //     }
    //     if (in_array($row->value, (array)($field->Form->DATA[$field->name] ?? []))) {
    //         $attrs['checked'] = 'checked';
    //     } else {
    //         $attrs['checked'] = false;
    //     }
    //     if ($plain) {
    //         $text .= '<label class="' . $field->type . ' inline">
    //                     <input' . $_RAASForm_Attrs($field, $attrs) . ' /> '
    //               .     htmlspecialchars($row->caption)
    //               .  '</label>';
    //     } else {
    //         $text .= '<li>';
    //         if ($row instanceof OptGroup) {
    //             $text .= '  <label>'
    //                   .       htmlspecialchars($row->caption)
    //                   .  '  </label>' ;
    //         } else {
    //             $text .= '  <label>
    //                           <input' . $_RAASForm_Attrs($field, $attrs) . ' /> '
    //                   .       htmlspecialchars($row->caption)
    //                   .  '  </label>' ;
    //         }
    //         $text .=    $_RAASForm_Checkbox($row->children, $level + 1) . '
    //                   </li>';
    //     }
    // }
    if (!$level) {
        $attrs = [];
        foreach (['value', 'checked'] as $key) {
            $attrs[$key] = null; // Убираем, т.к. для raas-field это не нужно
        }
        $source = $_RAASForm_Source($originalOptions);
        $attrs[':source'] = json_encode($source);
        $attrs[':value'] = json_encode((array)($field->Form->DATA[$field->name] ?? []));
        // $attrs = $_RAASForm_Attrs($field, $attrs);
        $text .= '<raas-field-checkbox' . $_RAASForm_Attrs($field, $attrs) . '></raas-field-checkbox>';
    }
    if ($text && !$plain) {
        // $text = '<ul' . (!$level ? ' class="tree" data-raas-role="tree"' : '') . '>' .
        //           $text .
        //        '</ul>';
        return $text;
    } else {
        return $text;
    }
};

/**
 * Шаблон поля
 * @param Field $field Поле
 * @param bool $confirm Нужно ли поле подтверждения для пароля
 */
$_RAASForm_Control = function (
    Field $field,
    $confirm = true
) use (
    &$_RAASForm_Attrs,
    &$_RAASForm_Options,
    &$_RAASForm_Checkbox,
    &$_RAASForm_Source
) {
    $attrs = [];
    switch ($field->type) {
        case 'image':
        case 'file':
            $attVar = isset($field->meta['attachmentVar'])
                    ? $field->meta['attachmentVar']
                    : 'attachments';
            $delAttPath = isset($field->meta['deleteAttachmentPath'])
                        ? $field->meta['deleteAttachmentPath']
                        : (HTTP::queryString('action=delete_attachment&id=') . '&id=%s');
            $Set = $field->Form->Item->$attVar;
            if (!is_array($Set)) {
                $Set = [$Set];
            }
            if ($Set = array_values(array_filter($Set, function ($x) {
                return $x->id;
            }))) { ?>
                <ul class="thumbnails">
                  <?php for ($i = 0; $i < count($Set); $i++) {
                      $row = $Set[$i];
                      ?>
                      <li class="span2">
                        <div class="thumbnail">
                          <?php if ($i || !$field->required) { ?>
                            <a class="close" href="<?php echo sprintf($delAttPath, (int)$row->id)?>" onclick="return confirm('<?php echo $field->type == 'image' ? DELETE_IMAGE_TEXT : DELETE_FILE_TEXT?>')">&times;</a>
                          <?php } ?>
                          <a href="<?php echo htmlspecialchars($row->fileURL)?>" target="_blank">
                            <?php if ($field->type == 'image') { ?>
                                <img src="<?php echo htmlspecialchars($row->tnURL)?>" alt="<?php echo htmlspecialchars(basename($row->filename))?>" title="<?php echo htmlspecialchars(basename($row->filename))?>" />
                            <?php } else { ?>
                                <?php echo htmlspecialchars(basename($row->filename))?>
                            <?php } ?>
                          </a>
                        </div>
                      </li>
                  <?php } ?>
                </ul>
            <?php }
            $attrs = ['type' => 'file'];
            if ($field->type == 'image') {
                $attrs['accept'] = 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml';
            }
            if ($field->multiple) {
                $attrs['multiple'] = false;
                ?>
                <div data-role="raas-repo-block">
                  <div data-role="raas-repo-container">
                    <div data-role="raas-repo-element">
                      <input<?php echo $_RAASForm_Attrs($field, $attrs)?> />
                    </div>
                  </div>
                  <div data-role="raas-repo">
                    <input<?php echo $_RAASForm_Attrs($field, array_merge($attrs, ['disabled' => 'disabled', 'multiple' => false]))?> />
                  </div>
                </div>
            <?php } else { ?>
                <input<?php echo $_RAASForm_Attrs($field, $attrs)?> />
            <?php }
            break;
        case 'checkbox':
            $attrs = [];
            if ($field->multiple) {
                $source = $_RAASForm_Source($field->children);
                $attrs[':source'] = json_encode($source);
                $attrs[':value'] = json_encode((array)($field->Form->DATA[$field->name] ?? []));
            } else {
                $attrs['defval'] = $field->defval ?: '1';
                $attrs['mask'] = '0';
                $attrs[':value'] = json_encode($field->Form->DATA[$field->name] ?? null);
            }
            ?>
            <raas-field-checkbox<?php echo $_RAASForm_Attrs($field, $attrs)?>></raas-field-checkbox>
            <?php
            break;
        case 'radio':
            echo $_RAASForm_Checkbox($field->children);
            break;
        case 'select':
            $attrs['type'] = false;
            if ($field->placeholder || !$field->required) {
                for ($i = count($field->children) - 1; $i >= 0; $i--) {
                    $field->children[$i + 1] = $field->children[$i];
                }
                $field->children[0] = new Option([
                    'caption' => $field->placeholder ?: '--',
                    'value' => ''
                ]);
            }
            if ($field->multiple && !$field->{'data-raas-multiselect'}) {
                $attrs = array_merge($attrs, ['multiple' => false]);
                ?>
                <div data-role="raas-repo-block">
                  <div data-role="raas-repo-container">
                    <?php foreach ((array)($field->Form->DATA[$field->name] ?? []) as $key => $val) {
                        $field->value = $val; ?>
                        <div data-role="raas-repo-element">
                          <select<?php echo $_RAASForm_Attrs($field, $attrs)?>>
                            <?php echo $_RAASForm_Options($field->children)?>
                          </select>
                        </div>
                    <?php } ?>
                  </div>
                  <div data-role="raas-repo">
                    <select<?php echo $_RAASForm_Attrs($field, array_merge($attrs, ['disabled' => 'disabled']))?>>
                      <?php echo $_RAASForm_Options($field->children)?>
                    </select>
                  </div>
                </div>
            <?php } else { ?>
                <select<?php echo $_RAASForm_Attrs($field, $attrs)?>>
                  <?php echo $_RAASForm_Options($field->children)?>
                </select>
            <?php }
            break;
        default:
            // @todo TEST!!!
            $attrs = [];
            $fieldType = $field->type ?: 'text';
            $itemArr = $field->getArrayCopy();
            $childrenArr = isset($itemArr['children']) ? $itemArr['children'] : null;

            if (!$field->type) {
                $attrs['type'] = 'text';
            }
            if (($field->type == 'password') && $confirm) {
                $attrs['name'] = $field->name . '@confirm';
            }
            if (($field->type == 'select') && $field->multiple) {
                $attrs['multiple'] = false;
            }
            // $attrs['v-pre'] = 'v-pre';
            // echo 'TEST!!!';
            if ($field->multiple && !in_array($field->type, ['password'])) {
                ?>
                <div data-role="raas-repo-block">
                  <div data-role="raas-repo-container">
                    <?php foreach ((array)($field->Form->DATA[$field->name] ?? []) as $key => $val) { ?>
                        <div data-role="raas-repo-element">
                          <raas-field-<?php echo htmlspecialchars($fieldType)?> <?php echo $_RAASForm_Attrs($field, array_merge($attrs, [':value' => json_encode($val), ':source' => $childrenArr ? json_encode($childrenArr) : false]))?>></raas-field-<?php echo htmlspecialchars($fieldType)?>>
                        </div>
                    <?php } ?>
                  </div>
                  <div data-role="raas-repo">
                    <raas-field-<?php echo htmlspecialchars($fieldType)?>
                      <?php echo $_RAASForm_Attrs($field, array_merge($attrs, ['disabled' => 'disabled', ':source' => $childrenArr ? json_encode($childrenArr) : false]))?>
                    ></raas-field-<?php echo htmlspecialchars($fieldType)?>>
                  </div>
                </div>
                <?php
            } else {
                $attrs[':value'] = json_encode($field->Form->DATA[$field->name] ?? null);
                $attrs[':source'] = $childrenArr ? json_encode($childrenArr) : false;
                ?>
                <raas-field-<?php echo htmlspecialchars($fieldType)?>
                  <?php echo $_RAASForm_Attrs($field, $attrs)?>
                ></raas-field-<?php echo htmlspecialchars($fieldType)?>>
                <?php
            }
            break;
    }
};


/**
 * Шаблон поля с подписью
 * @param Field $field Поле
 */
$_RAASForm_Field = function (Field $field) use (
    &$_RAASForm_Control,
    &$_RAASForm_Options
) {
    $err = (bool)array_filter(
        (array)$field->Form->localError,
        function ($x) use ($field) {
            return $x['value'] == $field->name;
        }
    );
    if (in_array($field->type, ['htmlarea', 'codearea', 'htmlcodearea'])) {
        ?>
        <div class="control-group control-group_full<?php echo $err ? ' error' : ''?>">
          <?php if ($field->caption) { ?>
              <label class="control-label" for="<?php echo htmlspecialchars($field->name)?>">
                <?php echo htmlspecialchars($field->caption)?>:
              </label>
          <?php } ?>
          <div class="controls controls_full"><?php echo $_RAASForm_Control($field)?></div>
        </div>
    <?php } elseif (($field->type == 'password') && $field->confirm) {
        $err2 = (bool)array_filter(
            (array)$field->Form->localError,
            function ($x) use ($field) {
                return $x['value'] == $field->name . '@confirm';
            }
        );
        ?>
        <div class="control-group<?php echo $err ? ' error' : ''?>">
          <label class="control-label" for="<?php echo htmlspecialchars($field->name)?>">
            <?php echo htmlspecialchars($field->caption)?>:
          </label>
          <div class="controls">
            <?php echo $_RAASForm_Control($field, false)?>
          </div>
        </div>
        <div class="control-group<?php echo $err2 ? ' error' : ''?>">
          <label class="control-label" for="<?php echo htmlspecialchars($field->name)?>@confirm">
            <?php echo PASSWORD_CONFIRM?>:
          </label>
          <div class="controls">
            <?php echo $_RAASForm_Control($field, true)?>
          </div>
        </div>
        <?php
    } elseif ($field->type == 'checkbox' && !$field->multiple) {
        ?>
        <div class="control-group<?php echo $err ? ' error' : ''?>">
          <div class="controls">
            <label class="checkbox"<?php echo $field->{'data-hint'} ? ' style="width: 174px;"' : ''?>>
              <?php echo $_RAASForm_Control($field, false)?>
              <?php echo htmlspecialchars($field->caption)?>
            </label>
          </div>
        </div>
        <?php
    } elseif ($field->type == 'hidden') {
        echo $_RAASForm_Control($field, false);
    } else {
        ?>
        <div class="control-group<?php echo $err ? ' error' : ''?>">
          <label class="control-label" for="<?php echo htmlspecialchars((string)$field->name)?>">
            <?php echo htmlspecialchars($field->caption ? $field->caption . ':' : '')?>
          </label>
          <div class="controls">
            <?php
            echo $_RAASForm_Control($field, false);
            if ($field->unit) {
                echo ' <span class="control-unit">' . htmlspecialchars($field->unit) . '</span>';
            }
            ?>
        </div>
        </div>
        <?php
    }
};
