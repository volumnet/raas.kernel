<?php
$_RAASForm_FormTab = function(\RAAS\FormTab $FormTab) use (&$_RAASForm_Form_Tabbed, &$_RAASForm_Form_Plain, &$_RAASForm_Attrs) {
    if (array_filter((array)$FormTab->children, function($x) { return $x instanceof \RAAS\FormTab; })) { 
        $_RAASForm_Form_Tabbed($FormTab->children);
    } else {
        $_RAASForm_Form_Plain($FormTab->children);
    }
};