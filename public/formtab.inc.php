<?php
/**
 * Виджет вкладки
 */
namespace RAAS;

$_RAASForm_FormTab = function($formTab) {
    echo $formTab->children->render();
};
