export default function(fill) {
    let text = '';
    $(this).empty();
    const source = [];
    const pValue = undefined;
    for (let i in fill) {
        const sourceEntry = {
            value: fill[i].value || fill[i].val,
            caption: fill[i].caption || fill[i].text,
        };
        if (fill[i].sel) {
            pValue = sourceEntry.sel;
        }
        
        text = '<option value="' + fill[i].val + '"' + (fill[i].sel ? ' selected="selected"' : '');
        for (let key in fill[i]) {
            if ($.inArray(key, ['val', 'sel', 'text']) == -1) {
                text += ' data-' + key + '="' + fill[i][key] + '"';
                sourceEntry['data-' + key] = fill[i][key];
            }
        }
        text += '>' + fill[i].text + '</option>';
        $(this).append($(text));
        source.push(sourceEntry);
    }
    // console.log(fill)
    $(this).trigger('raas.fill-select', { source, value: pValue });
};