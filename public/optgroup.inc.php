<?php
$_RAASForm_OptGroup = function(\RAAS\OptGroup $OptGroup) use (&$_RAASForm_Attrs, &$_RAASForm_Options) {
    ?>
    <optgroup<?php echo $_RAASForm_Attrs($OptGroup, array('label' => $OptGroup->caption))?>><?php $_RAASForm_Options($OptGroup->children)?></optgroup>
    <?php
};