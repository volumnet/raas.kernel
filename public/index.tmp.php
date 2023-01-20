<?php
/**
 * Основной шаблон RAAS
 */
use RAAS\Application;
use RAAS\AssetManager;

/**
 * Возвращает структуру меню с учетом прав доступа
 * @param array $menu <pre>array<[
 *     'href' => string URL пункта меню,
 *     'name' => string Заголовок пункта ссылки,
 *     'icon' => string Иконка пункта меню,
 *     'active' => bool Пункт активен,
 *     'submenu' => array<recursive> Подменю,
 *     'counter' => int Счетчик,
 *     string[] Наименование атрибута => string Значение атрибута
 * ]></pre> Меню для отображения
 * @return array Аналогичное меню
 */
function getMenu(array $menu)
{
    static $level = 0;
    $result = [];
    if ($menu) {
        foreach ($menu as $row) {
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
            if (isset($row['submenu'])) {
                $row['submenu'] = getMenu($row['submenu']);
            }
            $result[] = $row;
        }
        return $result;
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
    // if ($menu && ($text = showMenu($menu))) {
    //     return '<div class="btn-group ' . htmlspecialchars($classname) . '">
    //               <a href="#" class="btn dropdown-toggle ' . $btnClass . '" data-toggle="dropdown">
    //                 ' . htmlspecialchars($title) . '
    //                 <span class="caret"></span>
    //               </a>
    //               <ul class="dropdown-menu">' . $text . '</ul>
    //             </div>';
    // }
    if ($menuArr = getMenu((array)$menu)) {
        return '<row-context-menu :menu="' . htmlspecialchars(json_encode($menuArr)) . '"></row-context-menu>';
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
    preg_match_all($rx, $text, $regs);
    if ($regs[0]) {
        foreach ($regs[0] as $i => $script) {
            if ($allowedRx && preg_match($allowedRx, $script)) {
                $newScript = '';
                if (stristr($script, ' type="text/javascript"')) {
                    $newScript = str_ireplace(
                        ' type="text/javascript"',
                        ' type="application/javascript"',
                        $script
                    );
                }
                if (!stristr($script, ' type="')) {
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

    $rx = '/\\<style.*?\\>.*?\\<\\/style\\>/umis';
    $styles = '';
    if (preg_match_all($rx, $text, $regs)) {
        foreach ($regs[0] as $i => $style) {
            $styles .= $style . "\n";
            $result = str_replace($style, '', $result);
        }
    }
    return [$result, $scripts, $styles];
}

$metaTitle = $TITLE . ' — RAAS';
if (Application::i()->activePackage) {
    $metaTitle .= '.' . Application::i()->activePackage->view->_('__NAME');
}
if (Application::i()->activeModule) {
    $metaTitle .= '.' . Application::i()->activeModule->view->_('__NAME');
}

ob_start();

$packagesMenu = [];
foreach ($APPLICATION->packages as $key => $pack) {
    if ($access = $pack->access()) {
        if (($pack->alias != '/') && !$access->A('p=' . $key)) {
            continue;
        }
    }
    if ($pack->registryGet('isActive') || !$key || ($key == '/')) {
        $packagesMenu[] = [
            'href' => '?p=' . $key,
            'name' => $pack->view->_('__NAME'),
            'active' => ($pack == $APPLICATION->activePackage)
        ];
    }
}

$translations = $VIEW->translations;
if (Application::i()->activePackage) {
    $translations = array_merge(
        $translations,
        Application::i()->activePackage->view->translations
    );
    if (Application::i()->activeModule) {
        $translations = array_merge(
            $translations,
            Application::i()->activeModule->view->translations
        );
    }
}


$raasApplicationData = [
    'packagesMenu' => $packagesMenu,
    'mainMenu' => getMenu($MENU),
    'leftMenu' => getMenu($SUBMENU),
    'translations' => $translations,
    'availableLanguages' => $VIEW->availableLanguages,
    'hasActivePackage' => (bool)$APPLICATION->activePackage,
    'breadcrumbs' => getMenu($PATH),
    'title' => $TITLE,
    'subtitle' => $SUBTITLE,
    'errors' => $localError,
    'managementMenu' => getMenu($CONTEXTMENU),
    'versionName' => Application::i()->versionName,
    'year' => (int)date('Y'),
];
if ($USER) {
    $raasApplicationData['user'] = [
        'login' => $USER->login,
        'full_name' => $USER->full_name,
        'lang' => $VIEW->language,
        'loginType' => $APPLICATION->loginType,
    ];
}
?>
<!DOCTYPE html>
<html lang="<?php echo htmlspecialchars($VIEW->language)?>">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="generator" content="RAAS4" />
    <title><?php echo $metaTitle?></title>
    <!-- Here will be in-text styles inserted -->
    <!--styles--><!--/styles-->
    <?php
    AssetManager::requestCSS(array_merge([
        $VIEW->publicURL . '/header.css',
        $VIEW->publicURL . '/application.css',
        $VIEW->themeURL . ($VIEW->templateType ? '/' . $VIEW->templateType : '') . '/style.css',
    ], (array)$VIEW->css));
    AssetManager::requestJS(array_merge([
        $VIEW->publicURL . '/header.js'
    ], (array)$VIEW->head_js), 'beforeApp');
    AssetManager::requestJS(array_merge([
        '/vendor/ckeditor/ckeditor/ckeditor.js',
        '/js/raas.config.js',
        $VIEW->publicURL . '/application.js', // Здесь, потому что последующие скрипты должны отрабатывать после подключения Vue
        $VIEW->publicURL . '/ckeditor.config.js', // 2022-09-29, AVS: Эти и далее здесь, потому что адаптеры должны включаться после подключения CKEditor
        '/js/ckeditor.config.js',
        '/vendor/ckeditor/ckeditor/adapters/jquery.js',
    ], (array)$VIEW->js));
    echo AssetManager::getRequestedCSS();
    echo AssetManager::getRequestedJS('beforeApp');
    echo AssetManager::getRequestedCSS('custom');
    echo AssetManager::getRequestedJS('custom');
    echo AssetManager::getRequestedJS();
    ?>
  </head>
  <body class="body">
    <div id="raas-app">
      <raas-app v-bind="$data" :fixed-header="fixedHeader">
        <?php if ($SUBTITLE) { ?>
            <template v-slot:subtitle>
              <?php echo $SUBTITLE?>
            </template>
        <?php } ?>
        <template v-slot:default>
          <?php
          if ($TEMPLATE) {
              include $VIEW->tmp($TEMPLATE);
          }
          ?>
        </template>
      </raas-app>
    </div>
    <?php
    $content = separateScripts(
        ob_get_clean(),
        '/(maps.*?yandex.*constructor)|(type="text\\/html")/umis'
    );
    $text = $content[0] . $content[1];
    $text = str_replace('<!--styles--><!--/styles-->', $content[2], $text);
    echo $text;
    ?>
    <script>
    window.raasApplicationData = <?php echo json_encode($raasApplicationData, JSON_UNESCAPED_UNICODE)?>;
    </script>
  </body>
</html>
