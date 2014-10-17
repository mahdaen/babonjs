(function($, $d) {
    'use strict';

    var Config = {
        counter: 0,
        IDPrefix: 'editable-',
        handler: {}
    };

    /**
     * Content Editable Automator.
     * @param object -  Object that has content editable and button.
     * @constructor
     */
    var EditableKit = function(object) {
        !isJQuery(object) ? object = $d('editable-kit') : object;

        object.each(function() {
            var index = (Config.counter + 1);
            var ea_id = (Config.IDPrefix + index);

            var content = $d('editable-content', this).setData('editable-id', ea_id);
            var buttons = $d('editable-button', this).setData('editable-id', ea_id);

            buttons.click(function(e) {
                e.stopPropagation();

                var state = $(this).getData('editable-state');
                var ea_id = $(this).getData('editable-id');

                var edits = $d({ 'editable-content': '?', 'editable-id': ea_id });

                if (state === 'editing') {
                    $(this).setData('editable-state', 'ready');
                    edits.attr('contenteditable', false);

                    var hasHand = Object.keys(Config.handler);

                    if (hasHand.length > 0) {
                        foreach(Config.handler, function (name, func) {
                            func({ button: $(this), content: edits });
                        });
                    }
                } else {
                    $(this).setData('editable-state', 'editing');
                    edits.attr('contenteditable', true);
                }
            });

            Config.counter++;
        });
    };

    EditableKit.prototype = {
        afterEdit: function(name, func) {
            if (isString(name) && isFunction(func)) {
                Config.handler[name] = func;
            }

            return this;
        },
        setup: function(object) {
            if (isObject(object)) {
                foreach(object, function (name, value) {
                    Config[name] = value;
                });
            }

            return this;
        }
    };

    Automator('editable-kit', EditableKit).autobuild(true).escape(function() {
        if (Automator('editable-kit').enabled === false) {
            return true;
        } else {
            return false;
        }
    });
})(jQuery, jQuery.findData);