<?php
$getSelect = function (\RAAS\IRightsContext $row, array $DATA = array()) {
    ?>
    <select class="span2" name="rights[<?php echo htmlspecialchars($row->mid)?>]" id="rights_<?php echo htmlspecialchars($row->mid)?>">
      <option value="<?php echo (int)\RAAS\Level::REVOKE_ALL?>" <?php echo $DATA[$row->mid] == (int)\RAAS\Level::REVOKE_ALL ? 'selected="selected"' : ''?>><?php echo REVOKE_ALL?></option>
      <option value="" <?php echo !$DATA[$row->mid] ? 'selected="selected"' : ''?>><?php echo INHERIT?></option>
      <?php foreach ((array)$row->levels as $lev) { ?>
          <option value="<?php echo (int)$lev->id?>" <?php echo $DATA[$row->mid] == $lev->id ? 'selected="selected"' : ''?>>
            <?php echo htmlspecialchars($lev->name)?>
          </option>
      <?php } ?>
      <option value="<?php echo (int)\RAAS\Level::GRANT_ALL?>" <?php echo $DATA[$row->mid] == (int)\RAAS\Level::GRANT_ALL ? 'selected="selected"' : ''?>><?php echo GRANT_ALL?></option>
    </select>
    <?php
};

$showModule = function(\RAAS\IRightsContext $row, \RAAS\Form $Form) use (&$getSelect) {
    $Item = $Form->Item;
    $DATA = (array)$Form->DATA['rights'];
    $f = $Item instanceof \RAAS\Group ? 'getGroupRightsContextMenu' : 'getUserRightsContextMenu';
    ?>
    <tr<?php echo $row instanceof \RAAS\Package ? ' class="success"' : ''?>>
      <td<?php echo $row instanceof \RAAS\Module ? ' style="padding-left: 30px;"' : ''?>>
        <a href="?mode=admin&sub=modules&action=edit&mid=<?php echo htmlspecialchars($row->mid)?>" class="<?php echo $row->registryGet('isActive') ? '' : 'muted'?>">
          <?php echo $row->view->_('__NAME')?>
        </a>
      </td>
      <td>
        <?php $getSelect($row, (array)$DATA)?>
        <?php if ($Item->access($row)->selfRights) { ?>
            <i class="icon-lock" title="<?php echo FINE_RIGHTS_CONFIG?>"></i>
        <?php } ?>
      </td>
      <td><?php echo $Item->id ? rowContextMenu(\RAAS\General\ViewSub_Users::i()->$f($Item, $row)) : ''?></td>
    </tr>
    <?php
};

$_RAASForm_FormTab = function(\RAAS\FormTab $FormTab) use (&$showModule, &$getSelect, &$_RAASForm_Form_Tabbed, &$_RAASForm_Form_Plain, &$_RAASForm_Attrs) {
    $Form = $FormTab->Form;
    $Item = $Form->Item;
    $DATA = (array)$Form->DATA['rights'];
    $f = $Item instanceof \RAAS\Group ? 'getGroupRightsContextMenu' : 'getUserRightsContextMenu';
    ?>
    <table class="table">
      <thead><tr><th><?php echo PACKAGE_OR_MODULE?></th><th><?php echo ACCESS_LEVEL?></th><th></th></tr></thead>
      <tbody>
        <?php 
        foreach (\RAAS\Application::i()->packages as $key => $row) { 
            if ($key != '/') { 
                $showModule($row, $Form);
                foreach ($row->modules as $row2) {
                    $showModule($row2, $Form);
                }
            }
        } 
        ?>
      </tbody>
    </table>
    <?php
};