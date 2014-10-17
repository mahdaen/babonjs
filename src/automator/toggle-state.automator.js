(function($, $d) {
    'use strict';
    var Config = {
        active: 'down'
    };

    /**
     * Data toggle state remover. Remove 'down' state and 'down' class from object that have 'data-state' attrubute.
     * @param init - Use `false` as init for custom run to prevent double event on toggle-state-destroy element.
     * @return {Automator}
     */
    var DownStateDestroyer = function(init) {
        if (init === false) {
            $d('toggle-state').remData('toggle-state').removeClass(Config.active);
        } else {
            $d('toggle-state-destroy').each(function() {
                $(this).click(function(e) {
                    e.stopPropagation();

                    $d('toggle-state').remData('toggle-state').removeClass(Config.active);
                }).setData('toggle-state-destroy', 'initialized');
            });
        }

        return this;
    };
    DownStateDestroyer.prototype = {
        setup: function(obj) {
            if (isObject(obj)) {
                foreach(obj, function (key, value) {
                    Config[key] = value;
                });
            }

            return this;
        }
    }
    Automator('toggle-state-destroyer', DownStateDestroyer).autobuild(true).escape(function() {
        if (Automator('toggle-state-destroyer').enabled() === false) {
            return true;
        } else {
            return false;
        }
    });
})(jQuery, jQuery.findData);
