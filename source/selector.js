/* JQUERY DATA SELECTORS */
(function ($) {
    $.extend(jQuery.expr[':'], {
        hasattr: function(obj, idx, prop, stack) {
            if (!prop[3]) {
                return false;
            }
            var args = prop[3].replace(/\s?,\s?/, ',').split(',');
            if (args.length === 1) {
                var attrs = obj.attributes;
                if (attrs && attrs.length > 0) {
                    for (var i = 0; i < attrs.length; i++) {
                        var name = attrs[i].name;
                        if (name === args[0]) {
                            return true;
                        }
                    }
                }
                return false;
            } else if (args.length === 2) {
                var name = args[0];
                var vals = args[1];
                var oval = obj.getAttribute(name)
                if (oval) {
                    oval = oval.split(' ');
                }
                if (oval && oval.length > 0) {
                    for (var i = 0; i < oval.length; ++i) {
                        if (oval[i] === vals) {
                            return true;
                        }
                    }
                }
                return false;
            }
        },
        hasdata: function(obj, idx, prop, stack) {
            var attrs = obj.attributes;
            if (!prop[3]) {
                if (attrs && attrs.length > 0) {
                    for (var i = 0; i < attrs.length; ++i) {
                        var name = attrs[i].name;
                        if (name.search('data') > -1) {
                            return true;
                        }
                    }
                }
                return false;
            }
            
            var args = prop[3].replace(/\s?,\s?/, ',').split(',');
            if (args.length === 1) {
                if (attrs && attrs.length > 0) {
                    for (var i = 0; i < attrs.length; ++i) {
                        var name = attrs[i].name;
                        if (name === 'data-' + args[0]) {
                            return true;
                        }
                    }
                }
                return false;
            } else if (args.length === 2) {
                var name = args[0];
                var vals = args[1];
                var oval = obj.getAttribute('data-' + name)
                if (oval) {
                    oval = oval.split(' ');
                }
                if (oval && oval.length > 0) {
                    for (var i = 0; i < oval.length; ++i) {
                        if (oval[i] === vals) {
                            return true;
                        }
                    }
                }
                return false;
            }
        },
        hasname: function(obj, idx, prop, stack) {
            var attrs = obj.attributes;
            if (!prop[3]) {
                if (attrs && attrs.length > 0) {
                    for (var i = 0; i < attrs.length; ++i) {
                        var name = attrs[i].name;
                        if (name === 'name') {
                            return true;
                        }
                    }
                }
                return false;
            } else {
                if (obj.getAttribute('name') === prop[3]) return true;
                return false;
            }
        }
    });
})(jQuery);