/**
 * Box Automator.
 */
(function($, $d) {
    'use strict';

    /**
     * Maintain aspect ratio by width.
     * @param object - Object that has attribute 'data-box-ratio'. Leave blank to scan all box.
     * @returns {BoxRatio}
     * @constructor
     */
    var BoxRatio = function(object) {
        !isJQuery(object) ? object = $d('box-ratio') : object;

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

    /* Registering Box Ratio Automator */
    Automator('box-maintain-ratio', BoxRatio).autobuild(true).escape(function() {
        if (Automator('box-maintain-ratio').enabled === false) {
            return true;
        } else {
            return false;
        }
    });
    /* Adding Automator to jQuery plugin */
    $.fn.maintainRatio = function() {
        Automator('box-maintain-ratio').build(this);

        return this;
    }

    /**
     * Maintain Box Height.
     * @param object - jQuery object that contains child-box.
     * @constructor
     */
    var BoxHeight = function(object) {
        !isJQuery(object) ? object = $d('box-height') : object;

        object.each(function(idx) {
            var parent_height = 0;
            var mode = $(this).getData('box-height');

            var box_parent = $(this).getData('box-parent');

            if (!box_parent) box_parent = 'box-' + (idx + 1);
            $(this).setData('box-parent', box_parent);

            var child_box = $d('box-child', this);
            child_box.setData('box-parent', box_parent);

            child_box = $d({
                'box-child': '?',
                'box-parent': box_parent
            });

            foreach(child_box, function(obj, i) {
                var ch = $(obj).height();

                if (ch > parent_height) {
                    parent_height = ch;
                }
            });

            if (mode === 'capture-children' && parent_height > 0) {
                $(this).height(parent_height);
            } else if (mode === 'fill-children' && parent_height > 0) {
                child_box.height(parent_height);
            }
        });

        return this;
    };

    Automator('box-maintain-height', BoxHeight).autobuild(true).escape(function() {
        if (Automator('box-maintain-height').enabled === false) {
            return true;
        } else {
            return false;
        }
    });
    $.fn.maintainHeight = function() {
        Automator('box-maintain-height').build(this);

        return this;
    }

    /**
     * Maintain box height by row group.
     * @param object - jQuery object thats hold box.
     * @returns {BoxHeightGroup}
     * @constructor
     */
    var BoxHeightGroup = function(object) {
        !isJQuery(object) ? object = $d('box-height-group') : object;

        var groups = [];
        /* Indexing Groups */
        foreach(object, function(dom) {
            var groupId = $(dom).getData('box-height-group');
            if (groupId && groups.indexOf(groupId) < 0) {
                groups.push(groupId);
            }
        });

        /* Parsing Groups */
        foreach(groups, function(groupId) {
            var grouped_object = $d('box-height-group', groupId);

            if (grouped_object) {
                var high = 0, height;

                foreach(grouped_object, function(dom) {
                    if ($(dom).height() > high) {
                        high = $(dom).height();
                    }
                });

                if (high > 0) {
                    grouped_object.height(high);
                }
            }
        });

        return this;
    };

    Automator('box-maintain-height-group', BoxHeightGroup).autobuild(true).escape(function() {
        if (Automator('box-maintain-height-group').enabled === false) {
            return true;
        } else {
            return false;
        }
    });
    $.fn.maintainHeightGroup = function() {
        Automator('box-maintain-height-group').build(this);

        return this;
    }
})(jQuery, jQuery.findData);

