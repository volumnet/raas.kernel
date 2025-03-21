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
