<?php
/**
 * Основной шаблон RAAS
 */
use RAAS\Application;

/**
 * Возвращает код меню
 * @param array $menu <pre>array<[
 *     'href' => string URL пункта меню,
 *     'name' => string Заголовок пункта ссылки,
 *     'icon' => string Иконка пункта меню,
 *     'active' => bool Пункт активен,
 *     'submenu' => array<recursive> Подменю,
 *     'counter' => int Счетчик,
 *     string[] Наименование атрибута => string Значение атрибута
 * ]></pre> Меню для отображения
 * @param 'breadcrumb'|null Тип меню
 * @return string HTML-код меню
 */
function showMenu(array $menu, $type = null)
{
    static $level = 0;
    $text = '';
    if ($menu) {
        foreach ($menu as $row) {
            $attrs = '';
            // Проверка прав доступа
            $href = $row['href'];
            $href = parse_url($href, PHP_URL_QUERY);
            parse_str($href, $href);
            if (isset(
                $_GET['p'],
                $_GET['m'],
                Application::i()->packages[$_GET['p']]->modules[$_GET['m']]
            )) {
                $ctx = Application::i()->packages[$_GET['p']]->modules[$_GET['m']];
            } elseif (isset(
                $_GET['p'],
                Application::i()->packages[$_GET['p']]
            )) {
                $ctx = Application::i()->activePackage;
            } else {
                $ctx = Application::i()->context;
            }
            if ($access = $ctx->access()) {
                if (!$access->A($row['href'])) {
                    continue;
                }
            }

            foreach ($row as $key => $val) {
                if (!in_array($key, [
                    'name',
                    'href',
                    'submenu',
                    'counter',
                    'active',
                    'icon'
                ])) {
                    $attrs .= ' ' . htmlspecialchars($key)
                           .  '="' . htmlspecialchars($val) . '"';
                }
            }
            $text .= '<li' . ($row['active'] ? ' class="active"' : '') . '>';
            $children = '';
            if (isset($row['submenu']) && is_array($row['submenu'])) {
                $level++;
                $children = showMenu($row['submenu'], $type);
                $level--;
            }
            $text .= '  <a ' . $attrs . ((isset($row['href']) && $row['href']) ? ' href="' . htmlspecialchars($row['href']) . '"' : '') . '>';
            if (isset($row['icon'])) {
                $text .= '<i class="icon-' . htmlspecialchars($row['icon']) . '"></i> ';
            }
            $text .=    $row['name']
                  .  '</a>';
            if (isset($row['counter']) && $row['counter']) {
                $text .= ' (<b>';
                if (isset($row['href']) && $row['href']) {
                    $text .= '<a href="' . htmlspecialchars($row['href']) . '">'
                          .     (int)$row['counter']
                          .  '</a>';
                } else {
                    $text .= '<b>' . (int)$row['counter'] . '</b>';
                }
                $text .= ')';
            }
            $text .= $children;
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

/**
 * Формирует контекстное меню
 * @param array|null $menu <pre>array<[
 *     'href' => string URL пункта меню,
 *     'name' => string Заголовок пункта ссылки,
 *     'icon' => string Иконка пункта меню,
 *     'active' => bool Пункт активен,
 *     'submenu' => array<recursive> Подменю,
 *     'counter' => int Счетчик,
 *     string[] Наименование атрибута => string Значение атрибута
 * ]></pre> Меню для отображения
 * @param string $title Заголовок кнопки
 * @param string $classname CSS-класс меню
 * @param string $btnClass CSS-класс кнопки
 * @return string HTML-код контекстного меню
 */
function rowContextMenu(
    array $menu = null,
    $title = '',
    $classname = 'pull-right',
    $btnClass = ''
) {
    if ($menu && ($text = showMenu($menu))) {
        return '<div class="btn-group ' . htmlspecialchars($classname) . '">
                  <a href="#" class="btn dropdown-toggle ' . $btnClass . '" data-toggle="dropdown">
                    ' . htmlspecialchars($title) . '
                    <span class="caret"></span>
                  </a>
                  <ul class="dropdown-menu">' . $text . '</ul>
                </div>';
    }
    return '';
}

/**
 * Выделяет теги <script> из HTML-кода и меняет у разрешенных тип
 * с text/javascript на application/javascript
 * @param string $text Входной текст
 * @param string $allowedRx Регулярное выражение для поиска разрешенных тегов
 * @return string[] <pre>[
 *     string Текст без тегов <script> (кроме разрешенных),
 *     string Текст тегов <script> (кроме разрешенных)
 * ]</pre>
 */
function separateScripts($text, $allowedRx = '')
{
    $rx = '/\\<script.*?\\>.*?\\<\\/script\\>/umis';
    $scripts = '';
    $result = $text;
    if (preg_match_all($rx, $text, $regs)) {
        foreach ($regs[0] as $i => $script) {
            if ($allowedRx && !preg_match($allowedRx, $script)) {
                $newScript = '';
                if (!stristr($script, ' type="text/javascript"')) {
                    $newScript = str_ireplace(
                        ' type="text/javascript"',
                        ' type="application/javascript"',
                        $script
                    );
                }
                if (stristr($script, ' type="')) {
                    $newScript = str_ireplace(
                        '<script',
                        '<script type="application/javascript"',
                        $script
                    );
                }
                if ($newScript) {
                    $result = str_replace($script, $newScript, $result);
                }
            } else {
                $scripts .= $script . "\n";
                $result = str_replace($script, '', $result);
            }
        }
    }
    return [$result, $scripts];
}

$metaTitle = $TITLE . ' — RAAS';
if (Application::i()->activePackage) {
    $metaTitle .= '.' . Application::i()->activePackage->view->_('__NAME');
}
if (Application::i()->activeModule) {
    $metaTitle .= '.' . Application::i()->activeModule->view->_('__NAME');
}

ob_start();
?>
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <meta name="generator" content="RAAS4" />
    <title><?php echo $metaTitle?></title>
    <link href="<?php echo $VIEW->themeURL . ($VIEW->templateType ? '/' . $VIEW->templateType : '')?>/style.css?v=<?php echo date('Y-m-d', filemtime(__DIR__ . '/style.css'))?>" rel="stylesheet" />
    <link href="/vendor/components/jqueryui/themes/redmond/jquery-ui.min.css" rel="stylesheet" />
    <link href="/vendor/trentrichardson/jquery-timepicker-addon/dist/jquery-ui-timepicker-addon.min.css" rel="stylesheet" />
    <link href="/vendor/fortawesome/font-awesome/css/font-awesome.min.css" rel="stylesheet" />
    <?php foreach ($VIEW->css as $css) { ?>
        <link href="<?php echo $css?>" rel="stylesheet" />
    <?php } ?>

    <script src="<?php echo $VIEW->publicURL?>/application.js"></script>
    <script src="/vendor/components/jqueryui/ui/minified/i18n/jquery.ui.datepicker-<?php echo $VIEW->language?>.min.js"></script>
    <?php if ($VIEW->language != 'en') { ?>
        <script src="/vendor/trentrichardson/jquery-timepicker-addon/dist/i18n/jquery-ui-timepicker-addon-i18n.min.js"></script>
        <script>
        $.timepicker.setDefaults(
            $.timepicker.regional['<?php echo $VIEW->language?>']
        );
        </script>
    <?php } ?>
    <script>
    jQuery(document).ready(function($) {
      context.init({preventDoubleContext: false});
    });</script>
    <script src="/vendor/ckeditor/ckeditor/ckeditor.js"></script>
    <script src="<?php echo $VIEW->publicURL?>/ckeditor.config.js"></script>
    <?php if (is_file(Application::i()->baseDir . '/js/ckeditor.config.js')) { ?>
        <script src="/js/ckeditor.config.js"></script>
    <?php } ?>
    <?php if (is_file(Application::i()->baseDir . '/js/raas.config.js')) { ?>
        <script src="/js/raas.config.js"></script>
    <?php } ?>
    <script src="/vendor/ckeditor/ckeditor/adapters/jquery.js"></script>
    <?php foreach ($VIEW->head_js as $js) { ?>
        <script src="<?php echo $js?>"></script>
    <?php } ?>
  </head>
  <body class="body">
    <div id="raas-app">
      <?php if ($APPLICATION->activePackage) { ?>
          <header class="body__head navbar navbar-inverse navbar-fixed-top">
            <div class="navbar-inner">
              <div class="container">
                <nav class="menu-top">
                  <ul class="nav">
                    <li class="dropdown">
                      <a class="dropdown-toggle brand menu-top__current-package" href="?" data-toggle="dropdown">
                        RAAS.<?php echo htmlspecialchars($APPLICATION->activePackage->view->_('__NAME'))?><b class="caret"></b>
                      </a>
                      <ul class="dropdown-menu pull-right">
                        <?php foreach ($APPLICATION->packages as $key => $pack) {
                            if ($access = $pack->access()) {
                                if (($pack->alias != '/') &&
                                    !$access->A('p=' . $key)
                                ) {
                                    continue;
                                }
                            }
                            if ((
                                $pack->registryGet('isActive') ||
                                !$key ||
                                ($key == '/')
                            ) && ($pack != $APPLICATION->activePackage)) { ?>
                                <li>
                                  <a href="?p=<?php echo $key?>">
                                    <?php echo htmlspecialchars($pack->view->_('__NAME'))?>
                                  </a>
                                </li>
                            <?php } ?>
                        <?php } ?>
                      </ul>
                    </li>
                    <?php echo showMenu($MENU)?>
                  </ul>
                </nav>
                <?php if ($USER && $USER->id) { ?>
                    <ul class="nav pull-right">
                      <li class="dropdown">
                        <a class="dropdown-toggle" href="?p=/&action=edit" data-toggle="dropdown" title="<?php echo EDIT_YOUR_PROFILE?>">
                          <i class="icon-user icon-white"></i>
                          <?php echo htmlspecialchars($USER->full_name ? $USER->full_name : $USER->login)?><b class="caret"></b>
                        </a>
                        <ul class="dropdown-menu">
                          <li class="dropdown-submenu">
                            <a>
                              <i class="icon-globe"></i> <?php echo LANGUAGE?>:
                              <?php echo $VIEW->availableLanguages[$VIEW->language]?>
                            </a>
                            <ul class="dropdown-menu">
                              <?php foreach ($VIEW->availableLanguages as $key => $val) { ?>
                                  <?php if ($key != $VIEW->language) { ?>
                                      <li>
                                        <a href="?mode=set_language&lang=<?php echo $key?>&back=1">
                                          <?php echo htmlspecialchars($val)?>
                                        </a>
                                      </li>
                                  <?php } ?>
                              <?php } ?>
                            </ul>
                          </li>
                          <?php if ($USER && $USER->id) { ?>
                              <li>
                                <a href="?p=/&action=edit">
                                  <i class="icon-edit"></i>
                                  <?php echo constant('EDIT_YOUR_PROFILE')?>
                                </a>
                              </li>
                              <?php if($APPLICATION->loginType != 'http') { ?>
                                  <li>
                                    <a href="?mode=logout">
                                      <i class="icon-off"></i>
                                      <?php echo constant('EXIT')?>
                                    </a>
                                  </li>
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
      <div class="body__main-container-outer">
        <div class="body__main-container">
          <?php if ($SUBMENU) { ?>
              <div class="span3 body__menu-left">
                <nav class="menuLeft menu-left">
                  <ul><?php echo showMenu($SUBMENU)?></ul>
                </nav>
              </div>
          <?php } ?>
          <article class="body__content span<?php echo $SUBMENU ? 9 : 12?>">
            <?php if ($PATH) { ?>
                <nav class="backtrace">
                  <ul class="breadcrumb">
                    <?php echo showMenu($PATH, 'breadcrumb')?>
                  </ul>
                </nav>
            <?php }
            if ($CONTEXTMENU &&
                ($managementMenu = showMenu($CONTEXTMENU))
            ) { ?>
                <div class="btn-group pull-right">
                  <a href="#" class="btn btn-info btn-large dropdown-toggle" data-toggle="dropdown">
                    <?php echo MANAGEMENT?>
                    <span class="caret"></span>
                  </a>
                  <ul class="dropdown-menu"><?php echo $managementMenu?></ul>
                </div>
            <?php } ?>
            <h1 class="h1"><?php echo $TITLE?></h1>
            <?php if ($SUBTITLE) { ?>
                <div class="subtitle"><?php echo $SUBTITLE?></div>
            <?php } ?>
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
          <footer class="body__copyright">
            <?php if ($VIEW->context->versionName) { ?>
                <?php echo $VIEW->context->versionName?><br />
            <?php } ?>
            <?php echo Application::i()->versionName?>:
            <?php echo CORPORATE_RESOURCE_MANAGEMENT?><br />
            <?php echo COPYRIGHT?> &copy;
            <a href="http://www.volumnet.ru/" target="_blank">
              Volume Networks
            </a>,
            <?php echo date('Y')?>. <?php echo ALL_RIGHTS_RESERVED?>.<br />
            <?php echo ICONS_BY?>
            <a href="http://glyphicons.com/" target="_blank">Glyphicons</a>
          </footer>
        </div>
      </div>
    </div>
    <?php /* <script src="<?php echo $VIEW->themeURL . ($VIEW->templateType ? '/' . $VIEW->templateType : '')?>/index.js"></script> */
    $content = separateScripts(
        ob_get_clean(),
        '/(maps.*?yandex.*constructor)|(type="text\\/html")/umis'
    );
    echo $content[0] . $content[1];
    foreach ($VIEW->js as $js) { ?>
        <script src="<?php echo $js?>"></script>
    <?php } ?>
  </body>
</html>
