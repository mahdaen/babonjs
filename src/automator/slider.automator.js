/* CONTENT SLIDER KITS */
(function($, $$, $$$) {
    Registry('content-slider:count', 0, {lock: true, key: 'CSL-001'});

    __extend__({
        __sliderlist: []
    });

    var xParser = function(object) {
        if (!isJQuery(object)) {
            object = $$$('content-slider-kit');
        } else {
            if (object.length == 1 && !object.hasData('content-slider-kit')) {
                object = $$$('content-slider-kit', object);
            }
        }

        return object.each(function() {
            var index = Registry('content-slider:count').value;
            /* Creating Slider ID */
            var slider_id = (index + 1);

            /* Writing slider ID to all instance */
            $(this).setData('slider-id', slider_id);

            /* Parsing each Slider item and registering ID */
            $$$('slider-item', this).setData('slider-id', slider_id).each(function(index) {
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
            $$$('slider-select', this).setData('slider-id', slider_id).each(function(index) {
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
            $$$('slider-next', this).setData('slider-id', slider_id);
            $$$('slider-prev', this).setData('slider-id', slider_id);

            Registry('content-slider:count').update((index + 1), 'CSL-001');
        });
    }
    var xAnimator = {};
    var xSlider = function(root) {
        if (isString(root)) {
            var jq = $(':hasdata(content-slider-kit).' + root);
            if (isJQuery(jq) && jq.length === 1) {
                return new xSlider(jq);
            }
        }

        if (!isJQuery(root) || !root.hasData('slider-id')) return;

        var handler = this;

        this.parent = root;
        this.slider = $$$('slider-item', root);

        /* Parsing Slider Effect */
        this.effect = root.getData('slider-effect');
        if (!isString(this.effect)) {
            this.effect = 'simple';
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
        this.select = $$$('slider-select', root).each(function() {
            $(this).click(function() {
                if ($(this).hasData('slider-state')) return false;
                handler.navigate($(this));

                return false;
            });
        });

        /* Binding Navigator Actions */
        this.next = $(':hasdata(slider-next)', root).click(function() {
            handler.navigate('next');

            return false;
        });
        this.prev = $(':hasdata(slider-prev)', root).click(function() {
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
                    'slider-item': '?',
                    'slider-state': 'active'
                }, handler.parent);

                handler.target = $$$({
                    'slider-item': '?',
                    'slider-item-id': String(item_id),
                }, handler.parent);
            } else if (isString(direction)) {
                handler.current = $$$({
                    'slider-item': '?',
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
                    'slider-item': '?',
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
                'slider-select': '?',
                'slider-item-id': String(c_id)
            }, this.parent).removeClass('active').remData('slider-state');
            $$$({
                'slider-select': '?',
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

    // Simple slider handler.
    xSlider.animator('simple', function(data) {
        data.slider.swap();
    });

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

    /* Registering automator */
    Automator('content-slider', function(object) {
        object = xParser(object);

        foreach(object, function(slider) {
            __sliderlist.push(new xSlider($(slider)));
        });

        this.list = __sliderlist;

        return this;
    })
        .autobuild(true)
        .escape(function() {
            if (Automator('content-slider').enabled() === false) {
                return true;
            } else {
                return false;
            }
        }
    );

    __extend__({
        xSlider: function(object) {return new xSlider(object)},
        xSliderAnimator: xSlider.animator
    });

})(jQuery, Automator, jQuery.findData);