(function($, $d) {
    'use strict';

    var Config = {
        counter: 0,
        groups: 0,

        active: 'down',
        effect: 'default',
        hover: false,
        IDPrefix: 'accordion-',
        closeOthers: true,

        effectHandler: {
            classic: function(data) {
                var button = data.button,
                    content = data.content;

                if (data.hasOwnProperty('recent')) {
                    var all_button = data.recent.buttons;
                    var all_content = data.recent.contents;

                    all_button.removeClass(Config.active);
                    all_content.removeClass(Config.active);
                }

                button.toggleClass(Config.active);
                content.toggleClass(Config.active);

                return data;
            },
            default: function(data) {
                var button = data.button,
                    content = data.content;

                if (data.hasOwnProperty('recent')) {
                    var all_button = data.recent.buttons;
                    var all_content = data.recent.contents;

                    all_button.removeClass(Config.active);
                    all_content.slideUp();
                }

                button.toggleClass(Config.active);
                content.slideToggle();

                return data;
            }
        }
    };

    Registry('accordion-kit:config', Config, {lock: true, key: 'ACC-001'});

    /**
     * Simple Accordion Kit.
     * @param object
     * @constructor
     */
    var AccordionKit = function(object) {
        !isJQuery(object) ? object = $d('accordion-kit') : object;

        object.each(function () {
            var index = (Config.counter + 1);
            var ac_id = (Config.IDPrefix + index);

            $(this).setData('accordion-kit', ac_id);

            var content = $d('accordion-content', this).setData('accordion-id', ac_id);
            var buttons = $d('accordion-button', this).setData('accordion-id', ac_id)

            buttons.each(function() {
                var ac_st = $(this).getData('accordion-action');

                if (ac_st !== 'initialised') {
                    $(this).setData('accordion-action', 'initialised');

                    $(this).click(function(e) {
                        e.stopPropagation();

                        /* Getting Accordion ID and Group ID */
                        var ac_id = $(this).getData('accordion-id');
                        var ac_gp = $(this).getData('accordion-group-id');

                        /* Getting Current Button and Content */
                        var button = $(this);
                        var content = $d({ 'accordion-content': '?', 'accordion-id': ac_id });

                        /* Getting Handler Name */
                        var model = $d({ 'accordion-kit': ac_id }).getData('accordion-effect');

                        if (!isString(model)) {
                            model = Config.effect;
                        }

                        /* Getting Handler Function */
                        var handler = Config.effectHandler.classic;
                        if (Config.effectHandler.hasOwnProperty(model)) {
                            handler = Config.effectHandler[model];
                        }

                        /* Determine whether grouped or not */
                        if (isString(ac_gp) && Config.closeOthers === true && $(this).hasClass(Config.active) === false) {
                            /* If grouped, getting the recents active accordion */
                            var ct_all = $d({ 'accordion-content': '?', 'accordion-group-id': ac_gp });
                            var bt_all = $d({ 'accordion-button': '?', 'accordion-group-id': ac_gp });

                            handler({
                                button: button,
                                content: content,
                                recent: {
                                    buttons: bt_all,
                                    contents: ct_all
                                }
                            });
                        } else {
                            handler({
                                button: button,
                                content: content
                            });
                        }

                        return false;
                    });

                    if (Config.hover === true) {
                        $(this).mouseenter(function() {
                            $(this).click();
                        });
                    }
                }
            });

            Config.counter++;
        });

        return this;
    };
    AccordionKit.prototype = {
        setup: function(option) {
            if (isObject(option)) {
                foreach(option, function(key, value) {
                    Config[key] = value;
                });
            }

            return this;
        },
        addEffectHanlder: function(name, func) {
            if (isString(name) && isFunction(func)) {
                Config.effectHandler[name] = func;
            }

            return this;
        }
    };

    var AccordionGroup = function(object) {
        !isJQuery(object) ? object = $d('accordion-group') : object;

        object.each(function() {
            var index = (Config.groups + 1);
            var gp_id = (Config.IDPrefix + 'group-' + index);

            $(this).setData('accordion-group', gp_id);

            $(':hasdata(accordion-kit), :hasdata(accordion-button), :hasdata(accordion-content)', this).setData('accordion-group-id', gp_id);

            Config.groups++;
        });
    };

    Automator('accordion-kit', AccordionKit).autobuild(true).escape(function() {
        if (Automator('accordion-kit').enabled === false) {
            return true;
        } else {
            return false;
        }
    });

    Automator('accordion-group', AccordionGroup).autobuild(true).escape(function() {
        if (Automator('accordion-group').enabled === false) {
            return true;
        } else {
            return false;
        }
    });
})(jQuery, jQuery.findData);
