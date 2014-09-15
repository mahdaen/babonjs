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
                    this.name = name;
                    this.func = builder;

                    this.auto = false;
                    this.dont = [];

                    AutomatorMaps.automator[name] = this;

                    if (isBoolean(auto)) {
                        this.auto = auto;

                        if (auto === true) {
                            AutomatorMaps.prebuilds.push(name);
                        }
                    }
                } else {
                    /* Escape when error happens */
                    return console.error('Can not create automator "' + name + '" with ' + typeof builder + ' as a builder.');
                }
            } else {
                /* Continue selecting automator if no builder */
                if (AutomatorMaps.automator[name]) {
                    return AutomatorMaps.automator[name];
                } else {
                    /* Escape when error happens */
                    return console.error('Can not get automator "' + name + '" of undefined.');
                }
            }
        }

        return this;
    };

    /* Creating the Automator Prototypes */
    Automator.prototype = {
        /**
         * Automator Builder.
         * @param * {optional} - Build parameters is unlimited. They will be passed to the builder function.
         * @returns {Automator}
         */
        build: function() {
            /* Check the escape collection before build */
            if (this.dont.length > 0) {
                for (var i = 0; i <= this.dont.length; ++i) {
                    /* If some filter return true, then escape the build */
                    if (isFunction(this.dont[i]) && this.dont[i]() === true) {
                        return this;
                    }
                }
                /* Call the builder with forwarding arguments */
                this.func(arguments);
            } else {
                /* Call the builder with forwarding arguments */
                this.func(arguments);
            }

            return this;
        },

        /**
         * Removing Automator.
         * @returns {undefined}
         */
        remove: function() {
            delete AutomatorMaps.automator[this.name];
            return undefined;
        },

        /**
         * Register Build Filter.
         * @param args {function:required} - Function that will be called to determine whether the automator should be builded or not. Function should return true or false.
         * @param args {array} - Array contains filter function.
         * @returns {Automator}
         */
        escape: function(args) {
            if (isFunction(args)) {
                this.dont.push(args);
            } else if (isArray(args)) {
                var parent = this;

                foreach(args, function (func) {
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
            var idx = AutomatorMaps.prebuilds.indexOf(this.name);

            if (bool === false && idx > -1) {
                    AutomatorMaps.prebuilds[idx] = undefined;
            } else if (bool === true && idx === -1) {
                AutomatorMaps.prebuilds.push(this.name);
            }

            this.auto = bool;
            return this;
        },

        /**
         * Check whether the automator is enabled or disabled. No parameters needed.
         * @returns {boolean}
         */
        enabled: function() {
            var idx = AutomatorMaps.disableds.indexOf(this.name);

            if (idx > -1) {
                return false;
            } else {
                return true;
            }
        }
    };

    /* Binding auto-builder to the window on-ready */
    $(document).ready(function() {
        foreach(AutomatorMaps.prebuilds, function (name) {
            if (isString(name) && Automator(name)) {
                Automator(name).build();
            }
        });
    });

    /**
     * Automator Generator Wrapper
     * @param name
     * @param builder
     * @param auto
     * @returns {Automator}
     */
    var automator = function(name, builder, auto) { return new Automator(name, builder, auto); };

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
        }

        return name;
    };

    return automator;
}));
