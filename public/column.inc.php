<?php
$_RAASTable_Header = function(\RAAS\Column $Column, $key) use (&$_RAASTable_Attrs) {
    $Table = $Column->Parent;
    ?>
    <th<?php echo $_RAASTable_Attrs($Column)?>>
      <?php
      switch ($Column->sortable) {
          case \RAAS\Column::SORTABLE_REVERSABLE:
              $sortable = ($Table->sort == $key);
              $desc = ($sortable ? ($Table->order == \RAAS\Column::SORT_DESC) : null);
              $url = $Table->sortVar . '=' . $key . '&' . $Table->orderVar . '=' . ($sortable ? ($desc ? 'asc' : 'desc') : '');
              echo '<a href="' . \SOME\HTTP::queryString($url) . ($Table->hashTag ? '#_' . $Table->hashTag : '') . '">' . ($Column->caption . ($sortable ? (' ' . ($desc ? '&#9660;' : '&#9650;')) : '')) . '</a>';
              break;
          case \RAAS\Column::SORTABLE_NON_REVERSABLE:
              $url = $Table->sortVar . '=' . $key;
              echo '<a href="' . \SOME\HTTP::queryString($url) . '">' . $Column->caption . '</a>';
              break;
          default:
              echo $Column->caption;
              break;
      }
      ?>
    </th>
    <?php

};

$_RAASTable_Cell = function(\RAAS\Column $Column, $val) use (&$_RAASTable_Attrs) {
    echo '<td' . $_RAASTable_Attrs($Column) . '>' . $val . '</td>';
};