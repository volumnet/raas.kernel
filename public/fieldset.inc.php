<?php
$_RAASForm_FieldSet = function(\RAAS\FieldSet $FieldSet) use (&$_RAASForm_Form_Tabbed, &$_RAASForm_Form_Plain, &$_RAASForm_Form_Plain2, &$_RAASForm_Attrs) {
    ?>
    <fieldset>
      <legend><?php echo htmlspecialchars($FieldSet->caption)?></legend>
      <?php $_RAASForm_Form_Plain2($FieldSet->children)?>
    </fieldset>
    <?php
};
