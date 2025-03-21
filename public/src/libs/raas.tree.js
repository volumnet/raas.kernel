/**
 * @deprecated Дерево реализовано в RAAS (checkbox-tree) - до 01.01.2026
 */
export default function(method) {
    var $thisObj;
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
        clickCheckbox: function()
        {
            var group;
            var $li = $(this).closest('li');
            var $obj = $li.find('ul input:checkbox');
            if (group = $obj.attr('data-group')) {
                $obj = $obj.filter(function(index) {
                    return ($(this).attr('data-group') == group);
                });
            }
            if ($(this).is(':checked')) {
                $obj.prop('checked', true);
            } else {
                $obj.prop('checked', false);
            }
            if ($('input:checkbox:checked', $li).length > 0) {
                methods.unfold($li, true);
            } else {
                methods.fold($li, true);
            }
        },
        clickCheckboxAccurate: function(e)
        {
            if ($(this).is(':checked')) {
                $(this).prop('checked', false);
            } else {
                $(this).prop('checked', true);
            }
            e.stopPropagation();
            e.preventDefault();
            return false;
        },
        clickCheckboxAccurateLabel: function(e)
        {
            methods.clickCheckboxAccurate.call($(this).find('> input:checkbox')[0], e);
            return false;
        },
        init : function(options) { 
            console.log(this)
            $thisObj = $(this);
            if ($thisObj.length) {
                alert('Функция jQuery.tree устарела и будет отключена 01.01.2026. Пожалуйста, обратитесь к разработчику для обновления системы!');
            }
            methods.hideUL($thisObj);
            methods.addPluses($thisObj);
            methods.unfold($('li:has(input:checked)', $thisObj), false);
            $thisObj.on('click', '.jsTreePlus[data-role="fold-subtree"]', methods.clickPlus);
            $thisObj.on('click', '.jsTreeMinus[data-role="fold-subtree"]', methods.clickMinus);
            $('input:checkbox', $thisObj).on('click', methods.clickCheckbox);
            $('input:checkbox', $thisObj).on('contextmenu', methods.clickCheckboxAccurate)
            $('label:has(>input[type="checkbox"])', $thisObj).on('contextmenu', methods.clickCheckboxAccurateLabel)
        },
    };

    // логика вызова метода
    if ( methods[method] ) {
        return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
    }
};
