import '@fortawesome/fontawesome-free/scss/regular.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';
import '@fortawesome/fontawesome-free/scss/brands.scss';
import '@fortawesome/fontawesome-free/scss/fontawesome.scss';

import jQuery from 'expose-loader?exposes=$,jQuery!jquery';
import Cookie from 'js-cookie';

import numTxt from 'cms/application/_libs/num-txt.js';
import formatPrice from 'cms/application/_libs/format-price.js';
import * as Vue from 'expose-loader?exposes=Vue!vue/dist/vue.esm-bundler.js'

import 'spectrum-colorpicker/spectrum.css'


import 'jquery-form'
import './libs/bootstrap.js'

import 'jquery-ui'
import 'jquery-ui/themes/base/all.css';
import 'jquery-ui/ui/widgets/sortable.js';
import 'jquery-ui/ui/widgets/resizable.js';
import 'jquery-ui/ui/widgets/draggable.js';
import 'jquery-ui/ui/widgets/slider.js';
import 'jquery-ui/ui/widgets/autocomplete.js';

import 'spectrum-colorpicker';

import 'inputmask/dist/jquery.inputmask.js'

window.Vue = Vue;

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
import hintComponents from './_blocks/raas-hint';
import repoComponents from './application/raas-repo';

window.raasConfig = {
    shownLevel: 1,
};

window.Cookie = Cookie;
window.numTxt = numTxt;
window.formatPrice = formatPrice;

window.raasComponents = {
    ...raasTreeComponents,
    ...raasIconComponents,
    ...menuLeftComponents,
    ...menuDropdownComponents,
    ...rowContextMenuComponents,
    ...allContextMenuComponents,
    ...menuMobileComponents,
    ...menuPackagesComponents,
    ...menuMainComponents,
    ...menuUserComponents,
    ...raasBreadcrumbsComponents,
    ...menuManagementComponents,
    ...menuContextComponents,
    ...raasErrorsComponents,
    ...raasFieldComponents,
    ...raasAppComponents,
    ...menuMoveComponents,
    ...hintComponents,
    ...repoComponents,
};

window.ymapSettings = {
    apiKey: '',
    lang: 'ru_RU',
    coordorder: 'latlong',
    enterprise: false,
    version: '2.1'
};