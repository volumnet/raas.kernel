export default function() {
    var thisObj = this;
    var clearDate = $('<a href="#" class="jsClearDate"><i class="icon-remove-circle"></i></a>', thisObj).click(function(e) { 
        $(this).prev('input:not(:disabled)').val('').trigger('change'); 
        e.preventDefault();
    });
    
    $('input[type="date"], input[type="time"], input[type="month"], input[type="datetime-local"], input[type="datetime"]', thisObj).not('[disabled]').each(function() {
        var html = this.outerHTML;
        var type = $(this).attr('type');
        var rx = new RegExp('((type="' + type + '")|(type=' + type + '))($| )', 'gi');
        html = html.replace(rx, 'type="text"$4');
        $(this).after(clearDate.clone(true)).replaceWith($(html).attr({'data-type': type, 'readonly': 'readonly'}));
    })
    $('input[data-type="date"]', thisObj).datepicker({ 
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        changeYear: true,
    });
    $('input[data-type="time"]', thisObj).timepicker({ 
        timeFormat: 'HH:mm',
        changeMonth: true,
        changeYear: true, 
    });
    $('input[data-type="month"]', thisObj).datepicker({ 
        dateFormat: 'yy-mm',
        changeMonth: true,
        changeYear: true, 
    });
    
    $('input[data-type="datetime-local"], input[data-type="datetime"]', thisObj).not('[disabled]').each(function() {
        $(this).val($(this).val().replace(/T/, ' '));
        $(this).attr('readonly', 'readonly').datetimepicker({ 
            timeFormat: 'HH:mm',
            changeMonth: true,
            changeYear: true,
        })
    });
    $('input:visible[type="color"]', thisObj).attr('readonly', 'readonly').not('[disabled]').spectrum({
        showInput: true,
        showInitial: true,
        preferredFormat: 'hex',
    });
    
    $('input[type="range"]', thisObj).not('[disabled]').each(function() {
        if ($(this).attr('type') == 'number') {
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
              return '--';
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
              return selected + (options.length > 3 ? '...' : '');
            }
        },
        maxHeight: 200
    });
    $('textarea.codearea', thisObj).not('[disabled]').each(function() { 
        var codeMirrorData = { 
            lineNumbers: true, 
            mode: "application/x-httpd-php", 
            indentUnit: 2, 
            indentWithTabs: false, 
            enterMode: "keep", 
            tabMode: "shift", 
            tabSize: 2 
        }
        if ($(this).attr('data-mime')) {
            codeMirrorData['mode'] = $(this).attr('data-mime');
        }
        CodeMirror.fromTextArea(this, codeMirrorData);
    });
    $('textarea.htmlarea', thisObj).not('[disabled]').each(function() { 
        $(this).ckeditor(ckEditorConfig);
    });
    $('input[data-hint], textarea[data-hint], select[data-hint]', thisObj).each(function() {
        var text = '<a class="btn" href="#" rel="popover" data-content="' + $(this).attr('data-hint') + '"><i class="icon-question-sign"></i></a>';
        if (!$(this).closest('.control-group').find('a[rel="popover"]').length) {
            $(this).closest('.control-group').find('.controls').append(text);
        }
    });
}