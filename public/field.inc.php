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
    &$_RAASForm_Attrs
) {
    $field = $options->Parent;
    $options = (array)$options;
    $attrs = [];
    $text = '';
    $plain = !$level && !array_filter($options, function ($x) {
        return (bool)(array)$x->children;
    }) && (count($options) < 16);
    foreach ($options as $row) {
        $attrs = $row->attrs;
        foreach (['type', 'name', 'multiple'] as $key) {
            $attrs[$key] = $field->$key;
        }
        if (in_array($row->value, (array)$field->Form->DATA[$field->name])) {
            $attrs['checked'] = 'checked';
        } else {
            $attrs['checked'] = false;
        }
        if ($plain) {
            $text .= '<label class="' . $field->type . ' inline">
                        <input' . $_RAASForm_Attrs($field, $attrs) . ' /> '
                  .     htmlspecialchars($row->caption)
                  .  '</label>';
        } else {
            $text .= '<li>';
            if ($row instanceof OptGroup) {
                $text .= '  <label>'
                      .       htmlspecialchars($row->caption)
                      .  '  </label>' ;
            } else {
                $text .= '  <label>
                              <input' . $_RAASForm_Attrs($field, $attrs) . ' /> '
                      .       htmlspecialchars($row->caption)
                      .  '  </label>' ;
            }
            $text .=    $_RAASForm_Checkbox($row->children, $level + 1) . '
                      </li>';
        }
    }
    if ($text && !$plain) {
        return '<ul' . (!$level ? ' class="tree" data-raas-role="tree"' : '') . '>' .
                  $text .
               '</ul>';
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
    &$_RAASForm_Checkbox
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
                ?>
                <div data-role="raas-repo-block">
                  <div data-role="raas-repo-container">
                    <div data-role="raas-repo-element">
                      <input<?php echo $_RAASForm_Attrs($field, $attrs)?> />
                    </div>
                  </div>
                  <div data-role="raas-repo">
                    <input<?php echo $_RAASForm_Attrs($field, array_merge($attrs, ['disabled' => 'disabled']))?> />
                  </div>
                </div>
            <?php } else { ?>
                <input<?php echo $_RAASForm_Attrs($field, $attrs)?> />
            <?php }
            break;
        case 'checkbox':
            $attrs = [];
            if ($field->multiple) {
                echo $_RAASForm_Checkbox($field->children);
            } else {
                $attrs['value'] = 1;
                if ($field->Form->DATA[$field->name]) {
                    $attrs['checked'] = 'checked';
                }
                ?>
                <input<?php echo $_RAASForm_Attrs($field, $attrs)?> />
                <?php
            }
            break;
        case 'radio':
            echo $_RAASForm_Checkbox($field->children);
            break;
        case 'select':
            $attrs['type'] = false;
            if ($field->placeholder) {
                for ($i = count($field->children) - 1; $i >= 0; $i--) {
                    $field->children[$i + 1] = $field->children[$i];
                }
                $field->children[0] = new Option([
                    'caption' => $field->placeholder,
                    'value' => ''
                ]);
            }
            if ($field->multiple && !$field->{'data-raas-multiselect'}) {
                $attrs = array_merge($attrs, ['multiple' => false]);
                ?>
                <div data-role="raas-repo-block">
                  <div data-role="raas-repo-container">
                    <?php foreach ((array)$field->Form->DATA[$field->name] as $key => $val) {
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
        case 'textarea':
        case 'htmlarea':
        case 'codearea':
            $attrs['type'] = false;
            if ($field->type == 'htmlarea') {
                $attrs['class'] = 'htmlarea';
                $attrs['required'] = false;
            } elseif ($field->type == 'codearea') {
                $attrs['class'] = 'code codearea fullscreen';
            }
            $attrs['v-pre'] = 'v-pre';
            if ($field->multiple) {
                ?>
                <div data-role="raas-repo-block">
                  <div data-role="raas-repo-container">
                    <?php foreach ((array)$field->Form->DATA[$field->name] as $key => $val) { ?>
                        <div data-role="raas-repo-element">
                          <textarea<?php echo $_RAASForm_Attrs($field, $attrs)?>><?php
                            echo htmlspecialchars($val);
                          ?></textarea>
                        </div>
                    <?php } ?>
                  </div>
                  <div data-role="raas-repo">
                    <textarea<?php echo $_RAASForm_Attrs($field, array_merge($attrs, ['disabled' => 'disabled']))?>></textarea>
                  </div>
                </div>
            <?php } else { ?>
                <textarea<?php echo $_RAASForm_Attrs($field, $attrs)?>><?php
                  echo htmlspecialchars($field->Form->DATA[$field->name]);
                ?></textarea>
            <?php }
            break;
        case 'password':
            $attrs = [];
            if ($confirm) {
                $attrs['name'] = $field->name . '@confirm';
            }
            if ($field->confirm) {
                $attrs['autocomplete'] = 'new-password';
            }
            ?>
            <input<?php echo $_RAASForm_Attrs($field, $attrs)?> />
            <?php
            break;
        default:
            $attrs = [];
            if (!$field->type) {
                $attrs['type'] = 'text';
            }
            $attrs['v-pre'] = 'v-pre';
            if ($field->multiple) {
                ?>
                <div data-role="raas-repo-block">
                  <div data-role="raas-repo-container">
                    <?php foreach ((array)$field->Form->DATA[$field->name] as $key => $val) { ?>
                        <div data-role="raas-repo-element">
                          <input<?php echo $_RAASForm_Attrs($field, array_merge($attrs, ['value' => $val]))?> />
                        </div>
                    <?php } ?>
                  </div>
                  <div data-role="raas-repo">
                    <input<?php echo $_RAASForm_Attrs($field, array_merge($attrs, ['disabled' => 'disabled']))?> />
                  </div>
                </div>
                <?php
            } else {
                ?>
                <input<?php echo $_RAASForm_Attrs($field, array_merge($attrs, ['value' => $field->Form->DATA[$field->name]]))?> />
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
    if (in_array($field->type, ['htmlarea', 'codearea'])) {
        ?>
        <div class="control-group<?php echo $err ? ' error' : ''?>">
          <?php if ($field->caption) { ?>
              <label class="control-label" for="<?php echo htmlspecialchars($field->name)?>">
                <?php echo htmlspecialchars($field->caption)?>:
              </label>
              <div class="controls clearfix">&nbsp;</div>
          <?php } ?>
          <div class="clearfix"><?php echo $_RAASForm_Control($field)?></div>
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
          <label class="control-label" for="<?php echo htmlspecialchars($field->name)?>">
            <?php echo htmlspecialchars($field->caption ? $field->caption . ':' : '')?>
          </label>
          <div class="controls"><?php echo $_RAASForm_Control($field, false)?></div>
        </div>
        <?php
    }
};
