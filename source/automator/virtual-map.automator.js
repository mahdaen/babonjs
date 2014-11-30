/**
 * Citraland Megah Batam.
 * Virtual Map Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 10/12/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AutomatorName = 'virtual-map';

    // Automator Core Configuration.
    var Config = {
        counter: 0,
        IDPrefix: 'virtual-map-',
        allowReconfigure: false,
        allowEscape: true,

        // Constuctor Naming.
        data: {
            // HTML Data Attributes Naming.
            Kit: 'virtual-map',
            KitID: 'virtual-map-id',
            KitConfigured: 'virtual-map-configured',
            Pin: 'virtual-map-pin',
            PinID: 'virtual-map-pin-id',
            Info: 'virtual-map-info',
            InfoDestroy: 'virtual-map-info-destroy',

            // Data State.
            PinPlaced: 'placed',
            InfoActive: 'active',
        },

        hoverDelay: 200,
        hoverDelayHandler: setTimeout(function() {}, 0),

        map: {},
        initializer: {},

        effect: {
            default: function() {
                foreach(this.pins, function (pin) {
                    var pin = $(pin);

                    setTimeout(function() {
                        $(pin).addClass(Config.data.PinPlaced);
                    }, ($(pin).getData(Config.data.PinID) * 100));
                });

                return this;
            }
        },
        viewer: {
            default: function(index) {
                this.targetInfo.addClass(Config.data.InfoActive);
            }
        },
        destroyer: {
            default: function() {
                if (this.hasOwnProperty('targetInfo')) {
                    this.targetInfo.removeClass(Config.data.InfoActive);
                }
            }
        }
    };

    var VirtualMap = function() {
        // Kit Config.
        this.config = {
            baseWidth: 0,
            baseHeight: 0,
            action: 'click',
            effect: 'default',
            destroyer: 'default',
            viewer: 'default',
            dropload: true
        };

        // Attributes Naming.
        this.cons = Config.data;

        // Kit Holder
        this.holder = $('<div>');

        return this;
    };

    VirtualMap.prototype = {
        insert: function() {

            return this;
        },
        set: function(key, value) {
            if (isString(key) && isDefined(value)) {
                this[key] = value;
            } else if (isObject(key)) {
                var self = this;

                foreach(key, function(key, value) {
                    self[key] = value;
                });
            }

            return this;
        },
        dropPins: function() {
            if (Config.effect.hasOwnProperty(this.config.effect) && isFunction(Config.effect[this.config.effect])) {
                Config.effect[this.config.effect].apply(this);
            }

            return this;
        },
        showInfo: function() {
            if (Config.viewer.hasOwnProperty(this.config.viewer) && isFunction(Config.viewer[this.config.viewer])) {
                Config.viewer[this.config.viewer].apply(this, arguments);
            }

            return this;
        },
        destroyInfo: function() {
            if (Config.destroyer.hasOwnProperty(this.config.destroyer) && isFunction(Config.destroyer[this.config.destroyer])) {
                Config.destroyer[this.config.destroyer].apply(this, arguments);
            }

            return this;
        }
    };

    /**
     * Virtual Map Automator.
     * @param object - jQuery object that contains attribute 'data-virtual-map'.
     * @constructor
     */
    var virtualMap = function (object) {
        !isJQuery(object) ? object = $d(Config.data.Kit) : object;

        // If object is jQuery object but it's not a virtual map, then use it as query context.
        if (isJQuery(object) && !object.hasData(Config.data.Kit)) object = $d(Config.data.Kit, object);

        // Initializing Map.
        object.each(function() {
            // Check if already configured and skip if not allowed.
            if (Config.allowReconfigure === false && $(this).getData(Config.data.KitConfigured) === true) return;

            // Creating Map ID if not defined.
            var map_id = $(this).getData(Config.data.KitID);
            if (!isString(map_id)) {
                map_id = Config.IDPrefix + (Config.counter + 1);

                // Applying Map ID to map holder.
                $(this).setData(Config.data.KitID, map_id);
            }

            // Creating new Map Object.
            var map = new VirtualMap().set({ holder: $(this), map_id: map_id });

            // Getting Map Config and applying config to map.
            var config = $(this).getData(Config.data.Kit);
            if (isObject(config)) {
                foreach(config, function(name, value) {
                    map.config[name] = value;
                });
            }

            // Enumerating Map Pins, Map Info, Map Info Destroyer.
            var pins = $d(Config.data.Pin, this).setData(Config.data.KitID, map_id);
            var infos = $d(Config.data.Info, this).setData(Config.data.KitID, map_id);
            var destroyers = $d(Config.data.InfoDestroy, this).setData(Config.data.KitID, map_id);

            // Adding map to collections.
            Config.map[map_id] = map;

            // Increasing Counter.
            Config.counter++;
        });

        // Reinitializing Map to prevent error if contains map inside map.
        foreach(Config.map, function (map_id, map) {
            // Checking if already configured and determine does it should be reconfigured or not.
            if (Config.allowReconfigure === false && map.holder.getData(Config.data.KitConfigured) === true) {
                return;
            } else {
                map.holder.setData(Config.data.KitConfigured, true);
            }

            // Enumerating Map Pin and Map Info to assign indexes.
            var pinQuery = {};
            pinQuery[Config.data.Pin] = '?';
            pinQuery[Config.data.KitID] = map_id;

            var pins = $d(pinQuery).each(function(idx) {
                // Applying Map Pin ID.
                $(this).setData(Config.data.PinID, (idx + 1));

                // Getting Pin Position.
                var pos = $(this).getData(Config.data.Pin);

                // Applying Pin Position.
                if (isObject(pos) && pos.hasOwnProperty('x') && pos.hasOwnProperty('y') && isNumber(pos.x) && isNumber(pos.y)) {
                    var x = ((pos.x / map.config.baseWidth) * 100);
                    var y = ((pos.y / map.config.baseHeight) * 100);

                    // Setting up pin position.
                    $(this).css({ left: x + '%', top: y + '%' });
                }

                // Binding Action.
                if (map.config.action === 'click' || map.config.action === 'mouseenter') {
                    $(this).bind(map.config.action, function(e) {
                        e.stopPropagation();

                        // Getting Map ID and Pin ID.
                        var id = $(this).getData(Config.data.KitID);
                        var ix = $(this).getData(Config.data.PinID);

                        // Getting Map Object.
                        var map_object = Automator(AutomatorName).with(id);

                        // Getting Target Info.
                        var target = map_object.infos.filter(':hasdata(' + Config.data.PinID + ', ' + ix + ')');

                        // Adding Target Info into Map Object.
                        map_object.set('targetInfo', target);

                        // Prevent hover mistakes if type of action is mouseenter using timeout. Otherwise, show the info.
                        if (map_object.config.action === 'mouseenter') {
                            Config.hoverDelayHandler = setTimeout(function() {
                                map_object.destroyInfo().showInfo(ix);
                            }, Config.hoverDelay);
                        } else {
                            map_object.destroyInfo().showInfo(ix);
                        }

                        return false;
                    });

                    if (map.config.action === 'mouseenter') {
                        $(this).mouseleave(function(e) {
                            e.stopPropagation();

                            clearTimeout(Config.hoverDelayHandler);

                            return false;
                        });
                    }
                }
            });

            // Map Info.
            var infoQuery = {};
            infoQuery[Config.data.Info] = '?'
            infoQuery[Config.data.KitID] = map_id;

            var infos = $d(infoQuery).each(function(idx) {
                // Applying Map Pin ID.
                $(this).setData(Config.data.PinID, (idx + 1));
            });

            // Binding Destroy Action.
            var destroyerQuery = {};
            destroyerQuery[Config.data.InfoDestroy] = '?';
            destroyerQuery[Config.data.KitID] = map_id;

            var destroyers = $d(destroyerQuery).click(function(e) {
                e.stopPropagation();

                var id = $(this).getData(Config.data.KitID);
                Automator(AutomatorName).with(id).destroyInfo();

                return false;
            });

            if (Config.allowEscape === true) {
                $(window).bind('keyup', function(e) {
                    if (e.keyCode === 27) {
                        Automator(AutomatorName).with(map_id).destroyInfo();
                    }
                });
            }

            // Adding Pins and Infos into Map Object.
            map.set({ pins: pins, infos: infos, destroyers: destroyers });

            // Dropping Pins.
            if (map.config.dropload === true) {
                map.dropPins();
            }

            // Calling Custom Initializer.
            foreach(Config.initializer, function(name, handler) {
                handler.apply(map);
            });
        });
    };

    virtualMap.prototype = {
        with: function(name) {
            if (isString(name) && Config.map.hasOwnProperty(name)) {
                return Config.map[name];
            }

            return this;
        },
        addInitializer: function(name, handler) {
            if (isString(name) && isFunction(handler)) {
                Config.initializer[name] = handler;
            } else if (isObject(name)) {
                foreach(name, function (name, handler) {
                    Config.initializer[name] = handler;
                });
            }

            return this;
        },
        addEffect: function(name, handler) {
            if (isString(name) && isFunction(handler)) {
                Config.effect[name] = handler;
            } else if (isObject(name)) {
                foreach(name, function (name, handler) {
                    Config.effect[name] = handler;
                });
            }

            return this;
        },
        addViewer: function(name, handler) {
            if (isString(name) && isFunction(handler)) {
                Config.viewer[name] = handler;
            } else if (isObject(name)) {
                foreach(name, function (name, handler) {
                    Config.viewer[name] = handler;
                });
            }

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
        },
        getConfig: function() {
            return Config;
        }
    };

    Automator(AutomatorName, virtualMap);
})(jQuery, jQuery.findData);
