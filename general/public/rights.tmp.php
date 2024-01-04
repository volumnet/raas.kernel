<?php
/**
 * Виджет прав доступа
 */
declare(strict_types=1);

namespace RAAS\General;

use RAAS\Application;
use RAAS\Form;
use RAAS\FormTab;
use RAAS\Group;
use RAAS\IRightsContext;
use RAAS\Level;

/**
 * Выводит выпадающее меню уровней доступа
 * @param IRightsContext $context Контекст (пакет/модуль)
 * @param array $data Данные формы
 */
$getSelect = function (IRightsContext $context, array $data = []) {
    $contextValue = $data[$context->mid] ?? null;
    ?>
    <select
      class="span2"
      name="rights[<?php echo htmlspecialchars($context->mid)?>]"
      id="rights_<?php echo htmlspecialchars($context->mid)?>"
    >
      <option
        value="<?php echo (int)Level::REVOKE_ALL?>"
        <?php echo $contextValue == (int)Level::REVOKE_ALL ? 'selected="selected"' : ''?>
      >
        <?php echo REVOKE_ALL?>
      </option>
      <option value="" <?php echo !$contextValue ? 'selected="selected"' : ''?>><?php echo INHERIT?></option>
      <?php foreach ((array)$context->levels as $lev) { ?>
          <option
            value="<?php echo (int)$lev->id?>"
            <?php echo $data[$context->mid] == $lev->id ? 'selected="selected"' : ''?>
          >
            <?php echo htmlspecialchars($lev->name)?>
          </option>
      <?php } ?>
      <option
        value="<?php echo (int)Level::GRANT_ALL?>"
        <?php echo $contextValue == (int)Level::GRANT_ALL ? 'selected="selected"' : ''?>
      >
        <?php echo GRANT_ALL?>
      </option>
    </select>
    <?php
};


/**
 * Выводит строку модуля
 * @param IRightsContext $context Контекст (пакет/модуль)
 * @param Form $form Форма редактирования
 */
$showModule = function(IRightsContext $context, Form $form) use (&$getSelect) {
    $item = $form->Item;
    $data = (array)($form->DATA['rights'] ?? []);
    $f = $item instanceof Group ? 'getGroupRightsContextMenu' : 'getUserRightsContextMenu';
    ?>
    <tr<?php echo $context instanceof \RAAS\Package ? ' class="success"' : ''?>>
      <td<?php echo $context instanceof \RAAS\Module ? ' style="padding-left: 30px;"' : ''?>>
        <a href="?mode=admin&sub=modules&action=edit&mid=<?php echo htmlspecialchars($context->mid)?>" class="<?php echo $context->registryGet('isActive') ? '' : 'muted'?>">
          <?php echo $context->view->_('__NAME')?>
        </a>
      </td>
      <td>
        <?php $getSelect($context, (array)$data)?>
        <?php if ($item->access($context)->selfRights) { ?>
            <i class="icon-lock" title="<?php echo FINE_RIGHTS_CONFIG?>"></i>
        <?php } ?>
      </td>
      <td><?php echo $item->id ? rowContextMenu(\RAAS\General\ViewSub_Users::i()->$f($item, $context)) : ''?></td>
    </tr>
    <?php
};

$_RAASForm_FormTab = function(FormTab $formTab) use (
    &$showModule,
    &$getSelect,
    &$_RAASForm_Form_Tabbed,
    &$_RAASForm_Form_Plain,
    &$_RAASForm_Attrs
) {
    $form = $formTab->Form;
    $item = $form->Item;
    $data = (array)($form->DATA['rights'] ?? []);
    $f = ($item instanceof Group) ? 'getGroupRightsContextMenu' : 'getUserRightsContextMenu';
    ?>
    <table class="table">
      <thead><tr><th><?php echo PACKAGE_OR_MODULE?></th><th><?php echo ACCESS_LEVEL?></th><th></th></tr></thead>
      <tbody>
        <?php 
        foreach (\RAAS\Application::i()->packages as $key => $row) { 
            if ($key != '/') { 
                $showModule($row, $form);
                foreach ($row->modules as $row2) {
                    $showModule($row2, $form);
                }
            }
        } 
        ?>
      </tbody>
    </table>
    <?php
};
