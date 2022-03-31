export default function() {
    var thisObj = this;
    
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
    
    $('input[data-hint], textarea[data-hint], select[data-hint]', thisObj).each(function() {
        var text = '<a class="btn" href="#" rel="popover" data-content="' + $(this).attr('data-hint') + '"><i class="icon-question-sign"></i></a>';
        if (!$(this).closest('.control-group').find('a[rel="popover"]').length) {
            $(this).closest('.control-group').find('.controls').append(text);
        }
    });
}