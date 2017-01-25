<?php
$pages_list = array();
if ($Pages->pages > 1) {
    $trace = 2;
    if (!$pagesVar) {
        $pagesVar = 'page';
    }
    $pattern_active = '<li class="active"><span>{text}</span></li>';
    $pattern = '<li><a href="' . \SOME\HTTP::queryString($pagesVar . '={link}') . ($pagesHash ? '#' . $pagesHash : '') . '">{text}</a></li>';

    if ($Pages->page > 1) {
        $pages_list[] = strtr($pattern, array(urlencode('{link}') => $Pages->page - 1, '{text}' => '«'));
    }
    if ($Pages->page > 1 + $trace) {
        $pages_list[] = strtr($pattern, array(urlencode('{link}') => 1, '{text}' => 1));
    }
    if ($Pages->page > 2 + $trace) {
        if ($Pages->page == 3 + $trace) {
            $pages_list[] = strtr($pattern, array(urlencode('{link}') => 2, '{text}' => 2));
        } else {
            $pages_list[] = '<li><span>...</span></li>';
        }
    }
    for ( $i = max(1, $Pages->page - $trace);
          $i <= min($Pages->page + $trace, $Pages->pages);
          $i++) {
        $pages_list[] = strtr(($i == $Pages->page ? $pattern_active : $pattern),
                        array(urlencode('{link}') => $i, '{text}' => $i));
    }
    if ($Pages->page < $Pages->pages - $trace - 1) {
        if ($Pages->page == $Pages->pages - $trace - 2) {
            $pages_list[] = strtr($pattern, array(urlencode('{link}') =>  $Pages->pages - 1,
                                            '{text}' =>  $Pages->pages - 1));
        } else {
            $pages_list[] = '<li><span>...</span></li>';
        }
    }
    if ($Pages->page < $Pages->pages - $trace) {
        $pages_list[] = strtr($pattern, array(urlencode('{link}') => $Pages->pages, '{text}' => $Pages->pages));
    }
    if ($Pages->page < $Pages->pages) {
        $pages_list[] = strtr($pattern, array(urlencode('{link}') => $Pages->page + 1, '{text}' => '»'));
    }

    $pages_list = implode(' ', $pages_list);
}
?>
<nav class="pagination pagination-right clearfix">
  <div class="pull-left"><b><?php echo PAGES_SHOWN?>: </b> <?php echo $Pages->from . ' — ' . $Pages->to . ' ' . PAGES_OF . ' ' . $Pages->count; ?></div>
  <div><?php echo $pages_list ? '<ul>' . $pages_list . '</ul>' : ''?></div>
</nav>
