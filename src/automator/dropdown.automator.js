(function($, $$, $$$) {
    Registry('dropdown:index', 0, {lock: true, key: 'DRP-001'});
    Registry('dropdown:codes', 'dropdown-', {lock: true, key: 'DRP-001'});


    var DropDown = function(object) {
        !isJQuery(object) ? object = $$$('dropdown-kit') : object;

        return object.each(function(idx) {
            var dd_id = Registry('dropdown:codes').value + Registry('dropdown:index').value + 1;
            var dd_tp = $(this).setData('dd-id', dd_id).getData('dropdown-kit');
        });
    };
    DropDown.prototype = {
        test: function() {
            console.log(this);
        }
    };

    $$('dropdown', DropDown, true);
})(jQuery, Automator, jQuery.findData);
