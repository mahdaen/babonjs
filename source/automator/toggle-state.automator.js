(function($, $d) {
    'use strict';

    var AutomatorName = 'toggle-collapse';

    /**
     * Help automator that has `collapse` function to collapse them when clicking on free areas.
     * @return {Automator}
     */
    var DownStateDestroyer = function() {
        var $this = this;
        var $conf = this._config;
        var $data = $conf.data;

        var obj = $d($data.Kit).each(function() {
            $(this).click(function() {
                $this.collapse();

                return true;
            });
        });

        if ($conf.clean || !Automator.debug) {
            obj.remData($data.Kit);
        }

        return this;
    };

    DownStateDestroyer.prototype = {
        register: function(toggler) {
            var $this = this;

            if (isObject(toggler)) {
                $this._config.toggler.push(toggler);
            }

            return this;
        },
        collapse: function() {
            var $this = this;

            foreach($this._config.toggler, function (toggler) {
                if (toggler.collapse) {
                    toggler.collapse(arguments);
                }
            });

            return this;
        }
    }

    Automator(AutomatorName, DownStateDestroyer).setup('toggler', []);
})(jQuery, jQuery.findData);
