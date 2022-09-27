import '@fortawesome/fontawesome-free/scss/regular.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';
import '@fortawesome/fontawesome-free/scss/brands.scss';
import '@fortawesome/fontawesome-free/scss/_icons.scss';

import jQuery from 'expose-loader?exposes[]=$&exposes[]=jQuery!jquery';
import Cookie from 'expose-loader?exposes[]=Cookie!js-cookie';

import numTxt from 'cms/application/_libs/num-txt.js';
import formatPrice from 'cms/application/_libs/format-price.js';

// import 'jquery-ui/ui/widgets/datepicker.js';
// import 'jquery-ui/ui/i18n/datepicker-ru.js';
// import 'jquery-ui-timepicker-addon';
// import 'jquery-ui-timepicker-addon/dist/i18n/jquery-ui-timepicker-ru.js';

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
import raasErrorsComponents from './_blocks/errors';
import raasFieldComponents from './application/fields';
import raasAppComponents from './_blocks/raas-app';

window.raasConfig = {
    shownLevel: 1,
};

window.raasComponents = Object.assign(
    {}, 
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
    raasErrorsComponents,
    raasFieldComponents,
    raasAppComponents,
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
