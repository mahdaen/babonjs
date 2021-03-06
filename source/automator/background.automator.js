/**
 * Background Automator.
 */
(function($, $d) {
    'use strict';

    /* Automator Name */
    var AutomatorName = 'dynamic-background';

    var defConf = {
        responsive: true,
        retina: true,
        mobile: true,
        tablet: true,
        replace: false,
        clean: false,

        data: {
            Kit: 'background',
            KitID: 'background-id',

            noretina: 'noretina',
            nomobile: 'nomobile',
            notablet: 'notablet'
        }
    };

    /**
     * Dynamic Background Automator.
     * @param object - jQuery object thats hold background.
     * @returns {DynamicBackround}
     * @constructor
     */
    var DynamicBackround = function(object) {
        /* Wrapping Config */
        var $cfg = this._config;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($cfg.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($cfg.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $cfg.data.Kit + ')');

        object.each(function(idx) {
            var img_src = $(this).getData($cfg.data.Kit);
            var new_src = '';

            if (img_src === 'get-child-img') {
                img_src = $('img', this).attr('src');
            }

            var noretina = $(this).getData($cfg.data.noretina);
            var nomobile = $(this).getData($cfg.data.nomobile);
            var notablet = $(this).getData($cfg.data.notablet);

            if (isString(img_src)) {
                var img_url = parseURL(img_src);

                if (isObject(img_url)) {
                    /* Proccessing Responsive Background */
                    if ($cfg.responsive === true) {
                        if ($cfg.mobile && window['is-mobile'] === true && !nomobile) {
                            /* Device is Mobile */
                            new_src = img_url.root + img_url.name + '.mob';
                        } else if ($cfg.tablet && window['is-tablet'] === true && !notablet) {
                            /* Device is Tablet */
                            new_src = img_url.root + img_url.name + '.tab';
                        } else {
                            /* Device is Desktop */
                            new_src = img_url.root + img_url.name;
                        }
                    } else {
                        /* Skitp responsive if disabled */
                        new_src = img_url.root + img_url.name;
                    }

                    /* Proccessing Retina Backround */
                    if ($cfg.retina == true && !noretina) {
                        /* Proccess if enabled */
                        if (window['is-retina'] === true) {
                            /* Device is Retina */
                            new_src += '@2x.' + img_url.ext;
                        } else {
                            /* Device is non Retina */
                            new_src += '.' + img_url.ext;
                        }
                    } else {
                        /* Skip when disabled */
                        new_src += '.' + img_url.ext;
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

                    if ($cfg.replace === true || $cfg.clean === true) {
                        target.remData($cfg.data.Kit);
                    }
                }
            }

            if ($cfg.clean === true || !Automator.debug) {
                $(this).remData($cfg.data.Kit);
            }
        });

        return this;
    };

    Automator(AutomatorName, DynamicBackround).setup(defConf);
})(jQuery, jQuery.findData);

