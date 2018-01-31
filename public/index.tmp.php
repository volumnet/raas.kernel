<?php
function showMenu(array $SUBMENU, $type = null)
{
    static $level = 0;
    $text = '';
    if ($SUBMENU) {
        foreach ($SUBMENU as $row) {
            $attrs = '';
            // Проверка прав доступа
            $href = $row['href'];
            $href = parse_url($href, PHP_URL_QUERY);
            parse_str($href, $href);
            if (isset($_GET['p'], $_GET['m']) && isset(\RAAS\Application::i()->packages[$_GET['p']]->modules[$_GET['m']])) {
                $ctx = \RAAS\Application::i()->packages[$_GET['p']]->modules[$_GET['m']];
            } elseif (isset($_GET['p']) && isset(\RAAS\Application::i()->packages[$_GET['p']])) {
                $ctx = \RAAS\Application::i()->activePackage;
            } else {
                $ctx = \RAAS\Application::i()->context;
            }
            if ($access = $ctx->access()) {
                if (!$access->A($row['href'])) {
                    continue;
                }
            }

            foreach ($row as $key => $val) {
                if (!in_array($key, array('name', 'href', 'submenu', 'counter', 'active', 'icon'))) {
                    $attrs .= ' ' . htmlspecialchars($key) . '="' . htmlspecialchars($val) . '"';
                }
            }
            $text .= '<li' . ($row['active'] ? ' class="active"' : '') . '>';
            $children = '';
            if (isset($row['submenu']) && is_array($row['submenu'])) {
                $level++;
                $children = showMenu($row['submenu'], $type);
                $level--;
            }
            if ($row['href']) {
                $text .= '  <a ' . $attrs . ' href="' . htmlspecialchars($row['href']) . '">'
                      .       (isset($row['icon']) ? '<i class="icon-' . htmlspecialchars($row['icon']) . '"></i> ' : '') . $row['name']
                      .  '  </a>'
                      .     (isset($row['counter']) && $row['counter'] ? ' (<b><a href="' . htmlspecialchars($row['href']) . '">' . (int)$row['counter'] . '</a></b>)' : '')
                      .     $children;
            } else {
                $text .= '  <a ' . $attrs . '>'
                      .       (isset($row['icon']) ? '<i class="icon-' . htmlspecialchars($row['icon']) . '"></i> ' : '') . $row['name']
                      .  '  </a>'
                      .     (isset($row['counter']) && $row['counter'] ? ' (<b>' . (int)$row['counter'] . '</b>)' : '')
                      .     $children;
            }
            switch ($type) {
                case 'breadcrumb':
                    $text .= '<span class="divider">/</span>';
                    break;
            }
            $text .= '</li>';
        }
        if ($text && $level) {
            $text = '<ul>' . $text . '</ul>';
        }
        return $text;
    }
}
function rowContextMenu(array $SUBMENU = null, $title = '', $class = 'pull-right', $btnClass = '')
{
    if ($SUBMENU) {
        if ($text = showMenu($SUBMENU)) {
            return '<div class="btn-group ' . htmlspecialchars($class) . '">
                      <a href="#" class="btn dropdown-toggle ' . $btnClass . '" data-toggle="dropdown">' . htmlspecialchars($title) . ' <span class="caret"></span></a>
                      <ul class="dropdown-menu">' . $text . '</ul>
                    </div>';
        }
    }
    return '';
}
$metaTitle = $TITLE . ' — RAAS';
if (\RAAS\Application::i()->activePackage) {
    $metaTitle .= '.' . \RAAS\Application::i()->activePackage->view->_('__NAME');
}
if (\RAAS\Application::i()->activeModule) {
    $metaTitle .= '.' . \RAAS\Application::i()->activeModule->view->_('__NAME');
}
?>
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <meta name="generator" content="RAAS4" />
    <title><?php echo $metaTitle?></title>
    <link type="text/css" rel="stylesheet" href="<?php echo $VIEW->themeURL . ($VIEW->templateType ? '/' . $VIEW->templateType : '')?>/style.css" />

    <link type="text/css" href="<?php echo $VIEW->publicURL?>/jquery-ui/css/redmond/jquery-ui-1.8.23.custom.css" rel="stylesheet" />
    <link type="text/css" href="<?php echo $VIEW->publicURL?>/timepicker/jquery-ui-timepicker-addon.css" rel="stylesheet" />
    <link type="text/css" href="<?php echo $VIEW->publicURL?>/colorpicker/css/colorpicker.css" rel="stylesheet" />
    <link type="text/css" href="<?php echo $VIEW->publicURL?>/bootstrap-multiselect.css" rel="stylesheet" />
    <link type="text/css" href="<?php echo $VIEW->publicURL?>/codemirror/lib/codemirror.css" rel="stylesheet" />
    <link type="text/css" href="<?php echo $VIEW->publicURL?>/fonts/font-awesome.min.css" rel="stylesheet" />
    <?php foreach ($VIEW->css as $css) { ?>
        <link type="text/css" rel="stylesheet" href="<?php echo $css?>" />
    <?php } ?>
    <!--[if lt IE 9]>
    <script type="text/javascript">
    document.createElement('header');
    document.createElement('nav');
    document.createElement('section');
    document.createElement('article');
    document.createElement('aside');
    document.createElement('footer');
    </script>
    <![endif]-->
    <script src="<?php echo $VIEW->publicURL?>/jquery.js" type="text/javascript"></script>
    <script src="<?php echo $VIEW->publicURL?>/jquery.scrollTo.js" type="text/javascript"></script>
    <script src="<?php echo $VIEW->publicURL?>/jquery.form.js" type="text/javascript"></script>
    <script src="<?php echo $VIEW->publicURL?>/bootstrap.js" type="text/javascript"></script>
    <script src="<?php echo $VIEW->publicURL?>/jquery.raas.js" type="text/javascript"></script>
    <script type="text/javascript" src="<?php echo $VIEW->publicURL?>/jquery-ui/js/jquery-ui-1.8.23.custom.min.js"></script>
    <script type="text/javascript" src="<?php echo $VIEW->publicURL?>/modernizr.js"></script>
    <script type="text/javascript" src="<?php echo $VIEW->publicURL?>/jquery-ui/development-bundle/ui/i18n/jquery.ui.datepicker-<?php echo $VIEW->language?>.js "></script>
    <script type="text/javascript" src="<?php echo $VIEW->publicURL?>/timepicker/jquery-ui-timepicker-addon.js"></script>
    <?php if ($VIEW->language != 'en') { ?>
        <script type="text/javascript" src="<?php echo $VIEW->publicURL?>/timepicker/jquery-ui-timepicker-addon-i18n.js"></script>
        <script type="text/javascript">
        $.timepicker.setDefaults($.timepicker.regional['<?php echo $VIEW->language?>']);
        </script>
    <?php } ?>
    <script type="text/javascript" src="<?php echo $VIEW->publicURL?>/colorpicker/js/colorpicker.js"></script>
    <script type="text/javascript" src="<?php echo $VIEW->publicURL?>/context.js"></script>
    <script type="text/javascript">
    jQuery(document).ready(function($) {
      context.init({preventDoubleContext: false});
    });</script>
    <script type="text/javascript" src="<?php echo $VIEW->publicURL?>/bootstrap-multiselect.js"></script>
    <script type="text/javascript" src="<?php echo $VIEW->publicURL?>/codemirror/lib/codemirror.js"></script>
    <script type="text/javascript" src="<?php echo $VIEW->publicURL?>/codemirror/mode/xml/xml.js"></script>
    <script type="text/javascript" src="<?php echo $VIEW->publicURL?>/codemirror/mode/javascript/javascript.js"></script>
    <script type="text/javascript" src="<?php echo $VIEW->publicURL?>/codemirror/mode/css/css.js"></script>
    <script type="text/javascript" src="<?php echo $VIEW->publicURL?>/codemirror/mode/htmlmixed/htmlmixed.js"></script>
    <script type="text/javascript" src="<?php echo $VIEW->publicURL?>/codemirror/mode/clike/clike.js"></script>
    <script type="text/javascript" src="<?php echo $VIEW->publicURL?>/codemirror/mode/php/php.js"></script>
    <script type="text/javascript" src="<?php echo $VIEW->publicURL?>/ckeditor/ckeditor.js"></script>
    <script type="text/javascript" src="<?php echo $VIEW->publicURL?>/ckeditor/adapters/jquery.js"></script>
    <?php foreach ($VIEW->head_js as $js) { ?>
        <script src="<?php echo $js?>" type="text/javascript"></script>
    <?php } ?>
  </head>
  <body>
    <?php if ($APPLICATION->activePackage) { ?>
        <header class="navbar navbar-inverse navbar-fixed-top">
          <div class="navbar-inner">
            <div class="container">
              <ul class="nav">
                <li class="dropdown">
                  <a class="dropdown-toggle brand" href="?" data-toggle="dropdown">
                    RAAS.<?php echo htmlspecialchars($APPLICATION->activePackage->view->_('__NAME'))?><b class="caret"></b>
                  </a>
                  <ul class="dropdown-menu pull-right">
                    <?php foreach ($APPLICATION->packages as $key => $pack) {
                        if ($access = $pack->access()) {
                            if (($pack->alias != '/') && !$access->A('p=' . $key)) {
                                continue;
                            }
                        }
                        if (($pack->registryGet('isActive') || !$key || ($key == '/')) && ($pack != $APPLICATION->activePackage)) {
                            ?>
                            <li><a href="?p=<?php echo $key?>"><?php echo htmlspecialchars($pack->view->_('__NAME'))?></a></li>
                        <?php } ?>
                    <?php } ?>
                  </ul>
                </li>
                <?php echo showMenu($MENU)?>
              </ul>
              <?php if ($USER && $USER->id) { ?>
                  <ul class="nav pull-right">
                    <li class="dropdown">
                      <a class="dropdown-toggle" href="?p=/&action=edit" data-toggle="dropdown" title="<?php echo EDIT_YOUR_PROFILE?>">
                        <i class="icon-user icon-white"></i> <?php echo htmlspecialchars($USER->full_name ? $USER->full_name : $USER->login)?><b class="caret"></b>
                      </a>
                      <ul class="dropdown-menu">
                        <li class="dropdown-submenu">
                          <a><i class="icon-globe"></i> <?php echo LANGUAGE?>: <?php echo $VIEW->availableLanguages[$VIEW->language]?></a>
                          <ul class="dropdown-menu">
                            <?php foreach ($VIEW->availableLanguages as $key => $val) { ?>
                                <?php if ($key != $VIEW->language) { ?>
                                    <li><a href="?mode=set_language&lang=<?php echo $key?>&back=1"><?php echo htmlspecialchars($val)?></a></li>
                                <?php } ?>
                            <?php } ?>
                          </ul>
                        </li>
                        <li class="dropdown-submenu">
                          <a><i class="icon-picture"></i> <?php echo USER_THEME?>: <?php echo $VIEW->availableThemes[$VIEW->theme ? $VIEW->theme : '/']?></a>
                          <ul class="dropdown-menu">
                            <?php foreach ($VIEW->availableThemes as $key => $val) { ?>
                                <?php if (($key != $VIEW->theme) && !(!$key && ($VIEW->theme == '/')) && !(!$VIEW->theme && ($key == '/'))) { ?>
                                    <li><a href="?mode=set_theme&theme=<?php echo $key?>&back=1"><?php echo htmlspecialchars($val)?></a></li>
                                <?php } ?>
                            <?php } ?>
                          </ul>
                        </li>
                        <?php if ($USER && $USER->id) { ?>
                            <li><a href="?p=/&action=edit"><i class="icon-edit"></i> <?php echo constant('EDIT_YOUR_PROFILE')?></a></li>
                            <?php if($APPLICATION->loginType != 'http') { ?>
                                <li><a href="?mode=logout"><i class="icon-off"></i> <?php echo constant('EXIT')?></a></li>
                            <?php } ?>
                        <?php } ?>
                      </ul>
                    </li>
                  </ul>
              <?php } ?>
            </div>
          </div>
        </header>
    <?php } ?>
    <div class="container">
      <section class="row">
        <?php if ($SUBMENU) { ?>
            <nav class="span3 menuLeft"><ul><?php echo showMenu($SUBMENU)?></ul></nav>
        <?php } ?>
        <article class="span<?php echo $SUBMENU ? 9 : 12?>">
          <?php if ($PATH) { ?>
              <nav class="backtrace"><ul class="breadcrumb"><?php echo showMenu($PATH, 'breadcrumb')?></ul></nav>
          <?php } ?>
          <?php if ($CONTEXTMENU && ($managementMenu = showMenu($CONTEXTMENU))) { ?>
              <div class="btn-group pull-right">
                <a href="#" class="btn btn-info btn-large dropdown-toggle" data-toggle="dropdown"><?php echo MANAGEMENT?> <span class="caret"></span></a>
                <ul class="dropdown-menu"><?php echo $managementMenu?></ul>
              </div>
          <?php } ?>
          <h1><?php echo $TITLE?></h1>
          <?php if ($localError) { ?>
              <div class="alert alert-error alert-block">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <h4><?php echo FOLLOWING_ERRORS_FOUND?>:</h4>
                <ul class="error">
                  <?php foreach ($localError as $row) { ?>
                      <li><?php echo nl2br(htmlspecialchars($row))?></li>
                  <?php } ?>
                </ul>
              </div>
          <?php } ?>

          <?php
          if ($TEMPLATE) {
              include $VIEW->tmp($TEMPLATE);
          }
          ?>
        </article>
        <div class="clearfix"></div>
      </section>
      <footer class="copyright">
        <?php if ($VIEW->context->versionName) { ?>
            <?php echo $VIEW->context->versionName?><br />
        <?php } ?>
        <?php echo \RAAS\Application::versionName?>: <?php echo CORPORATE_RESOURCE_MANAGEMENT?><br />
        <?php echo COPYRIGHT?> &#0169; <a href="http://www.volumnet.ru/">Volume Networks</a>, <?php echo date('Y')?>. <?php echo ALL_RIGHTS_RESERVED?>.<br />
        <?php echo ICONS_BY?> <a href="http://glyphicons.com/" target="_blank">Glyphicons</a>

      </footer>
    </div>
    <script src="<?php echo $VIEW->themeURL . ($VIEW->templateType ? '/' . $VIEW->templateType : '')?>/index.js" type="text/javascript"></script>
    <?php foreach ($VIEW->js as $js) { ?>
        <script src="<?php echo $js?>" type="text/javascript"></script>
    <?php } ?>
  </body>
</html>
