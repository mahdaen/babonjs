/* MENU KITS */
(function($, $$, $$$) {
    /* Mega Menu Kit */
    window.__megaworker = {};
    $$.builder('menu:mega-menu', function(object) {
        !isJQuery(object) ? object = $$$('mega-menu') : object;

        return object.each(function() {
            var mn_id = $(this).getData('mega-menu');

            $(this).mouseenter(function() {
                if (window.__megaworker[mn_id]) {
                    clearTimeout(window.__megaworker[mn_id]);
                }

                window.__megaworker.active = mn_id;

                /* Hiding All Mega Menu */
                $(':hasdata(mega-menu), :hasdata(mega-menu-id)').remData('menu-state').removeClass('show');

                /* Showing Target */
                $(':hasdata(mega-menu, ' + mn_id + '), :hasdata(mega-menu-id, ' + mn_id + ')').addClass('show');
            }).mouseleave(function() {
                window.__megaworker[mn_id] = setTimeout(function() {
                    /* Hiding All Mega Menu */
                    $(':hasdata(mega-menu), :hasdata(mega-menu-id)').removeClass('show');
                }, 300);
            });

            $$$('mega-menu-id', mn_id).mouseenter(function() {
                if (window.__megaworker[mn_id]) {
                    clearTimeout(window.__megaworker[mn_id]);
                }
            }).mouseleave(function() {
                window.__megaworker[mn_id] = setTimeout(function() {
                    /* Hiding All Mega Menu */
                    $(':hasdata(mega-menu), :hasdata(mega-menu-id)').removeClass('show');
                }, 300);
            });
        });
    });
})(jQuery, BabonKit, jQuery.findData);