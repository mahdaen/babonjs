/**
 * BabonJS.
 * ContentStack Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 10/30/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AutomatorName = 'accordion';

    // ContentStack object.
    var ContentStack = function () {
        this.config = {
            effect: 'default'
        };
        this.holder = $('<div>');

        return this;
    };

    // ContentStack Object Prototypes.
    ContentStack.prototype = {
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
    var contentStack = function (object) {
        /* Wrapping Config */
        var $cfg = this._config;

        /* Extending Config */
        $cfg.data.KitState = 'ac-item-state';
        $cfg.effect = {};

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($cfg.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($cfg.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $cfg.data.Kit + ')');

        // Iterating Objects.
        object.each(function () {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData($cfg.data.KitID);
            if (!isString(kit_id)) {
                kit_id = $cfg.IDPrefix + ($cfg.counter + 1);

                /* Increasing counter */
                $cfg.counter++;
            }

            /* Creating new Kit */
            var Kit = new ContentStack().set({
                id: kit_id,
                holder: $(this).setData($cfg.data.KitID, kit_id)
            });
        });

        return this;
    };

    // Registering Automator including autobuild and default escape condition.
    Automator(AutomatorName, contentStack);
})(jQuery, jQuery.findData);
