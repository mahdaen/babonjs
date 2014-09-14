(function($, $$$, cons, vars, func) {
    /* Height group generator */
    func('box:generate-height-group', function(object, ceil) {
        if (isJQuery(object) && isNumber(ceil)) {
            var length = object.length;
            var group = Math.ceil(length / ceil);
            var obj_index = 0;
            
            for (var x = 1; x <= group; ++x) {
                for (var i = 0; i < ceil; ++i) {
                    var objx = object[obj_index];
                    
                    if (objx) {
                        $(objx).setData('box-height-group', 'bhg-' + x);
                    }
                    
                    obj_index += 1;
                }
            }
        }
    });
    
    /* Box ratio counter */
    func('box:count-ratio', function(width, height) {
        var getDivisor, temp, divisor;

        getDivisor = function(a, b) {
            if (b === 0) return a;
            return getDivisor(b, a % b);
        }

        if (width === height) return '1,1';

        if (+width < +height) {
            temp = width;
            width = height;
            height = temp;
        }

        divisor = getDivisor(+width, +height);

        return 'undefined' === typeof temp ? (width / divisor) + ',' + (height / divisor) : (height / divisor) + ',' + (width / divisor);
    });
})(jQuery, jQuery.findData, cons, vars, func);