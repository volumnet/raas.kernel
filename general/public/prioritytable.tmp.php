<?php
/**
 * Таблица с полем порядка отображения
 */
namespace RAAS\General;

use RAAS\Application;

include View_Web::i()->tmp('/table.inc.php');

if ((array)$Table->Set || ($Table->emptyHeader && $Table->header)) { ?>
    <form action="" method="post">
      <table<?php echo $_RAASTable_Attrs($Table)?>>
        <?php if ($Table->header) { ?>
            <thead>
              <tr>
                <?php foreach ($Table->columns as $key => $col) {
                    include Application::i()->view->context->tmp('/column.inc.php');
                    if ($col->template) {
                        include Application::i()->view->context->tmp($col->template);
                    }
                    $_RAASTable_Header($col, $key);
                } ?>
              </tr>
            </thead>
        <?php }
        if ((array)$Table->Set) { ?>
            <tbody>
              <?php for ($i = 0; $i < count($Table->rows); $i++) {
                  $row = $Table->rows[$i];
                  include Application::i()->view->context->tmp('/row.inc.php');
                  if ($row->template) {
                      include Application::i()->view->context->tmp($row->template);
                  }
                  $_RAASTable_Row($row, $i);
              } ?>
            </tbody>
        <?php } ?>
        <tfoot>
          <tr>
            <td colspan="<?php echo (count($Table->columns) - 2)?>">&nbsp;</td>
            <td>
              <input type="submit" class="btn btn-small btn-default" style="width: 70px; padding: 2px 0;" value="<?php echo DO_UPDATE?>" />
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </form>
<?php }
if (!(array)$Table->Set && $Table->emptyString) { ?>
    <p><?php echo htmlspecialchars($Table->emptyString)?></p>
<?php }
if ($Table->Set && ($Pages = $Table->Pages) && ($pagesVar = $Table->pagesVar)) {
    include ViewSub_Main::i()->tmp('/pages.tmp.php');
}
