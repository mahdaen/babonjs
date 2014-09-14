/* CONTENT SLIDER KITS */
(function($, $$, $$$) {
    __extend__({
        __sliderlist: []
    });
    var xParser = function() {
        return $$$('kit', 'content-slider').each(function(index) {
            /* Creating Slider ID */
            var slider_id = (index + 1);

            /* Writing slider ID to all instance */
            $(this).setData('slider-id', slider_id);

            /* Parsing each Slider item and registering ID */
            $$$('kit', 'slider-item', this).setData('slider-id', slider_id).each(function(index) {
                /* Creating Slider item ID */
                var item_id = (index + 1);
                /* Writing Slider item ID */
                $(this).setData('slider-item-id', item_id);

                /* Activating first slider */
                if (item_id === 1) {
                    $(this).setData('slider-state', 'active').addClass('active');
                }
            });

            /* Parsing each Slider Selector and registering ID */
            $$$('kit', 'slider-select', this).setData('slider-id', slider_id).each(function(index) {
                /* Creating Slider item ID */
                var item_id = (index + 1);
                /* Writing Slider item ID */
                $(this).setData('slider-item-id', item_id);

                /* Activating first slider */
                if (item_id === 1) {
                    $(this).setData('slider-state', 'active').addClass('active');
                }
            });

            /* Parsing navigator */
            $$$('kit', 'slider-next', this).setData('slider-id', slider_id);
            $$$('kit', 'slider-prev', this).setData('slider-id', slider_id);
        });
    }
    var xAnimator = {};
    var xSlider = function(root) {
        if (isString(root)) {
            var jq = $(':hasdata(kit, content-slider).' + root);
            if (isJQuery(jq) && jq.length === 1) {
                return new xSlider(jq);
            }
        }

        if (!isJQuery(root) || !root.hasData('slider-id')) return;

        var handler = this;

        this.parent = root;
        this.slider = $$$('kit', 'slider-item', root);

        /* Parsing Slider Effect */
        this.effect = root.getData('slider-effect');
        if (!isString(this.effect)) {
            this.effect = 'fade';
        }

        /* Parsing Slider Config */
        this.anim_config = root.getData('slider-config');
        if (!isObject(this.anim_config)) {
            this.anim_config = {
                speed: 1,
                easing: 'Linear.easeInOut'
            }
        }

        /* Binding Selector Actions */
        this.select = $$$('kit', 'slider-select', root).each(function() {
            $(this).click(function() {
                if ($(this).hasData('slider-state')) return false;
                handler.navigate($(this));

                return false;
            });
        });

        /* Binding Navigator Actions */
        this.next = $(':hasdata(kit, slider-next)', root).click(function() {
            handler.navigate('next');

            return false;
        });
        this.prev = $(':hasdata(kit, slider-prev)', root).click(function() {
            handler.navigate('prev');

            return false;
        });

        return this;
    }
    xSlider.prototype = {
        navigate: function(direction) {
            var handler = this;
            if (isJQuery(direction)) {
                var item_id = direction.getData('slider-item-id');

                handler.current = $$$({
                    'kit': 'slider-item',
                    'slider-state': 'active'
                }, handler.parent);

                handler.target = $$$({
                    'kit': 'slider-item',
                    'slider-item-id': String(item_id),
                }, handler.parent);
            } else if (isString(direction)) {
                handler.current = $$$({
                    'kit': 'slider-item',
                    'slider-state': 'active'
                }, handler.parent);

                var cr = handler.current.getData('slider-item-id');
                var to = 1;

                if (direction === 'next') {
                    if (cr === handler.slider.length) {
                        to = 1;
                    } else {
                        to = cr + 1;
                    }
                } else if (direction === 'prev') {
                    if (cr === 1) {
                        to = handler.slider.length;
                    } else {
                        to = cr - 1;
                    }
                }

                handler.target = $$$({
                    'kit': 'slider-item',
                    'slider-item-id': String(to)
                }, handler.parent);
            }

            /* Animating Content */
            this.animate();

            return this;
        },
        animate: function(option) {
            xAnimator[this.effect]({
                active: this.current,
                target: this.target,
                config: this.anim_config,
                slider: this
            });

            return this;
        },
        swap: function() {
            var c_id = this.current.getData('slider-item-id');
            var t_id = this.target.getData('slider-item-id');

            this.current.removeClass('active').remData('slider-state');
            this.target.addClass('active').setData('slider-state', 'active');
            $$$({
                'kit': 'slider-select',
                'slider-item-id': String(c_id)
            }, this.parent).removeClass('active').remData('slider-state');
            $$$({
                'kit': 'slider-select',
                'slider-item-id': String(t_id)
            }, this.parent).addClass('active').setData('slider-state', 'active');

            return this;
        }
    }

    /* Creating animaton maker */
    xSlider.animator = function(name, func) {
        if (isString(name) && isFunction(func)) {
            return xAnimator[name] = func;
        } else if (isObject(name)) {
            foreach(name, function(name, func) {
                if (isString(name) && isFunction(func)) {
                    xAnimator[name] = func;
                }
            });
        }
    };

    /* Creating prebuilt animation */
    xSlider.animator('fade', function(data) {
        var speed = 1;

        if (isNumber(data.config.speed)) {
            speed = data.config.speed;
        }

        /* Fading Out Active Slider */
        TweenMax.to(data.active, speed, {
            opacity: 0,
            ease: Linear.easeInOut,
            onCompleteParams: [data.slider, data.active],
            onComplete: function(slider, active) {
                active.css('display', '');
                slider.swap();
            }
        });

        /* Fading In Target Slider */
        data.target.css({
            opacity: 0,
            display: 'block'
        });
        TweenMax.to(data.target, speed, {
            opacity: 1,
            ease: Linear.easeInOut
        });

        return data.slider;
    });

    $$.builder('content-slider', function(object) {
        if (!$$.config('content-slider-enabled')) return;

        !isJQuery(object) ? object = xParser() : object;

        foreach(object, function(slider) {
            __sliderlist.push(new xSlider($(slider)));
        });

        return object;
    });

    __extend__({
        xSlider: function(object) {return new xSlider(object)},
        xSliderAnimator: xSlider.animator
    });
})(jQuery, BabonKit, jQuery.findData);