<?php
/**
 * Функции для отображения колонок таблицы
 */
namespace RAAS;

use SOME\HTTP;

/**
 * Отображает ячейку-заголовок таблицы
 * @param Column $column Колонка
 * @param string $key URN колонки
 */
$_RAASTable_Header = function (Column $column, string $key) {
    $table = $column->Parent;
    ?>
    <th<?php echo $column->getAttrsString()?>>
      <?php
      switch ($column->sortable) {
          case Column::SORTABLE_REVERSABLE:
              $sortable = ($table->sort == $key);
              $desc = ($sortable ? ($table->order == Column::SORT_DESC) : null);
              $url = $table->sortVar . '=' . $key . '&' . $table->orderVar . '=' . ($sortable ? ($desc ? 'asc' : 'desc') : '');
              echo '<a href="' . HTTP::queryString($url) . ($table->hashTag ? '#_' . $table->hashTag : '') . '">' . ($column->caption . ($sortable ? (' ' . ($desc ? '&#9660;' : '&#9650;')) : '')) . '</a>';
              break;
          case Column::SORTABLE_NON_REVERSABLE:
              $url = $table->sortVar . '=' . $key;
              echo '<a href="' . HTTP::queryString($url) . '">' . $column->caption . '</a>';
              break;
          default:
              echo $column->caption;
              break;
      }
      ?>
    </th>
    <?php

};

/**
 * Отображает ячейку таблицы
 * @param Column $column Колонка
 * @param string $val Текст таблицы
 */
$_RAASTable_Cell = function (Column $column, string $val) {
    echo '<td' . $column->getAttrsString() . '>' . $val . '</td>';
};
