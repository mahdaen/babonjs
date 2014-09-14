/* TAB KITS */
(function($, $$, $$$) {
    /* Tabbed List Kit */
    var TabList = function(object) {
        !isJQuery(object) ? object = $$$('kit', 'tabbed-list') : object;

        return object.each(function(idx) {
            var tab_id = '#' + (idx + 1);

            $(this).setData('tab-id', tab_id);
            var parent = this;

            var buttons = $$$('kit', 'tab-button', this);
            var content = $$$('kit', 'tab-content', this);

            var mode = $(this).getData('tab-mode');
            if (!mode) {
                mode = 'click';
            }

            buttons.each(function(idx) {
                var ctn_id = '#' + (idx + 1);

                $(this).setData({
                    'tab-id': tab_id,
                    'tab-content-id': ctn_id
                });

                if (ctn_id === '#1') {
                    $(this).setData('tab-state', 'active').addClass('active');
                }

                if (mode === 'click') {
                    $(this).click(function() {

                    });
                } else if (mode === 'hover') {
                    $(this).hover(function() {
                        var tab_id = $(this).getData('tab-id');
                        var tgn_id = $(this).getData('tab-content-id');

                        /* Deactivating all tabs */
                        $$$({
                            'tab-state': 'active'
                        }, parent).remData('tab-state').removeClass('active').css('z-index', 0);

                        /* Activating Target Tab */
                        $$$({
                            'tab-content-id': tgn_id
                        }, parent).setData('tab-state', 'active').addClass('active').css('z-index', 1);
                    });
                }
            });

            content.each(function(idx) {
                var ctn_id = '#' + (idx + 1);

                $(this).setData({
                    'tab-id': tab_id,
                    'tab-content-id': ctn_id
                });

                if (ctn_id === '#1') {
                    $(this).setData('tab-state', 'active').addClass('active');
                }
            });
        });
    };

    /* Registering Kit */
    $$.builder('tabbed-list', TabList);
})(jQuery, BabonKit, jQuery.findData);