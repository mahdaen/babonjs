/**
 * BabonJS.
 * LazyLoader Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 10/30/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AutomatorName = 'lazy-loader';

    // Automator Configurations.
    var Config = {
        counter: 0,
        IDPrefix: 'lazy-loader-',
        clean: true,

        // Attributes Naming.
        data: {
            Kit: 'lazy-loader',
            KitID: 'lazy-loader-id',
            KitState: 'lazy-loader-state'
        },

        loadtime: 'load',

        // Object Collections.
        object: {},

        // Effect Collections.
        effect: {
            default: function() {
                this.loaded = true;
                this.holder.addClass(this.config.loadclass);

                if (Config.clean === false) {
                    this.holder.setData(Config.data.KitState, this.config.loadclass);
                }

                return this;
            }
        }
    };

    // LazyLoader object.
    var LazyLoader = function () {
        this.config = {
            delay: 0,
            loadtime: 'winload',
            effect: 'default',
            loadclass: 'loaded'
        };
        this.timeHanlder = setTimeout(function() {}, 0);
        this.holder = $('<div>');

        return this;
    };

    // LazyLoader Object Prototypes.
    LazyLoader.prototype = {
        // Change or add Kit properties.
        set: function (name, value) {
            if (isString(name) && isDefined(value)) {
                this[name] = value;
            } else if (isObject(name)) {
                var self = this;

                foreach(name, function (name, value) {
                    self[name] = value;
                });
            }

            return this;
        },
    };

    // Automator Constructor.
    var lazyLoader = function (object) {
        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d(Config.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d(Config.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + Config.data.Kit + ')');

        // Iterating Objects.
        object.each(function () {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData(Config.data.KitID);
            if (!isString(kit_id)) {
                kit_id = Config.IDPrefix + (Config.counter + 1);

                /* Increasing Counter */
                Config.counter++;
            }

            /* Creating New Kit */
            var Kit = new LazyLoader().set({ id: kit_id, holder: $(this).setData(Config.data.KitID, kit_id) });

            /* Geting Configurations */
            var config = Kit.holder.getData(Config.data.Kit);
            if (isObject(config)) {
                foreach(config, function (key, value) {
                    Kit.config[key] = value;
                });
            }

            /* Getting Delay Time */
            var delay = isNumber(Kit.config.delay) ? Kit.config.delay : 0;

            /* Creating Load Handler */
            var timeHandler = function() {
                var effectName = Kit.config.effect;

                if (isString(effectName) && Config.effect.hasOwnProperty(effectName)) {
                    var effect = Config.effect[effectName];

                    if (isFunction(effect)) {
                        effect.apply(Kit);
                    }
                }
            };

            /* Determine Load Time */
            var loadtime = Kit.config.loadtime;

            if (loadtime === 'winload') {
                $(window).load(function() {
                    clearTimeout(Kit.timeHanlder);

                    Kit.timeHanlder = setTimeout(timeHandler, delay);
                });
            } else if (loadtime === 'docready') {
                clearTimeout(Kit.timeHanlder);

                Kit.timeHanlder = setTimeout(timeHandler, delay);
            } else if (loadtime === 'selfload') {
                Kit.holder.load(function() {
                    clearTimeout(Kit.timeHanlder);

                    Kit.timeHanlder = setTimeout(timeHandler, delay);
                });
            } else  {
                if (isString(loadtime)) {
                    $(loadtime, Kit.holder).load(function() {
                        clearTimeout(Kit.timeHanlder);

                        Kit.timeHanlder = setTimeout(timeHandler, delay);
                    });
                }
            }

            /* Adding Kit to Collections */
            Config.object[kit_id] = Kit;

            /* Clean up Tag */
            if (Config.clean === true) {
                foreach(Config.data, function (key, value) {
                    Kit.holder.remData(value);
                });
            }
        });

        return this;
    };

    // Automator Prototypes.
    lazyLoader.prototype = {
        /* Configuring Automator */
        setup: function (name, value) {
            if (isString(name) && isDefined(value)) {
                Config[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    Config[name] = value;
                });
            }
        },

        /* Adding Effect Handler */
        addEffect: function(name, func) {
            if (isString(name) && isFunction(func)) {
                Config.effect[name] = func;
            } else if (isObject(name)) {
                foreach(name, function (name, func) {
                    Config.effect[name] = func;
                });
            }

            return this;
        },
        /* Getting The Kit Lists */
        list: function() {
            return Config.object;
        }
    };

    // Registering Automator including autobuild and default escape condition.
    Automator(AutomatorName, lazyLoader);
})(jQuery, jQuery.findData);
