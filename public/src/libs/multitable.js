/**
 * Множественная таблица
 */
export default function() {
    const thisObj = this;
    const $thisObj = $(this);
    const idN = $thisObj.attr('data-idn') || 'id';

    const check = function () {
        const $checkbox = $('[data-role="checkbox-row"]', thisObj);
        const $all = $('[data-role="checkbox-all"]', thisObj);
        const $menu = $('tfoot .btn-group, tfoot .all-context-menu', thisObj);
        const $menuItems = $('.dropdown-menu li a, .menu-dropdown__link', $menu);
        if ($all.is(':checked')) {
            $checkbox.each(function() {
                if (!$(this).is(':checked')) {
                    $all.prop('checked', false);
                    return false;
                }
            })
        }
        let ids = '';
        if ($all.is(':checked') && $all.val() && ($all.val() != 'ids')) {
            ids += '&' + idN + '=' + $all.val();
        } else {
            $checkbox.filter(':checked').each(function() {
                ids += '&' + idN + '[]=' + $(this).val();
            });
        }
        $menuItems.each(function() {
            $(this).attr('href', $(this).attr('data-href') + ids);
        })
        if (ids) {
            $menu.show();
        } else {
            $menu.hide();
        }
    };

    const init = function() {
        const $menu = $('tfoot .btn-group, tfoot .all-context-menu', thisObj);
        const $menuItems = $('.dropdown-menu li a, .menu-dropdown__link', $menu);
        $menuItems.each(function() {
            $(this).attr('data-href', $(this).attr('href'));
        })
    };

    const checkAccurate = function(e) {
        if ($(this).is(':checked')) {
            $(this).prop('checked', false);
        } else {
            $(this).prop('checked', true);
        }
        e.stopPropagation();
        e.preventDefault();
        check();
        return false;
    };

    $(this).on('click', '[data-role="checkbox-all"]', function() {
        const $checkbox = $('[data-role="checkbox-row"]', thisObj);
        if ($(this).is(':checked')) {
            $checkbox.prop('checked', true);
        } else {
            $checkbox.prop('checked', false);
        }
        check();
    });

    $(this).on('click', '[data-role="checkbox-row"]', check);
    $(this).on('contextmenu', '[data-role="checkbox-row"]', checkAccurate);
    $(this).on('contextmenu', '[data-role="checkbox-all"]', checkAccurate);
    init();
    check();
};
