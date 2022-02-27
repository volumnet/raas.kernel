export default function(url, params) {
    var defaultParams = {
        'before': function(data) { return data; },
        'after': function(data) {}
    }
    params = $.extend(defaultParams, params);
    var thisObj = this;
    $.getJSON(url, function(data) {
        var fill = params.before.call(thisObj, data);
        $(thisObj).RAAS_fillSelect(fill);
        params.after.call(thisObj, data);
    });
};