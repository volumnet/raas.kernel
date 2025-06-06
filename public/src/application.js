import App from './application/app.vue';

import queryString from 'query-string';
import 'jquery.scrollto'

import RAAS_tree from './libs/raas.tree.js';
import RAAS_autocompleter from './libs/raas.autocompleter.js';
import RAAS_menuTree from './libs/raas.menu-tree.js';
import RAAS_fillSelect from './libs/raas.fill-select.js';
import RAAS_getSelect from './libs/raas.get-select.js';
import RAAS_repo from './libs/raas.repo.js';
import RAASInitInputs from './libs/raas.init-inputs.js';
import RAAS_queryString from './libs/raas.query-string.js';
import RAAS_MultiTable from './libs/multitable.js'

window.queryString = queryString;

// Vue.use(YmapPlugin, window.ymapSettings);

jQuery(function ($) {
    $.fn.extend({
        RAAS_tree,
        RAAS_autocompleter,
        RAAS_menuTree,
        RAAS_fillSelect,
        RAAS_getSelect,
        RAAS_repo,
        RAASInitInputs,
        RAAS_MultiTable,
    });
    $.extend({ RAAS_queryString });
});


let app, vueRoot;
vueRoot = app = Vue.createApp(App);

window.registeredRAASComponents = {};
Object.keys(window.raasComponents).forEach((componentURN) => {
    window.registeredRAASComponents[componentURN] = vueRoot.component(componentURN, raasComponents[componentURN]);
})

jQuery(document).ready(function($) {
    window.app = app.mount('#raas-app');

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
    
    // $.datepicker.setDefaults({ dateFormat: 'yy-mm-dd' });
    // $.timepicker.setDefaults({ dateFormat: 'yy-mm-dd', timeFormat: 'hh:mm', separator: ' ' });
    
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

    $('[data-role="multitable"]').each(function() {
        $(this).RAAS_MultiTable();
    });
});