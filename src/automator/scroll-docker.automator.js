/**
 * BabonJS.
 * ScrollDocker Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 10/29/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AutomatorName = 'scroll-docker';

    // Automator Configurations.
    var Config = {
        counter: 0,
        IDPrefix: 'scroll-docker-',
        allowReconfigure: false,
        clean: true,

        // Attributes Naming.
        data: {
            Kit: 'scroll-docker',
            KitID: 'scroll-docker-id',
            KitTrigger: 'scroll-docker-pos',
            KitState: 'scroll-docker-state',

            EnterClass: 'enter',
            LeaveClass: 'leave'
        },

        /* Object Collections */
        object: {},
        docker: {},
        dockenter: {},
        dockleave: {},

        /* Object Event Handler */
        enter: {},
        leave: {},
    };

    /* Creating Scroll Handler */
    Automator('scroll-pos').onScroll(function() {
        var wpos = window.scrollPos;

        foreach(Config.dockenter, function (pos, kit) {
            if (isNumber(wpos.y) && wpos.y >= pos) {
                if (kit.state !== Config.data.EnterClass) {
                    kit.state = Config.data.EnterClass;
                    kit.holder.setData(Config.data.KitState, Config.data.EnterClass).removeClass(Config.data.LeaveClass).addClass(Config.data.EnterClass);

                    if (Config.enter.hasOwnProperty(kit.config.handler)) {
                        Config.enter[kit.config.handler].apply(kit);
                    }
                }

                /* Get Outside */
                if (kit.config.outside === true) {
                    if (kit.state === Config.data.EnterClass) {
                        if (kit.outside !== true) {
                            if (wpos.y > kit.config.outsidepos) {
                                kit.outside = true;
                                kit.holder.toggleClass('outside');
                            }
                        } else if (kit.outside === true) {
                            if (wpos.y < kit.config.outsidepos) {
                                kit.outside = false;
                                kit.holder.toggleClass('outside');

                                if (Config.enter.hasOwnProperty(kit.config.handler)) {
                                    Config.enter[kit.config.handler].apply(kit);
                                }
                            }
                        }
                    }
                }
            }
        });
        foreach(Config.dockleave, function(pos, kit) {
            if (isNumber(wpos.y) && wpos.y <= pos) {
                if (kit.state === Config.data.EnterClass) {
                    kit.state = Config.data.LeaveClass;
                    kit.holder.setData(Config.data.KitState, Config.data.LeaveClass).removeClass(Config.data.EnterClass).addClass(Config.data.LeaveClass);

                    if (Config.leave.hasOwnProperty(kit.config.handler)) {
                        Config.leave[kit.config.handler].apply(kit);
                    }
                }
            }
        });
    });

    // ScrollDocker object.
    var ScrollDocker = function () {
        this.config = {
            handler: 'none',
            enterpos: 0,
            leavepos: 0,
            outside: true,
            outsidepos: 0
        };

        this.id = '';
        this.state = 'ready';
        this.holder = $('<div>');

        return this;
    };

    // ScrollDocker Object Prototypes.
    ScrollDocker.prototype = {
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
    var scrollDocker = function (object) {
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

            /* Creating new Kit and asign ID */
            var Kit = new ScrollDocker().set({ 'id': kit_id, holder: $(this).setData(Config.data.KitID, kit_id) });

            /* Adding Kit to Collections */
            Config.object[kit_id] = Kit;

            /* Getting Configuration */
            var config = $(this).getData(Config.data.Kit);
            if (isObject(config)) {
                foreach(config, function (name, value) {
                    if (name === 'enterpos' || name === 'leavepos') {
                        if (isString(value)) {
                            if (value.search('%') > -1) {
                                value = Number(value.replace('%', ''));
                                value = (value / 100 * window.innerHeight);
                            } else {
                                value = Number(value);
                            }
                        }
                    }
                    Kit.config[name] = value;
                });
                if (!config.hasOwnProperty('leavepos')) {
                    Kit.config.leavepos = Kit.config.enterpos;
                }
            }

            /* Registering Docker to Scroll Handler */
            var kit_top = Kit.holder.offset().top;

            var dc_pos_etr = (kit_top - Kit.config.enterpos);
            var dc_pos_lve = (kit_top - Kit.config.leavepos);

            /* Configuring Outside Area */
            if (Kit.config.outside === true) {
                Kit.config.outsidepos = (dc_pos_etr + Kit.config.enterpos);
            }

            /* Writing Trigger Pos */
            Kit.holder.setData(Config.data.KitTrigger, { enter: dc_pos_etr, leave: dc_pos_lve });

            /* Registering Docker */
            Config.dockenter[dc_pos_etr] = Kit;
            Config.dockleave[dc_pos_lve] = Kit;

            /* Cleanup Data Tag */
            if (Config.clean === true) {
                foreach(Config.data, function(key, value) {
                    Kit.holder.remData(value);
                });
            }
        });

        return this;
    };

    // Automator Prototypes.
    scrollDocker.prototype = {
        addEnter: function(name, func) {
            if (isString(name) && isFunction(func)) {
                Config.enter[name] = func;
            } else if (isObject(name)) {
                foreach(name, function (name, func) {
                    Config.enter[name] = func;
                });
            }

            return this;
        },
        addLeave: function(name, func) {
            if (isString(name) && isFunction(func)) {
                Config.leave[name] = func;
            } else if (isObject(name)) {
                foreach(name, function (name, func) {
                    Config.leave[name] = func;
                });
            }

            return this;
        },

        // Configuring Automator.
        setup: function (name, value) {
            if (isString(name) && isDefined(value)) {
                Config[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    Config[name] = value;
                });
            } else {
                return Config;
            }

            return this;
        },
        config: function(name, value) {
            if (isString(name) && isDefined(value)) {
                Config.data[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    Config.data[name] = value;
                });
            } else {
                return Config.data;
            }

            return this;
        },

        // Selecting Kit Object by KitID.
        with: function (name) {
            if (Config.object.hasOwnProperty(name)) {
                return Config.object[name];
            }
        },
    };

    // Registering Automator including autobuild and default escape condition.
    Automator(AutomatorName, scrollDocker);
})(jQuery, jQuery.findData);
