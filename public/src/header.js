import '@fortawesome/fontawesome-free/scss/regular.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';
import '@fortawesome/fontawesome-free/scss/brands.scss';
import '@fortawesome/fontawesome-free/scss/_icons.scss';

import jQuery from 'expose-loader?exposes[]=$&exposes[]=jQuery!jquery';
import Cookie from 'expose-loader?exposes[]=Cookie!js-cookie';

import numTxt from 'cms/application/_libs/num-txt.js';
import formatPrice from 'cms/application/_libs/format-price.js';

window.raasConfig = {
    shownLevel: 1,
};

window.raasComponents = Object.assign(
    {}, 
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
