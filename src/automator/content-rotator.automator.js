/**
 * Citraland Megah Batam.
 * Content Rotator Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 10/13/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name Variable.
    var AutomatorName = 'content-rotator';

    // Rotator Main Configuration.
    var Config = {
        counter: 0,
        IDPrefix: 'rotator-',
        allowReconfigure: false,

        // Constructor Naming.
        data: {
            // HTML Data Attributes Naming.
            Kit: 'content-rotator',
            KitID: 'content-rotator-id',
            KitConfigured: 'content-rotator-configured',

            Item: 'content-rotator-item',
            ItemID: 'content-rotator-item-id',
            ItemState: 'content-rotator-item-state',

            Prev: 'content-rotator-prev',
            Next: 'content-rotator-next',
            Select: 'content-rotator-select',

            Progress: 'content-rotator-progress',

            // Data State Naming.
            ItemActive: 'active',

            ProgressStopped: 'stopped',
            ProgressPaused: 'paused',

            NavigateNext: 'forward',
            NavigatePrev: 'backward'
        },

        maps: {},
        animator: {
            default: function() {
                this.swap();
            },
            fade: function() {
                var self = this;

                self.active.fadeOut();
                self.target.fadeIn();

                self.swap();
            }
        }
    };

    // Rotator Object.
    var ContentRotator = function() {
        // Rotator Object Configuration.
        this.config = {
            // Auto rotate Items.
            auto: false,

            // Animation Name.
            animationName: 'default',

            // Animation Speed.
            animationSpeed: 0
        };

        // Attributes Naming.
        this.cons = Config.data;

        // Creating temporary holder.
        this.holder = $('<div>');

        return this;
    };

    // Rotator Prototypes.
    ContentRotator.prototype = {
        navigate: function(direction) {
            var next = 0;

            if (isString(direction)) {
                // Handle for next and prev navigation.
                if (direction === Config.data.NavigateNext) {
                    if (this.current === this.total) {
                        next = 1;
                    } else {
                        next = (this.current + 1);
                    }
                } else if (direction === Config.data.NavigatePrev) {
                    if (this.current === 1) {
                        next = this.total;
                    } else {
                        next = (this.current - 1);
                    }
                } else {
                    return this;
                }

                this.target = this.items.filter(':hasdata(' + Config.data.ItemID + ', ' + next + ')');
                this.current = next;
            } else if (isNumber(direction) && direction >= 1 && direction <= this.total) {
                // Handle for index specific navigation.
                this.target = this.items.filter(':hasdata(' + Config.data.ItemID + ', ' + direction + ')');
                this.current = direction;
            }

            // Animating Items.
            this.animate();

            return this;
        },
        animate: function() {
            var anim = this.config.animationName;

            if (Config.animator.hasOwnProperty(anim) && isFunction(Config.animator[anim])) {
                Config.animator[anim].apply(this);
            } else {
                this.swap();
            }

            return this;
        },
        swap: function() {
            // Deactivating Active Item.
            this.active.removeClass(Config.data.ItemActive).remData(Config.data.ItemState);

            // Activating Target Item.
            this.target.addClass(Config.data.ItemActive).setData(Config.data.ItemState, Config.data.ItemActive);

            // Replacing active item with target item.
            this.active = this.target;

            // Starting auto rotate content.
            if (isNumber(this.config.auto)) {
                this.restart();
            }

            return this;
        },
        start: function() {
            var duration = (this.config.auto * 1000),
                w = this.progress.width();

            if (w > 0) {
                var style = this.progress.style(),
                    width = Number(style.width.replace('%', ''));

                duration = duration - ((width / 100) * duration);
            }

            this.progress.removeClass(Config.data.ProgressStopped).animate({
                width: '100%'
            }, duration, function() {
                // Getting Rotator ID and Resetting Width.
                var rt_id = $(this).css({ width: 0 }).getData(Config.data.KitID);

                Automator(AutomatorName).with(rt_id).navigate(Config.data.NavigateNext);
            });

            return this;
        },
        restart: function() {
            this.stop();
            this.start();

            return this;
        },
        stop: function() {
            this.progress.stop().addClass(Config.data.ProgressStopped).width(0);

            return this;
        },
        pause: function() {
            this.progress.stop().addClass(Config.data.ProgressPaused);

            return this;
        },
        set: function(key, value) {
            if (isString(key)) {
                if (value) this[key] = value;
            } else if (isObject(key)) {
                var self = this;

                foreach(key, function (key, value) {
                    self[key] = value;
                });
            }

            return this;
        }
    };

    /**
     * Content Rotator Automator Constructor.
     * @param object - jQuery object that has attribute 'data-rotator-kit'.
     * @required htmlTag - 'data-rotator-kit' as holder, 'data-rotator-item' as rotator item, 'data-rotator-select' as selector, 'data-rotator-next' as navigate forward, 'data-rotator-prev' as navigate backward.
     * @config data-object - 'auto' with number duration, 'animationName' for custom animation, 'animationSpeed' for custom animation speed. Sample: `data-rotator-kit="auto: 5000, animationName: 'fade', animationSpeed: 1000"`.
     * @returns {contentRotator}
     * @constructor
     */
    var contentRotator = function (object) {
        /* Wrapping Config */
        var $cfg = this._config = Config;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($cfg.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($cfg.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $cfg.data.Kit + ')');

        // Initializing Rotator.
        object.each(function() {
            // Check if already configured and skip if not allowed.
            if (Config.allowReconfigure === false && $(this).getData(Config.data.KitConfigured) === true) return;

            // Creating Rotator ID if not defined.
            var rt_id = $(this).getData(Config.data.KitID);

            if (!isString(rt_id)) {
                rt_id = Config.IDPrefix + (Config.counter + 1);

                // Applying Rotator ID to Rotator Holder.
                $(this).setData(Config.data.KitID, rt_id);
            }

            // Creating Rotator Object.
            var rotator = new ContentRotator().set('holder', $(this));

            // Getting Rotator Config.
            var config = $(this).getData(Config.data.Kit);

            // Apllying rotator object config.
            if (isObject(config)) {
                foreach(config, function (key, value) {
                    rotator.config[key] = value;
                });
            }

            // Getting Rotator Items.
            var items = $d(Config.data.Item, this).setData(Config.data.KitID, rt_id);

            // Getting Rotator Selector.
            var select = $d(Config.data.Select, this).setData(Config.data.KitID, rt_id);

            // Getting Rotator Navigator and Binding Click Function.
            var prev = $d(Config.data.Prev, this).setData(Config.data.KitID, rt_id).click(function(e) {
                e.stopPropagation();

                rotator.navigate(Config.data.NavigatePrev);

                return false;
            });
            var next = $d(Config.data.Next, this).setData(Config.data.KitID, rt_id).click(function(e) {
                e.stopPropagation();

                rotator.navigate(Config.data.NavigateNext);

                return false;
            });

            // Adding navigator to Rotator Object.
            rotator.set({
                'nav_prev': prev,
                'nav_next': next
            });

            // Creating Rotator Progress Controll if not exist.
            var prog = $d(Config.data.Progress, this).setData(Config.data.KitID, rt_id);

            var progressQuery = {};
            progressQuery[Config.data.Progress] = '';
            progressQuery[Config.data.KitID] = rt_id;

            if (prog.length < 1) {
                prog = $('<div>').setData(progressQuery).addClass(Config.data.Progress).css({ width: 0, position: 'absolute' }).prependTo(this);
            }

            // Adding Progress to Rotator Object.
            rotator.set('progress', prog);

            // Adding Rotator Object to list.
            Config.maps[rt_id] = rotator;

            // Increasing Counter.
            Config.counter++;
        });

        // Reinitializing Rotator to prevent wrong items index number for rotator inside rotator.
        foreach(Config.maps, function (rt_id, rotator) {
            // Checking if already configured and determine does it should be reconfigured or not.
            if (Config.allowReconfigure === false && rotator.holder.getData(Config.data.KitConfigured) === true) {
                return;
            } else {
                rotator.holder.setData(Config.data.KitConfigured, true);
            }

            // Temporary Default Item.
            var default_item;
            var default_select = 0;

            // Initializing Rotator Items.
            var itemQuery = {};
            itemQuery[Config.data.Item] = '?';
            itemQuery[Config.data.KitID] = rt_id;

            var items = $d(itemQuery).each(function(index) {
                // Applying Item Index ID.
                $(this).setData(Config.data.ItemID, (index + 1));

                // Setting first item as default activated item.
                if (index === 0) {
                    default_item = $(this);
                    default_select = 0;
                    rotator.current = 1;
                    rotator.active = $(this);
                }

                // If this is default, then replace the first activated item with this.
                if ($(this).getData(Config.data.Item) === 'default') {
                    default_item = $(this);
                    default_select = index;
                    rotator.current = (index + 1);
                    rotator.active = $(this);
                }
            });

            // Activating Default Item.
            if (default_item) {
                default_item.setData(Config.data.ItemState, Config.data.ItemActive).addClass(Config.data.ItemActive);
            }

            // Initializing Rotator Selectors.
            var selectorQuery = {};
            selectorQuery[Config.data.Select] = '?';
            selectorQuery[Config.data.KitID] = rt_id;

            var selects = $d(selectorQuery).each(function(index) {
                // Applying Item Index ID.
                $(this).setData(Config.data.ItemID, (index + 1));

                // Activating Default Select.
                if (index === default_select) {
                    $(this).setData(Config.data.ItemState, Config.data.ItemActive).addClass(Config.data.ItemActive);
                }

                // Biding Click Function.
                $(this).click(function(e) {
                    e.stopPropagation();

                    var rt_id = $(this).getData(Config.data.KitID);
                    var index = $(this).getData(Config.data.ItemID);

                    if (isString(rt_id) && isNumber(index)) {
                        rotator.navigate(index);
                    }

                    return false;
                });
            });

            // Adding Rotator Items and Selects to Rotator Object.
            if (items.length > 0) {
                rotator.set({ 'items': items, total: items.length });
            }
            if (selects.length > 0) {
                rotator.set('selects', selects);
            }
        });

        // Initializing Auto Rotate.
        foreach(Config.maps, function (name, rotator) {
            if (isNumber(rotator.config.auto)) {
                rotator.start();
            }
        });

        return this;
    };

    // Automator Prototypes.
    contentRotator.prototype = {
        addAnimation: function(animationName, func) {
            if (isString(animationName) && isFunction(func)) {
                Config.animator[animationName] = func;
            } else if (isObject(animationName)) {
                foreach(animationName, function (name, func) {
                    if (isFunction(func)) {
                        Config.animator[name] = func;
                    }
                });
            }

            return this;
        }
    };

    // Registering Automator including autobuild and default escape condition.
    Automator(AutomatorName, contentRotator).autobuild(true).escape(function () {
        if (Automator(AutomatorName).enabled === false) {
            return true;
        } else {
            return false;
        }
    });
})(jQuery, jQuery.findData);
