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
  <table<?php echo $Table->getAttrsString()?>>
    <?php if ($Table->header) { ?>
        <thead>
          <?php echo $Table->renderHeaderRow(); ?>
          <tr>
            <th>
              <?php
              ?>
              <raas-field-multiselect
                name="uid[]"
                id="uid"
                :source="<?php echo htmlspecialchars(json_encode(array_map(fn($x) => ['value' => (int)$x->id, 'caption' => $x->login], $users)))?>"
                :model-value="<?php echo htmlspecialchars(json_encode((array)($DATA['uid'] ?? [])))?>"
              ></raas-field-multiselect>
            </th>
            <th>
              <input type="date" name="date_from" class="span2" placeholder="<?php echo $VIEW->context->_('SHOW_FROM')?>" value="<?php echo $DATA['date_from'] ?? ''?>" /><br>
              <input type="date" name="date_to" class="span2" placeholder="<?php echo $VIEW->context->_('SHOW_TO')?>" value="<?php echo $DATA['date_to'] ?? ''?>" />
            </th>
            <th>
              <input type="text" name="ip" class="span2" value="<?php echo $DATA['ip'] ?? ''?>" />
            </th>
            <th>
              <raas-field-multiselect
                name="filter_method[]"
                id="filter_method"
                :source="<?php echo htmlspecialchars(json_encode(array_map(fn($x) => ['value' => $x, 'caption' => $x], $methods)))?>"
                :model-value="<?php echo htmlspecialchars(json_encode((array)($DATA['filter_method'] ?? [])))?>"
              ></raas-field-multiselect>
            </th>
            <th>
              <raas-field-multiselect
                name="filter_package[]"
                id="filter_package"
                :source="<?php echo htmlspecialchars(json_encode(array_map(fn($x) => ['value' => $x, 'caption' => $x], $packages)))?>"
                :model-value="<?php echo htmlspecialchars(json_encode((array)($DATA['filter_package'] ?? [])))?>"
              ></raas-field-multiselect>
            </th>
            <th>
              <raas-field-multiselect
                name="filter_module[]"
                id="filter_module"
                :source="<?php echo htmlspecialchars(json_encode(array_map(fn($x) => ['value' => $x, 'caption' => $x], $modules)))?>"
                :model-value="<?php echo htmlspecialchars(json_encode((array)($DATA['filter_module'] ?? [])))?>"
              ></raas-field-multiselect>
            </th>
            <th>
              <raas-field-multiselect
                name="filter_sub[]"
                id="filter_sub"
                :source="<?php echo htmlspecialchars(json_encode(array_map(fn($x) => ['value' => $x, 'caption' => $x], $subs)))?>"
                :model-value="<?php echo htmlspecialchars(json_encode((array)($DATA['filter_sub'] ?? [])))?>"
              ></raas-field-multiselect>
            </th>
            <th>
              <input type="text" name="action_name" autocomplete="off" class="span2" value="<?php echo $DATA['action_name'] ?? null?>" />
            </th>
            <th>
              <input type="text" name="element_id" class="span1" value="<?php echo $DATA['element_id'] ?? null?>" />
              <button type="submit" class="btn" title="<?php echo $VIEW->context->_('DO_SEARCH')?>"><raas-icon icon="search"></raas-icon></button>
              <a href="?mode=admin&sub=user_log" class="btn" title="<?php echo $VIEW->_('RESET')?>"><raas-icon icon="times"></raas-icon></button>
            </th>
          </tr>
        </thead>
    <?php }
    echo $Table->renderBody();
    ?>
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
