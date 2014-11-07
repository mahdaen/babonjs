(function($, $d) {
    'use strict';

    var AutomatorName = 'toggle-state-destroy';

    /**
     * Data toggle state remover. Remove 'down' state and 'down' class from object that have 'data-state' attrubute.
     * @param init - Use `false` as init for custom run to prevent double event on toggle-state-destroy element.
     * @return {Automator}
     */
    var DownStateDestroyer = function(init) {
        var $this = this;
        var $conf = this._config;
        var $data = $conf.data;

        if (init === false) {
            $d($data.Toggle).remData($data.Toggle).removeClass($conf.active);
        } else {
            $d($data.Kit).each(function() {
                $(this).click(function(e) {
                    e.stopPropagation();

                    $d($data.Toggle).remData($data.Toggle).removeClass($conf.active);

                    return false;
                });

                if ($conf.clean === true || !Automator.debug) {
                    $(this).remData($data.Kit);
                }
            });
        }

        return this;
    };

    Automator(AutomatorName, DownStateDestroyer).setup('active', 'down').config({
        Toggle: 'toggle-state'
    });
})(jQuery, jQuery.findData);
