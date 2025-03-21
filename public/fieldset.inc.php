<?php
/**
 * Виджет отображения группы полей
 */
namespace RAAS;

/**
 * Отображает группу полей
 * @param FieldSet $fieldSet Группа полей для отображения
 */
$_RAASForm_FieldSet = function(FieldSet $fieldSet) {
    ?>
    <fieldset>
      <?php if ($caption = $fieldSet->caption) { ?>
          <legend><?php echo htmlspecialchars($caption)?></legend>
      <?php }
      echo $fieldSet->children->render();
      ?>
    </fieldset>
    <?php
};
