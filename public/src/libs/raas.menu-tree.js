/**
 * @deprecated Дерево меню реализовано в RAAS - до 2026-01-01
 */
export default function(method) {
    var $thisObj;
    var defaultParams = { shownLevel: 2 };
    var params = {};
    var methods = {
        hideUL: function($obj)
        {
            $('ul', $obj).hide();
        },
        addPluses: function($obj)
        {
            $('li:has(ul)', $obj).prepend('<a href="#" class="jsTreePlus" data-role="fold-subtree"></a>');
        },
        unfold: function($obj, slowly)
        {
            $obj.children('[data-role="fold-subtree"]').removeClass('jsTreePlus').addClass('jsTreeMinus');
            if (slowly) {
                $obj.find('> ul').slideDown();
            } else {
                $obj.find('> ul').show();
            }
        },
        fold: function($obj, slowly)
        {
            $obj.children('[data-role="fold-subtree"]').removeClass('jsTreeMinus').addClass('jsTreePlus');
            if (slowly) {
                $obj.find('> ul').slideUp();
            } else {
                $obj.find('> ul').hide();
            }
        },
        clickPlus: function() 
        { 
            methods.unfold($(this).closest('li'), true);
            return false;
        },
        clickMinus: function()
        {
            methods.fold($(this).closest('li'), true);
            return false;
        },
        init : function(options) { 
            params = $.extend(defaultParams, options);
            if (params.shownLevel) {
                var sel = '';
                for (var i = 0; i < params.shownLevel; i++) {
                    sel += 'ul ';
                }
                $thisObj = $(sel, this);
            } else {
                $thisObj = $(this);
            }
            if ($thisObj.length) {
                alert('Функция jQuery.menuTree устарела и будет отключена 01.01.2026. Пожалуйста, обратитесь к разработчику для обновления системы!');
            }
            methods.hideUL($thisObj);
            methods.addPluses($thisObj);
            methods.unfold($('li.active', $thisObj), false);
            $thisObj.on('click', '.jsTreePlus[data-role="fold-subtree"]', methods.clickPlus);
            $thisObj.on('click', '.jsTreeMinus[data-role="fold-subtree"]', methods.clickMinus);
        },
    };

    // логика вызова метода
    if ( methods[method] ) {
        return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
    }
};