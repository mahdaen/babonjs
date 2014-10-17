/**
 * Kit Automator.
 * Automaticaly Build Dynamic Content.
 * @credits - Created by Nanang Mahdaen El Agung.
 */

(function(automator) {
    if (typeof exports === 'object') {
        /* NodeJS */
        module.exports = automator();
    } else if (typeof define === 'function' && define.amd) {
        /* RequireJS */
        define(automator);
    } else {
        /* Browser */
        window.Automator = automator();
    }
}(function() {
    /* Escape when no jQuery defined */
    if (typeof jQuery === 'undefined') return console.error('BabonKit requires: jQuery 1.10+ and Enquire!');

    /* Defining jQuery Shortname */
    var $ = jQuery;

    /* Defining Automator Maps */
    var AutomatorMaps =  {
        automator: {},
        prebuilds: [],
        disableds: []
    };

    /**
     * Automator Generator Wrapper
     * @param name
     * @param builder
     * @param auto
     * @returns {Automator}
     */
    var automator = function(name, builder, auto) { return new Automator(name, builder, auto); };

    /**
     * Automator Generator.
     * @param name {string:required} - Name of the automator.
     * @param builder {function:conditional} - Function that will be called. Required when creating automator.
     * @param auto {optional} - Determine whether the automator will be automaticaly builded when document is ready. Ensure your builder accepting no-params build since we build the automator without parameters.
     * @constructor
     */
    var Automator = function(name, builder, auto) {
        /* Continue the script only when the type of name is string */
        if (isString(name)) {
            /* Continue creating automator when builder is defined */
            if (isDefined(builder)) {
                /* Continue creating automator when type of builder is function */
                if (isFunction(builder)) {
                    var Automator = function() {
                        this._constructor = function(){};
                        this._constructor.id = name;
                        this._constructor.func = builder;

                        this.auto = true;
                        this.dont = [];
                        this._constructor.hand = {};

                        this._constructor.type = 'automator';

                        /* Reconfiguring Autobuild if defined and adding to Autobuild map */
                        if (isBoolean(auto)) {
                            this.auto = auto;
                        }

                        if (this.auto === true) {
                            AutomatorMaps.prebuilds.push(name);
                        }

                        return this;
                    };

                    Automator.prototype = {};

                    /* Adding Default Prototypes */
                    foreach(defaultModules, function(name, func) {
                        Automator.prototype[name] = func;
                    });

                    /* Adding Builder Prototypes */
                    foreach(builder.prototype, function(name, func) {
                        Automator.prototype[name] = func;
                    });

                    /* Adding new automator to map */
                    AutomatorMaps.automator[name] = new Automator();

                    /* Updating Automator Lists */
                    automator.list = Object.keys(AutomatorMaps.automator);

                    return AutomatorMaps.automator[name];
                } else {
                    /* Escape when error happens */
                    console.warn('Can\'t create automator "' + name + '" with ' + typeof builder + ' as a builder.');
                    return false;
                }
            } else {
                /* Continue selecting automator if no builder */
                if (isAutomator(AutomatorMaps.automator[name])) {
                    return AutomatorMaps.automator[name];
                } else {
                    /* Escape when error happens */
                    console.warn('Automator "' + name + '" undefined.');
                    return false;
                }
            }
        }

        return this;
    };

    /* Creating the Automator Prototypes */
    var defaultModules = {
        /**
         * Automator Builder.
         * @param * {optional} - Build parameters is unlimited. They will be passed to the builder function.
         * @returns {Automator}
         */
        build: function() {
            /* Escape if disabled */
            if (this.enabled() === false) return this;

            /* Check the escape collection before build */
            if (this.dont.length > 0) {
                for (var i = 0; i <= this.dont.length; ++i) {
                    /* If some filter return true, then escape the build */
                    if (isFunction(this.dont[i]) && this.dont[i]() === true) {
                        return this;
                    }
                }
                /* Call the builder with forwarding arguments */
                return this._constructor.func.apply(this, arguments);
            } else {
                /* Call the builder with forwarding arguments */
                return this._constructor.func.apply(this, arguments);
            }

            return this;
        },

        /**
         * Removing Automator.
         * @returns {undefined}
         */
        remove: function() {
            /* Deleting automator from map */
            if (isAutomator(this._constructor.id)) {
                delete AutomatorMaps.automator[this._constructor.id];

                /* Updating automator list */
                return automator.list = Object.keys(AutomatorMaps.automator);
            }

            return this;
        },

        /**
         * Register Build Filter.
         * @param args {function:required} - Function that will be called to determine whether the automator should be builded or not. Function should return true or false.
         * @param args {array} - Array contains filter function.
         * @returns {Automator}
         */
        escape: function(args) {
            if (isFunction(args)) {
                /* Push new escape handler to automator */
                this.dont.push(args);
            } else if (isArray(args)) {
                /* Iterate escape handler list if args is array */
                var parent = this;

                foreach(args, function (func) {
                    /* Proceed Only if func is function */
                    if (isFunction(func)) {
                        parent.dont.push(func);
                    }
                });
            }

            return this;
        },

        /**
         * Change the automator auto mode.
         * @param bool {boolean:required} - If false, the current automatic state will be removed. If true, the automator will be added to the auto-build lists.
         * @returns {Automator}
         */
        autobuild: function(bool) {
            var idx = AutomatorMaps.prebuilds.indexOf(this._constructor.id);

            if (bool === false && idx > -1) {
                    AutomatorMaps.prebuilds[idx] = undefined;
            } else if (bool === true && idx === -1) {
                AutomatorMaps.prebuilds.push(this._constructor.id);
            } else if (bool === true && idx > -1) {
                AutomatorMaps.prebuilds[idx] = this._constructor.id;
            }

            this.auto = bool;
            return this;
        },

        /**
         * Check whether the automator is enabled or disabled. No parameters needed.
         * @returns {boolean}
         */
        enabled: function() {
            var idx = AutomatorMaps.disableds.indexOf(this._constructor.id);

            if (idx > -1) {
                return false;
            } else {
                return true;
            }
        },

        /**
         * Binding custom callback to automator.
         * @param name
         * @param func
         * @returns {Automator}
         */
        bind: function(name, func) {
            if (isString(name) && isFunction(func)) {
                this._constructor.hand[name] = func;
            }

            return this;
        },

        /**
         * Remove custom callback.
         * @param name
         * @returns {Automator}
         */
        unbind: function(name) {
            if (isString(name) && isFunction(this._constructor.hand[name])) {
                delete this._constructor.hand[name];
            }

            return this;
        },

        /**
         * Call the callbacks.
         * @param parent - The object that will be applied to callbacks.
         * @returns {Automator}
         */
        forward: function(parent) {
            foreach(this._constructor.hand, function(name, func) {
                if (isObject(parent)) {
                    func.apply(parent);
                } else {
                    func();
                }
            });

            return this;
        }
    };
    automator.module = Automator.prototype = defaultModules;

    /* Binding auto-builder to the window on-ready */
    $(document).ready(function() {
        foreach(AutomatorMaps.prebuilds, function (name) {
            if (isString(name) && AutomatorMaps.prebuilds.indexOf(name) !== -1) {
                Automator(name).build();
            }
        });
    });

    /**
     * Disabling automator.
     * @param name {string} - Name of automator that will be disabled.
     * @returns {*}
     */
    automator.disable = function(name) {
        if (isString(name)) {
            if (AutomatorMaps.disableds.indexOf(name) === -1) {
                AutomatorMaps.disableds.push(name);
            }
        } else if (isArray(name)) {
            foreach(name, function (obj) {
                automator.disable(obj);
            });
        }

        return name;
    };

    /**
     * Enabling automator.
     * @param name {string} - Name of automator that will be enabled.
     * @returns {*}
     */
    automator.enable = function(name) {
        if (isString(name)) {
            var idx = AutomatorMaps.disableds.indexOf(name);

            if (idx > -1) {
                AutomatorMaps.disableds[idx] = undefined;
            }
        } else if (isArray(name)) {
            foreach(name, function (obj) {
                automator.enable(obj);
            });
        }

        return name;
    };

    /**
     * Get the list of automators.
     * @returns {Array}
     */
    automator.list = Object.keys(AutomatorMaps.automator);
    automator.maps = AutomatorMaps;

    /**
     * Core Automator Generator. Use it when you want to create automator and need to add your own prototypes.
     * @type {Automator}
     */
    automator.core = Automator;

    return automator;
}));
