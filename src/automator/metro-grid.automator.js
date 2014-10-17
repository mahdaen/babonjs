(function($, $d) {
    'use strict';

    var Config = {

    };

    var MetroGrid = function(object) {

    };
    MetroGrid.prototype = {

    };

    Automator('metro-grid', MetroGrid).autobuild(true).escape(function() {
        if (Automator('metro-grid').enabled === false) {
            return true;
        } else {
            return false;
        }
    });
})(jQuery, jQuery.findData);