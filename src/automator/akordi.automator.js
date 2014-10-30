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

    // Automator Configurations.
    var Config = {
        counter: 0,
        IDPrefix: 'accordion-',
        allowReconfigure: false,

        // Attributes Naming.
        data: {
            Kit: 'accordion',
            KitID: 'accordion-id',
            KitState: 'ac-item-state'
        },

        /* Kit Collections */
        object: {},

        /* Effect Collections */
        effect: {}
    };

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
        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d(Config.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d(Config.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + Config.data.Kit + ')');

        // Iterating Objects.
        object.each(function () {

        });

        return this;
    };

    // Automator Prototypes.
    contentStack.prototype = {
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

        // Selecting Kit Object by KitID.
        with: function (name) {
            if (Config.object.hasOwnProperty(name)) {
                return Config.object[name];
            }
        },
    };

    // Registering Automator including autobuild and default escape condition.
    Automator(AutomatorName, contentStack);
})(jQuery, jQuery.findData);
