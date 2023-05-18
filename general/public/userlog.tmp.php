<?php
/**
 * Раздел "Обратная связь"
 */
namespace RAAS\General;

use RAAS\Application;

include $VIEW->tmp('/table.inc.php');
?>
<form class="form-search" action="" method="get">
  <?php foreach ($VIEW->nav as $key => $val) { ?>
      <?php if (in_array($key, ['mode', 'sub'])) { ?>
          <input type="hidden" name="<?php echo htmlspecialchars($key)?>" value="<?php echo htmlspecialchars($val)?>" />
      <?php } ?>
  <?php } ?>
  <table<?php echo $_RAASTable_Attrs($Table)?>>
    <?php if ($Table->header) { ?>
        <thead>
          <tr>
            <?php
            foreach ($Table->columns as $key => $col) {
                include \RAAS\Application::i()->view->context->tmp('/column.inc.php');
                if ($col->template) {
                    include \RAAS\Application::i()->view->context->tmp($col->template);
                }
                $_RAASTable_Header($col, $key);
            }
            ?>
          </tr>
          <tr>
            <th>
              <select name="uid[]" id="uid" multiple>
                <?php foreach ($users as $user) { ?>
                    <option value="<?php echo (int)$user->id?>"<?php echo in_array($user->id, (array)($VIEW->nav['uid'] ?? null)) ? ' selected="selected"' : ''?>>
                      <?php echo htmlspecialchars($user->login)?>
                    </option>
                <?php } ?>
              </select>
            </th>
            <th>
              <input type="date" name="date_from" class="span2" placeholder="<?php echo $VIEW->context->_('SHOW_FROM')?>" value="<?php echo $DATA['date_from'] ?? ''?>" /><br>
              <input type="date" name="date_to" class="span2" placeholder="<?php echo $VIEW->context->_('SHOW_TO')?>" value="<?php echo $DATA['date_to'] ?? ''?>" />
            </th>
            <th>
              <input type="text" name="ip" class="span2" value="<?php echo $DATA['ip'] ?? ''?>" />
            </th>
            <th>
              <select name="filter_method" id="filter_method" multiple>
                <?php foreach ($methods as $method) { ?>
                    <option value="<?php echo htmlspecialchars($method)?>"<?php echo in_array($method, (array)($DATA['filter_method'] ?? null)) ? ' selected="selected"' : ''?>>
                      <?php echo htmlspecialchars($method)?>
                    </option>
                <?php } ?>
              </select>
            </th>
            <th>
              <select name="filter_package[]" id="filter_package" multiple>
                <?php foreach ($packages as $package) { ?>
                    <option value="<?php echo htmlspecialchars($package)?>"<?php echo in_array($package, (array)($DATA['filter_package'] ?? null)) ? ' selected="selected"' : ''?>>
                      <?php echo htmlspecialchars($package)?>
                    </option>
                <?php } ?>
              </select>
            </th>
            <th>
              <select name="filter_module[]" id="filter_module" multiple>
                <?php foreach ($modules as $module) { ?>
                    <option value="<?php echo htmlspecialchars($module)?>"<?php echo in_array($module, (array)($DATA['filter_module'] ?? null)) ? ' selected="selected"' : ''?>>
                      <?php echo htmlspecialchars($module)?>
                    </option>
                <?php } ?>
              </select>
            </th>
            <th>
              <select name="filter_sub[]" id="filter_sub" multiple>
                <?php foreach ($subs as $sub) { ?>
                    <option value="<?php echo htmlspecialchars($sub)?>"<?php echo in_array($sub, (array)($DATA['filter_sub'] ?? null)) ? ' selected="selected"' : ''?>>
                      <?php echo htmlspecialchars($sub)?>
                    </option>
                <?php } ?>
              </select>
            </th>
            <th>
              <input type="text" name="action_name" autocomplete="off" class="span2" value="<?php echo $DATA['action_name'] ?? null?>" />
            </th>
            <th>
              <input type="text" name="element_id" class="span1" value="<?php echo $DATA['element_id'] ?? null?>" />
              <button type="submit" class="btn" title="<?php echo $VIEW->context->_('DO_SEARCH')?>"><i class="icon-search"></i></button>
              <a href="?mode=admin&sub=user_log" class="btn" title="<?php echo $VIEW->_('RESET')?>"><i class="fa fa-times"></i></button>
            </th>
          </tr>
        </thead>
    <?php } ?>
    <?php if ((array)$Table->Set) { ?>
        <tbody>
          <?php
          for ($i = 0; $i < count($Table->rows); $i++) {
              $row = $Table->rows[$i];
              include \RAAS\Application::i()->view->context->tmp('/row.inc.php');
              if ($row->template) {
                  include \RAAS\Application::i()->view->context->tmp($row->template);
              }
              $_RAASTable_Row($row, $i);
              ?>
          <?php } ?>
        </tbody>
    <?php } ?>
  </table>
</form>
<?php if (!(array)$Table->Set && $Table->emptyString) { ?>
  <p><?php echo htmlspecialchars($Table->emptyString)?></p>
<?php } ?>
<?php
if ($Table->Set && ($Pages = $Table->Pages) && ($pagesVar = $Table->pagesVar)) {
    include $VIEW->tmp('/pages.tmp.php')?>
<?php } ?>
<script>
jQuery(document).ready(function($) {
    $('[name="action_name"]').autocomplete({
        source: <?php echo json_encode($actions)?>
    })
});
</script>
