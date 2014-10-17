/**
 * Tab Kit Automator.
 */
(function($, $d) {
    'use strict';

    var Config = {
        counter: 0,
        IDPrefix: 'tab-',

        allowReconfigure: false,

        handler: [],
        animator: {
            default: function(data) {
                /* Deactivate current tab */
                data.active.remData('tab-state').removeClass('current');

                /* Activating this tab */
                data.target.setData('tab-state', 'current').addClass('current');

                if (data.handle.length > 0) {
                    foreach(data.handle, function (handler) {
                        handler({
                            active: data.active,
                            target: data.target
                        });
                    });
                }

                return this;
            }
        }
    };

    Registry('tab-kit:config', Config, {lock: true, key: 'TAB-001'});

    /**
     * Tab Automator Kit.
     * @param object - jQuery object that hold the tab kit.
     * @return {TabKit}
     * @constructor
     */
    var TabKit = function(object) {
        !isJQuery(object) ? object = $d('tab-kit') : object;

        /* Enumerating Object to assign ID. Prevent issues when we have Tab inside Tab */
        object.each(function() {
            /* Skip if reconfigure is not allowed and tab already configured */
            if (Config.allowReconfigure === false && $(this).getData('tab-configured') === true) return;

            var index = (Config.counter + 1);
            var ta_id = (Config.IDPrefix + index);

            $(this).setData('tab-kit', ta_id);

            /* Embedding Tab ID */
            $d('tab-button', this).setData('tab-id', ta_id);
            $d('tab-content', this).setData('tab-id', ta_id);

            Config.counter++;
        });

        /* Enumerating Indexes and assigning events. */
        foreach(Config.counter, function (index) {
            var tab_id = (Config.IDPrefix + (index + 1));
            var tab_ct = $d({ 'tab-kit': tab_id });
            var tab_cs = tab_ct.getData('tab-configured');

            /* Skip if reconfigure is not allowed and tab already configured */
            if (Config.allowReconfigure === false && tab_cs === true) {
                return;
            } else if (Config.allowReconfigure === true && tab_cs === true) {
                tab_ct.setData('tab-configured', 'reconfigured');
            } else {
                tab_ct.setData('tab-configured', true);
            }

            var tab_ef = tab_ct.getData('tab-effect');

            if (!isString(tab_ef) || !Config.animator.hasOwnProperty(tab_ef)) {
                tab_ef = 'default';
            }

            /* Enumerating Buttons */
            var buttons = $d({ 'tab-button': '?', 'tab-id': tab_id }).setData('tab-effect', tab_ef);

            /* Enumerating Buttons */
            var content = $d({ 'tab-content': '?', 'tab-id': tab_id });

            /* Configuring buttons */
            buttons.each(function(idx) {
                var idx = (idx + 1);
                var stt = $(this).getData('action-state');

                $(this).setData('tab-index', idx);

                if (idx === 1) {
                    $(this).setData('tab-state', 'current').addClass('current');
                }

                if (!stt) {
                    $(this).setData('action-state', 'initialised');

                    /* Binding Action */
                    $(this).click(function() {
                        if ($(this).getData('tab-state') === 'current') return false;

                        var tab_id = $(this).getData('tab-id');
                        var tab_ix = $(this).getData('tab-index');
                        var tab_ef = $(this).getData('tab-effect');

                        var active = $(':hasdata(tab-id, ' + tab_id + '):hasdata(tab-state, current)');
                        var target = $(':hasdata(tab-id, ' + tab_id + '):hasdata(tab-index, ' + tab_ix + ')');

                        Config.animator[tab_ef]({
                            active: active,
                            target: target,
                            handle: Config.handler
                        });

                        return false;
                    });
                }
            });

            /* Configuring contents */
            content.each(function(idx) {
                var idx = (idx + 1);

                $(this).setData('tab-index', idx);

                if (idx === 1) {
                    $(this).setData('tab-state', 'current').addClass('current');
                }
            });
        });

        return this;
    };

    /* TabKit Prototype */
    TabKit.prototype = {
        /**
         * Add Callback to TabKit.
         * @param func - Javascript function that handle tab changes. We give argument {active, target}.
         * @return {TabKit}
         */
        addCallback: function(func) {
            if (isFunction(func)) {
                Config.handler.push(func);
            }

            return this;
        },

        /**
         * Add Custom Effect Handler to TabKit.
         * @param name - String the effect name. e.g: fade
         * @param func - Function that handle the effect. We give argument {active, target, handle}. You've to Execute all callback in 'handle' object after finishing effect.
         * @return {TabKit}
         */
        addEffect: function(name, func) {
            if (isString(name) && isFunction(func)) {
                Config.animator[name] = func;
            }

            return this;
        },

        /**
         * Configuring TabKit.
         * @param object - Object contains config key and value. Avaliable key: IDPrefix [default: "tab-"], allowReconfigure [default: false]
         * @return {TabKit}
         */
        setup: function(object) {
            if (isObject(object)) {
                foreach(object, function (key, value) {
                    Config[key] = value;
                });
            }

            return this;
        }
    }

    /* Registering TabKit into Automator */
    Automator('tab-kit', TabKit).autobuild(true).escape(function() {
        if (Automator('tab-kit').enabled === false) {
            return true;
        } else {
            return false;
        }
    });
})(jQuery, jQuery.findData);
