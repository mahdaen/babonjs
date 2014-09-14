/* ACCORDION KITS */
(function($, $$, $$$) {
    /* Accordion Kit */
    $$.builder('accordion', function(object) {
        !isJQuery(object) ? object = $$$('kit', 'accordion') : object;

        return object.each(function(idx) {
            var acc_id = '#' + (idx + 1);
            var parent = $(this).setData('acc-id', acc_id);

            /* Assigning Accordion ID to handler */
            $(':hasdata(kit, accordion-item), :hasdata(kit, accordion-button), :hasdata(kit, accordion-content)', this).setData('acc-id', acc_id);

            /* Indexing Items */
            $$$('kit', 'accordion-item', this).each(function(itd) {
                var it_id = '#' + (itd + 1);
                var items = $(this).setData('acc-item-id', it_id);

                $(':hasdata(kit, accordion-button), :hasdata(kit, accordion-content)', this).setData('acc-item-id', it_id);

                /* Activating first item */
                if (it_id === '#1') {
                    $(this).setData('acc-state', 'active').addClass('active');
                    $$$({'kit': 'accordion-button', 'acc-item-id': it_id, 'acc-id': acc_id}).setData('acc-state', 'active');
                }
            });

            /* Enabling Button */
            $$$('kit', 'accordion-button', this).click(function() {
                var ac_id = $(this).getData('acc-id');
                var it_id = $(this).getData('acc-item-id');

                var it_st = $(this).getData('acc-state');

                if (it_st) {
                    return false;
                }

                /* Hiding Active Item */
                $$$({
                    'kit': 'accordion-item',
                    'acc-id': ac_id,
                    'acc-state': 'active'
                }).each(function() {
                    var pra = $(this).remData('acc-state');

                    /* Sliding Up Content */
                    $$$('kit', 'accordion-content', this).slideUp(400, function() {
                        pra.removeClass('active');
                    });
                });
                $$$({
                    'kit': 'accordion-button',
                    'acc-id': ac_id,
                    'acc-state': 'active'
                }).remData('acc-state');

                /* Showing Target Item */
                $(this).setData('acc-state', 'active');
                $$$({
                    'kit': 'accordion-item',
                    'acc-id': ac_id,
                    'acc-item-id': it_id
                }).each(function() {
                    var prt = $(this).setData('acc-state', 'active');

                    /* Sliding Up Content */
                    $$$('kit', 'accordion-content', this).slideDown(400, function() {
                        prt.addClass('active');

                        var st_tp = $(this).offset();
                        if (st_tp && st_tp.top) {
                            $('body, html').animate({
                                scrollTop: (st_tp.top - 50)
                            }, 600);
                        }
                    });
                });
            });
        });
    });
})(jQuery, BabonKit, jQuery.findData);