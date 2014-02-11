<?php echo SELECT_LANGUAGE_TO_WORK?>
<?php $f = false?>
<?php foreach ($VIEW->availableLanguages as $key => $val) { ?>
    <?php 
    echo $f ? '<hr />' : ''?>
    <h2><a href="?mode=set_language&lang=<?php echo htmlspecialchars($key) . ($NAV['referer'] ? '&referer=' . urlencode($NAV['referer']) : '')?>"><?php echo htmlspecialchars($val)?></a></h2>
    <?php $f = true?>
<?php } ?>