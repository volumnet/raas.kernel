<?php include $VIEW->tmp('/form.inc.php')?>
<form<?php echo $_RAASForm_Attrs($Form)?>>
  <?php 
  if (array_filter((array)$Form->children, function($x) { return $x instanceof \RAAS\FormTab; })) { 
      $_RAASForm_Form_Tabbed($Form->children);
  } else {
      $_RAASForm_Form_Plain($Form->children);
  }
  ?>
  <div class="form-horizontal">
    <div class="control-group">
      <div class="controls">
          <input type="submit" class="btn btn-primary" value="<?php echo $Form->submitCaption ? htmlspecialchars($Form->submitCaption) : SAVE?>" />
        <?php if ($Form->Item && $Form->actionMenu) { ?>
            <input type="submit" name="@cancel" class="btn" value="<?php echo $Form->resetCaption ? htmlspecialchars($Form->resetCaption) : RESET?>" /> <?php echo _AND?>
            <select name="@oncommit">
              <?php 
              $_RAASForm_Actions = array();
              $_RAASForm_Actions[\RAAS\Form::ONCOMMIT_EDIT] = ONCOMMIT_EDIT;
              $_RAASForm_Actions[\RAAS\Form::ONCOMMIT_RETURN] = ONCOMMIT_RETURN;
              if (!$Form->Item->id) {
                  $_RAASForm_Actions[\RAAS\Form::ONCOMMIT_NEW] = ONCOMMIT_NEW;
              }
              foreach ($_RAASForm_Actions as $key => $val) { 
                  ?>
                  <option value="<?php echo (int)$key?>" <?php echo (isset($Form->DATA['@oncommit']) && $Form->DATA['@oncommit'] == $key) ? 'selected="selected"' : ''?>>
                    <?php echo htmlspecialchars($val)?>
                  </option>
              <?php } ?>
            </select>
        <?php } else { ?>
            <input type="reset" class="btn" value="<?php echo $Form->resetCaption ? htmlspecialchars($Form->resetCaption) : RESET?>" />
        <?php } ?>
      </div>
    </div>
  </div>
</form>