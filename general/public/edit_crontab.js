jQuery(document).ready(function($) {
    var checkFields = function () {
        var time = $('[name="time"]').val();

        if ((time == '1') || (time == '')) {
            $('[name="minutes[]"], [name="hours[]"]').closest('.control-group').show();
        } else {
            $('[name="minutes[]"], [name="hours[]"]').closest('.control-group').hide();
        }
    };
    $('[name="time"]').on('change', checkFields);
    checkFields();
});