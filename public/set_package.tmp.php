<?php echo SELECT_PACKAGE_TO_WORK?>
<?php $f = false?>
<?php foreach ($APPLICATION->packages as $key => $row) { ?>
    <?php 
    echo $f ? '<hr />' : ''?>
    <h2><a href="?p=<?php echo htmlspecialchars($row->alias)?>"><?php echo htmlspecialchars($row->view->_('__NAME'))?></a></h2>
    <p><?php echo htmlspecialchars($row->view->_('__DESCRIPTION'))?></p>
    <?php $f = true?>
<?php } ?>