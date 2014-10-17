(function($, $d) {
    'use strict';

    var PlaceholderToggle = function(object) {
        !isJQuery(object) ? object = $d('placeholder-toggle') : object;

        object.each(function() {

            $(this).focus(function() {
                $(this).addClass('accepted');
            }).blur(function() {
                var min_len = $(this).getData('min-text-length');
                var txt = $(this).prop('value');

                if (txt.length === 0) {
                    $(this).removeClass('accepted');
                }
                if (isNumber(min_len) && txt.length < min_len) {
                    $(this).removeClass('accepted');
                }
            });
        });
    };

    Automator('placeholder-toggle', PlaceholderToggle).autobuild(true).escape(function() {
        if (Automator('placeholder-toggle').enabled === false) {
            return true;
        } else {
            return false;
        }
    });
})(jQuery, jQuery.findData);