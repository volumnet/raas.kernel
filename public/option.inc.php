<?php
$_RAASForm_Option = function(\RAAS\Option $Option, $level = 0) use ($_RAASForm_Options, $_RAASForm_Attrs) {
    $attrs = array();
    if (in_array($Option->value, (array)$Option->Form->DATA[$Option->Field->name]) && !$Option->disabled) {
        $attrs['selected'] = 'selected';
    }
    ?>
    <option<?php echo $_RAASForm_Attrs($Option, $attrs)?>><?php echo str_repeat('&nbsp;', $level * 3) . htmlspecialchars($Option->caption)?></option>
    <?php 
    $_RAASForm_Options($Option->children, $level + 1);
};