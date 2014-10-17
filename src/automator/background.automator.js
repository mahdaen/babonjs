/**
 * Background Automator.
 */
(function($, $d) {
    'use strict';

    var Config = {
        responsive: true,
        retina: true,
        replace: false
    };

    /**
     * Dynamic Background Automator.
     * @param object - jQuery object thats hold background.
     * @returns {DynamicBackround}
     * @constructor
     */
    var DynamicBackround = function(object) {
        !isJQuery(object) ? object = $d('bg-dynamic') : object;

        object.each(function(idx) {
            var img_src = $(this).getData('bg-dynamic');
            var new_src = '';

            if (img_src === 'get-child-img') {
                img_src = $('img', this).attr('src');
            }

            if (isString(img_src)) {
                var img_url = parseURL(img_src);

                if (isObject(img_url)) {
                    /* Proccessing Responsive Background */
                    if (Config.responsive == true) {
                        if (window['is-mobile'] === true) {
                            /* Device is Mobile */
                            new_src = img_url.root + img_url.name + '.mobile.';
                        } else if (window['is-tablet'] === true) {
                            /* Device is Tablet */
                            new_src = img_url.root + img_url.name + '.tablet.';
                        } else {
                            /* Device is Desktop */
                            new_src = img_url.root + img_url.name + '.';
                        }
                    } else {
                        /* Skitp responsive if disabled */
                        new_src = img_url.root + img_url.name + '.';
                    }

                    /* Proccessing Retina Backround */
                    if (Config.retina == true) {
                        /* Proccess if enabled */
                        if (window['is-retina'] === true) {
                            /* Device is Retina */
                            new_src += 'retina.' + img_url.ext;
                        } else {
                            /* Device is non Retina */
                            new_src += img_url.ext;
                        }
                    } else {
                        /* Skip when disabled */
                        new_src += img_url.ext;
                    }

                    var target = $(this);

                    $.ajax({
                        url: new_src,
                        type: 'HEAD',
                        success: function() {
                            target.css('backgroundImage', 'url(' + new_src + ')');
                        },
                        error: function() {
                            target.css('backgroundImage', 'url(' + img_src + ')');
                        }
                    });

                    if (Config.replace === true) {
                        target.remData('bg-dynamic');
                    }
                }
            }
        });

        return this;
    };
    DynamicBackround.prototype = {
        setup: function(object) {
            if (isObject(object)) {
                foreach(object, function (key, value) {
                    Config[key] = value;
                });
            }

            return this;
        }
    }

    Automator('bg-dynamic', DynamicBackround).autobuild(true).escape(function() {
        if (Automator('bg-dynamic').enable === false) {
            return true;
        } else {
            return false;
        }
    });
})(jQuery, jQuery.findData);

