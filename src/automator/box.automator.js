/**
 * Box Automator.
 */
(function($, $d) {
    'use strict';

    /* Automator Names */
    var nameof = {
        'box-ratio': 'box-ratio',
        'box-height': 'box-height',
        'box-row-height': 'box-row-height'
    }

    /**
     * Maintain aspect ratio by width.
     * @param object - Object that has attribute 'data-box-ratio'. Leave blank to scan all box.
     * @returns {BoxRatio}
     * @constructor
     */
    var BoxRatio = function(object) {
        /* Wrapping Config */
        var $cfg = this._config;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($cfg.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($cfg.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $cfg.data.Kit + ')');

        /* Enumerating Objects */
        object.each(function() {
            var box_width = $(this).width();
            var box_ratio = $(this).getData($cfg.data.Kit);
            var box_height;

            if (isArray(box_ratio) && box_ratio.length === 2) {
                box_height = Math.round((box_width / box_ratio[0]) * box_ratio[1]);

                $(this).height(box_height);
            } else if (isString(box_ratio)) {
                var ratio = box_ratio.replace(/\s+/g, '').split(':');

                if (ratio.length > 0) {
                    box_height = Math.round((box_width / ratio[0]) * ratio[1]);

                    $(this).height(box_height);
                }
            }

            if ($cfg.clean === true) {
                $(this).remData($cfg.data.Kit);
            }
        });

        return this;
    };

    /* Registering Box Ratio Automator */
    Automator(nameof['box-ratio'], BoxRatio);

    /* Adding Automator to jQuery plugin */
    $.fn.maintainRatio = function(ratio) {
        /* Wrapping Automator */
        var $atm = Automator(nameof['box-ratio']);

        /* Getting ratio */
        if (!isArray(ratio)) ratio = this.getData($atm._config.data.Kit);
        /* Registering ratio */
        if (isArray(ratio)) this.setData($atm._config.data.Kit, ratio);
        /* Building Kit */
        $atm.build(this);

        return this;
    }

    /* Box Height Maintainer */
    var BoxHeightMaintainer = function() {
        this.mode = 'capture-children';

        this.height = 0;
        this.holder = $('<div>');
        this.childs = $('<div>');

        return this;
    };

    /* Kit Prototypes */
    BoxHeightMaintainer.prototype = {
        set: function(name, value) {
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

    /**
     * Maintain Box Height.
     * @param object - jQuery object that contains child-box.
     * @constructor
     */
    var boxHeight = function(object) {
        /* Wrapping Config */
        var $cfg = this._config;

        /* Extending Config */
        $cfg.data.Child = 'box-child';

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($cfg.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($cfg.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $cfg.data.Kit + ')');

        /* Enumerating Object */
        object.each(function() {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData($cfg.data.KitID);
            if (!isString(kit_id)) {
                kit_id = $cfg.IDPrefix + ($cfg.counter + 1);

                /* Increasing Counter */
                $cfg.counter++;
            }

            /* Creating New Kit */
            var Kit = new BoxHeightMaintainer().set({
                id: kit_id,
                holder: $(this).setData($cfg.data.KitID, kit_id),
                defcfg: $cfg
            });

            /* Getting Mode */
            var mode = Kit.holder.getData($cfg.data.Kit);
            if (isString(mode)) {
                Kit.mode = mode;
            }

            /* Adding Kit into Collections */
            $cfg.maps[kit_id] = Kit;

            /* Applying ID to childrens */
            if (Kit.mode !== 'fill-parent') {
                $d($cfg.data.Child, Kit.holder).setData($cfg.data.KitID, kit_id);
            }
        });

        /* Building Kits */
        foreach($cfg.maps, function (id, kit) {
            /* Fill Parent first */
            if (kit.mode === 'fill-parent') {
                kit.holder.height(kit.holder.parent().height());
            } else {
                /* Collecting Childrens */
                var childQuery = {};

                childQuery[$cfg.data.Child] = '?';
                childQuery[$cfg.data.KitID] = id;

                kit.childs = $d(childQuery, kit.holder);

                /* Getting the highest height */
                foreach(kit.childs, function (hChild) {
                    var height = $(hChild).height();

                    if (isNumber(height)) {
                        if (height > kit.height) {
                            kit.height = height;
                        }
                    }
                });

                /* Applying Height With Specific Mode */
                if (kit.mode === 'capture-children') {
                    kit.holder.height(kit.height);
                } else if (kit.mode === 'fill-children' || kit.mode === 'sync-children') {
                    kit.childs.height(kit.height);
                }
            }

            /* Cleaning Up Data Attributes */
            if ($cfg.clean === true) {
                kit.holder.remData([
                    $cfg.data.Kit,
                    $cfg.data.KitID
                ]);
                kit.childs.remData([
                    $cfg.data.Child,
                    $cfg.data.KitID
                ]);
            }
        });

        return this;
    };

    /* Registering Automator */
    Automator(nameof['box-height'], boxHeight);

    /* Registering jQuery Plugin */
    $.fn.maintainHeight = function(mode) {
        /* Wrapping Automator */
        var $atm = Automator(nameof['box-height']);

        /* Getting Mode */
        if (!isString(mode)) mode = this.getData($atm._config.data.Kit);
        /* Registering Mode */
        if (isString(mode)) this.setData($atm._config.data.Kit, mode);
        /* Building Kit */
        $atm.build(this);

        return this;
    }

    /* Box Row Height Maintainer */
    var BoxRowHeightMaintainer = function() {
        this.column = 3;
        this.holder = $('<div>');
        this.childs = $('<div>');
        this.groups = {};

        return this;
    };

    /* Kit Prototypes */
    BoxRowHeightMaintainer.prototype = {
        set: function(name, value) {
            if (isString(name) && isDefined(value)) {
                this[name] = value;
            } else if (isObject(name)) {
                var self = this;
                foreach(name, function (name, value) {
                    self[name] = value;
                });
            }

            return this;
        }
    };

    /**
     * Maintain Box Row Height
     * @param object = jQuery object that contains child-box.
     * @returns {boxRowHeight}
     */
    var boxRowHeight = function(object) {
        /* Wrapping Config */
        var $cfg = this._config;

        /* Extending Config */
        $cfg.data.Child = 'box-row-child';
        $cfg.data.Group = 'box-row-group';

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($cfg.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($cfg.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $cfg.data.Kit + ')');

        /* Enumerating Kits */
        object.each(function() {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData($cfg.data.KitID);
            if (!isString(kit_id)) {
                kit_id = $cfg.IDPrefix + ($cfg.counter + 1);

                /* Increasing Counter */
                $cfg.counter++;
            }

            /* Creating New Kit */
            var Kit = new BoxRowHeightMaintainer().set({
                id: kit_id,
                holder: $(this).setData($cfg.data.KitID, kit_id)
            });

            /* Getting Mode */
            var column = Kit.holder.getData($cfg.data.Kit);
            if (isString(column)) {
                Kit.column = column;
            }

            /* Adding Kit into Collections */
            $cfg.maps[kit_id] = Kit;

            /* Applying ID to childrens */
            $d($cfg.data.Child, Kit.holder).setData($cfg.data.KitID, kit_id);
        });

        foreach($cfg.maps, function (id, kit) {
            /* Getting Childrens */
            var childQuery = {};

            childQuery[$cfg.data.Child] = '?';
            childQuery[$cfg.data.KitID] = id;

            kit.childs = $d(childQuery);

            /* Enumerating Childrens */
            var counts = 1;
            var groups = 1;

            foreach(kit.childs, function (hChild) {
                /* Converting to jQuery object */
                hChild = $(hChild);

                /* Resetting counter and height if reach column count */
                if (counts === (kit.column + 1)) {
                    counts = 1;
                    groups++;
                } else {
                    counts++;
                }

                /* Creating new group if not exist */
                if (!isObject(kit.groups[groups])) {
                    kit.groups[groups] = {
                        height: 0,
                        childs: []
                    };
                }

                /* Applying Group ID */
                hChild.setData($cfg.data.Group, groups);

                /* Adding item to groups */
                kit.groups[groups].childs.push(hChild);
            });

            /* Maintain Row Height in each group */
            foreach(kit.groups, function (id, group) {
                /* Getting highest height */
                foreach(group.childs, function (child) {
                    child = $(child);

                    if (child.height() > group.height) {
                        group.height = child.height();
                    }
                });

                /* Applying new height */
                foreach(group.childs, function(child) {
                    $(child).height(group.height);
                });
            });

            /* Cleaning Up Data Attributes */
            if ($cfg.clean === true) {
                kit.holder.remData([
                    $cfg.data.Kit,
                    $cfg.data.KitID
                ]);
                kit.childs.remData([
                    $cfg.data.Child,
                    $cfg.data.KitID
                ]);
            }
        });

        return this;
    };

    /* Registering Automator */
    Automator(nameof['box-row-height'], boxRowHeight);

    /* Creating jQuery Plugin */
    $.fn.maintainRowHeight = function(column) {
        /* Wrapping Automator */
        var $atm = Automator(nameof['box-row-height']);

        /* Getting Column Count */
        if (!isNumber(column)) column = this.getData($atm._config.data.Kit);
        /* Registering Column Count */
        if (isNumber(column)) this.setData($atm._config.data.Kit, column);
        /* Building Kit*/
        $atm.build(this);

        return this;
    }

    /**
     * @todo: Simplify the scripts and makes it more smart and configurable.
     */
})(jQuery, jQuery.findData);
