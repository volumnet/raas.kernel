export default function(method) {
    var $thisObj;
    var $autotext;
    var defaultParams = {
        showInterval: 1000
    };
    var params;
    var timeout_id = 0;
    
    var methods = {
        getCompletion: function(data) {
            var Set = data.Set;
            var i;
            $autotext.empty();
            if (Set && (Set.length > 0)) {
                for (i = 0; i < Set.length; i++) {
                    var text = '<li>';
                    text    += '  <a href="#" data-id="' + Set[i].id + '"';
                    for (var key in Set[i]) {
                        if ($.inArray(key, ['id', 'name', 'description', 'img']) == -1) {
                            text += ' data-' + key + '="' + Set[i][key].toString() + '"';
                        }
                    }
                    text += '>';
                    if (Set[i].img) {
                        text += '   <img src="' + Set[i].img + '" />';
                    }
                    text    += '    <span class="raas-autotext__name">' + Set[i].name + '</span>';
                    text    += '    <span class="raas-autotext__description">' + Set[i].description + '</span>';
                    text    += '  </a>';
                    text    += '</li>';
                    $autotext.append(text);
                }
                $autotext.show();
            } else {
                $autotext.hide();
            }
        },
        textOnChange: function() {
            $autotext.trigger('RAAS_autocompleter.change');
            var text = $thisObj.val();
            var url = params.url;
            if (/\*/.test(url)) {
                var url = url.replace(/\*/, text);
            } else {
                var url = url + text;
            }
            window.clearTimeout(timeout_id);
            timeout_id = window.setTimeout(function() { $.getJSON(url, methods.getCompletion) }, params.showInterval);
        },
        onClick: function(e) {
            $autotext.trigger('RAAS_autocompleter.click');
            if (params.callback) {
                params.callback.apply(this, e);
            }
            $autotext.hide();
            return false;
        },
        init: function(options) { 
            $autotext.params = params = $.extend(defaultParams, options);
            $thisObj.on('keyup', methods.textOnChange);
            // 2015-05-04, AVS: заменил $autotext.hide на function() { $autotext.hide() }, ибо глючит
            $('body').on('click', function() { $autotext.hide() });
            $autotext.on('click', 'a', methods.onClick);
        },
    };

    $thisObj = $(this);
    $autotext = $thisObj.next('[data-role="raas-autotext"]');
    if (!$autotext.length) {
        $autotext = $('<ul class="raas-autotext" style="display: none" data-role="raas-autotext"></ul>')
        $thisObj.after($autotext);
    }
    if ($autotext.params) {
        $params = $autotext.params;
    }

    // логика вызова метода
    if ( methods[method] ) {
        return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
    }
};