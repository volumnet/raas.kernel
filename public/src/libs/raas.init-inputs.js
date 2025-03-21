export default function() {
    var thisObj = this;
    
    $('input[data-hint], textarea[data-hint], select[data-hint]', thisObj).each(function() {
        var text = '<button type="button" class="btn" rel="popover" data-content="' + $(this).attr('data-hint') + '"><span class="raas-icon fa-solid fa-circle-question"></span></button>';
        if (!$(this).closest('.control-group').find('a[rel="popover"]').length) {
            $(this).closest('.control-group').find('.controls').append(text);
        }
    });
}