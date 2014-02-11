<?php
$getCatalogTree = function(\RAAS\Group $node, array $cats = array()) use (&$getCatalogTree)
{
    static $level = 0;
    foreach ($node->children as $row) {
        $text .= '<li class="' . ((!$row->vis || !$row->pvis) ? ' cms-invis' : '') . (!$row->pvis ? ' cms-inpvis' : '') . '">
                    <label class="checkbox">
                      <input type="checkbox" name="groups[' . (int)$row->id . ']" value="1" ' . ($cats[$row->id] ? 'checked="checked"' : '') . ' /> 
                      ' . htmlspecialchars($row->name) . '
                    </label>';
        if ($current->id != $row->id) {
            $level++;
            $text .= $getCatalogTree($row, $cats);
            $level--;
        }
        $text .= '</li>'; 
    }

    if ($text) {
        if ($level) {
            $text = '<ul>' . $text . '</ul>';
        } else {
            $text = '<ul class="tree" data-raas-role="tree">' . $text . '</ul>';
        }
    }
    return $text;
};

$_RAASForm_FormTab = function(\RAAS\FormTab $FormTab) use (&$getCatalogTree, &$showModule, &$getSelect, &$_RAASForm_Form_Tabbed, &$_RAASForm_Form_Plain, &$_RAASForm_Attrs) {
    echo $getCatalogTree(new \RAAS\Group(), (array)$FormTab->Form->DATA['groups']);
};