(function($) {
    'use strict';
    var Config = {
        handleDelay: 0,
        timeHanlder: setTimeout(function() {}, 0),
        scrollOwner: $(),
        scrollHolder: $(),

        onReachTop: [],
        onReachRight: [],
        onReachBottom: [],
        onReachLeft: [],
        onScrolling: [],

        enableEffect: true,
        effect: {
            default: function(range) {
                if (isNumber(range)) {
                    if (Config.enableEffect) {
                        Config.scrollOwner.animate({
                            scrollTop: range
                        }, 500);
                    } else {
                        Config.scrollOwner.scrollTop(range);
                    }
                }
            }
        }
    };

    var ScrollPos = function() {
        window.scrollPos = { dir: 'vertical', x: 'left', y: 'top' };

        // Getting Scroll Holder.
        Config.scrollOwner = $.findData('scroll-owner');
        Config.scrollHolder = $.findData('scroll-holder');

        if (Config.scrollOwner.length < 1) {
            Config.scrollOwner = $(window);
            Config.enableEffect = false;
        }
        if (Config.scrollHolder.length < 1) {
            Config.scrollHolder = $('body');
        }

        // Setting up scroller.
        Config.scrollHolder.setData('scroll-holder', scrollPos);

        var handleScroll = function() {
            // Getting Window Innser Size.
            var windWidth = innerWidth;
            var windHeight = innerHeight;

            // Getting Scroll Holder Size.
            var holdWidth = Config.scrollHolder.innerWidth();
            var holdHeight = Config.scrollHolder.innerHeight();

            // Getting End of X and Y.
            var right = (holdWidth - windWidth);
            var bottom = (holdHeight - windHeight);

            // Determine the Y position.
            if (scrollY === 0) {
                scrollPos.y = 'top';

                foreach(Config.onReachTop, function (func) {
                    func();
                });
            } else if (scrollY === bottom) {
                scrollPos.y = 'bottom';

                foreach(Config.onReachBottom, function (func) {
                    func();
                });
            } else {
                scrollPos.y = scrollY;

                if (scrollY > 0) {
                    scrollPos.dir = 'vertical';
                }

                foreach(Config.onScrolling, function (func) {
                    func();
                });
            }

            // Determine the X position.
            if (scrollX === 0) {
                scrollPos.x = 'left';

                foreach(Config.onReachLeft, function (func) {
                    func();
                });
            } else if (scrollX === right) {
                scrollPos.x = 'right';

                foreach(Config.onReachRight, function (func) {
                    func();
                });
            } else {
                scrollPos.x = scrollX;

                if (scrollX > 0) {
                    scrollPos.dir = 'horizontal';
                }

                foreach(Config.onScrolling, function (func) {
                    func();
                });
            }

            // Applying position to holder.
            Config.scrollHolder.setData('scroll-holder', scrollPos);
        };

        $(window).scroll(function() {
            if (isNumber(Config.handleDelay) && Config.handleDelay !== 0) {
                clearTimeout(Config.timeHanlder);

                Config.timeHanlder = setTimeout(handleScroll, Config.handleDelay);
            } else {
                handleScroll();
            }
        });
    };

    ScrollPos.prototype = {
        onReachTop: function(func) {
            if (isFunction(func)) {
                Config.onReachTop.push(func);
            } else if (isArray(func)) {
                foreach(func, function (func) {
                    if (isFunction(func)) {
                        Config.onReachTop.push(func);
                    }
                });
            }

            return this;
        },
        onReachRight: function(func) {
            if (isFunction(func)) {
                Config.onReachRight.push(func);
            } else if (isArray(func)) {
                foreach(func, function (func) {
                    if (isFunction(func)) {
                        Config.onReachRight.push(func);
                    }
                });
            }

            return this;
        },
        onReachBottom: function(func) {
            if (isFunction(func)) {
                Config.onReachBottom.push(func);
            } else if (isArray(func)) {
                foreach(func, function (func) {
                    if (isFunction(func)) {
                        Config.onReachBottom.push(func);
                    }
                });
            }

            return this;
        },
        onReachLeft: function(func) {
            if (isFunction(func)) {
                Config.onReachLeft.push(func);
            } else if (isArray(func)) {
                foreach(func, function (func) {
                    if (isFunction(func)) {
                        Config.onReachLeft.push(func);
                    }
                });
            }

            return this;
        },
        onScroll: function(func) {
            if (isFunction(func)) {
                Config.onScrolling.push(func);
            } else if (isArray(func)) {
                foreach(func, function (func) {
                    if (isFunction(func)) {
                        Config.onScrolling.push(func);
                    }
                });
            }

            return this;
        },
        setDelay: function(delay) {
            if (isNumber(delay)) {
                Config.handleDelay = delay;
            }

            return this;
        },
        addScrollEffect: function(name, func) {
            if (isString(name) && isFunction(func)) {
                Config.effect[name] = func;
            } else if (isObject(name)) {
                foreach(name, function (name, func) {
                    Config.effect[name] = func;
                });
            }

            return this;
        },
        scrollTop: function(range, effect) {
            if (isNumber(range)) {
                if (isString(effect) && Config.enableEffect) {
                    if (Config.effect.hasOwnProperty(effect)) {
                        Config.effect[effect](range);
                    } else {
                        Config.scrollOwner.scrollTop(range);
                    }
                } else {
                    Config.scrollOwner.scrollTop(range);
                }
            }

            return this;
        }
    };

    Automator('scroll-pos', ScrollPos);
})(jQuery);