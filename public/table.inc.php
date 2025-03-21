<?php
namespace RAAS;

/**
 * Возвращает строку атрибутов табличного элемента
 * @param TableElement $tableElement табличный элемент
 * @param array $additional Дополнительные атрибуты
 * @return string
 * @deprecated Используем метод getAttrsString() - до 2026-03-20
 */
$_RAASTable_Attrs = function (TableElement $tableElement, array $additional = []): string {
    trigger_error('$_RAASTable_Attrs is deprecated. Use TableElement::getAttrsString instead.', E_USER_DEPRECATED);
    return $tableElement->getAttrsString($additional);
};


/**
 * Рендерит строку заголовка таблицы
 * @param Table $table Таблица
 */
$_RAASTable_HeaderRow = function (Table $table) {
    ?>
    <tr>
      <?php if ($table->isMultitable) { ?>
          <th>
            <?php if ($table->meta['allValue'] ?? false) { ?>
                <input type="checkbox" data-role="checkbox-all" value="<?php echo htmlspecialchars($table->meta['allValue'])?>">
            <?php } ?>
          </th>
      <?php }
      foreach ($table->columns as $key => $col) {
          echo $col->renderHeader($key);
      }
      ?>
    </tr>
    <?php
};


/**
 * Рендерит заголовок таблицы
 * @param Table $table Таблица
 */
$_RAASTable_Header = function (Table $table) {
    if ($table->header) { ?>
        <thead>
          <?php echo $table->renderHeaderRow()?>
        </thead>
    <?php }
};


/**
 * Рендерит тело таблицы
 * @param Table $table Таблица
 */
$_RAASTable_Body = function (Table $table) {
    if ((array)$table->Set) {
        $rows = $table->rows;
        $st = microtime(true);
        ?>
        <tbody>
          <?php
          for ($i = 0; $i < count($rows); $i++) {
              echo $rows[$i]->render($i);
          }
          ?>
        </tbody>
    <?php }
};


/**
 * Рендерит строку подвала таблицы
 * @param Table $table Таблица
 */
$_RAASTable_FooterRow = function (Table $table) {
    $columnsCounter = count($table->columns) + (int)$table->isMultitable; // + (int)$table->isMultitable - Увеличиваем на колонку чекбоксов
    if ($table->hasAllContextMenu) {
        $allContextMenuSpan = 2;
        if (($table->priorityColumnIndex !== null) && ($table->priorityColumnIndex <= 1)) {
            $allContextMenuSpan = 1;
        }
        $middleSpan = max(0, $table->priorityColumnIndex - $allContextMenuSpan);
    } elseif ($table->priorityColumnIndex !== null) {
        $middleSpan = $table->priorityColumnIndex;
    }

    if ($table->priorityColumnIndex !== null) {
        $rightSpan = $columnsCounter - $table->priorityColumnIndex - 1; // Общее количество колонок - номер колонки приоритета - одна колонка приоритета
    } elseif ($table->hasAllContextMenu) {
        $rightSpan = $columnsCounter - $allContextMenuSpan; // Общее количество колонок - колонки общего меню
    }
    // Тут рассматриваем, что один из этих вариантов точно должен быть
    // var_dump($allContextMenuSpan, $middleSpan, $rightSpan);
    ?>
    <tr>
      <?php if ($table->hasAllContextMenu) { ?>
          <td<?php echo ($allContextMenuSpan > 1) ? (' colspan="' . $allContextMenuSpan . '"') : ''?>>
            <all-context-menu
              :menu="<?php echo htmlspecialchars(json_encode(getMenu($table->meta['allContextMenu'])))?>"
            ></all-context-menu>
          </td>
      <?php } ?>
      <?php if ($middleSpan) { ?>
          <td<?php echo ($middleSpan > 1) ? (' colspan="' . $middleSpan . '"') : ''?>></td>
      <?php } ?>
      <?php if ($table->priorityColumnIndex) { ?>
          <td>
            <button type="submit" class="btn btn-small btn-default">
              <?php echo DO_UPDATE?>
            </button>
          </td>
      <?php } ?>
      <?php if ($rightSpan) { ?>
          <td<?php echo ($rightSpan > 1) ? (' colspan="' . $rightSpan . '"') : ''?>></td>
      <?php } ?>
    </tr>
    <?php
};


/**
 * Рендерит подвал таблицы
 * @param Table $table Таблица
 */
$_RAASTable_Footer = function (Table $table) {
    if ((array)$table->Set &&
        (($table->hasAllContextMenu) || ($table->priorityColumnIndex !== null))
    ) {
        ?>
        <tfoot>
          <?php echo $table->renderFooterRow()?>
        </tfoot>
    <?php }
};


/**
 * Рендерит собственно таблицу
 * @param Table $table Таблица
 */
$_RAASTable_Table = function (Table $table) {
    ?>
    <table<?php echo $table->getAttrsString()?>>
      <?php echo $table->renderHeader() . $table->renderBody() . $table->renderFooter()?>
    </table>
    <?php
};


/**
 * Рендерит таблицу с окружающей формой (если нужна)
 * @param Table $table Таблица
 * @param bool $insideForm Уже находится внутри формы
 */
$_RAASTable_TableForm = function (Table $table, bool $insideForm = false) {
    $tableHTML = $table->renderTable();
    if ($table->priorityColumnIndex && !($insideForm ?? false)) {
        echo '<form action="' . (($table->meta['formHash'] ?? null) ? ('#' . $table->meta['formHash']) : '') . '" method="post">' .
                $tableHTML .
             '</form>';
    } else {
        echo $tableHTML;
    }
};

/**
 * Рендерит таблицу полностью
 * @param Table $table Таблица
 * @param bool $insideForm Таблица находится уже внутри формы (ей не нужна своя форма)
 * @param string $pagesHash Хэш-тег для постраничной разбивки
 */
$_RAASTable = function (Table $table, bool $insideForm = false, string $pagesHash = '') {
    if ((array)$table->Set || ($table->emptyHeader && $table->header)) {
        echo $table->renderTableForm();
    }
    if (!(array)$table->Set && $table->emptyString) { ?>
        <p><?php echo htmlspecialchars($table->emptyString)?></p>
    <?php }
    if ($table->Set && ($Pages = $table->Pages) && ($pagesVar = $table->pagesVar)) {
        include Application::i()->view->tmp('/pages.tmp.php')?>
    <?php }
};
