<?php
$_RAASForm_FieldSet = function(\RAAS\FieldSet $FieldSet) use (&$_RAASForm_Form_Tabbed, &$_RAASForm_Form_Plain) {
    ?>
    <fieldset>
      <legend><?php echo htmlspecialchars($FieldSet->caption)?></legend>
      <?php $_RAASForm_Form_Plain($FieldSet->children)?>
    </fieldset>
    <?php
};