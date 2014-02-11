<?php 
if ($firstUser) { 
    ?>
    <div class="alert"><?php echo FIRST_USER?></div>
<?php } else { ?>
    <p><?php HAVETO_AUTHORIZE?></p>
    <?php 
    } 
include $VIEW->tmp('/form.tmp.php');