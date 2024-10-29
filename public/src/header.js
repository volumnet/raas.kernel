import '@fortawesome/fontawesome-free/scss/regular.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';
import '@fortawesome/fontawesome-free/scss/brands.scss';
import '@fortawesome/fontawesome-free/scss/_icons.scss';

import jQuery from 'expose-loader?exposes[]=$&exposes[]=jQuery!jquery';
import Cookie from 'expose-loader?exposes[]=Cookie!js-cookie';

import numTxt from 'cms/application/_libs/num-txt.js';
import formatPrice from 'cms/application/_libs/format-price.js';

// import 'jquery-ui/themes/base/all.css'
// // import 'jquery-ui/jquery-ui.structure.css'
// // import 'jquery-ui/jquery-ui.theme.css'
// import 'jquery-ui-timepicker-addon/dist/jquery-ui-timepicker-addon.css'

import 'spectrum-colorpicker/spectrum.css'
import 'bootstrap-multiselect/dist/css/bootstrap-multiselect.css'
import 'codemirror/lib/codemirror.css'
// import 'jquery-ui-timepicker-addon/dist/jquery-ui-timepicker-addon.css'

import 'jquery-form'
import './libs/bootstrap.js'
import 'jquery.scrollto'
import queryString from 'query-string';
window.queryString = queryString;

import 'jquery-ui'
import 'jquery-ui/themes/base/all.css';
import 'jquery-ui/ui/widgets/sortable.js';
import 'jquery-ui/ui/widgets/resizable.js';
import 'jquery-ui/ui/widgets/draggable.js';
import 'jquery-ui/ui/widgets/slider.js';
import 'jquery-ui/ui/widgets/autocomplete.js';

import 'spectrum-colorpicker';
import './libs/context.js';

import 'bootstrap-multiselect';
import CodeMirror from 'codemirror';
window.CodeMirror = CodeMirror;
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/php/php.js';
// import 'jquery.event.swipe'
import 'inputmask/dist/jquery.inputmask.js'
// import 'bootstrap-2.3.2/css/bootstrap.css'

import Vue from 'vue/dist/vue.js'
window.Vue = Vue;

// import 'jquery-ui/ui/widgets/datepicker.js';
// import 'jquery-ui/ui/i18n/datepicker-ru.js';
// import 'jquery-ui-timepicker-addon';
// import 'jquery-ui-timepicker-addon/dist/i18n/jquery-ui-timepicker-ru.js';

import raasTreeComponents from './_blocks/raas-tree';
import raasIconComponents from './_blocks/raas-icon';
import menuLeftComponents from './_blocks/menu-left';
import menuDropdownComponents from './_blocks/menu-dropdown';
import rowContextMenuComponents from './_blocks/row-context-menu';
import allContextMenuComponents from './_blocks/all-context-menu';
import menuMobileComponents from './_blocks/menu-mobile';
import menuPackagesComponents from './_blocks/menu-packages';
import menuMainComponents from './_blocks/menu-main';
import menuUserComponents from './_blocks/menu-user';
import raasBreadcrumbsComponents from './_blocks/breadcrumbs';
import menuManagementComponents from './_blocks/menu-management';
import menuContextComponents from './_blocks/menu-context';
import raasErrorsComponents from './_blocks/errors';
import raasFieldComponents from './application/fields';
import raasAppComponents from './_blocks/raas-app';
import menuMoveComponents from './_blocks/menu-move';

window.raasConfig = {
    shownLevel: 1,
};

window.raasComponents = Object.assign(
    {}, 
    raasTreeComponents,
    raasIconComponents,
    menuLeftComponents,
    menuDropdownComponents,
    rowContextMenuComponents,
    allContextMenuComponents,
    menuMobileComponents,
    menuPackagesComponents,
    menuMainComponents,
    menuUserComponents,
    raasBreadcrumbsComponents,
    menuManagementComponents,
    menuContextComponents,
    raasErrorsComponents,
    raasFieldComponents,
    raasAppComponents,
    menuMoveComponents,
);

window.ymapSettings = {
    apiKey: '',
    lang: 'ru_RU',
    coordorder: 'latlong',
    enterprise: false,
    version: '2.1'
};

window.Cookie = Cookie;
window.numTxt = numTxt;
window.formatPrice = formatPrice;
