/**
 * BabonJS.
 * Grid Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 11/18/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AutomatorName = 'grid';

    var defData = {
        column: 'grid-col',
        wrapper: 'grid-wrap'
    };

    // Grid object.
    var Grid = function () {
        this.config = {
            width: false,

            column: 12,
            gutter: 10,

            gutterpos: 'left',

            pull: true,
            wrap: true,
            format: '%'
        };

        this.holder = $('<div>');

        this.wrapper = $('<div>');
        this.columns = $('<div>');

        this.width = 0;
        this.colWidth = 0;
        this.gutWidth = 0;

        return this;
    };

    // Grid Object Prototypes.
    Grid.prototype = {
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
    };

    // Automator Constructor.
    var grid = function (object) {
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
            var kit = new Grid().set({
                $conf: $conf,
                $data: $data,

                id: kit_id,
                holder: $(this).setData($data.KitID, kit_id)
            });

            /* Getting Config */
            var config = $(this).getData($data.Kit);
            if (isObject(config)) {
                kit.use(config);
            }

            /* Getting Wrapper */
            kit.wrapper = $d($data.wrapper, kit.holder).setData($data.KitID, kit_id);
            kit.columns = $d($data.column, kit.holder).setData($data.KitID, kit_id);

            /* Counting Dimensions */
            if (!kit.config.width) {
                kit.config.width = kit.holder.width();
            }

            var gut_size = ((kit.config.gutter / kit.config.width) * 100);
            var col_size = ((100 / kit.config.column) - gut_size);
            var own_size = (100 + gut_size);

            /* Exporting Dimensions */
            if (kit.config.format === 'px') {
                kit.width = Math.round((own_size / 100) * kit.config.width);
                kit.colWidth = Math.round((col_size / 100) * kit.config.width);
                kit.gutWidth = Math.round((gut_size / 100) * kit.config.width);
            } else if (kit.config.format === '%') {
                kit.width = Math.round(own_size);
                kit.colWidth = Math.round(col_size);
                kit.gutWidth = Math.round(gut_size);
            }

            /* Adding to map */
            $conf.maps[kit_id] = kit;
        });

        /* Re Enumerating Kit */
        foreach($conf.maps, function (id, kit) {
            /* Filtering wrapper and items to ensure the ID is correct */
            kit.wrapper = kit.wrapper.filter(':hasdata(' + $data.KitID + ', ' + id  + ')')

            /* Set the wrapper width and margin to pull */
            if (kit.config.wrap) {
                kit.wrapper.css({
                    width: (kit.width + kit.config.format)
                });
            }
            if (kit.config.pull && kit.gutWidth > 0) {
                kit.wrapper.css('margin-' + kit.config.gutterpos, ('-' + kit.gutWidth + kit.config.format));
            }

            /* Get corrected column and set the column width and margin as gutter */
            kit.columns = kit.columns.filter(':hasdata(' + $data.KitID + ', ' + id  + ')').each(function() {
                var col = $(this).getData($data.column);

                if (isNumber(col)) {
                    var width = ((kit.colWidth * col) + (kit.gutWidth * (col - 1)));

                    $(this).css('width', (width + kit.config.format));

                    if (kit.gutWidth > 0) {
                        $(this).css('margin-' + kit.config.gutterpos, (kit.gutWidth + kit.config.format))
                    }
                }

                if ($(this).hasData('box-ratio')) {
                    $(this).css('height', '').maintainRatio();
                }
            });

            /* Cleaning Up Data Attribute */
            if ($conf.clean || !Automator.debug) {
                kit.holder.remData([$data.Kit, $data.KitID]);
                kit.wrapper.remData([$data.wrapper, $data.KitID]);
                kit.columns.remData([$data.column, $data.KitID]);
            }
        });

        return this;
    };

    // Registering Automator.
    Automator(AutomatorName, grid).config(defData);
})(jQuery, jQuery.findData);
