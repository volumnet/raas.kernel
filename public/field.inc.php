<?php
/**
 * Шаблоны полей
 */
namespace RAAS;

use SOME\HTTP;

/**
 * Шаблон поля
 * @param Field $field Поле
 * @param bool $confirmPassword Подтверждающее поле для пароля
 * @param array $additional Дополнительные атрибуты
 */
$_RAASForm_Control = function (Field $field, bool $confirmPassword = false, array $additional = []) {
    $attrs = [];
    $fieldType = $field->type ?: 'text';
    switch ($fieldType) {
        case 'image':
        case 'file':
            $attVar = $field->meta['attachmentVar'] ?? 'attachments';
            $delAttPath = $field->meta['deleteAttachmentPath'] ?? (HTTP::queryString('action=delete_attachment&id=') . '&id=%s');
            $Set = $field->Form->Item->$attVar;
            if (!is_array($Set)) {
                $Set = [$Set];
            }
            $Set = array_values(array_filter($Set, fn($x) => (int)$x->id));
            $data = array_map(fn($val) => $field->datatypeStrategy->importForJSON($val), $Set);
            if ($Set) { ?>
                <thumbnails-list
                  :items="<?php echo htmlspecialchars(json_encode($data))?>"
                  delete-url="<?php echo htmlspecialchars($delAttPath)?>"
                ></thumbnails-list>
            <?php }
            $attrs = ['type' => 'file'];
            if ($field->type == 'image') {
                $attrs['accept'] = 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml';
            }
            $attrs = array_merge($attrs, $additional);
            ?>
            <raas-field-file <?php echo $field->getAttrsString($attrs)?>></raas-field-file>
            <?php
            break;
        default:
            if ($field->type == 'select') { // Должно быть здесь, до получения источника
                if ($field->placeholder || !$field->required) {
                    for ($i = count($field->children) - 1; $i >= 0; $i--) {
                        $field->children[$i + 1] = $field->children[$i];
                    }
                    $field->children[0] = new Option([
                        'caption' => $field->placeholder ?: '--',
                        'value' => ''
                    ]);
                }
            }

            $attrs['type'] = $fieldType;
            $itemArr = $field->getArrayCopy();
            $childrenArr = $itemArr['children'] ?? null;

            if ($field->type == 'checkbox') {
                if (!$field->multiple) {
                    $attrs['defval'] = $field->defval ?: '1';
                    $attrs['mask'] = '0';
                }
            } elseif ($field->type == 'password') {
                if ($confirmPassword) {
                    $attrs['name'] = $field->name . '@confirm';
                }
            }
            if ($childrenArr) {
                $attrs[':source'] = json_encode($childrenArr);
            }

            if ($field->multiple) {
                $data = array_map(
                    fn($val) => $field->datatypeStrategy->importForJSON($val),
                    (array)($field->Form->DATA[$field->name] ?? [])
                );
            } else {
                $data = $field->datatypeStrategy->importForJSON($field->Form->DATA[$field->name] ?? null);
            }

            if ($field->multiple &&
                (!isset($additional['multiple']) || $additional['multiple']) &&
                !in_array($field->type, ['password', 'checkbox']) &&
                !$field->{'data-raas-multiselect'}
            ) {
                $attrs = array_merge($attrs, $additional);
                $attrs['multiple'] = null; // Чтобы перекрыть стандартный атрибут multiple="1"
                $attrs[':model-value'] = 'repo.modelValue';
                $attrs['@update:model-value'] = 'repo.emit(\'update:modelValue\', repo.modelValue = $event)';
                ?>
                <raas-repo
                  :model-value="<?php echo htmlspecialchars(json_encode($data))?>"
                  :defval="null"
                  :sortable="true"
                  :required="<?php echo htmlspecialchars(json_encode((bool)$field->required))?>"
                  v-slot="repo"
                >
                  <raas-field-<?php echo htmlspecialchars($fieldType)?>
                    <?php echo $field->getAttrsString($attrs)?>
                  ></raas-field-<?php echo htmlspecialchars($fieldType)?>>
                </raas-repo>
                <?php
            } else {
                $attrs[':model-value'] = json_encode($data);
                $attrs = array_merge($attrs, $additional);
                ?>
                <raas-field-<?php echo htmlspecialchars($fieldType)?>
                  <?php echo $field->getAttrsString($attrs)?>
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
$_RAASForm_Field = function (Field $field) {
    $err = (bool)array_filter((array)($field->Form->localError ?? []), fn($x) => ($x['value'] == $field->name));
    if (in_array($field->type, ['htmlarea', 'codearea', 'htmlcodearea'])) { ?>
        <div class="control-group control-group_full<?php echo $err ? ' error' : ''?>">
          <?php if ($field->caption) { ?>
              <label class="control-label" for="<?php echo htmlspecialchars($field->name)?>">
                <?php echo htmlspecialchars($field->caption)?>:
              </label>
          <?php } ?>
          <div class="controls controls_full"><?php echo $field->render()?></div>
        </div>
    <?php } elseif ($field->type == 'checkbox' && !$field->multiple) { ?>
        <div class="control-group<?php echo $err ? ' error' : ''?>">
          <div class="controls">
            <label class="checkbox"<?php echo $field->{'data-hint'} ? ' style="width: 174px;"' : ''?>>
              <?php echo $field->render()?>
              <?php echo htmlspecialchars($field->caption)?>
            </label>
          </div>
        </div>
    <?php } elseif ($field->type == 'hidden') {
        echo $field->render();
    } else { ?>
        <div class="control-group<?php echo $err ? ' error' : ''?>">
          <label class="control-label" for="<?php echo htmlspecialchars((string)$field->name)?>">
            <?php echo htmlspecialchars($field->caption ? $field->caption . ':' : '')?>
          </label>
          <div class="controls">
            <?php
            echo $field->render();
            if ($field->unit) {
                echo ' <span class="control-unit">' . htmlspecialchars($field->unit) . '</span>';
            }
            ?>
          </div>
        </div>
        <?php
    }

    if (($field->type == 'password') && $field->confirm) {
        $err2 = (bool)array_filter(
            (array)$field->Form->localError,
            function ($x) use ($field) {
                return $x['value'] == $field->name . '@confirm';
            }
        );
        ?>
        <div class="control-group<?php echo $err2 ? ' error' : ''?>">
          <label class="control-label" for="<?php echo htmlspecialchars($field->name)?>@confirm">
            <?php echo PASSWORD_CONFIRM?>:
          </label>
          <div class="controls">
            <?php echo $field->render(true)?>
          </div>
        </div>
        <?php
    }
};
