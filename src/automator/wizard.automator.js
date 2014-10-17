(function($, $d) {
    'use strict';

    var WizardKit = function(object) {
        !isJQuery(object) ? object = $d('wizard-kit') : object;

        object.each(function(index) {
            var wiz_id = 'wizard-' + (index + 1);

            $(this).setData('wizard-id', wiz_id);

            var defl;

            var wiz_page = $d('wizard-page', this).setData('wizard-id', wiz_id).each(function(idx) {
                var def = $(this).getData('wizard-page');
                var wiz_idx = (idx + 1);

                $(this).setData('wizard-index', wiz_idx);

                if (wiz_idx === 1) {
                    defl = this;
                    $(this).setData('wizard-state', 'on-stage').addClass('on-stage');
                }
                if (def === 'default') {
                    $(defl).remData('wizard-state').removeClass('on-stage');
                    $(this).setData('wizard-state', 'on-stage').addClass('on-stage');
                }
            });

            var wiz_next = $d('wizard-next', this).setData('wizard-id', wiz_id).click(function(e) {
                var id = $(this).getData('wizard-id');

                e.stopPropagation();

                var scroll = $d({ 'wizard-kit': '?', 'wizard-id': id }).getData('wizard-kit');

                if (isString(scroll)) {
                    $(scroll).animate({
                        scrollTop: 0
                    }, 300, function() {
                        Navigate(this, 'next');
                    });
                } else {
                    Navigate(this, 'next');
                }

                return false;
            });
            var wiz_prev = $d('wizard-prev', this).setData('wizard-id', wiz_id).click(function(e) {
                var id = $(this).getData('wizard-id');

                e.stopPropagation();

                var scroll = $d({ 'wizard-kit': '?', 'wizard-id': id }).getData('wizard-kit');

                if (isString(scroll)) {
                    $(scroll).animate({
                        scrollTop: 0
                    }, 300, function() {
                        Navigate(this, 'next');
                    });
                } else {
                    Navigate(this, 'next');
                }

                return false;
            });
        });

        return this;
    };

    var Navigate = function(object, dir) {
        var id = $(object).getData('wizard-id');

        var pages = $d({ 'wizard-page': '?', 'wizard-id': id });
        var active = pages.filter(':hasdata(wizard-state, on-stage)').remData('wizard-state').removeClass('on-stage');
        var current = active.getData('wizard-index');

        if (isNumber(current)) {
            if (dir === 'next') {
                if (current === pages.length) {
                    pages.filter(':hasdata(wizard-index, 1)').setData('wizard-state', 'on-stage').addClass('on-stage');
                } else {
                    pages.filter(':hasdata(wizard-index, ' + (current + 1) + ')').setData('wizard-state', 'on-stage').addClass('on-stage');
                }
            } else if (dir === 'prev') {
                if (current === 1) {
                    pages.filter(':hasdata(wizard-index, ' + pages.length + ')').setData('wizard-state', 'on-stage').addClass('on-stage');
                } else {
                    pages.filter(':hasdata(wizard-index, ' + (current - 1) + ')').setData('wizard-state', 'on-stage').addClass('on-stage');
                }
            }
        }
    };

    WizardKit.prototype = {
        setup: function() {
            
        }
    }

    Automator('wizard-kit', WizardKit).autobuild(true).escape(function() {
        if (Automator('wizard-kit').enabled === false) {
            return true;
        } else {
            return false;
        }
    });
})(jQuery, jQuery.findData);