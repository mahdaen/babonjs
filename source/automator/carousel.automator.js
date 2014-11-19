/**
 * BabonJS.
 * Carousel Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 11/17/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AutomatorName = 'carousel';

    var defData = {
        item: 'carousel-item',
        active: 'current'
    };

    // Carousel object.
    var Carousel = function () {
        this.config = {
            effect: 'default'
        };

        this.holder = $('<div>');

        return this;
    };

    // Carousel Object Prototypes.
    Carousel.prototype = {
        // Change or add Kit properties.
        set: function (name, value) {
            var $this = this;

            if (isString(name) && isDefined(value)) {
                this[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    $this[name] = value;
                });
            }

            return this;
        },
        use: function (name, value) {
            var $this = this;

            if (isString(name) && isDefined(value)) {
                this.config[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    $this.config[name] = value;
                });
            }

            return this;
        },
        move: function() {

            return this;
        }
    };

    // Automator Constructor.
    var carousel = function (object) {
        var $this = this;
        var $conf = this._config;
        var $data = this._config.data;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $data.Kit + ')');

        // Iterating Objects.
        object.each(function () {
            /* Creating Kit ID */
            var kit_id = $(this).getData($data.KitID);
            if (!isString(kit_id)) {
                kit_id = $conf.IDPrefix + ($conf.counter + 1);

                $conf.counter++;
            }

            /* Creating New Kit */
            var kit = new Carousel().set({
                $conf: $conf,
                $data: $data,

                id: kit_id,
                holder: $(this).setData($data.KitID, kit_id)
            });

            /* Finding Items */
            $this.items = $d($data.item, kit.holder).setData($data.KitID, kit_id);
        });

        return this;
    };

    // Registering Automator.
    Automator(AutomatorName, carousel);
})(jQuery, jQuery.findData);
