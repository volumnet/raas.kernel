<?php
$_RAASTable_Attrs = function(\RAAS\TableElement $TableElement, $additional = array()) {
    $arr = (array)$TableElement->attrs;
    if ($TableElement instanceof \RAAS\Table) {
        $arr['class'] .= ' table table-striped';
    }
    foreach ((array)$additional as $key => $val) {
        if ($val === false) {
            unset($arr[$key]);
        } else {
            if (in_array($key, array('class', 'data-role'))) {
                $arr[$key] .= ' ' . $val;
            } else {
                $arr[$key] = $val;
            }
        }
    }
    foreach ($arr as $key => $val) {
        $arr[$key] = trim($val);
    }
    $text = '';
    foreach ($arr as $key => $val) {
        $text .= ' ' . htmlspecialchars($key) . '="' . htmlspecialchars($val) . '"';
    }
    return $text;
};
