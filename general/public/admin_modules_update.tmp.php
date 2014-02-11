<?php if (isset($Update)) { ?>
    <div class="form-horizontal">
      <div class="control-group">
        <label class="control-label"><?php echo MODULE_OR_PACKAGE?>:</label>
        <div class="controls">
          <?php echo htmlspecialchars($Update->module)?>
          (<?php if ($Update->Context instanceof \RAAS\IContext) { ?>
              <?php if ($Update->Context instanceof \RAAS\Package) { ?>
                  <a href="?mode=admin&sub=modules&action=edit&mid=<?php echo htmlspecialchars($Update->Context->mid)?>">
                    <?php echo htmlspecialchars($Update->Context->view->_('__NAME'))?>
                  </a>
              <?php } elseif ($Update->Context instanceof \RAAS\Module) { ?>
                  <a href="?mode=admin&sub=modules&action=edit&mid=<?php echo htmlspecialchars($Update->Context->mid)?>">
                    <?php echo htmlspecialchars($Update->Context->view->_('__NAME'))?>
                  </a>
              <?php } elseif ($Update->Context instanceof \RAAS\Application) { ?>
                  <a href="?mode=admin&sub=modules&action=edit"><?php echo APPLICATION?></a>
              <?php } ?>
          <?php } else { ?>
              <?php if (isset($Update->preContext['p'], $Update->preContext['m'])) { ?>
                  <?php echo htmlspecialchars($Update->moduleName)?>
              <?php } elseif (isset($Update->preContext['p'])) { ?>
                  <?php echo htmlspecialchars($Update->moduleName)?>
              <?php } ?>
          <?php } ?>)
        </div>
      </div>
      <div class="control-group">
        <label class="control-label"><?php echo INSTALL_MODE?>:</label><div class="controls"><?php echo $Update->Context ? UPDATE : INSTALLATION?></div>
      </div>
      <div class="control-group">
        <label class="control-label"><?php echo VERSION?>:</label>
        <div class="controls">
          <span <?php echo ($Update->Context && ($Update->versionTime <= $Update->Context->versionTime) && !$success) ? 'class="text-error"' : ''?>>
            <?php echo date(DATEFORMAT, $Update->versionTime)?>
          </span>
        </div>
      </div>
      <div class="control-group">
        <label class="control-label"><?php echo DESCRIPTION?>:</label><div class="controls"><?php echo nl2br(htmlspecialchars($Update->description))?></div>
      </div>
    </div>
<?php } ?>

<h2><?php echo AUTOMATIC_UPDATE?></h2>
<?php if ($DATA = $availableUpdates['modules']) { ?>
    <p><?php echo THE_FOLLOWING_UPDATES_AVAILABLE?>:</p>
    <table class="table table-striped">
      <thead><tr><th><?php echo PACKAGE_OR_MODULE?></th><th><?php echo VERSION?></th><th><?php echo REMOTE_VERSION?></th><th>&nbsp;</th></tr></thead>
      <tbody>
        <?php if (isset($DATA['/'])) { ?>
            <tr class="info">
              <td><?php echo $APPLICATION->view->_('APPLICATION')?></td>
              <td><?php echo date($VIEW->_('DATEFORMAT'), $APPLICATION->versionTime)?></td>
              <td><?php echo date($VIEW->_('DATEFORMAT'), $DATA['/'])?></td>
              <td>
                <a class="btn" href="?mode=admin&sub=modules&action=update&mid=/" onclick="return confirm('<?php echo addslashes(htmlspecialchars(UPDATE_CONFIRM_TEXT))?>');">
                  <?php echo DO_UPDATE?>
                </a>
              </td>
            </tr>
        <?php } ?>
        <?php foreach ($APPLICATION->packages as $key => $row) { ?>
            <?php if ($key != '/') { ?>
                <?php if ($temp = array_filter(array_keys($DATA), function($x) use ($key) { return preg_match('/^' . preg_quote($key) . '($|\\.)/i', $x); })) { ?>
                    <tr class="success">
                      <td><?php echo $row->view->_('__NAME')?></td>
                      <?php if (isset($DATA[$key])) { ?>
                          <td><?php echo date($VIEW->_('DATEFORMAT'), $row->versionTime)?></td>
                          <td><?php echo date($VIEW->_('DATEFORMAT'), $DATA[$row->alias])?></td>
                          <td><a class="btn" href="?mode=admin&sub=modules&action=update&mid=<?php echo htmlspecialchars($row->alias)?>" onclick="return confirm('<?php echo addslashes(htmlspecialchars(UPDATE_CONFIRM_TEXT))?>');"><?php echo DO_UPDATE?></a></td>
                      <?php } else { ?>
                          <td colspan="3"></td>
                      <?php } ?>
                    </tr>
                    <?php foreach ($row->modules as $row2) { ?>
                        <?php if (isset($DATA[$row->alias . '.' . $row2->alias])) { ?>
                            <tr>
                              <td style="padding-left: 30px;"><?php echo $row2->view->_('__NAME')?></td>
                              <td><?php echo date($VIEW->_('DATEFORMAT'), $row2->versionTime)?></td>
                              <td><?php echo date($VIEW->_('DATEFORMAT'), $DATA[$row->alias . '.' . $row2->alias])?></td>
                              <td>
                                <a class="btn" href="?mode=admin&sub=modules&action=update&mid=<?php echo htmlspecialchars($row->alias . '.' . $row2->alias)?>" onclick="return confirm('<?php echo addslashes(htmlspecialchars(UPDATE_CONFIRM_TEXT))?>');">
                                  <?php echo DO_UPDATE?>
                                </a>
                              </td>
                            </tr>
                        <?php } ?>
                    <?php } ?>
                <?php } ?>
            <?php } ?>
        <?php } ?>
      </tbody>
    </table>
<?php } elseif (isset($availableUpdates['failedToConnect'])) { ?>
    <p class="error"><?php echo FAILED_TO_CONNECT_TO_UPDATE_SERVER?></p>
<?php } else { ?>
    <p><?php echo NO_UPDATES_AVAILABLE?></p>
<?php } ?>

<h2><?php echo MANUAL_UPDATE?></h2>
<p><?php echo DO_UPDATE_FILE_TEXT?></p>
<form class="form-inline" action="?mode=admin&sub=modules&action=update" method="post" enctype="multipart/form-data">
  <input type="file" name="update" required="required" value="" /> 
  <input type="submit" class="btn btn-info" value="<?php echo VIEW?>" />
  <input type="submit" class="btn btn-primary" name="doUpdate" value="<?php echo DO_UPDATE?>" onclick="return confirm('<?php echo addslashes(htmlspecialchars(UPDATE_CONFIRM_TEXT))?>');" />
</form>
