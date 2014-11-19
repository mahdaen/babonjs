/**
 * Image Automator.
 */
(function($, $d) {
    'use strict';

    /**
     * Define image orientation.
     * @param object - image object. Leave blank for proccessing all images.
     * @return {ImageOrientation}
     * @constructor
     */
    var ImageOrientation = function(object) {
        !isJQuery(object) ? object = $('img') : object;

        object.each(function() {
            var w = $(this).width();
            var h = $(this).height();

            if (w > h) {
                $(this).removeClass('portrait').addClass('landscape');
            } else {
                $(this).removeClass('landscape').addClass('portrait');
            }
        });

        return this;
    };

    Automator('image-orientation', ImageOrientation).autobuild(true).escape(function() {
        if (Automator('image-orientation').enabled === false) {
            return true;
        } else {
            return false;
        }
    });

    /**
     * Responsive Image Automator.
     * @param object - jQuery Image Objects. Leave blank to scan all images that has attribute `responsive`.
     * @constructor
     */
    var ImageResponsive = function(object) {
        !isJQuery(object) ? object = $('img:hasattr(responsive)') : object;

        object.each(function () {
            var img_src = parseURL($(this).attr('src')),
                img_out = '';

            if (window['is-mobile']) {
                img_out = img_src.root + img_src.name + '.mobile.' + img_src.ext;
            } else if (window['is-tablet']) {
                img_out = img_src.root + img_src.name + '.tablet.' + img_src.ext;
            } else {
                img_out = img_src.root + img_src.name + '.' + img_src.ext;
            }

            $(this).attr('src', img_out);
        });
    };

    Automator('image-responsive', ImageResponsive).autobuild(true).escape(function() {
        if (Automator('image-responsive').enabled = false) {
            return true;
        } else {
            return false;
        }
    });

    /**
     * Retina Image Automator.
     * @param object - jQuery Image Objects. Leave blank to scan all image that has attribute `retina`.
     * @constructor
     */
    var ImageRetina = function(object) {
        !isJQuery(object) ? object = $('img:hasattr(retina)') : object;

        object.each(function() {
            var img_src = parseURL($(this).attr('src')),
                img_out = '';

            if (window['is-retina']) {
                img_out = img_src.root + img_src.name + '@2x.' + img_src.ext;
            } else {
                img_out = img_src.root + img_src.name + '.' + img_src.ext;
            }

            $(this).attr('src', img_out);
        });
    }

    Automator('image-retina', ImageRetina).autobuild(true).escape(function() {
        if (Automator('image-retina').enabled === false) {
            return true;
        } else {
            return false;
        }
    });

})(jQuery, jQuery.findData);
