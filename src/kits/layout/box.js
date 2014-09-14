/* BOX KITS */
(function($, $$, $$$) {
    /* PUBLIC BUILDER */
    /* Box Ratio Maintainer */
    $$.builder('box:ratio', function(object) {
        !isJQuery(object) ? object = $$$('box-ratio') : object;
        
        return object.each(function() {
            var box_width = $(this).width();
            var box_ratio = $(this).getData('box-ratio');
            var box_height;

            if (isArray(box_ratio) && box_ratio.length === 2) {
                box_height = Math.round((box_width / box_ratio[0]) * box_ratio[1]);

                $(this).height(box_height);
            }
        });
    });
    $.fn.maintainRatio = function() {
        return $$.build('box:ratio')(this);
    }
    
    /* Dynamic Height */
    $$.builder('box:height', function(object) {
        !isJQuery(object) ? object = $$$('box-height') : object;
        
        return object.each(function(idx) {
            var parent_height = 0;
            var mode = $(this).getData('box-height');
            
            var box_parent = $(this).getData('box-parent');
            if (!box_parent) box_parent = 'box-' + (idx + 1);
            $(this).setData('box-parent', box_parent);
            
            var child_box = $$$('box-child', this);
            child_box.setData('box-parent', box_parent);
            child_box = $$$({
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
    });
    $$.builder('box:height-group', function(object) {
        !isJQuery(object) ? object = $$$('box-height-group') : object;
        
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
            var grouped_object = $$$('box-height-group', groupId);
            
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
        
        return object;
    });
})(jQuery, BabonKit, jQuery.findData);