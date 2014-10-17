(function($, $d) {
    'use strict';

    var Config = {
        counter: 0,
        IDPrefix: 'dropdown-',

        allowReconfigure: false,

        animator: {
            /**
             * Default Dropdown showing effect.
             * @param data
             */
            default: function(data) {
                if (data.state === 'down') {
                    data.parent.remData('toggle-state').removeClass('down');
                    data.button.remData('toggle-state').removeClass('down');
                    data.list.remData('toggle-state').removeClass('down');
                } else if (data.state === 'up') {
                    Automator('toggle-state-destroyer').build(false);

                    data.parent.setData('toggle-state', 'down').addClass('down');
                    data.button.setData('toggle-state', 'down').addClass('down');
                    data.list.setData('toggle-state', 'down').addClass('down');
                }
            }
        },
        handler: {
            default: function (data) {
                data.active.setData('dropdown-item', 'ready').removeClass('current');
                data.target.setData('dropdown-item', 'current').addClass('current');

                data.label.html(data.target.html());
            }
        }
    };

    var DropDown = function(object) {
        !isJQuery(object) ? object = $d('dropdown-kit') : object;

        object.each(function() {
            if (Config.allowReconfigure === false && $(this).getData('dropdown-configured') === true) {
                return;
            } else {
                $(this).setData('dropdown-configured', true);
            }

            var index = (Config.counter + 1);
            var dd_id = (Config.IDPrefix + index);

            var dd_tp = $(this).setData('dropdown-id', dd_id).getData('dropdown-kit');

            var button = $d('dropdown-button', this).setData('dropdown-id', dd_id);
            var list = $d('dropdown-list', this).setData('dropdown-id', dd_id);

            if (dd_tp === 'select') {
                var label = $d('dropdown-label', this).setData('dropdown-id', dd_id);
                var first;

                var items = $d('dropdown-item', this).setData('dropdown-id', dd_id).each(function(idx) {
                    var isCur = $(this).getData('dropdown-item');

                    if (idx === 0) {
                        label.html($(this).html());
                        $(this).setData('dropdown-item', 'current').addClass('current');

                        first = this;
                    }

                    if (isCur === 'current') {
                        label.html($(this).html());
                        $(this).addClass('current');

                        $(first).setData('dropdown-item', 'ready').removeClass('current');
                    }

                    $(this).click(function(e) {
                        e.stopPropagation();

                        /* Toggling the dropdown */
                        Automator('toggle-state-destroyer').build(false);

                        /* Skip if already active */
                        if ($(this).getData('dropdown-item') === 'current') return false;

                        var dd_id = $(this).getData('dropdown-id');

                        var target = $(this);
                        var parent = $d({ 'dropdown-kit': '?', 'dropdown-id': dd_id });

                        var onselect = parent.getData('dropdown-onselect');

                        var active = $d({ 'dropdown-item': 'current', 'dropdown-id': dd_id }, parent);

                        var label = $d({ 'dropdown-label': '?', 'dropdown-id': dd_id }, parent);
                        var button = $d({ 'dropdown-button': '?', 'dropdown-id': dd_id }, parent);
                        var list = $d({ 'dropdown-list': '?', 'dropdown-id': dd_id }, parent);

                        Config.handler.default({
                            target: target,
                            active: active,
                            label: label,

                            button: button,
                            parent: parent,
                            list: list
                        });

                        if (isString(onselect) && Config.handler.hasOwnProperty(onselect)) {
                            Config.handler[onselect]({
                                target: target,
                                active: active,
                                label: label,

                                button: button,
                                parent: parent,
                                list: list
                            });
                        }

                        return false;
                    });
                });
            }

            Config.counter++;

            button.click(function(e) {
                e.stopPropagation();

                var dd_id = $(this).getData('dropdown-id');
                var state = $(this).getData('toggle-state');
                var effect = $(this).getData('dropdown-effect');

                if (!state) {
                    state = 'up';
                }

                var parent = $d({ 'dropdown-kit': '?', 'dropdown-id': dd_id });
                var button = $d({ 'dropdown-button': '?', 'dropdown-id': dd_id }, parent);
                var list = $d({ 'dropdown-list': '?', 'dropdown-id': dd_id }, parent);

                if (!isString(effect) || !Config.animator.hasOwnProperty(effect)) {
                    effect = 'default';
                }

                Config.animator[effect]({
                    state: state,
                    parent: parent,
                    button: button,
                    list: list
                });

                return false;
            });
        });

        return this;
    };

    DropDown.prototype = {
        setup: function(object) {
            if (isObject(object)) {
                foreach(object, function (key, value) {
                    Config[key] = value;
                });
            }

            return this;
        },
        addEffect: function(name, func) {
            if (isString(name) && isFunction(func)) {
                Config.animator[name] = func;
            }

            return this;
        },
        addHandler: function(name, func) {
            if (isString(name) && isFunction(func)) {
                Config.handler[name] = func;
            }

            return this;
        }
    }

    Automator('dropdown-kit', DropDown).autobuild(true).escape(function() {
        if (Automator('dropdown-kit').enabled === false) {
            return true;
        } else {
            return false
        }
    });
})(jQuery, jQuery.findData);
