(function($, $$, $$$) {
    /* Detecting Retina Display */
    if (window.devicePixelRatio && window.devicePixelRatio > 1) {
        $$.config('is-retina', true);
    }

    /* Dynamic Background Image */
    $$.builder('background', function(object) {
        !isJQuery(object) ? object = $$$('background') : object;

        if ($$.config('responsive-background-image') && window['__is-tablet'] || window['__is-mobile']) {
            $_tablet.onReady(function() {
                object.each(function() {
                    var target = $(this);

                    var background = $(this).getData('background');
                    if (background === 'get-child-img') {
                        background = $('img', this).attr('src');
                    }

                    if (isString(background)) {
                        var img_url = parseURL(background);
                        if (isObject(img_url)) {
                            img_url = img_url.root + img_url.name + '@tablet.' + img_url.ext;

                            $.ajax({
                                url: img_url,
                                type: 'HEAD',
                                success: function() {
                                    target.css('backgroundImage', 'url(' + img_url + ')');
                                },
                                error: function() {
                                    target.css('backgroundImage', 'url(' + background + ')');
                                }
                            });
                        }
                    }
                });
            });
            $_mobile.onReady(function() {
                object.each(function() {
                    var target = $(this);

                    var background = $(this).getData('background');
                    if (background === 'get-child-img') {
                        background = $('img', this).attr('src');
                    }

                    if (isString(background)) {
                        var img_url = parseURL(background);

                        if (isObject(img_url)) {
                            img_url = img_url.root + img_url.name + '@mobile.' + img_url.ext;

                            $.ajax({
                                url: img_url,
                                type: 'HEAD',
                                success: function() {
                                    target.css('backgroundImage', 'url(' + img_url + ')');
                                },
                                error: function() {
                                    target.css('backgroundImage', 'url(' + background + ')');
                                }
                            });
                        }
                    }
                });
            });
        } else {
            object.each(function() {
                var background = $(this).getData('background');

                if (background === 'get-child-img') {
                    background = $('img', this).attr('src');
                }
                if (isString(background)) {
                    var target = this;
                    $(this).css({
                        backgroundImage: 'url(' + background + ')'
                    });
                }
            });
        }

        return object;
    });
    $.fn.applyBackground = function() {
        return $$.build('background')(this);
    }

    $$.builder('img:retina', function(object) {
        if (!$$.config('is-retina') || !$$.config('retina-images')) return;

        !isJQuery(object) ? object = $$$('retina-image') : object;

        return object.each(function() {
            var image = $(this);
            var source = image.attr('src');
            var im_src;

            if (source) {
                var parse = parseURL(source);

                if (parse) {
                    im_src = parse.root + parse.name + '@2x.' + parse.ext;
                }
            }

            if (im_src) {
                $.ajax({
                    url: im_src,
                    success: function(data) {
                        image.css({
                            width: image.width(),
                            height: image.height()
                        }).attr('src', im_src);
                    }
                });
            }
        });
    });
})(jQuery, BabonKit, jQuery.findData);