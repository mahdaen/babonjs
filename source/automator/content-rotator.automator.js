/**
 * BabonJS.
 * ContentRotator Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 11/16/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AutomatorName = 'content-rotator';

    /* Default Configs */
    var defConf = {
        IDPrefix    : 'cr-',

        /* Effect Collections */
        effect      : {
            /* Default Effect - Only changing the class */
            'default': function() {
                this.swap();

                return this;
            },

            /* Simple Effect - Using jQuery $.fadeIn() and $.fadeOut() before swapping class */
            'simple': function() {
                var $this = this;

                $this.active.fadeOut(function() {
                    $this.target.fadeIn(function() {
                        $this.swap();
                    });
                });

                return this;
            },
        },

        /* Callback Collections */
        callback    : {}
    };

    /* Default Data-Attribute and Class naming */
    var defData = {
        id          : 'content-rotator-id',
        kit         : 'content-rotator',

        item        : 'content-rotator-item',
        prev        : 'content-rotator-prev',
        next        : 'content-rotator-next',
        select      : 'content-rotator-select',
        default     : 'default',
        progress    : 'content-rotator-progress',

        state       : 'content-rotator-state',
        active      : 'active',
        paused      : 'paused',
        stopped     : 'stopped',
        forward     : 'forward',
        backward    : 'backward'
    };

    // ContentRotator object.
    var ContentRotator = function () {
        this.config = {
            auto: false,
            effect: 'default',
            progress: false,
            onnavigate: 'none',

            select: true,
            before: false,
            after: false
        };

        this.prev = $('<div>');
        this.next = $('<div>');
        this.items = $('<div>');
        this.holder = $('<div>');
        this.selects = $('<div>');

        this.active = $('<div>');
        this.target = $('<div>');

        this.activeS = $('<div>');
        this.targetS = $('<div>');

        this.current = 0;
        this.total = 0;
        this.navdir = 'none';

        return this;
    };

    // ContentRotator Object Prototypes.
    ContentRotator.prototype = {
        // Change or add Kit properties.
        set: function (name, value) {
            var $this = this;

            if (isString(name) && isDefined(value)) {
                this[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    $this[name] = value;
                });
            }

            return this;
        },
        use: function (name, value) {
            var $this = this;

            if (isString(name) && isDefined(value)) {
                this.config[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    $this.config[name] = value;
                });
            }

            return this;
        },

        /* Function to define the target item */
        navigate: function($dir) {
            /* Escape when no dir defined */
            if (!isString($dir) && !isNumber($dir)) return;

            /* Variable Wrapper */
            var $this = this, $next = 0, $data = $this.$data;

            /* Stop auto rotate during navigate */
            $this.stop();

            /* Initializing Direction */
            if ($dir === $data.forward) {
                /* Navigate Forward */
                if ($this.current < ($this.total - 1)) {
                    $next = $this.current + 1;
                } else {
                    $next = 0;
                }
            } else if ($dir === $data.backward) {
                /* Navigate Backward */
                if ($this.current >= 1) {
                    $next = $this.current - 1;
                } else {
                    $next = ($this.total - 1);
                }
            } else if (isNumber($dir)) {
                /* Navigate to index number */
                $next = $dir;
            }

            $this.navdir = $dir;

            /* Get the target item and select */
            $this.target = $($this.items.get($next));

            /* If Select Enabled */
            if ($this.config.select) {
                $this.targetS = $($this.selects.get($next));
            }

            /* Before Target item and select */
            if ($this.config.before) {
                $this.before = $($this.items.get($next - 1));
                if ($this.before.length < 1) {
                    $this.before = $($this.items.get($this.items.length - 1));
                }

                if ($this.config.select) {
                    $this.beforeS = $($this.selects.get($next - 1));
                    if ($this.beforeS.length < 1) {
                        $this.beforeS = $($this.selects.get($this.items.length - 1));
                    }
                }
            }

            /* After Target item and select */
            if ($this.config.after) {
                $this.after = $($this.items.get($next + 1));
                if ($this.after.length < 1) {
                    $this.after = $($this.items.get(0));
                }

                if ($this.config.select) {
                    $this.afterS = $($this.selects.get($next + 1));
                    if ($this.afterS.length < 1) {
                        $this.afterS = $($this.selects.get(0));
                    }
                }
            }

            /* Animate the rotator, or return if no target found with the given index or target is more than one (that confusing). */
            if ($this.target.length === 1) {
                /* Replacing Current Index */
                $this.current = $next;

                /* Animating */
                $this.animate();
            } else {
                return;
            }

            return this;
        },

        /* Function to animate active item and target item */
        animate: function() {
            /* Variable Wrapper */
            var $this = this, $conf = $this.$conf, $data = $this.$data, $anim = $this.config.effect;

            /* Does the selected effect exist? Call it if exist, otherwise use default */
            if ($conf.effect.hasOwnProperty($anim)) {
                $conf.effect[$anim].apply($this);
            } else {
                $conf.effect.default.apply($this);
            }

            return this;
        },

        /* Function to change the class of the active item and target item */
        swap: function() {
            /* Variable Wrapper */
            var $this = this, $conf = $this.$conf, $data = $this.$data;

            /* Removing active class from the active item */
            $this.active.removeClass($data.active);
            $this.activeS.removeClass($data.active);

            /* Adding active calss to the target item */
            $this.target.addClass($data.active);
            $this.targetS.addClass($data.active);

            /* Modifying Data Attribute if shouldnt' to be clean */
            if (!$conf.clean && Automator.debug) {
                /* Removing data state from the active item */
                $this.active.remData($data.state);
                $this.activeS.remData($data.state);

                /* Adding data state to the target item */
                $this.target.setData($data.state, $data.active);
                $this.targetS.setData($data.state, $data.active);
            }

            /* Replacing active item with target item */
            $this.active = $this.target;
            $this.activeS = $this.targetS;

            /* Calling callback if defined and exist */
            if ($conf.callback.hasOwnProperty($this.config.onnavigate)) {
                $conf.callback[$this.config.onnavigate].apply($this);
            }

            /* Restarting auto-rotate if enabled */
            if (isNumber($this.config.auto)) {
                $this.start();
            }

            return this;
        },
        start: function() {
            if (!isNumber(this.config.auto)) return;

            /* Variable Wrapper */
            var $this = this, $data = $this.$data;

            /* Get duration time in ms */
            var duration = ($this.config.auto * 1000);

            /* Get the progress width */
            var width = $this.progress.width();

            /* Count the current position and duration to be used when it's paused */
            if (width > 0) {
                /* Get the style lists */
                var style = $this.progress.style();

                /* Count new duration */
                duration = duration - (Number(style.width.replace('%', '') / 100) * duration);
            }

            /* Animating Progress as a timer :D */
            $this.progress
                /* Remove stop class */
                .removeClass($data.stopped)
                /* Remove puase state */
                .removeClass($data.paused)
                /* Change width to 100% and navigate item when reached 100% */
                .animate({ width: '100%' }, duration, function() {
                    /* Resetting progress width to 0 */
                    $this.progress.width(0);

                    /* Navigate to next item */
                    $this.navigate($data.forward);
                });

            return this;
        },
        stop: function() {
            if (!isNumber(this.config.auto)) return;

            /* Variable Wrapper */
            var $this = this, $data = $this.$data;

            /* Stopping progress animation and adding stop state */
            $this.progress
                /* Stopping animation */
                .stop()
                /* Remove pause state */
                .removeClass($data.paused)
                /* Adding stop state */
                .addClass($data.stopped)
                /* Reset width to 0 */
                .animate({ width: 0 }, 200, function() {
                    $this.progress.css('width', '');
                });

            return this;
        },
        pause: function() {
            if (!isNumber(this.config.auto)) return;

            /* Variable Wrapper */
            var $this = this, $data = $this.$data;

            /* Stopping progress animation and adding pause state */
            $this.progress
                /* Stopping animation */
                .stop()
                /* Remove stop state */
                .removeClass($data.stopped)
                /* Adding stop state */
                .addClass($data.paused);

            return this;
        },
        restart: function() {
            if (!isNumber(this.config.auto)) return;

            /* Variable Wrapper */
            var $this = this;

            /* Stopping current timer */
            $this.stop();

            /* Starting new timer */
            $this.start();

            return this;
        },
    };

    // Automator Constructor.
    var contentRotator = function (object) {
        var $this = this;
        var $conf = this._config;
        var $data = this._config.data;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($data.kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($data.kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $data.kit + ')');

        // Iterating Objects.
        object.each(function () {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData($data.id);
            if (!isString(kit_id)) {
                kit_id = $conf.IDPrefix + ($conf.counter + 1);

                $conf.counter++;
            }

            /* Creating New Kit */
            var kit = new ContentRotator().set({
                $conf: $conf,
                $data: $data,

                id: kit_id,
                holder: $(this).setData($data.id, kit_id)
            });

            /* Getting Config */
            var config = kit.holder.getData($data.kit);
            if (isObject(config)) {
                kit.use(config);
            }

            /* ENUMERATING COMPONENTS */
            /* Rotator Items */
            kit.items = $d($data.item, kit.holder).setData($data.id, kit_id);

            /* Select Buttons If Enabled */
            if (kit.config.select) {
                kit.selects = $d($data.select, kit.holder).setData($data.id, kit_id);
            }

            /* Prev Button */
            kit.prev = $d($data.prev, kit.holder).setData($data.id, kit_id);

            /* Next Button */
            kit.next = $d($data.next, kit.holder).setData($data.id, kit_id);

            /* Progress */
            kit.progress = $d($data.progress, kit.holder).setData($data.id, kit_id);

            /* Adding Kit to Collections */
            $conf.maps[kit_id] = kit;
        });

        /* Re-enumearting Kits to enable usage of rotator inside rotator. */
        foreach($conf.maps, function (id, kit) {
            /* FILTERING COMPONENTS TO PREVENT SELECT MISTAKES */
            /* Items */
            kit.items = kit.items.filter(':hasdata(' + $data.id + ', ' + id + ')');

            /* Updating Total Items */
            kit.total = kit.items.length;

            /* Selects */
            kit.selects = kit.selects.filter(':hasdata(' + $data.id + ', ' + id + ')');

            /* Prev Button */
            kit.prev = kit.prev.filter(':hasdata(' + $data.id + ', ' + id + ')');

            /* Next Button */
            kit.next = kit.next.filter(':hasdata(' + $data.id + ', ' + id + ')');

            /* Progress Bar */
            kit.progress = kit.progress.filter(':hasdata(' + $data.id + ', ' + id + ')');

            /* Creating new progress bar when not exist and should auto-rotate */
            if (kit.progress.length < 1 && isNumber(kit.config.auto)) {
                kit.progress = $('<div class="progress" ' + $data.progress + '>')
                    /* Adding Data Attribute */
                    .setData($data.id, id)
                    /* Prepend to content-rotator holder */
                    .prependTo(kit.holder);

                /* Adding style to hide progress if unused */
                if (!kit.config.progress) {
                    kit.progress.css({ position: 'absolute', top: 0, left: 0, visibility: 'hidden', opacity: 0 })
                }
            }

            /* Finding Default Item */
            var def = kit.items.filter(':hasdata(' + $data.default + ')');

            if (def.length === 1) {
                def = kit.items.index(def);
            } else {
                def = 0;
            }

            /* Activating Default Item */
            kit.navigate(def);

            /* BINDING CLICK EVENTS */
            /* Select Buttons */
            kit.selects.click(function(e) {
                e.stopPropagation();

                var index = kit.selects.index(this);

                if (isNumber(index)) kit.navigate(index);

                return false;
            });

            /* Prev Button */
            kit.prev.click(function(e) {
                e.stopPropagation();

                kit.navigate($data.backward);

                return false;
            });

            /* Next Button */
            kit.next.click(function(e) {
                e.stopPropagation();

                kit.navigate($data.forward);

                return false;
            });

            /* Cleaning up data attribute if shouldn't to be clean */
            if ($conf.clean || !Automator.debug) {
                kit.holder.remData([$data.kit, $data.id]);
                kit.items.remData([$data.item, $data.id, $data.default]);
                kit.selects.remData([$data.select, $data.id]);
                kit.prev.remData([$data.prev, $data.id]);
                kit.next.remData([$data.next, $data.id]);
                kit.progress.remData([$data.progress, $data.id]);
            }

            /* Starting auto-rotate if enabled */
            if (isNumber(kit.config.auto)) {
                kit.start();
            }
        });

        return this;
    };

    /* Automator Prototypes */
    contentRotator.prototype = {
        addAnimation: function(name, handler) {
            var $this = this;

            if (isString(name) && isFunction(handler)) {
                $this._config.effect[name] = handler;
            } else if (isObject(name)) {
                foreach(name, function (name, handler) {
                    $this._config.effect[name] = handler;
                });
            }

            return this;
        },
        addCallback: function(name, handler) {
            var $this = this;

            if (isString(name) && isFunction(handler)) {
                $this._config.callback[name] = handler;
            } else if (isObject(name)) {
                foreach(name, function (name, handler) {
                    $this._config.callback[name] = handler;
                });
            }

            return this;
        }
    }

    // Registering Automator.
    Automator(AutomatorName, contentRotator).setup(defConf).config(defData);
})(jQuery, jQuery.findData);
