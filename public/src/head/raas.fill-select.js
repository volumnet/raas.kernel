export default function(fill) {
    var text;
    $(this).empty();
    for (var i in fill) {
        text = '<option value="' + fill[i].val + '"' + (fill[i].sel ? ' selected="selected"' : '');
        for (var key in fill[i]) {
            if ($.inArray(key, ['val', 'sel', 'text']) == -1) {
                text += ' data-' + key + '="' + fill[i][key] + '"';
            }
        }
        text += '>' + fill[i].text + '</option>';
        $(this).append($(text));
    }
};