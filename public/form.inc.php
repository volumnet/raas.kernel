<?php
namespace RAAS;

/**
 * Возвращает строку атрибутов HTML-элемента
 * @param FormElement $formElement HTML-элемент
 * @param array $additional Дополнительные атрибуты
 * @return string
 * @deprecated Используем метод getAttrsString() - до 2026-03-19
 */
$_RAASForm_Attrs = function (FormElement $formElement, array $additional = []): string {
    trigger_error('$_RAASForm_Attrs is deprecated. Use HTMLElement::getAttrsString instead.', E_USER_DEPRECATED);
    return $formElement->getAttrsString($additional);
};

/**
 * Отображает список полей
 * @param FieldCollection $fields Список полей для отображения
 */
$_RAASForm_Form_Plain = function (FieldCollection $fields) {
    ?>
    <div class="form-horizontal">
      <?php
      foreach ($fields as $row) {
          if ($row instanceof FieldSet) {
              echo $row->render();
          } elseif ($row instanceof Field) {
              echo $row->renderGroup();
          } elseif ($row instanceof FieldCollection) {
              echo $row->children->render();
          }
      }
      ?>
    </div>
    <?php
};

/**
 * Отображает список полей
 * @param FieldCollection $fields Список полей для отображения
 * @deprecated Используем метод FieldCollection::render - до 2026-03-20
 */
$_RAASForm_Form_Plain2 = function (FieldCollection $fields) use (&$_RAASForm_Form_Plain) {
    trigger_error('$_RAASForm_Form_Plain2 is deprecated. Use FieldCollection::render instead.', E_USER_DEPRECATED);
    return $_RAASForm_Form_Plain($fields);
};


/**
 * Отображает список полей в виде таблицы-репозитория
 * @param FieldCollection $fieldsCollection Список полей для отображения
 */
$_RAASForm_Form_Compound = function (FieldCollection $fieldsCollection) {
    $fields = (array)$fieldsCollection;
    $hiddenFields = array_filter($fields, fn($field) => ($field->type == 'hidden'));
    $visibleFields = array_filter($fields, fn($field) => ($field->type != 'hidden'));
    if (!$fields) {
        return;
    }
    $DATA = $fieldsCollection->Form->DATA;

    $columns = $defval = [];
    foreach ($fields as $field) {
        if ($field->type != 'hidden') {
            $columns[] = $field->caption;
        }
        $defval[$field->name] = null;
    }

    $repoData = [];
    $firstField = $fields[array_keys($fields)[0]];
    foreach ((array)($DATA[$firstField->name] ?? []) as $i => $temp) {
        $repoRow = [];
        foreach ($fields as $field) {
            $repoRow[$field->name] = $DATA[$field->name][$i] ?? null;
        }
        $repoData[] = $repoRow;
    }

    ?>
    <raas-repo-table
      class="table table-striped table-condensed"
      :model-value="<?php echo htmlspecialchars(json_encode($repoData))?>"
      :defval="<?php echo htmlspecialchars(json_encode($defval))?>"
      :columns-counter="<?php echo count($columns)?>"
      :sortable="true"
    >
      <?php if (array_filter($columns)) { ?>
          <template #header>
            <component is="tr">
              <?php foreach ($visibleFields as $field) { ?>
                  <component is="th">
                    <?php
                    echo htmlspecialchars($field->caption);
                    if ($field->meta['hint'] ?? null) { ?>
                        <raas-hint><?php echo $field->meta['hint']?></raas-hint>
                    <?php } ?>
                  </component>
              <?php } ?>
              <component is="th"></component>
            </component>
          </template>
      <?php } ?>
      <template #default="repo">
        <?php $i = 0; foreach ($visibleFields as $field) { ?>
            <component is="td">
              <?php
              if (!$i) {
                  foreach ($hiddenFields as $hiddenField) {
                      $hiddenFieldName = $hiddenField->name;
                      if (!stristr($hiddenFieldName, '[')) {
                          $hiddenFieldName .= '[]';
                      }
                      ?>
                      <input
                        type="hidden"
                        name="<?php echo htmlspecialchars($hiddenFieldName)?>"
                        :value="repo.modelValue.<?php echo htmlspecialchars($hiddenField->name)?>"
                      >
                  <?php }
              }

              $attrs = [
                  ':model-value' => 'repo.modelValue.' . $field->name,
                  '@update:model-value' => 'repo.emit(\'update:modelValue\', {...repo.modelValue, ' . $field->name . ': $event })',
                  'multiple' => false,
              ];
              if ($field->type == 'checkbox') {
                  $field->mask = '0';
              }
              echo $field->render(false, $attrs)?>
            </component>
        <?php $i++; } ?>
      </template>
    </raas-repo-table>
    <?php
};

/**
 * Отображает список вкладок
 * @param FieldCollection $fields Список вкладок для отображения
 */
$_RAASForm_Form_Tabbed = function (FieldCollection $tabs) {
    ?>
    <div class="tabbable">
      <ul class="nav nav-tabs">
        <?php $i = 0; foreach ($tabs as $tab) { ?>
            <li<?php echo !$i ? ' class="active"' : ''?>>
              <a href="#<?php echo htmlspecialchars($tab->name)?>" data-toggle="tab">
                <?php echo htmlspecialchars($tab->caption)?>
              </a>
            </li>
        <?php $i++; } ?>
      </ul>
      <div class="tab-content">
        <?php $i = 0; foreach ($tabs as $tab) { ?>
            <div<?php echo $tab->getAttrsString(['class' => 'tab-pane' . (!$i ? ' active' : ''), 'id' => $tab->name])?>>
              <?php echo $tab->render()?>
            </div>
        <?php $i++; } ?>
      </div>
    </div>
    <?php
};

/**
 * Рендерит форму полностью
 * @param Form $form Форма
 */
$_RAASForm = function (Form $form) {
    ?>
    <form<?php echo $form->getAttrsString()?>>
      <?php echo $form->children->render(); ?>
      <div class="form-horizontal">
        <div class="control-group">
          <div class="controls">
            <button type="submit" class="btn btn-primary">
              <?php echo $form->submitCaption ? htmlspecialchars($form->submitCaption) : SAVE?>
            </button>
            <?php if ($form->Item && $form->actionMenu) { ?>
                <button type="submit" name="@cancel" class="btn">
                  <?php echo $form->resetCaption ? htmlspecialchars($form->resetCaption) : RESET?>
                </button>
                <?php echo _AND?>
                <select name="@oncommit">
                  <?php
                  $actions = [];
                  $actions[Form::ONCOMMIT_EDIT] = ONCOMMIT_EDIT;
                  $actions[Form::ONCOMMIT_RETURN] = ONCOMMIT_RETURN;
                  if (!$form->Item->id) {
                      $actions[Form::ONCOMMIT_NEW] = ONCOMMIT_NEW;
                  }
                  foreach ($actions as $key => $val) { ?>
                      <option value="<?php echo (int)$key?>" <?php echo (isset($form->DATA['@oncommit']) && $form->DATA['@oncommit'] == $key) ? 'selected="selected"' : ''?>>
                        <?php echo htmlspecialchars($val)?>
                      </option>
                  <?php } ?>
                </select>
            <?php } else { ?>
                <button type="reset" class="btn">
                  <?php echo $form->resetCaption ? htmlspecialchars($form->resetCaption) : RESET?>
                </button>
            <?php } ?>
          </div>
        </div>
      </div>
    </form>
    <?
};
