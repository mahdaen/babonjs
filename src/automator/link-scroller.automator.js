/**
 * BabonJS.
 * LinkScroller Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 10/29/14.
 * License: GNU General Public License v2 or later.
 */

(function($, $d) {
    'use strict';

    var AutomatorName = 'link-scroller';

    var Config = {
        counter: 0,
        IDPrefix: 'link-scroller-',

        data: {
            kit: 'link-scroller'
        },

        stopPos: 0,
        independent: true,

        kit: {},
    }

    var linkScroller = function(object) {
        !isJQuery(object) ? object = $d(Config.data.kit) : object;

        object = object.filter(':hasdata(' + Config.data.kit + ')');

        object.each(function() {
            /* Getting Target ID */
            var target = $(this).getData(Config.data.kit);

            /* Getting Scroll Effect */
            var scrollEffect = $(this).getData('link-scroll-effect');
            if (!isString(scrollEffect)) {
                scrollEffect = 'default';
            }

            /* Getting Target */
            var linkTarget = $(target);

            if (linkTarget.length > 0) {
                /* Getting Offset */
                var top = linkTarget.offsets().top;


                $(this).click(function(e) {
                    if (Config.independent) {
                        e.stopPropagation();
                    }

                    var range = (top - Config.stopPos);

                    Automator('scroll-pos').scrollTop(range, scrollEffect);

                    if (Config.independent) {
                        return false;
                    }
                });
            }
        });
    };

    /* Kit Prototype */
    linkScroller.prototype = {
        addEffect: function(name, func) {
            Automator('scroll-pos').addScrollEffect(name, func);

            return this;
        },
        setup: function(name, value) {
            if (isString(name) && isDefined(value)) {
                Config[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    Config[name] = value;
                });
            }

            return this;
        }
    };

    /* Registering Automator */
    Automator(AutomatorName, linkScroller);
})(jQuery, jQuery.findData);