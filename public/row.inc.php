<?php
/**
 * Строка таблицы
 */
namespace RAAS;

/**
 * Отображает строку таблицы
 * @param Row $row Строка таблицы для отображения
 * @param int $num Номер строки
 */
$_RAASTable_Row = function (Row $row, int $num) {
    $table = $row->Parent;
    ?>
    <tr<?php echo $row->getAttrsString()?>>
      <?php if ($table->isMultitable) { ?>
          <td>
            <?php if ($row->source->id && !$row->disableMulti) { ?>
                <input type="checkbox" data-role="checkbox-row" value="<?php echo (int)$row->source->id?>">
            <?php } ?>
          </td>
      <?php }
      foreach ($table->columns as $key => $col) {
          $var = $table->displayData[$num][$key];
          echo $col->render((string)$var);
      } 
      ?>
    </tr>
    <?php
};
