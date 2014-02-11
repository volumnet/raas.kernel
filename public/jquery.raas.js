jQuery(function($) {
    $.fn.extend({
        RAAS_tree: function() {
            $('ul', this).hide();
            $('li:has(ul)', this).prepend('<a href="#" class="jsTreePlus"></a>');
            $('ul:has(input:checked)', this).show().closest('li').children('a.jsTreePlus').removeClass('jsTreePlus').addClass('jsTreeMinus');
            $(this).on('click', 'a.jsTreePlus', function() { 
                $(this).removeClass('jsTreePlus').addClass('jsTreeMinus').closest('li').children('ul').slideDown();
                 return false;
            });
            $(this).on('click', 'a.jsTreeMinus', function() { 
                $(this).removeClass('jsTreeMinus').addClass('jsTreePlus').closest('li').children('ul').slideUp();
                return false;
            });
            $('input:checkbox', this).click(function() {
                var checked = $(this).attr('checked');
                if (checked) {
                    $(this).closest('li').find('ul input:checkbox').attr('checked', 'checked');
                } else {
                    $(this).closest('li').find('ul input:checkbox').removeAttr('checked');
                }
            })
        },
        
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
                'php': { lineNumbers: true, mode: "application/x-httpd-php", indentUnit: 2, indentWithTabs: false, enterMode: "keep", tabMode: "shift", tabSize: 2 }
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
            
            $('input[data-type="datetime-local"], input:visible[data-type="datetime"]', thisObj).not('[disabled]').each(function() {
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
            $('input:visible[type="range"]', thisObj).not('[disabled]').each(function() {
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
                    
                }
                $(this).attr('readonly', 'readonly').hide().after('<div class="input-range"></div>').next('div').slider(options).slider('widget').attr('title', $(this).val());
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