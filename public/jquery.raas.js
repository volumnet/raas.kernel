jQuery(function($) {
    $.fn.RAAS_tree = function(method)
    {
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
                    $obj.attr('checked', 'checked');
                } else {
                    $obj.removeAttr('checked');
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
                    $(this).removeAttr('checked');
                } else {
                    $(this).attr('checked', 'checked');
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
                $thisObj = $(this);
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


    $.fn.RAAS_autocompleter = function(method)
    {
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


    $.fn.RAAS_menuTree = function(method)
    {
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

    $.fn.extend({
        RAAS_fillSelect: function(fill) {
            var text;
            $(this).empty();
            for (i in fill) {
                text = '<option value="' + fill[i].val + '"' + (fill[i].sel ? ' selected="selected"' : '');
                for (key in fill[i]) {
                    if ($.inArray(key, ['val', 'sel', 'text']) == -1) {
                        text += ' data-' + key + '="' + fill[i][key] + '"';
                    }
                }
                text += '>' + fill[i].text + '</option>';
                $(this).append($(text));
            }
        },
        
        RAAS_getSelect: function(url, params) {
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
        },
                
        RAAS_repo: function(params) {
            var defaultParams = {
                'repoContainer': '[data-role="raas-repo-container"]',
                'repoElement': '[data-role="raas-repo-element"]',
                'repoElementChanges': {'data-role': 'raas-repo-element'},
                'repoAdd': '[data-role="raas-repo-add"]',
                'repoMove': '[data-role="raas-repo-move"]',
                'repoDelete': '[data-role="raas-repo-del"]',
                'repo': '[data-role="raas-repo"]',
                'onBeforeAdd': function() {},
                'onAfterAdd': function() { $(this).find('select:disabled, input:disabled, textarea:disabled').removeAttr('disabled'); },
                'onBeforeDelete': function() {},
                'onAfterDelete': function() {}
            }
            params = $.extend(defaultParams, params);
            var $repoBlock = $(this);
            
            var $repoContainer;
            if ($(this).attr('data-raas-repo-container')) {
                $repoContainer = $($(this).attr('data-raas-repo-container'));
            } else if ($repoBlock.find(params.repoContainer).length > 0) {
                $repoContainer = $repoBlock.find(params.repoContainer);
            } else {
                $repoContainer = $(params.repoContainer);
            }
            
            var $repo;
            if ($(this).attr('data-raas-repo')) {
                $repo = $($(this).attr('data-raas-repo'));
            } else if ($repoBlock.find(params.repo).length > 0) {
                $repo = $repoBlock.find(params.repo);
            } else {
                $repo = $(params.repo);
            }

            var checkRequired = function() {
                var $repoElement;
                if ($repoBlock.find(params.repoElement).length > 0) {
                    $repoElement = $repoBlock.find(params.repoElement + ':has(*[data-required])');
                } else {
                    $repoElement = $(params.repoElement + ':has(*[data-required])');
                }
                if ($repoElement.length > 1) {
                    $repoElement.find(params.repoDelete).show();
                } else {
                    $repoElement.find(params.repoDelete).hide();
                }

                if ($repoBlock.find(params.repoElement).length > 0) {
                    $repoElement = $repoBlock.find(params.repoElement);
                } else {
                    $repoElement = $(params.repoElement);
                }
                if ($repoElement.length > 1) {
                    $repoElement.find(params.repoMove).show();
                } else {
                    $repoElement.find(params.repoMove).hide();
                }
            };

            $repoBlock.on('click', params.repoAdd, function() {
                params.onBeforeAdd.call($repoElement);
                var $repoElement = $repo.clone(true);
                $repoElement.attr(params.repoElementChanges);
                $repoContainer.append($repoElement);
                $repoElement.trigger('RAAS_repo.add');
                params.onAfterAdd.call($repoElement);
                checkRequired();
                $repoElement.RAASInitInputs();
                return false;
            });
            
            $repoBlock.on('click', params.repoDelete, function() {
                var $repoElement;
                if ($(this).closest(params.repoElement).length > 0) {
                    $repoElement = $(this).closest(params.repoElement);
                } else if ($(this).attr('data-raas-repo-element')) {
                    $repoElement = $($(this).attr('data-raas-repo-element'));
                } else if ($repoBlock.find(params.repoElement).length > 0) {
                    $repoElement = $repoBlock.find(params.repoElement);
                } else {
                    $repoElement = $(params.repoElement);
                }
                params.onBeforeDelete.call($repoElement);
                $repoElement.trigger('RAAS_repo.delete');
                $repoElement.remove();
                params.onAfterDelete.call($repoElement);
                checkRequired();
                return false;
            });

            $repoContainer.sortable({ axis: 'y', 'handle': params.repoMove, containment: $(this) });


            checkRequired();
        },

        RAASInitInputs: function() {
            var thisObj = this;
            var clearDate = $('<a href="#" class="jsClearDate"><i class="icon-remove-circle"></i></a>', thisObj).click(function() { $(this).prev('input').val(''); return false; });
            var codeSettings = {
                'php': { lineNumbers: true, mode: "application/x-httpd-php", indentUnit: 2, indentWithTabs: false, enterMode: "keep", tabMode: "shift", tabSize: 2 },
                'html': { lineNumbers: true, mode: "text/html", indentUnit: 2, indentWithTabs: false, enterMode: "keep", tabMode: "shift", tabSize: 2 }
            };
            
            $('input[type="date"], input[type="time"], input[type="month"], input[type="datetime-local"], input[type="datetime"]', thisObj).not('[disabled]').each(function() {
                var html = this.outerHTML;
                var type = $(this).attr('type');
                rx = new RegExp('((type="' + type + '")|(type=' + type + '))($| )', 'gi');
                html = html.replace(rx, 'type="text"$4');
                $(this).after(clearDate.clone(true)).replaceWith($(html).attr({'data-type': type, 'readonly': 'readonly'}));
            })
            $('input[data-type="date"]', thisObj).datepicker({ dateFormat: 'yy-mm-dd' });
            $('input[data-type="time"]', thisObj).timepicker({ timeFormat: 'hh:mm' });
            $('input[data-type="month"]', thisObj).datepicker({ dateFormat: 'yy-mm' });
            
            $('input[data-type="datetime-local"], input[data-type="datetime"]', thisObj).not('[disabled]').each(function() {
                if (!Modernizr.inputtypes.datetime) {
                    $(this).val($(this).val().replace(/T/, ' '));
                }
                $(this).attr('readonly', 'readonly').datetimepicker({ timeFormat: 'hh:mm' })
            });
            $('input:visible[type="color"]', thisObj).attr('readonly', 'readonly').not('[disabled]').ColorPicker({
                onShow: function (colpkr) { $(colpkr).fadeIn(500); return false; },
                onHide: function (colpkr) { $(colpkr).fadeOut(500); return false; },
                onBeforeShow: function () { $(this).ColorPickerSetColor(this.value.replace(/#/, '')); },
                onSubmit: function (hsb, hex, rgb, el) { $(el).val('#' + hex); }
            });
            $('input[type="range"]', thisObj).not('[disabled]').each(function() {
                if (($(this).attr('type') == 'number') && Modernizr.inputtypes.number) {
                    return;
                }
                var obj = this;
                var options = {};
                var e = 100;
                if ($(this).attr('min')) {
                    options.min = parseFloat($(this).attr('min'));
                }
                if ($(this).attr('max')) {
                    options.max = parseFloat($(this).attr('max'));
                }
                if ($(this).val()) {
                    options.value = parseFloat($(this).val());
                }
                if ($(obj).attr('type') == 'range') {
                    if (options.max) {
                        e = Math.log(options.max) / Math.log(10);
                    } else if (options.value) {
                        e = Math.log(options.value) / Math.log(10);
                    }
                    options.step = Math.pow(10, e - 2);
                }
                options.change = function(e, ui) {
                    $(obj).val(parseFloat(ui.value));
                    $(ui.handle).closest('.ui-slider').attr('title', ui.value);
                    $(this).closest('.input-range-container').find('.range-value').text(ui.value);
                }
                $(this).attr('readonly', 'readonly')
                       .hide()
                       .after('<div class="input-range-container"><div class="input-range"></div><div class="range-value">' + $(this).val() + '</div></div>')
                       .next('div')
                       .children('.input-range')
                       .slider(options)
                       .slider('widget')
                       .attr('title', $(this).val());
            });
            $('select[multiple]').not('[disabled]', thisObj).multiselect({
                buttonText: function(options, select) {
                    if (options.length == 0) {
                      return '-- <b class="caret"></b>';
                    }
                    else {
                      var selected = '';
                      var i = 0;
                      options.each(function() {
                          if (i < 3) {
                              selected += $(this).text() + ', ';
                          }
                          i++;
                      });
                      selected = selected.substr(0, selected.length -2);
                      return selected + (options.length > 3 ? '...' : '') + ' <b class="caret"></b>';
                    }
                },
                maxHeight: 200
            });
            $('textarea.codearea', thisObj).not('[disabled]').each(function() { 
                CodeMirror.fromTextArea(this, codeSettings[$(this).attr('data-language') ? $(this).attr('data-language') : 'php']);
            });
            $('textarea.htmlarea', thisObj).not('[disabled]').each(function() { 
                $(this).ckeditor();
            });
            $('input[data-hint], textarea[data-hint], select[data-hint]', thisObj).each(function() {
                var text = '<a class="btn" href="#" rel="popover" data-content="' + $(this).attr('data-hint') + '"><i class="icon-question-sign"></i></a>';
                if (!$(this).closest('.control-group').find('a[rel="popover"]').length) {
                    $(this).closest('.control-group').find('.controls').append(text);
                }
            });
        },
    });
    
    $.extend({
        RAAS_queryString: function(change_query, include_dirs, initial_path) {
            if (!initial_path) {
                initial_path = document.location.href
            }
            if (change_query.substr(0, 1) == '?') {
                change_query = change_query.substr(1);
            }
            var query_dir = initial_path.split('?').slice(0, 1).toString();
            var query_str = initial_path.split('?').slice(1).toString();
            
            var old_query = query_str.split('&');
            var change = change_query.split('&');
            
            var query = {};
            var temp = [];
            
            var new_query = [];
            for (i = 0; i < old_query.length; i++) {
                temp = old_query[i].split('=');
                if (temp[0].length > 0) {
                    query[temp[0]] = temp[1];
                }
            }
            for (i = 0; i < change.length; i++) {
                temp = change[i].split('=');
                if (temp[0].length > 0) {
                    query[temp[0]] = temp[1];
                }
            }
            temp = [];
            for (key in query) {
                if (query[key] && (query[key].length > 0)) {
                    temp[temp.length] = key + '=' + query[key];
                }
            }
            query = temp.join('&');
            return query;
        }
    });
});