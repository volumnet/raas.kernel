<p>
  <?php echo General\GREETING?> <b><?php echo htmlspecialchars(\RAAS\Application::i()->versionName); ?></b>.
  <?php echo General\SELECT_MODULE?>
</p>
<p><?php echo General\GOOD_WISHES?></p>
<p><i><?php echo General\SERVER_TIME?>: <label id="lblTime"><?php echo date('d.m.Y H:i:s'); ?></label></i></p>
<p>
  <b><?php echo YOU_LOGGED_AS?>:</b> <?php echo $USER->login; ?><br />
  <b><?php echo ADMIN_RIGHTS?>:</b>
  <?php echo ($USER->adminRights ? '<b class="text-success">' . _YES . '</b>' : '<b class="text-error">' . _NO . '</b>')?><br />
  <b><?php echo YOUR_IP?>:</b>
  <?php
  echo $ip;
  if (isset($proxy) && $proxy && ($proxy != $ip)) {
      echo ' (<b>' . PROXY . ':</b> ' . $proxy . ')';
  }
  ?>
  <br />
  <b><?php echo SERVER_IP?>:</b>
  <?php echo $serverIP; ?><br />
  <b><?php echo __PHP_VERSION?>:</b>
  <?php echo PHP_VERSION ?>
  <br />
</p>
<script type="text/javascript" src="<?php echo $APPLICATION->activePackage->view->publicURL?>/greeting.js"></script>
<script type="text/javascript">
jQuery(function($) {
    $('#lblTime').serverClock({
        GOODMORNING: '<?php echo General\GOODMORNING?>',
        GOODAFTERNOON: '<?php echo General\GOODAFTERNOON?>',
        GOODEVENING: '<?php echo General\GOODEVENING?>',
        GOODNIGHT: '<?php echo General\GOODNIGHT?>',
        greeting: 'article.main > h1'
    })
})
</script>

