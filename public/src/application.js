// import 'jquery-ui/themes/base/all.css'
// // import 'jquery-ui/jquery-ui.structure.css'
// // import 'jquery-ui/jquery-ui.theme.css'
// import 'jquery-ui-timepicker-addon/dist/jquery-ui-timepicker-addon.css'

import 'spectrum-colorpicker/spectrum.css'
import 'bootstrap-multiselect/dist/css/bootstrap-multiselect.css'
import 'codemirror/lib/codemirror.css'

import 'expose-loader?exposes[]=$&exposes[]=jQuery!jquery';
import 'jquery.scrollto'
import 'jquery-form'
import './libs/bootstrap.js'
import 'jquery-ui'
import 'jquery-ui/ui/widgets/datepicker.js'
import 'jquery-ui/ui/widgets/sortable.js'
import 'jquery-ui/ui/widgets/slider.js'
import 'jquery-ui/ui/widgets/autocomplete.js'
import 'spectrum-colorpicker'
import './libs/context.js'
import 'jquery-ui-timepicker-addon'
import 'bootstrap-multiselect'
import CodeMirror from 'codemirror';
window.CodeMirror = CodeMirror;
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/php/php.js'
import raasConfig from './raas.config.js'
window.raasConfig = raasConfig;
// import 'jquery.event.swipe'
// import 'inputmask/dist/jquery.inputmask.js'
// import 'bootstrap-2.3.2/css/bootstrap.css'

// // import 'jquery-ui/ui/i18n/datepicker-ru.js'
// // import 'jquery-ui-timepicker-addon/dist/i18n/jquery-ui-timepicker-ru.js'
import Vue from 'vue/dist/vue.js'
window.Vue = Vue;
// import Cookie from 'expose-loader?exposes[]=Cookie!js-cookie'
import App from './app.vue';

import formatPrice from './head/format-price.js';
import RAASTree from './head/raas.tree.js';
import RAASAutocompleter from './head/raas.autocompleter.js';
import RAASMenuTree from './head/raas.menu-tree.js';
import RAASFillSelect from './head/raas.fill-select.js';
import RAASGetSelect from './head/raas.get-select.js';
import RAASRepo from './head/raas.repo.js';
import RAASInitInputs from './head/raas.init-inputs.js';
import RAASQueryString from './head/raas.query-string.js'

window.formatPrice = formatPrice;
jQuery(function($) {
    $.fn.extend({
        RAAS_tree: RAASTree,
        RAAS_autocompleter: RAASAutocompleter,
        RAAS_menuTree: RAASMenuTree,
        RAAS_fillSelect: RAASFillSelect,
        RAAS_getSelect: RAASGetSelect,
        RAAS_repo: RAASRepo,
        RAASInitInputs: RAASInitInputs,
    });
    
    $.extend({
        RAAS_queryString: RAASQueryString
    });

    var hash = document.location.hash;
    if (hash) {
        if ($('.tabbable ul.nav-tabs a[href="' + hash + '"]').length > 0) {
            $('.tabbable ul.nav-tabs a[href="' + hash + '"]').tab('show');
            $.scrollTo(0, 0);
        } else if ($('.accordion a.accordion-toggle[href="' + hash + '"]').length > 0) {
            $('.accordion a.accordion-toggle[href="' + hash + '"]').closest('.accordion').find('.collapse').removeClass('in');
            $('.accordion a.accordion-toggle[href="' + hash + '"]').closest('.accordion-group').find('.collapse').collapse('show');
            $.scrollTo($('.accordion a.accordion-toggle[href="' + hash + '"]')[0]);
        }
    }
    
    $('*').focus(function() {
        if ($(this).closest('.tabbable .tab-pane').length > 0) {
            var hash= '#' + $(this).closest('.tabbable .tab-pane').attr('id');
            $(this).closest('.tabbable ul.nav-tabs a[href="' + hash + '"]').tab('show');
        }
        if ($(this).closest('.accordion .accordion-body:not(.in)').length > 0) {
            var hash = '#' + $(this).closest('.accordion .accordion-body').attr('id');
            //$(this).closest('.accordion').find('.collapse.in').collapse('hide');
            $(this).closest('.accordion').find('a.accordion-toggle[href="' + hash + '"]').closest('.accordion-group').find('.collapse').collapse('show');
        }
    });

    $('a[data-toggle="tab"]').on('shown', function () {
        var url = $(this).attr('href');
        window.history.pushState({}, document.title, url);
    });
    
    $.datepicker.setDefaults({ dateFormat: 'yy-mm-dd' });
    $.timepicker.setDefaults({ timeFormat: 'hh:mm', separator: ' ' });
    
    $('body').RAASInitInputs();
    $(':reset').click(function() { document.location.reload(); return false; });
    $('*[rel*="popover"]').popover().click(function() { return false; });
    
    $('*[data-raas-role*="tree"]').RAAS_tree();
    $('*[data-role="raas-repo-block"]:not(:has([data-role="raas-repo-add"]))')
        .find('[data-role="raas-repo-container"]')
        .after('<a href="#" data-role="raas-repo-add"><i class="icon icon-plus"></i></a>');
    $('*[data-role="raas-repo-element"]:not(:has([data-role="raas-repo-del"])), *[data-role="raas-repo"]:not(:has([data-role="raas-repo-del"]))')
        .append('<a href="#" data-role="raas-repo-del"><i class="icon icon-remove"></i></a>');
    $('*[data-role="raas-repo-element"]:not(:has([data-role="raas-repo-move"])), *[data-role="raas-repo"]:not(:has([data-role="raas-repo-move"]))')
        .append('<a href="#" data-role="raas-repo-move"><i class="icon icon-resize-vertical"></i></a>');
    $('*[data-role="raas-repo-block"]').each(function() { $(this).RAAS_repo() });
    $('nav.menuLeft ul').RAAS_menuTree({ shownLevel: raasConfig.shownLevel });

});

jQuery(document).ready(function($) {
    // window.app = new Vue(App);
});