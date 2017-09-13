<?php
$_RAASForm_Options = function(\RAAS\OptionCollection $options, $level = 0) use (&$_RAASForm_Options, &$_RAASForm_Attrs) {
    foreach ($options as $row) {
        switch (get_class($row)) {
            case 'RAAS\OptGroup':
                include \RAAS\Application::i()->view->context->tmp('/optgroup.inc.php');
                break;
            case 'RAAS\Option':
                include \RAAS\Application::i()->view->context->tmp('/option.inc.php');
                break;
        }
        if ($row->template) {
            include \RAAS\Application::i()->view->context->tmp($row->template);
        }
        switch (get_class($row)) {
            case 'RAAS\OptGroup':
                $_RAASForm_OptGroup($row, $level);
                break;
            case 'RAAS\Option':
                $_RAASForm_Option($row, $level);
                break;
            default:
                $_RAASForm_Options($row->children, $level + 1);
                break;
        }
    }
};

$_RAASForm_Checkbox = function (\RAAS\OptionCollection $options, $level = 0) use (&$_RAASForm_Checkbox, &$_RAASForm_Attrs) {
    $Field = $options->Parent;
    $options = (array)$options;
    $attrs = array();
    $text = '';
    $plain = !$level && !array_filter($options, function($x) { return (bool)(array)$x->children; }) && count($options) < 16;
    foreach ($options as $row) {
        $attrs = $row->attrs;
        foreach (array('type', 'name', 'multiple') as $key) {
            $attrs[$key] = $Field->$key;
        }
        if (in_array($row->value, (array)$Field->Form->DATA[$Field->name])) {
            $attrs['checked'] = 'checked';
        }
        if ($plain) {
            $text .= '<label class="' . $Field->type . ' inline"><input' . $_RAASForm_Attrs($Field, $attrs) . ' /> ' . htmlspecialchars($row->caption) . '</label>';
        } else {
            $text .= '<li>';
            if ($row instanceof \RAAS\OptGroup) {
                $text .= '  <label>' . htmlspecialchars($row->caption) . '</label>' ;
            } else {
                $text .= '  <label><input' . $_RAASForm_Attrs($Field, $attrs) . ' /> ' . htmlspecialchars($row->caption) . '</label>' ;
            }
            $text .=    $_RAASForm_Checkbox($row->children, $level + 1) . '
                      </li>';
        }
    }
    return $text && !$plain ? '<ul' . (!$level ? ' class="tree" data-raas-role="tree"' : '') . '>' . $text . '</ul>' : $text;
};

$_RAASForm_Control = function(\RAAS\Field $Field, $confirm = true) use (&$_RAASForm_Attrs, &$_RAASForm_Options, &$_RAASForm_Checkbox) {
    $attrs = array();
    switch ($Field->type) {
        case 'image': case 'file':
            $attVar = isset($Field->meta['attachmentVar']) ? $Field->meta['attachmentVar'] : 'attachments';
            $delAttPath = isset($Field->meta['deleteAttachmentPath']) ? $Field->meta['deleteAttachmentPath'] : (\SOME\HTTP::queryString('action=delete_attachment&id=') . '&id=%s');
            $Set = $Field->Form->Item->$attVar;
            if (!is_array($Set)) {
                $Set = array($Set);
            }
            if ($Set = array_values(array_filter($Set, function($x) { return $x->id; }))) {
                ?>
                <ul class="thumbnails">
                  <?php
                  for ($i = 0; $i < count($Set); $i++) {
                      $row = $Set[$i];
                      ?>
                      <li class="span2">
                        <div class="thumbnail">
                          <?php if ($i || !$Field->required) { ?>
                            <a class="close" href="<?php echo sprintf($delAttPath, (int)$row->id)?>" onclick="return confirm('<?php echo $Field->type == 'image' ? DELETE_IMAGE_TEXT : DELETE_FILE_TEXT?>')">&times;</a>
                          <?php } ?>
                          <a href="<?php echo htmlspecialchars($row->fileURL)?>" target="_blank">
                            <?php if ($Field->type == 'image') { ?>
                                <img src="<?php echo htmlspecialchars($row->tnURL)?>" alt="<?php echo htmlspecialchars(basename($row->filename))?>" title="<?php echo htmlspecialchars(basename($row->filename))?>" />
                            <?php } else { ?>
                                <?php echo htmlspecialchars(basename($row->filename))?>
                            <?php } ?>
                          </a>
                        </div>
                      </li>
                      <?php
                  }
                  ?>
                </ul>
                <?php
            }
            $attrs = array('type' => 'file');
            if ($Field->type == 'image') {
                $attrs['accept'] = 'image/jpeg,image/png,image/gif';
            }
            if ($Field->multiple) {
                ?>
                <div data-role="raas-repo-block">
                  <div data-role="raas-repo-container"><div data-role="raas-repo-element"><input<?php echo $_RAASForm_Attrs($Field, $attrs)?> /></div></div>
                  <div data-role="raas-repo"><input<?php echo $_RAASForm_Attrs($Field, array_merge($attrs, array('disabled' => 'disabled')))?> /></div>
                </div>
            <?php } else { ?>
                <input<?php echo $_RAASForm_Attrs($Field, $attrs)?> />
            <?php
            }
            break;
        case 'checkbox':
            $attrs = array();
            if ($Field->multiple) {
                echo $_RAASForm_Checkbox($Field->children);
            } else {
                $attrs['value'] = 1;
                if ($Field->Form->DATA[$Field->name]) {
                    $attrs['checked'] = 'checked';
                }
                ?>
                <input<?php echo $_RAASForm_Attrs($Field, $attrs)?> />
                <?php
            }
            break;
        case 'radio':
            echo $_RAASForm_Checkbox($Field->children);
            break;
        case 'select':
            $attrs['type'] = false;
            if ($Field->placeholder) {
                for ($i = count($Field->children) - 1; $i >= 0; $i--) {
                    $Field->children[$i + 1] = $Field->children[$i];
                }
                $Field->children[0] = new \RAAS\Option(array('caption' => $Field->placeholder, 'value' => ''));
            }
            if ($Field->multiple && !$Field->{'data-raas-multiselect'}) {
                $attrs = array_merge($attrs, array('multiple' => false));
                ?>
                <div data-role="raas-repo-block">
                  <div data-role="raas-repo-container">
                    <?php foreach ((array)$Field->Form->DATA[$Field->name] as $key => $val) { $Field->value = $val; ?>
                        <div data-role="raas-repo-element">
                          <select<?php echo $_RAASForm_Attrs($Field, $attrs)?>><?php echo $_RAASForm_Options($Field->children)?></select>
                        </div>
                    <?php } ?>
                  </div>
                  <div data-role="raas-repo"><select<?php echo $_RAASForm_Attrs($Field, array_merge($attrs, array('disabled' => 'disabled')))?>><?php echo $_RAASForm_Options($Field->children)?></select></div>
                </div>
                <?php
            } else {
                ?>
                <select<?php echo $_RAASForm_Attrs($Field, $attrs)?>><?php echo $_RAASForm_Options($Field->children)?></select>
                <?php
            }
            break;
        case 'textarea': case 'htmlarea': case 'codearea':
            $attrs['type'] = false;
            if ($Field->type == 'htmlarea') {
                $attrs['class'] = 'htmlarea';
                $attrs['required'] = false;
            } elseif ($Field->type == 'codearea') {
                $attrs['class'] = 'code codearea fullscreen';
            }
            if ($Field->multiple) {
                ?>
                <div data-role="raas-repo-block">
                  <div data-role="raas-repo-container">
                    <?php foreach ((array)$Field->Form->DATA[$Field->name] as $key => $val) { ?>
                        <div data-role="raas-repo-element"><textarea<?php echo $_RAASForm_Attrs($Field, $attrs)?>><?php echo htmlspecialchars($val)?></textarea></div>
                    <?php } ?>
                  </div>
                  <div data-role="raas-repo"><textarea<?php echo $_RAASForm_Attrs($Field, array_merge($attrs, array('disabled' => 'disabled')))?>></textarea></div>
                </div>
            <?php } else { ?>
                <textarea<?php echo $_RAASForm_Attrs($Field, $attrs)?>><?php echo htmlspecialchars($Field->Form->DATA[$Field->name])?></textarea>
            <?php
            }
            break;
        case 'password':
            $attrs = array();
            if ($confirm) {
                $attrs['name'] = $Field->name . '@confirm';
            }
            ?>
            <input<?php echo $_RAASForm_Attrs($Field, $attrs)?> />
            <?php
            break;
        default:
            $attrs = array();
            if (!$Field->type) {
                $attrs['type'] = 'text';
            }
            if ($Field->multiple) {
                ?>
                <div data-role="raas-repo-block">
                  <div data-role="raas-repo-container">
                    <?php foreach ((array)$Field->Form->DATA[$Field->name] as $key => $val) { ?>
                        <div data-role="raas-repo-element"><input<?php echo $_RAASForm_Attrs($Field, array_merge($attrs, array('value' => $val)))?> /></div>
                    <?php } ?>
                  </div>
                  <div data-role="raas-repo"><input<?php echo $_RAASForm_Attrs($Field, array_merge($attrs, array('disabled' => 'disabled')))?> /></div>
                </div>
                <?php
            } else {
                ?>
                <input<?php echo $_RAASForm_Attrs($Field, array_merge($attrs, array('value' => $Field->Form->DATA[$Field->name])))?> />
                <?php
            }
            break;
    }
};

$_RAASForm_Field = function(\RAAS\Field $Field) use (&$_RAASForm_Control, &$_RAASForm_Options) {
    $err = (bool)array_filter((array)$Field->Form->localError, function($x) use ($Field) { return $x['value'] == $Field->name; });
    if (in_array($Field->type, array('htmlarea', 'codearea'))) {
        ?>
        <div class="control-group<?php echo $err ? ' error' : ''?>">
          <?php if ($Field->caption) { ?>
              <label class="control-label" for="<?php echo htmlspecialchars($Field->name)?>"><?php echo htmlspecialchars($Field->caption)?>:</label>
              <div class="controls clearfix">&nbsp;</div>
          <?php } ?>
          <div class="clearfix"><?php echo $_RAASForm_Control($Field)?></div>
        </div>
        <?php
    } elseif (($Field->type == 'password') && $Field->confirm) {
        $err2 = (bool)array_filter((array)$Field->Form->localError, function($x) use ($Field) { return $x['value'] == $Field->name . '@confirm'; });
        ?>
        <div class="control-group<?php echo $err ? ' error' : ''?>">
          <label class="control-label" for="<?php echo htmlspecialchars($Field->name)?>"><?php echo htmlspecialchars($Field->caption)?>:</label>
          <div class="controls"><?php echo $_RAASForm_Control($Field, false)?></div>
        </div>
        <div class="control-group<?php echo $err2 ? ' error' : ''?>">
          <label class="control-label" for="<?php echo htmlspecialchars($Field->name)?>@confirm"><?php echo PASSWORD_CONFIRM?>:</label>
          <div class="controls"><?php echo $_RAASForm_Control($Field, true)?></div>
        </div>
        <?php
    } elseif ($Field->type == 'checkbox' && !$Field->multiple) {
        ?>
        <div class="control-group<?php echo $err ? ' error' : ''?>">
          <div class="controls"><label class="checkbox"<?php echo $Field->{'data-hint'} ? ' style="width: 174px;"' : ''?>><?php echo $_RAASForm_Control($Field, false)?> <?php echo htmlspecialchars($Field->caption)?></label></div>
        </div>
        <?php
    } elseif ($Field->type == 'hidden') {
        echo $_RAASForm_Control($Field, false);
    } else {
        ?>
        <div class="control-group<?php echo $err ? ' error' : ''?>">
          <label class="control-label" for="<?php echo htmlspecialchars($Field->name)?>">
            <?php echo htmlspecialchars($Field->caption ? $Field->caption . ':' : '')?>
          </label>
          <div class="controls"><?php echo $_RAASForm_Control($Field, false)?></div>
        </div>
        <?php
    }
};
