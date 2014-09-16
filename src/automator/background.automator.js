/**
 * Dynamic Background Automator.
 * Autmatically detect responsive and retina, then set the background dynamically.
 * @responsive {string:pattern} - background.jpg, background.retina.jpg, background.mobile.jpg, background.mobile.retina.jpg, etc.
 * @options - mobile, tablet, retina.
 * @credits - Created by Nanang Mahdaen El Agung.
 */

(function($, $$, $$$) {
    /* Setting up registry */
    Registry('enable-responsive-background', true, {lock: true, key: 'BGD-RSP'});
    Registry('enable-retina-background', true, {lock: true, key: 'BGD-RTN'});

    var bgAtom = $$('bg:dynamic', function(object, name) {
        !isJQuery(object) ? object = $$$('bg-dynamic') : object;

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
                    if (Registry('enable-responsive-background').value == true) {
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
                    if (Registry('enable-retina-background').value == true) {
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
                }
            }
        });
    })
        .autobuild(true)
        .escape(function() {
            if ($$('bg:dynamic').enabled() === false) {
                return true;
            } else {
                return false;
            }
        }
    );
})(jQuery, Automator, jQuery.findData);
