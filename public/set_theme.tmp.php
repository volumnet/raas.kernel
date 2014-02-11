<?php echo SELECT_USER_THEME?>
<?php $f = false?>
<?php foreach ($VIEW->availableThemes as $key => $val) { ?>
    <?php 
    echo $f ? '<hr />' : ''?>
    <h2><a href="?mode=set_theme&theme=<?php echo htmlspecialchars($key) . ($NAV['referer'] ? '&referer=' . urlencode($NAV['referer']) : '')?>"><?php echo htmlspecialchars($val)?></a></h2>
    <?php $f = true?>
<?php } ?>