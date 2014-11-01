/**
 * Box Automator.
 */
(function($, $d) {
    'use strict';

    var Config = {
        'box-ratio': {
            name: 'box-ratio',

            clean: false,

            data: {
                Kit: 'box-ratio',
                KitID: 'box-ratio-id'
            }
        },
        'box-height': {
            name: 'box-height',

            counter: 0,
            IDPrefix: 'box-height-',
            clean: false,

            data: {
                Kit: 'box-height',
                KitID: 'box-height-id',
                Child: 'box-child'
            },

            object: {}
        },
        'box-row-height': {
            name: 'box-row-height',

            IDPrefix: 'box-row-',
            counter: 0,
            clean: false,

            data: {
                Kit: 'box-row-height',
                KitID: 'box-row-height-id',
                Child: 'box-row-child',
                Group: 'box-row-group'
            },

            object: {}
        }
    }

    /**
     * Maintain aspect ratio by width.
     * @param object - Object that has attribute 'data-box-ratio'. Leave blank to scan all box.
     * @returns {BoxRatio}
     * @constructor
     */
    var BoxRatio = function(object) {
        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d(Config['box-ratio'].data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d(Config['box-ratio'].data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + Config['box-ratio'].data.Kit + ')');

        /* Enumerating Objects */
        object.each(function() {
            var box_width = $(this).width();
            var box_ratio = $(this).getData('box-ratio');
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
        });

        return this;
    };

    BoxRatio.prototype = {
        setup: function(name, value) {
            if (isString(name) && isDefined(value)) {
                Config['box-ratio'][name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    Config['box-ratio'][name] = value;
                });
            }

            return this;
        },
        config: function(name, value) {
            if (isString(name) && isDefined(value)) {
                Config['box-ratio'].data[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    Config['box-ratio'].data[name] = value;
                });
            }

            return this;
        }
    }

    /* Registering Box Ratio Automator */
    Automator(Config['box-ratio'].name, BoxRatio);

    /* Adding Automator to jQuery plugin */
    $.fn.maintainRatio = function() {
        Automator(Config['box-ratio'].name).build(this);
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
        build: function() {
            var kit = this, id = this.id;

            /* Fill Parent first */
            if (kit.mode === 'fill-parent') {
                kit.holder.height(kit.holder.parent().height());
            } else {
                /* Collecting Childrens */
                var childQuery = {};

                childQuery[Config['box-height'].data.Child] = '?';
                childQuery[Config['box-height'].data.KitID] = id;

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
            if (Config['box-height'].clean === true) {
                kit.holder.remData([
                    Config['box-height'].data.Kit,
                    Config['box-height'].data.KitID
                ]);
                kit.childs.remData([
                    Config['box-height'].data.Child,
                    Config['box-height'].data.KitID
                ]);
            }

            return this;
        }
    };

    /**
     * Maintain Box Height.
     * @param object - jQuery object that contains child-box.
     * @constructor
     */
    var boxHeight = function(object) {
        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d(Config['box-height'].data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d(Config['box-height'].data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + Config['box-height'].data.Kit + ')');

        /* Enumerating Object */
        object.each(function() {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData(Config['box-height'].data.KitID);
            if (!isString(kit_id)) {
                kit_id = Config['box-height'].IDPrefix + (Config['box-height'].counter + 1);

                /* Increasing Counter */
                Config['box-height'].counter++;
            }

            /* Creating New Kit */
            var Kit = new BoxHeightMaintainer().set({
                id: kit_id,
                holder: $(this).setData(Config['box-height'].data.KitID, kit_id)
            });

            /* Getting Mode */
            var mode = Kit.holder.getData(Config['box-height'].data.Kit);
            if (isString(mode)) {
                Kit.mode = mode;
            }

            /* Adding Kit into Collections */
            Config['box-height'].object[kit_id] = Kit;

            /* Applying ID to childrens */
            if (Kit.mode !== 'fill-parent') {
                $d(Config['box-height'].data.Child, Kit.holder).setData(Config['box-height'].data.KitID, kit_id);
            }
        });

        /* Building Kits */
        foreach(Config['box-height'].object, function (id, kit) {
            kit.build();
        });

        return this;
    };

    boxHeight.prototype = {
        setup: function(name, value) {
            if (isString(name) && isDefined(value)) {
                Config['box-height'][name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    Config['box-height'][name] = value;
                });
            } else {
                return Config['box-height'];
            }
        },
        config: function(name, value) {
            if (isString(name) && isDefined(value)) {
                Config['box-height'].data[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    Config['box-height'].data[name] = value;
                });
            } else {
                return Config['box-height'].data;
            }
        },
        list: function () {
            return Config['box-height'].object;
        },
        with: function(id) {
            if (isString(id) && Config['box-height'].object.hasOwnProperty(id)) {
                return Config['box-height'].object[id];
            } else {
                console.warn('Box Height Maintener "' + id + '" undefined!');
            }
        }
    }

    /* Registering Automator */
    Automator(Config['box-height'].name, boxHeight);

    /* Registering jQuery Plugin */
    $.fn.maintainHeight = function(mode) {
        Automator(Config['box-height'].name).build(this);

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
        },
        build: function() {
            var kit = this, id = this.id;

            /* Getting Childrens */
            var childQuery = {};

            childQuery[Config['box-row-height'].data.Child] = '?';
            childQuery[Config['box-row-height'].data.KitID] = id;

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
                hChild.setData(Config['box-row-height'].data.Group, groups);

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
            if (Config['box-row-height'].clean === true) {
                kit.holder.remData([
                    Config['box-row-height'].data.Kit,
                    Config['box-row-height'].data.KitID
                ]);
                kit.childs.remData([
                    Config['box-row-height'].data.Child,
                    Config['box-row-height'].data.KitID
                ]);
            }
        }
    };

    var boxRowHeight = function(object) {
        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d(Config['box-row-height'].data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d(Config['box-row-height'].data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + Config['box-row-height'].data.Kit + ')');

        /* Enumerating Kits */
        object.each(function() {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData(Config['box-row-height'].data.KitID);
            if (!isString(kit_id)) {
                kit_id = Config['box-row-height'].IDPrefix + (Config['box-row-height'].counter + 1);

                /* Increasing Counter */
                Config['box-row-height'].counter++;
            }

            /* Creating New Kit */
            var Kit = new BoxRowHeightMaintainer().set({
                id: kit_id,
                holder: $(this).setData(Config['box-row-height'].data.KitID, kit_id)
            });

            /* Getting Mode */
            var column = Kit.holder.getData(Config['box-row-height'].data.Kit);
            if (isString(column)) {
                Kit.column = column;
            }

            /* Adding Kit into Collections */
            Config['box-row-height'].object[kit_id] = Kit;

            /* Applying ID to childrens */
            $d(Config['box-row-height'].data.Child, Kit.holder).setData(Config['box-row-height'].data.KitID, kit_id);
        });

        foreach(Config['box-row-height'].object, function (id, kit) {
            kit.build();
        });

        return this;
    };

    boxRowHeight.prototype = {
        setup: function(name, value) {
            if (isString(name) && isDefined(value)) {
                Config['box-row-height'][name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    Config['box-row-height'][name] = value;
                });
            } else {
                return Config['box-row-height'];
            }
        },
        config: function(name, value) {
            if (isString(name) && isDefined(value)) {
                Config['box-row-height'].data[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    Config['box-row-height'].data[name] = value;
                });
            } else {
                return Config['box-row-height'].data;
            }
        },
        list: function () {
            return Config['box-row-height'].object;
        },
        with: function(id) {
            if (isString(id) && Config['box-row-height'].object.hasOwnProperty(id)) {
                return Config['box-row-height'].object[id];
            } else {
                console.warn('Box Height Maintener "' + id + '" undefined!');
            }
        }
    };

    /* Registering Automator */
    Automator(Config['box-row-height'].name, boxRowHeight);

    /* Creating jQuery Plugin */
    $.fn.maintainRowHeight = function() {
        Automator(Config['box-row-height'].name).build(this);

        return this;
    }
})(jQuery, jQuery.findData);

