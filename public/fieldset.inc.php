<?php
$_RAASForm_FieldSet = function(\RAAS\FieldSet $fieldSet) use (&$_RAASForm_Form_Tabbed, &$_RAASForm_Form_Plain, &$_RAASForm_Form_Plain2, &$_RAASForm_Attrs) {
    ?>
    <fieldset>
      <?php if ($caption = $fieldSet->caption) { ?>
          <legend><?php echo htmlspecialchars($caption)?></legend>
      <?php }
      $_RAASForm_Form_Plain2($fieldSet->children)?>
    </fieldset>
    <?php
};
