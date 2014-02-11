<?php
$_RAASForm_Attrs = function(\RAAS\FormElement $FormElement, $additional = array()) {
    $arr = (array)$FormElement->attrs;
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
    if (!(isset($arr['id']) && $arr['id']) && !$FormElement->multiple && isset($arr['name']) && $arr['name']) {
        $arr['id'] = $arr['name'];
    } elseif ($FormElement->multiple) {
        unset($arr['id']);
    }
    if (isset($arr['name']) && $FormElement->multiple && !strstr($arr['name'], '[')) {
        $arr['name'] .= '[]';
    }
    if ($FormElement->type != 'select') {
        //unset($arr['multiple'], $arr['placeholder']); 2013-08-19 - Зачем??? // AVS
    }
    if ($FormElement->type == 'password') {
        unset($arr['confirm']);
    }
    if ($arr['required']) {
        $arr['data-required'] = 'required';
    }
    unset($arr['required']); // временно
    $text = '';
    foreach ($arr as $key => $val) {
        $text .= ' ' . htmlspecialchars($key) . '="' . htmlspecialchars($val) . '"';
    }
    return $text;
};

$_RAASForm_Form_Plain = function(\RAAS\FieldCollection $fields) use (&$_RAASForm_Form_Plain, &$_RAASForm_Attrs) {
    ?>
    <div class="form-horizontal">
      <?php 
      foreach ($fields as $row) { 
          switch (get_class($row)) {
              case 'RAAS\FieldSet':
                  include \RAAS\Application::i()->view->context->tmp('/fieldset.inc.php');
                  break;
              case 'RAAS\Field':
                  include \RAAS\Application::i()->view->context->tmp('/field.inc.php');
                  break;
          }
          if ($row->template) {
              include \RAAS\Application::i()->view->context->tmp($row->template);
          }
          switch (get_class($row)) {
              case 'RAAS\FieldSet':
                  $_RAASForm_FieldSet($row);
                  break;
              case 'RAAS\Field':
                  $_RAASForm_Field($row);
                  break;
              default:
                  $_RAASForm_Form_Plain($row->children);
                  break;
          }
      } 
      ?>
    </div>
    <?php
};

$_RAASForm_Form_Tabbed = function(\RAAS\FieldCollection $fields) use (&$_RAASForm_Form_Tabbed, &$_RAASForm_Form_Plain, &$_RAASForm_Attrs) {
    ?>
    <div class="tabbable">
      <ul class="nav nav-tabs">
        <?php $i = 0; foreach ($fields as $row) { ?>
            <li<?php echo !$i ? ' class="active"' : ''?>>
              <a href="#<?php echo htmlspecialchars($row->name)?>" data-toggle="tab"><?php echo htmlspecialchars($row->caption)?></a>
            </li>
        <?php $i++; } ?>
      </ul>
      <div class="tab-content">
        <?php 
        $i = 0; 
        foreach ($fields as $row) { 
            ?>
            <div<?php echo $_RAASForm_Attrs($row, array('class' => 'tab-pane' . (!$i ? ' active' : ''), 'id' => $row->name))?>>
              <?php
              include \RAAS\Application::i()->view->context->tmp('/formtab.inc.php');
              if ($row->template) {
                  include \RAAS\Application::i()->view->context->tmp($row->template);
              }
              $_RAASForm_FormTab($row);
              ?>
            </div>
        <?php $i++; } ?>
      </div>
    </div>
    <?php
};