<?php
$_RAASForm_Option = function(\RAAS\Option $Option, $level = 0) use ($_RAASForm_Options, $_RAASForm_Attrs) {
    $attrs = array();
    $selected = false;
    if (!$Option->disabled) {
        if ($Option->Field->multiple) {
            if ($Option->Field->{'data-raas-multiselect'}) {
                $selected = in_array($Option->value, (array)$Option->Form->DATA[$Option->Field->name]);
            } else {
                $selected = (trim($Option->value) === trim($Option->Field->value));
            }
        } else {
            $selected = (trim($Option->value) === trim($Option->Form->DATA[$Option->Field->name]));
        }
    }
    if ($selected) {
        $attrs['selected'] = 'selected';
    }
    ?>
    <option<?php echo $_RAASForm_Attrs($Option, $attrs)?>><?php echo str_repeat('&nbsp;', $level * 3) . htmlspecialchars($Option->caption)?></option>
    <?php
    $_RAASForm_Options($Option->children, $level + 1);
};
