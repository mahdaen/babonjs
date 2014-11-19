/**
 * BabonJS
 * Just another Javascript library.
 * Created by Nanang Mahdaen El Aung
 * © 2014 BabonKit. All right reserved.
 *
 * External libraries:
 * jQuery, Enquire.
 *
 * Browser Support:
 * All modern browser (IE9+).
 */

/* Ensure jQuery and Enquire is loaded */
if (typeof jQuery === 'undefined' || typeof enquire === 'undefined') {
    throw new Error('BabonJS requires jQuery and Enquire!');
}

/* EXTENDING NATIVE FUNCTIONS */
(function() {
    /**
     * Window object extender.
     * @param obj {object:required} - Object contains key and value to be added to window object.
     * @private
     */
    var Extend = function (obj) {
        if (typeof obj === 'object' && obj.indexOf === undefined) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    window[key] = obj[key];
                }
            }
        }
    };

    /**
     * Check whether object is defined or not, whether the object is match with type.
     * @param obj {*} - Object that will be checked. Use these functions for checking arguments only.
     * @returns {boolean}
     */
    window.isDefined = function(obj) {
        return typeof obj !== 'undefined' ? true : false;
    };
    window.isString = function(obj) {
        return typeof obj === 'string' ? true : false;
    };
    window.isObject = function(obj) {
        return typeof obj === 'object' && obj.indexOf === undefined && obj.splice === undefined ? true : false;
    };
    window.isArray = function(obj) {
        return typeof obj === 'object' && Array.isArray(obj) && !window.isJQuery(obj) ? true : false;
    };
    window.isFunction = function(obj) {
        return typeof obj === 'function' ? true : false;
    };
    window.isNumber = function(obj) {
        return typeof obj === 'number' ? true : false;
    };
    window.isBoolean = function(obj) {
        return typeof obj === 'boolean' ? true : false;
    };

    /* DOM Type */
    window.isJQuery = function(obj) {
        return typeof obj === 'object' && obj.hasOwnProperty('length') && obj.jquery ? true : false;
    };
    window.isAutomator = function(obj) {
        return typeof obj === 'object' && obj._constructor.type === 'automator' ? true : false;
    };
    window.isGenerator = function(obj) {
        return typeof obj === 'object' && obj._constructor.type == 'generator' ? true : false;
    };
    window.isHTML = function(obj) {
        return typeof obj === 'object' && obj.ELEMENT_NODE ? true : false;
    };

    /* String Type */
    window.isColor = function(obj) {
        return /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/.test(obj) ? true : false;
    };
    window.isURL = function(obj) {
        return /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i.test(obj) ? true : false;
    };
    window.isEmail = function(obj) {
        return /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i.test(obj) ? true : false;
    };
    window.isDate = function(obj) {
        return !window.isNaN(new Date(obj).getDate()) ? true : false;
    };

    /**
     * Foreach loop for both object and array.
     * @param object {object:required} - Obejct that will pe parsed.
     * @param func {funtion:required} - Function that will be called in each loop. For array, we give "value" and "index" as arguments. For object, we give "key" and "value" as arguments.
     * @returns {object itself}
     */
    window.foreach = function(object, func) {
        if (isFunction(func)) {
            if (isArray(object) || isJQuery(object) && isFunction(func)) {
                for (var i = 0; i < object.length; ++i) {
                    func(object[i], i);
                }
            } else if (isObject(object) && isFunction(func)) {
                for (var key in object) {
                    if (object.hasOwnProperty(key)) {
                        func(key, object[key]);
                    }
                }
            } else if (isNumber(object) && isFunction(func)) {
                for (var i = 1; i <= object; ++i) {
                    func(i);
                }
            } else if (isString(object) && isFunction(func)) {
                for (var i = 0; i < object.length; ++i) {
                    func(object.charAt(i), (i + 1));
                }
            } else {
                return console.error('Invalid arguments!');
            }
        }

        return object;
    };

    /**
     * RegExp String Replace.
     * @param string - String Source.
     * @param pattern - RegEx Pattern.
     * @param replace - Replace String. Use '$i' to reuse the original string. E.g: pregReplace("opacity: 1", /[a-z]+/g, '-webkit-$i');
     * @returns {*}
     */
    window.pregReplace = function (string, pattern, replace) {
        var match = string.match(pattern),
            newstring, replaced, candidate;

        if (match) {
            newstring = string;

            for (var i = 1; i <= match.length; ++i) {
                var cur = match[i - 1];

                if (typeof cur === 'string') {
                    candidate = /\$i/g;
                    replaced = replace.replace(candidate, match[i - 1]);
                    newstring = newstring.replace(match[i - 1], replaced);
                }
            }

            return newstring;
        }

        return string;
    };

    /**
     * Extract url path.
     * @param url {string:required} - URL string that will be extracted.
     * @returns {{root: string, name: string, ext: string}}
     */
    window.parseURL = function(url) {
        if (isString(url)) {
            var splited = url.split('/'),
                first = '',
                paths = '',
                files = '',
                exten = '';

            foreach(splited, function(value, index) {
                if (index === 0 && value === '/') {
                    first = '/';
                }
                if (index === (splited.length - 1)) {
                    files = value;
                } else {
                    paths = paths + value + '/';
                }
            });

            if (files !== '') {
                var ef = files.split('.'),
                    en = '',
                    ex = '';

                foreach(ef, function(value, index) {
                    if (index === (ef.length - 1)) {
                        ex = value;
                    } else {
                        en = en + value;
                        if (index !== ef.length - 2) {
                            en = en + '.';
                        }
                    }
                });

                files = en;
                exten = ex;
            }

            return {
                root: paths,
                name: files,
                ext: exten
            };
        }
    };
    window.splitURL = window.parseURL;

    Extend({ __extend__: Extend });
})();

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
/* BABONKIT JQUERY PLUGINS */
(function ($) {
    'use strict';

    // Box Ratio Counter.
    var countRatio = function (width, height) {
        var getDivisor, temp, divisor;

        getDivisor = function(a, b) {
            if (b === 0) return a;
            return getDivisor(b, a % b);
        }

        if (width === height) return '1,1';

        if (+width < +height) {
            temp = width;
            width = height;
            height = temp;
        }

        divisor = getDivisor(+width, +height);

        return 'undefined' === typeof temp ? (width / divisor) + ',' + (height / divisor) : (height / divisor) + ',' + (width / divisor);
    };

    /* DATA KITS */
    $.fn.hasAttr = function(name) {
        if (this.length < 1) return false;

        var obj = this[0];
        var atr = obj.attributes;
        
        if (isString(name)) {
            if (!atr[name]) return false;
        } else if (isArray(name)) {
            for (var i = 0; i < name.length; ++i) {
                if (!atr[name[i]]) return false;
            }
        }
        
        return true;
    };
    $.fn.hasData = function(name) {
        if (isString(name)) {
            return this.hasAttr('data-' + name);
        } else if (isArray(name)) {
            for (var i = 0; i < name.length; ++i) {
                name[i] = 'data-' + name[i];
            }
            
            return this.hasAttr(name);
        }
    };
    $.fn.getData = function(name) {
        if (isString(name)) {
            var data = this.attr('data-' + name);

            if (data) {
                if (data.search(/(\:)/) > -1 && data.search(/\(/)){
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        try {
                            eval('data = {' + data + '}');
                        } catch (e) {
                            try {
                                eval('data = ' + data);
                            } catch (e) {
                                try {
                                    data = eval(data);
                                } catch (e) {}
                            }
                        }
                    }
                } else if (data.search(',') > -1) {
                    data = data.replace(/\s?,\s?/g, ',').split(',');

                    if (data.length) {
                        for (var d = 0; d < data.length; d++) {
                            var now = data[d];
                            if (Number(now)) {
                                data[d] = Number(now);
                            } else if (now === 'true') {
                                data[d] = true;
                            } else if (now === 'false') {
                                data[d] = false;
                            }
                        }
                    }
                } else if (Number(data)) {
                    data = Number(data);
                } else if (data === 'true') {
                    data = true;
                } else if (data === 'false') {
                    data = false;
                }
            }

            return data;
        } else if (Array.isArray(name)) {
            var data = {};

            for (var x = 0; x < name.length; ++x) {
                var vals = this.getData(name[x]);

                if (vals) {
                    data[name[x]] = vals;
                }
            }

            return data;
        } else {
            var data = {};
            var attr = this[0].attributes;

            for (var a = 0; a < attr.length; ++a) {
                var name = attr[a].name;

                if (name.search('data-') > -1) {
                    name = name.replace('data-', '');

                    var vals = this.getData(name);

                    data[name] = vals;
                }
            }

            return data;
        }
    };
    $.fn.setData = function(name, value) {
        if (isString(name) && value) {
            if (isObject(value)) {
                if (!isArray(value)) {
                    value = JSON.stringify(value);
                } else {
                    value = value.toString();
                }
            }

            this.attr('data-' + name, value);
        } else if (isObject(name)) {
            for (var key in name) {
                if (name.hasOwnProperty(key)) {
                    var val = name[key];
                    if (isObject(val)) {
                        if (!isArray(val)) {
                            val = JSON.stringify(val);
                        } else {
                            val = val.toString();
                        }
                    }

                    this.attr('data-' + key, val);
                }
            }
        };

        return this;
    };
    $.fn.appendData = function(name, value) {
        if (isString(name) && value) {
            for (var x = 0; x < this.length; ++x) {
                var obj = $(this[x]);
                var att = obj.getData(name);

                if (att && !isObject(att)) {
                    obj.setData(name, att + ' ' + value);
                } else {
                    obj.setData(name, value);
                }
            }
        } else if (isObject(name)) {
            var obj = this;
            foreach(name, function(name, value) {
                obj.appendData(name, value);
            });
        }

        return this;
    };
    $.fn.remData = function(name) {
        if (isString(name)) {
            this.removeAttr('data-' + name);
        } else if (isArray(name)) {
            var obj = this;
            foreach(name, function(value) {
                obj.removeAttr('data-' + value);
            });
        }

        return this;
    };
    
    /* GET CENTER POSITION OF ELEMENT */
    $.fn.offsets = function() {
        var offset = this.offset();
        var width = this.width();
        var height = this.height();

        offset.width = width;
        offset.height = height;
        
        var wdt = offset.width / 2;
        var hgt = offset.height / 2;
        var p_top = offset.top + hgt;
        var p_lft = offset.left + wdt;
        
        offset.center = {
            top: Math.round(p_top),
            left: Math.round(p_lft)
        };

        return offset;
    }
    $.fn.center = function() {
        var ofs = this.offsets();
        var wdt = ofs.width / 2;
        var hgt = ofs.height / 2;

        var p_top = ofs.top + hgt;
        var p_lft = ofs.left + wdt;

        return {
            top: Math.round(p_top),
            left: Math.round(p_lft)
        }
    };
    $.fn.boxRatio = function() {
        this.each(function() {
            var ratio = $(this).getData('box-ratio');

            if (!ratio) {
                var width = $(this).width();
                var height = $(this).height();

                ratio = countRatio(width, height).split(',');

                $(this).setData('box-ratio', ratio);
            }
        });

        return this.getData('box-ratio');
    };
    $.fn.direction = function() {
        if (this.length < 1) {
            return this;
        } else if (this.length === 1) {
            var offset = this.offsets();
            if (offset.width > offset.height) {
                this.addClass('landscape').removeClass('portrait');
                return 'landscape';
            } else {
                this.addClass('portrait').removeClass('landscape');
                return 'portrait';
            }
        } else {
            this.each(function() {
                $(this).direction();
            });
        }
        
        return this;
    };
    $.fn.orientation = $.fn.direction;

    // Css Object Getter.
    $.fn.style = function() {
        if (this.length >= 1) {
            var origin = this.get(0).style;
            var styles = {};

            for(var prop in origin) {
                if (origin.hasOwnProperty(prop)) {
                    if (origin[prop] !== '' && origin[prop] !== null && prop !== 'cssText') {
                        if (prop.search(/[\d]/) === -1) {
                            styles[prop] = origin[prop];
                        }
                    }
                }
            }

            return styles;
        } else {
            return undefined;
        }
    };

    // Create Selection.
    $.fn.focusTo = function(start, end) {
        return this.each(function() {
            if (this.setSelectionRange) {
                this.focus();
                this.setSelectionRange(start, end);
            } else if (this.createTextRange) {
                var range = this.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        });
    };

})(jQuery);

/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.12
 *
 * Requires: jQuery 1.2.2+
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));

/* Native Tools */
(function() {
    var Tools = {};
    
    /* Tool collections. */
    Tools.variables = {};
    Tools.constants = {};
    Tools.functions = {};

    /* Variable setter/getter. */
    Tools.vars = function(name, value) {
        if (name) {
            if (value) {
                return Tools.variables[name] = value;
            } else {
                if (Tools.variables[name]) {
                    return Tools.variables[name];
                }
            }
        }
    };
    
    /* Constant setter/getter. */
    Tools.cons = function(name, value) {
        if (name) {
            if (value) {
                if (isFunction(value)) return console.warn("You can't register function as a constant. Please use func() rather than cons().");
                if (Tools.constants[name]) return console.warn('Constant "' + name + '" alerady registered.');
                return Tools.constants[name] = value;
            } else {
                return Tools.constants[name];
            }
        }
    };
    
    /* Protected function setter/getter */
    Tools.func = function (name, func) {
        if (isString(name)) {
            if (isFunction(func)) {
                if (Tools.functions[name]) return console.warn('Function "' + name + '" alerady registered.');
                Tools.functions[name] = func;
                
                return Tools.functions[name];
            } else {
                return Tools.functions[name];
            }
        }
    };

    /* Prototype Maker */
    Tools.proto = function(name, proto_name, func) {
        if (isString(name) && isFunction(Tools.functions[name]) && isString(proto_name) && isFunction(func)) {
            Tools.functions[name].prototype[proto_name] = func;
            return Tools.functions[name];
        }
    };
    
    /* Registering BabonKit to window */
    __extend__({
        cons: Tools.cons,
        vars: Tools.vars,
        func: Tools.func,
        proto: Tools.proto,
        __tools__: function() {
            return {
                vars: Tools.variables,
                cons: Tools.constants,
                func: Tools.functions
            };
        }
    });
})();
/* DOM DATA ATTRIBUTE FILTERS. */
(function($) {
    var DataFinder = function(name, value, from) {
        /* If name is string, then pass single query */
        if (isString(name)) {
            var arName = name.replace(/\s/g, '').split(','), query = '';

            /* If value is defined and not object or array, then pass query with value. */
            if (isString(value) || isNumber(value) || isBoolean(value)) {
                if (arName.length > 1) {
                    foreach(arName, function(name) {
                        query += ':hasdata(' + name + ', ' + value + '),';
                    });

                    query = query.replace(/\,$/, '');
                } else {
                    query = ':hasdata(' + name + ', ' + value + ')';
                }

                /* If from is jquery object or html object, then pass query with value and context */
                if (isJQuery(from) || isHTML(from)) {
                    return $(query, from);
                }
                /* Else if no form defined, then pass query without context */
                else {
                    return $(query);
                }
            }
            /* If value is jquery object or html element, then pass query wihtout value but has a context */
            else if (isJQuery(value) || isHTML(value)) {
                if (arName.length > 1) {
                    foreach(arName, function(name) {
                        query += ':hasdata(' + name + '),';
                    });

                    query = query.replace(/\,$/, '');
                } else {
                    query = ':hasdata(' + name + ')';
                }

                return $(query, value);
            }
            /* If no value defined, then pass query without value or find element that has a attribute. */
            else {
                if (arName.length > 1) {
                    foreach(arName, function(name) {
                        query += ':hasdata(' + name + '),';
                    });

                    query = query.replace(/\,$/, '');
                } else {
                    query = ':hasdata(' + name + ')';
                }

                return $(query);
            }
        }
        /* If name is object, then pass multiple query with value. */
        else if (isObject(name)) {
            /* Creating query string. */
            var query = '';
            foreach(name, function(name, value) {
                /* If has value, then insert query with value. */
                if (isString(value) && value !== '?') {
                    query += ':hasdata(' + name + ', ' + value + ')';
                } else {
                    query += ':hasdata(' + name + ')';
                }
            });
            /* If value is jquery object or html object, then use it as context. */
            if (isJQuery(value) || isHTML(value)) {
                return $(query, value);
            }
            /* If value is undefined, then pass query without context. */
            else {
                return $(query);
            }
        }
        /* If name is array, then pass multiple query without value. */
        else if (isArray(name)) {
            /* Creating query string. */
            var query = '';
            foreach(name, function(value) {
                query += ':hasdata(' + value + ')';
            });
            if(isJQuery(value) || isHTML(value)) {
                return $(query, value);
            } else {
                return $(query);
            }
        }
    };
    
    window.$data = $.findData = DataFinder;
})(jQuery);
/**
 * Public Registry.
 * Store the application registry into private scope.
 */

(function(registry) {
    if (typeof exports === 'object') {
        /* NodeJS */
        module.exports = registry();
    } else if (typeof define === 'function' && define.amd) {
        /* RequireJS */
        define(registry);
    } else {
        /* Browser */
        window.Registry = window.regs = registry();
    }
}(function() {
    var AppReg = {};
    var RegKey = {};

    var Registry = function(name, value, option) {
        /* Continue only when type of name is string*/
        if (isString(name)) {
            if (isDefined(value)) {
                this._constructor = function(){};
                this._constructor.locked = false;

                /* Checking whether registry already exist or not and locked or not */
                if (typeof AppReg[name] !== 'undefined' && AppReg[name]._constructor.locked === true) {
                    this._constructor.locked = true;
                }

                this.value = value;
                this.name = name;

                if (this._constructor.locked) {
                    return console.warn('Registry ' + name + ' already exists as Protected Registry. Please use ".update()" method and give your key to update the registry.');
                } else {
                    if (isObject(option) && option.lock === true && isString(option.key)) {
                        this._constructor.locked = true;
                        RegKey[name] = option.key;

                        AppReg[name] = this;
                    } else {
                        this._constructor.locked = false;
                        this._constructor.unlock = null;

                        AppReg[name] = this;
                    }
                }
            } else {
                if (typeof AppReg[name] !== 'undefined') {
                    return AppReg[name];
                } else {
                    return undefined;
                }
            }
        }

        return this;
    };

    Registry.prototype = {
        update: function(value, key) {
            if (this._constructor.locked === true) {
                if (!key || key !== RegKey[this.name]) {
                    return console.warn('Unable to update protected registry. Please check your key.');
                } else {
                    this.value = value;
                }
            }

            return this;
        }
    };

    return function(name, value, option) {
        return new Registry(name, value, option);
    };
}));

/**
 * Kit Automator.
 * Automaticaly Build Dynamic Content.
 * @credits - Created by Nanang Mahdaen El Agung.
 */

(function(automator) {
    if (typeof exports === 'object') {
        /* NodeJS */
        module.exports = automator();
    } else if (typeof define === 'function' && define.amd) {
        /* RequireJS */
        define(automator);
    } else {
        /* Browser */
        window.Automator = automator();
    }
}(function() {
    /* Automator Version */
    var version = "0.1.2";

    /* Escape when no jQuery defined */
    if (typeof jQuery === 'undefined') return console.error('BabonJS requires: jQuery 1.10+ and Enquire!');

    /* Defining jQuery Shortname */
    var $ = jQuery;

    /* Defining Automator Maps */
    var AutomatorMaps =  {
        automator: {},
        prebuilds: [],
        disableds: []
    };

    /**
     * Automator Generator Wrapper
     * @param name
     * @param builder
     * @param auto
     * @returns {Automator}
     */
    var automator = function(name, builder, auto) { return new Automator(name, builder, auto); };

    /**
     * Automator Generator.
     * @param name {string:required} - Name of the automator.
     * @param builder {function:conditional} - Function that will be called. Required when creating automator.
     * @param auto {optional} - Determine whether the automator will be automaticaly builded when document is ready. Ensure your builder accepting no-params build since we build the automator without parameters.
     * @constructor
     */
    var Automator = function(name, builder, auto) {
        /* Continue the script only when the type of name is string */
        if (isString(name)) {
            /* Continue creating automator when builder is defined */
            if (isDefined(builder)) {
                /* Continue creating automator when type of builder is function */
                if (isFunction(builder)) {
                    var Automator = function() {
                        this._constructor = {};
                        this._constructor.id = name;
                        this._constructor.func = builder;
                        this._constructor.version = version;

                        this._constructor.hand = {};
                        this._constructor.type = 'automator';

                        this.auto = true;
                        this.dont = [];

                        this._config = {
                            loadtime: 'onready',
                            counter: 0,
                            IDPrefix: name + '-',

                            clean: false,

                            data: {
                                Kit: name,
                                KitID: name + '-id'
                            },

                            maps: {

                            }
                        };

                        /* Reconfiguring Autobuild if defined and adding to Autobuild map */
                        if (isBoolean(auto)) {
                            this.auto = auto;
                        }

                        if (this.auto === true) {
                            AutomatorMaps.prebuilds.push(name);
                        }

                        return this;
                    };

                    Automator.prototype = {};

                    /* Adding Default Prototypes */
                    foreach(defaultModules, function(name, func) {
                        Automator.prototype[name] = func;
                    });

                    /* Adding Builder Prototypes */
                    foreach(builder.prototype, function(name, func) {
                        Automator.prototype[name] = func;
                    });

                    /* Adding new automator to map */
                    AutomatorMaps.automator[name] = new Automator();

                    /* Updating Automator Lists */
                    automator.list = Object.keys(AutomatorMaps.automator);

                    return AutomatorMaps.automator[name];
                } else {
                    /* Escape when error happens */
                    console.warn('Can\'t create automator "' + name + '" with ' + typeof builder + ' as a builder.');
                    return false;
                }
            } else {
                /* Continue selecting automator if no builder */
                if (isAutomator(AutomatorMaps.automator[name])) {
                    return AutomatorMaps.automator[name];
                } else {
                    /* Escape when error happens */
                    console.warn('Automator "' + name + '" undefined.');
                    return false;
                }
            }
        }

        return this;
    };

    /* Creating the Automator Prototypes */
    var defaultModules = {
        /**
         * Setting Up the Automator.
         * @param name - String Automator Property Name. If it's object, then each item should have name and value.
         * @param value - Automator Property Value. Optional if name is object.
         * @returns {defaultModules}
         */
        setup: function(name, value) {
            if (isString(name) && isDefined(value)) {
                this._config[name] = value;
            } else if (isObject(name)) {
                var self = this;
                foreach(name, function (name, value) {
                    self._config[name] = value;
                });
            } else {
                console.warn('Invalid ' + this._constructor.id + ' config arguments!');
                return this._config;
            }

            return this;
        },

        /**
         * Setting Up the Automator Data Attribute.
         * @param id - String data attribute ID.
         * @param name - String data attribute Name.
         * @returns {defaultModules}
         */
        config: function(id, name) {
            if (isString(id) && isDefined(name)) {
                this._config.data[id] = name;
            } else if (isObject(id)) {
                var self = this;
                foreach(id, function (id, name) {
                    self._config.data[id] = name;
                });
            } else {
                console.warn('Invalid ' + this._constructor.id + ' config arguments!');
                return this._config.data;
            }

            return this;
        },

        /**
         * Get the lists of kit.
         * @returns {*}
         */
        list: function () {
            return this._config.maps;
        },

        insert: function(id, kit) {
            if (isString(id) && isObject(kit)) {
                this._config.maps[id] = kit;
            }

            return this;
        },

        /**
         * Get the kit by ID.
         * @param id - String Kit ID.
         * @returns {*}
         */
        with: function(id) {
            if (isString(id) && this._config.maps.hasOwnProperty(id)) {
                return this._config.maps[id];
            } else {
                console.warn(this._constructor.id + ' "' + id + '" is undefined!');
            }
        },

        /**
         * Automator Builder.
         * @param * {optional} - Build parameters is unlimited. They will be passed to the builder function.
         * @returns {Automator}
         */
        build: function() {
            /* Escape if disabled */
            if (this.enabled() === false) return this;

            /* Check the escape collection before build */
            if (this.dont.length > 0) {
                for (var i = 0; i <= this.dont.length; ++i) {
                    /* If some filter return true, then escape the build */
                    if (isFunction(this.dont[i]) && this.dont[i]() === true) {
                        return this;
                    }
                }
                /* Call the builder with forwarding arguments */
                return this._constructor.func.apply(this, arguments);
            } else {
                /* Call the builder with forwarding arguments */
                return this._constructor.func.apply(this, arguments);
            }

            return this;
        },

        /**
         * Removing Automator.
         * @returns {undefined}
         */
        remove: function() {
            /* Deleting automator from map */
            if (isAutomator(this._constructor.id)) {
                delete AutomatorMaps.automator[this._constructor.id];

                /* Updating automator list */
                return automator.list = Object.keys(AutomatorMaps.automator);
            }

            return this;
        },

        /**
         * Register Build Filter.
         * @param args {function:required} - Function that will be called to determine whether the automator should be builded or not. Function should return true or false.
         * @param args {array} - Array contains filter function.
         * @returns {Automator}
         */
        escape: function(args) {
            if (isFunction(args)) {
                /* Push new escape handler to automator */
                this.dont.push(args);
            } else if (isArray(args)) {
                /* Iterate escape handler list if args is array */
                var parent = this;

                foreach(args, function (func) {
                    /* Proceed Only if func is function */
                    if (isFunction(func)) {
                        parent.dont.push(func);
                    }
                });
            }

            return this;
        },

        /**
         * Change the automator auto mode.
         * @param bool {boolean:required} - If false, the current automatic state will be removed. If true, the automator will be added to the auto-build lists.
         * @returns {Automator}
         */
        autobuild: function(bool) {
            var idx = AutomatorMaps.prebuilds.indexOf(this._constructor.id);

            if (bool === false && idx > -1) {
                    AutomatorMaps.prebuilds[idx] = undefined;
            } else if (bool === true && idx === -1) {
                AutomatorMaps.prebuilds.push(this._constructor.id);
            } else if (bool === true && idx > -1) {
                AutomatorMaps.prebuilds[idx] = this._constructor.id;
            }

            this.auto = bool;
            return this;
        },

        /**
         * Check whether the automator is enabled or disabled. No parameters needed.
         * @returns {boolean}
         */
        enabled: function() {
            var idx = AutomatorMaps.disableds.indexOf(this._constructor.id);

            if (idx > -1) {
                return false;
            } else {
                return true;
            }
        },

        /**
         * Binding custom callback to automator.
         * @param name
         * @param func
         * @returns {Automator}
         */
        bind: function(name, func) {
            if (isString(name) && isFunction(func)) {
                this._constructor.hand[name] = func;
            }

            return this;
        },

        /**
         * Remove custom callback.
         * @param name
         * @returns {Automator}
         */
        unbind: function(name) {
            if (isString(name) && isFunction(this._constructor.hand[name])) {
                delete this._constructor.hand[name];
            }

            return this;
        },

        /**
         * Call the callbacks.
         * @param parent - The object that will be applied to callbacks.
         * @returns {Automator}
         */
        forward: function(parent) {
            foreach(this._constructor.hand, function(name, func) {
                if (isObject(parent)) {
                    func.apply(parent);
                } else {
                    func();
                }
            });

            return this;
        }
    };
    automator.module = Automator.prototype = defaultModules;
    automator.loadtime = 'onready';

    /* Binding auto-builder to the window on-ready */
    $(document).ready(function() {
        /* Applying Signature */
        $('html').setData('signature', 'Using BabonJS version ' + version + '.');

        /* Window On Load List */
        var loadlist = [];

        /* Getting Global Build Time */
        if (automator.loadtime === 'onload') {
            $(window).load(function() {
                /* Building Automators */
                foreach(AutomatorMaps.prebuilds, function (name) {
                    if (isString(name) && AutomatorMaps.prebuilds.indexOf(name) !== -1) {
                        Automator(name).build();
                    }
                });
            });
        } else {
            /* Building OnReady Automators */
            foreach(AutomatorMaps.prebuilds, function (name) {
                if (isString(name) && AutomatorMaps.prebuilds.indexOf(name) !== -1) {
                    var atom = AutomatorMaps.automator[name];

                    /* Getting Private Build Time */
                    if (atom._config.loadtime === 'onload') {
                        loadlist.push(atom);
                    } else if (atom._config.loadtime === 'onready') {
                        atom.build();
                    }
                }
            });

            /* Creating OnLoad Builder */
            $(window).load(function () {
                foreach(loadlist, function (atom) {
                    atom.build();
                });
            });
        }
    });

    /**
     * Disabling automator.
     * @param name {string} - Name of automator that will be disabled.
     * @returns {*}
     */
    automator.disable = function(name) {
        if (isString(name)) {
            if (AutomatorMaps.disableds.indexOf(name) === -1) {
                AutomatorMaps.disableds.push(name);
            }
        } else if (isArray(name)) {
            foreach(name, function (obj) {
                automator.disable(obj);
            });
        }

        return name;
    };

    /**
     * Enabling automator.
     * @param name {string} - Name of automator that will be enabled.
     * @returns {*}
     */
    automator.enable = function(name) {
        if (isString(name)) {
            var idx = AutomatorMaps.disableds.indexOf(name);

            if (idx > -1) {
                AutomatorMaps.disableds[idx] = undefined;
            }
        } else if (isArray(name)) {
            foreach(name, function (obj) {
                automator.enable(obj);
            });
        }

        return name;
    };

    /**
     * Get the list of automators.
     * @returns {Array}
     */
    automator.list = Object.keys(AutomatorMaps.automator);
    automator.maps = AutomatorMaps;

    /* Whether to keep the data-attribute live on dom element or not. Usable to debug the automator */
    /* To prevent double build mistakes, we recomend to keep the debug false */
    automator.debug = false;

    /**
     * Core Automator Generator. Use it when you want to create automator and need to add your own prototypes.
     * @type {Automator}
     */
    automator.core = Automator;

    /* Automator Builder After Page Load and can be called by users. */
    automator.build = function(from) {
        var context = $('body');

        /* Getting Context */
        if (isString(from) || isJQuery(from) || isHTML(from)) {
            context = $(from);
        }

        /* Building Each Automator */
        foreach(automator.list, function (name) {
            var atm = AutomatorMaps.automator[name];
            var kit_name = atm._config.data.Kit;
            var object = jQuery.findData(kit_name, context);

            if (object.length > 0) {
                atm.build(object);
            }
        });

        return context;
    };

    return automator;
}));

/**
 * UI Kit Generator.
 * Created by mahdaen on 9/15/14.
 * © 2014 BabonJS. All right reserved.
 */

(function(generator) {
    if (typeof exports === 'object') {
        /* NodeJS */
        module.exports = generator();
    } else if (typeof define === 'function' && define.amd) {
        /* RequireJS */
        define(generator);
    } else {
        /* Browser */
        window.Generator = generator();
    }
}(function () {
    'use strict';

    /* Creating jQuery Wrapper */
    $ = jQuery;

    /* Creating Collections */
    var GeneratorMaps = {
        generator: {},
        protected: [],
        counter: 0,
    }

    /**
     * Custom Generator Wrapper.
     * @param name
     * @param maker
     * @returns {Generator}
     */
    var generator = function(name, maker, option) { return new Generator(name, maker, option); };

    /**
     * Creating Custom Generator.
     * @param name {string:required} - Generator Name.
     * @param maker {string:conditional} - Function that will be called to generate the kit.
     * @returns {Generator}
     * @constructor
     */
    var Generator = function(name, maker, option) {
        if (isString(name)) {
            if (isDefined(maker)) {
                if (isFunction(maker)) {
                    this._constructor = function(){};
                    this._constructor.id = name;
                    this._constructor.type = 'generator';
                    this._constructor.func = maker;

                    this.data = {};
                    this.html = $('');

                    /* Checking whether generator is should locked or not. */
                    if (isObject(option) && option.lock === true && isString(option.key)) {
                        var gen = GeneratorMaps[name];

                        /* Checking whether generator already exists or not and locked or not */
                        if (isGenerator(gen) && gen.locked === true) {
                            return console.warn('Can\'t update protected generator ' + name + '. Please use "Generator.update()" method to replace the generator.');
                        } else {
                            /* Locking Object */
                            this._constructor.locked = true;
                            this._constructor.unlock = option.key;

                            /* Adding new Generator to map */
                            GeneratorMaps.generator[name] = this;
                            GeneratorMaps.protected.push(name);
                        }
                    } else {
                        /* Adding new Generator to map */
                        GeneratorMaps.generator[name] = this;
                    }

                    if (isObject(option) && option.extendable === true) {
                        this._constructor.fluid = true;
                    } else {
                        this._constructor.fluid = false;
                    }

                    /* Updating Generator Lists */
                    generator.list = Object.keys(GeneratorMaps.generator);
                } else {
                    return console.warn('Can\'t create Generator ' + name + ' with ' + typeof maker + ' as a maker.');
                }
            } else {
                if (isObject(GeneratorMaps.generator[name])) {
                    return GeneratorMaps.generator[name];
                } else {
                    return console.warn('Generator "' + name + '" undefined.');
                }
            }
        }

        return this;
    };

    /**
     * Generator Prototypes.
     * @type {{}}
     */
    generator.module = Generator.prototype = {
        /**
         * Making new object from kit.
         * @param {} - Parametes is depending on whats the kit needs.
         * @return {*}
         */
        make: function() {
            var mst = this;
            var cst = this._constructor;

            var Generator = function() {
                this._constructor = cst;

                for(var key in mst) {
                    if (mst.hasOwnProperty(key)) {
                        this[key] = mst[key];
                    }
                }

                return this;
            };

            Generator.prototype = {};

            foreach(defaultModules, function(name, func) {
                Generator.prototype[name] = func;
            });

            foreach(this._constructor.func.prototype, function(name, func) {
                Generator.prototype[name] = func;
            });

            return this._constructor.func.apply(new Generator(), arguments);
        },

        /**
         * Removing generator.
         * @return {*}
         */
        remove: function() {
            if (isGenerator(GeneratorMaps.generator[this._constructor.id])) {
                /* Deleting Automator if exist */
                if (isAutomator(this._constructor.id)) {
                    Automator(this._constructor.id).remove();
                }

                /* Deleting generator from map */
                this.html.remove();
                delete GeneratorMaps.generator[this._constructor.id];

                /* Updating Generator Lists */
                return generator.list = Object.keys(GeneratorMaps.generator);
            }

            return this;
        }
    };

    var defaultModules = {
        build: function() {
            var automator = Automator(this._constructor.id);

            if (isAutomator(automator)) {
                automator.build(this.html);
            }

            return this;
        },
        appendTo: function() {
            this.html.appendTo(arguments);

            return this;
        },
        prependTo: function() {
            this.html.prependTo(arguments);

            return this;
        },
        animate: function() {
            this.html.animate(arguments);

            return this;
        },
        addClass: function() {
            this.html.addClass(arguments);

            return this;
        },
        toggleClass: function() {
            this.html.toggleClass(arguments);

            return this;
        },
        remove: function() {
            this.html.remove();

            return this;
        }
    };

    var reconstructor = function() {
        return this;
    };

    generator.extend = function(from, into, args) {
        var master = GeneratorMaps.generator[from];

        if (isGenerator(master)) {
            reconstructor.call(into, from);
            master._constructor.func.apply(into, args);
        }

        return this;
    };
    generator.update = function(name, maker, key) {
        if (isString(name)) {
            var gen = GeneratorMaps.generator[name];

            if (isGenerator(gen) && isFunction(maker) && gen.locked === true && isObject(option) && key === gen.unlock) {
                gen.func = maker;

                return gen;
            }
        }

        return undefined;
    };
    generator.lock = function(name, key) {
        if (isString(name) && isString(key)) {
            var gen = GeneratorMaps.generator[name];

            if (isGenerator(gen)) {
                gen.locked = true;
                gen.unlock = key;

                return gen;
            }
        }

        return undefined;
    };
    generator.free = function(name, key) {
        if (isString(name) && isString(key)) {
            var gen = GeneratorMaps.generator[name];

            if (isGenerator(gen) && gen.locked === true && isString(key) && key === gen.unlock) {
                gen.locked = false;
                gen.unlock = null;

                GeneratorMaps.protected[GeneratorMaps.protected.indexOf(gen.id)] = undefined;

                return gen;
            }
        }

        return undefined;
    };

    generator.list = Object.keys(GeneratorMaps.generator);

    /**
     * Creating Core Generator Constructor. Use it when you want to create Generator and need to add your own prototypes.
     * @type {Generator}
     */
    generator.core = Generator;

    return generator;
}));

(function(atmedia) {
    /* Preparing Default Queries */
    window['is-mobile'] = false;
    enquire.register('only screen and (min-device-width : 320px) and (max-device-width : 767px)', {
        match: function() {
            window['is-mobile'] = true;
        }
    });
    window['is-tablet'] = false;
    enquire.register('only screen and (min-device-width : 768px) and (max-device-width : 1024px), (min-width: 768px) and (max-width: 1200px)', {
        match: function() {
            window['is-tablet'] = true;
        }
    });
    window['is-desktop'] = false;
    enquire.register('screen and (min-width: 960px)', {
        match: function() {
            window['is-desktop'] = true;
        }
    });
    window['is-retina'] = false;
    if (window.devicePixelRatio && window.devicePixelRatio > 1) window['is-retina'] = true;

    /* Media Query Worker */
    var _MQ_ = function(query) {
        this.query = '';

        if (isString(query)) {
            this.query = query;
        }

        return this;
    };
    _MQ_.prototype = {
        /* Run code immediately after match with query */
        run: function(func) {
            if (isFunction(func) && isString(this.query)) {
                enquire.unregister(this.query);
                enquire.register(this.query, {
                    match: func
                });
            }

            return this;
        },
        /* Delete registered query */
        del: function() {
            if (this.query) {
                enquire.unregister(this.query);
            }

            return this;
        },
        /* Run code after document ready and match with query */
        onReady: function(func) {
            if (isFunction(func)) {
                var query = this;

                $(document).ready(function() {
                    query.run(func);
                });
            }

            return this;
        }
    }

    /* Registering default media query */
    __extend__({
        $_desktop: new _MQ_('screen and (min-width: 960px)'),
        $_mobile: new _MQ_('only screen and (min-device-width : 320px) and (max-device-width : 767px)'),
        $_tablet: new _MQ_('only screen and (min-device-width : 768px) and (max-device-width : 1024px)')
    });

    window.$media = window.atmedia = function(STR_QUERY) {return new _MQ_(STR_QUERY)};
})(enquire);
/**
 * BabonJS.
 * ContentStack Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 10/30/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AccordionName = 'accordion';
    var AccordionGroupName = 'accordion-group';

    /* Accordion Configurations */
    var acSetup = {
        effect: {
            expand: {
                'simple': function() {
                    this.content.slideDown();
                }
            },
            collapse: {
                'simple': function() {
                    this.content.slideUp();
                }
            }
        }
    };
    var acConfig = {
        KitState: 'accordion-state',
        KitDefault: 'accordion-default',

        ExpandClass: 'expanded',
        CollapseClass: 'collapsed',

        Button: 'accordion-button',
        Content: 'accordion-content'
    };
    var Config = {};

    /* Accordion Group Configuration */
    var GroupConfig = {};

    /* Creating Accordion Group */
    var AccordionGroup = function() {
        this.config = {};
        this.content = {};
        this.current = null;

        return this;
    };

    /* Accordion Group Prototypes */
    AccordionGroup.prototype = {
        set: function(name, value) {
            if (isString(name) && isDefined(value)) {
                this[name] = value;
            } else if (isObject(name)) {
                var self = this;

                foreach(name, function (name, value) {
                    self[name] = value;
                });
            }

            return this;
        },
        clean: function() {
            this.holder.remData([GroupConfig.data.Kit, GroupConfig.data.KitID]);

            foreach(this.content, function (id, kit) {
                kit.holder.remData(GroupConfig.data.KitID);
            });

            return this;
        },
        insert: function(name, accordion) {
            if (isString(name) && isObject(accordion)) {
                this.content[name] = accordion;
            }

            return this;
        },
        expand: function(name) {
            if (isString(name)) {
                if (this.content.hasOwnProperty(name)) {
                    var accordion = this.content[name];

                    if (accordion.state === Config.data.ExpandClass) {
                        accordion.collapse();
                    } else {
                        accordion.expand();
                    }

                    if (this.current !== null && this.current.id !== name) {
                        this.current.collapse();
                    }

                    this.current = accordion;
                }
            }

            return this;
        }
    }

    /* Automator Handler */
    var accordionGroup = function(object) {
        /* Wrapping Config */
        var $cfg = GroupConfig = this._config;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($cfg.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($cfg.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $cfg.data.Kit + ')');

        // Iterating Objects.
        object.each(function() {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData($cfg.data.KitID);
            if (!isString(kit_id)) {
                kit_id = $cfg.IDPrefix + ($cfg.counter + 1);

                /* Increasing counter */
                $cfg.counter++;
            }

            /* Creating new kit */
            var Kit = new AccordionGroup().set({
                id: kit_id,
                holder: $(this).setData($cfg.data.KitID, kit_id)
            });

            /* Getting config */
            var config = $(this).getData($cfg.data.Kit);
            if (isObject(config)) {
                foreach(config, function (name, value) {
                    Kit.config[name] = value;
                });
            }

            /* Adding Kit to collections */
            $cfg.maps[kit_id] = Kit;

            /* Getting Accordions */
            $d(Config.data.Kit, Kit.holder).setData($cfg.data.KitID, kit_id);
        });
    };

    /* Registering Automator */
    Automator(AccordionGroupName, accordionGroup);

    // Accordion object.
    var Accordion = function () {
        this.config = {
            effect: 'default',
            expand: false,

            /* Mouse Event */
            click: true,
            enter: false,
            hover: false,
            delay: 200
        };

        this.id = 'none';
        this.group = 'none';

        this.state = acConfig.CollapseClass;
        this.holder = $('<div>');

        return this;
    };

    // Accordion Object Prototypes.
    Accordion.prototype = {
        // Change or add Kit properties.
        set: function (name, value) {
            if (isString(name) && isDefined(value)) {
                this[name] = value;
            } else if (isObject(name)) {
                var self = this;

                foreach(name, function (name, value) {
                    self[name] = value;
                });
            }

            return this;
        },
        toggle: function() {
            if (this.group !== 'none') {
                Automator(AccordionGroupName).with(this.group).expand(this.id);
            } else {
                if (this.state === Config.data.ExpandClass) {
                    this.collapse();
                } else {
                    this.expand();
                }
            }

            return this;
        },
        expand: function() {
            var efc = this.config.effect;

            /* Adding State to Kit */
            this.state = Config.data.ExpandClass;

            /* Getting effect handler or use default */
            if (Config.effect.expand.hasOwnProperty(efc)) {
                Config.effect.expand[efc].apply(this);
            } else if (efc === 'default') {
                /* Adding State to Holder */
                this.holder
                    .removeClass(Config.data.CollapseClass)
                    .addClass(this.state);

                /* Adding State to Content */
                this.content
                    .removeClass(Config.data.CollapseClass)
                    .addClass(this.state);

                /* Adding State to Button */
                this.button
                    .removeClass(Config.data.CollapseClass)
                    .addClass(this.state);

                if (!Config.clean && Automator.debug) {
                    this.holder.setData(Config.data.KitState, this.state);
                    this.button.setData(Config.data.KitState, this.state);
                    this.content.setData(Config.data.KitState, this.state);
                }
            } else {
                console.warn(AccordionName + ' effect handler "' + efc + '" is undefined!');
            }

            return this;
        },
        collapse: function() {
            var efc = this.config.effect;

            /* Adding State to Kit */
            this.state = Config.data.CollapseClass;

            /* Getting effect handler or use default */
            if (Config.effect.collapse.hasOwnProperty(efc)) {
                Config.effect.collapse[efc].apply(this);
            } else if (efc === 'default') {
                /* Adding State to Holder */
                this.holder
                    .removeClass(Config.data.ExpandClass)
                    .addClass(this.state);

                /* Adding State to Content */
                this.content
                    .removeClass(Config.data.ExpandClass)
                    .addClass(this.state);

                /* Adding State to Button */
                this.button
                    .removeClass(Config.data.ExpandClass)
                    .addClass(this.state);

                if (!Config.clean && Automator.debug) {
                    this.holder.setData(Config.data.KitState, this.state);
                    this.button.setData(Config.data.KitState, this.state);
                    this.content.setData(Config.data.KitState, this.state);
                }
            } else {
                console.warn(AccordionName + ' effect handler "' + efc + '" is undefined!');
            }

            return this;
        },
    };

    // Automator Constructor.
    var accordion = function (object) {
        /* Wrapping Config */
        var $cfg = this._config;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($cfg.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($cfg.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $cfg.data.Kit + ')');

        // Iterating Objects.
        object.each(function () {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData($cfg.data.KitID);
            if (!isString(kit_id)) {
                kit_id = $cfg.IDPrefix + ($cfg.counter + 1);

                /* Increasing counter */
                $cfg.counter++;
            }

            /* Creating new Kit */
            var Kit = new Accordion().set({
                id: kit_id,
                holder: $(this).setData($cfg.data.KitID, kit_id)
            });

            /* Getting Configs */
            var config = $(this).getData($cfg.data.Kit);
            if (isObject(config)) {
                foreach(config, function (name, value) {
                    Kit.config[name] = value;
                });
            }

            /* Enumerating Group */
            if (Kit.holder.hasData(GroupConfig.data.KitID)) {
                var gid = Kit.holder.getData(GroupConfig.data.KitID);
                Kit.group = gid;

                if (isString(gid)) {
                    Automator(AccordionGroupName).with(gid).insert(kit_id, Kit);
                }
            }

            /* Adding Kit to collections */
            $cfg.maps[kit_id] = Kit;

            /* Initializing Buttons, and Contents */
            $d($cfg.data.Button, this).setData($cfg.data.KitID, kit_id);
            $d($cfg.data.Content, this).setData($cfg.data.KitID, kit_id);
        });

        /* Configuring Kits */
        foreach($cfg.maps, function (id, kit) {
            // Adding Content and Buttons to Kit.

            /* Button Query */
            var btQ = {}; btQ[$cfg.data.Button] = '?'; btQ[$cfg.data.KitID] = id;

            /* Adding Button */
            kit.button = $d(btQ, kit.holder);

            /* Content Query */
            var ctQ = {}; ctQ[$cfg.data.Content] = '?'; ctQ[$cfg.data.KitID] = id;

            /* Adding Content */
            kit.content = $d(ctQ, kit.holder);

            /* Does expand at start */
            if (kit.config.expand === true) {
                kit.expand();
            } else {
                kit.collapse();
            }

            /* Handling Events */
            kit.hoverTimer = setTimeout(function() {});
            kit.enterTimer = setTimeout(function() {});

            /* Does using click */
            if (kit.config.click) {
                kit.button.click(function(e) {
                    e.stopPropagation();

                    kit.toggle();

                    return false;
                });
            }

            /* Does using hover */
            if (kit.config.hover && !kit.config.enter) {
                /* Creating New Hover Candidate */
                var nextState = kit.state;

                kit.button.hover(function() {
                    /* Toggling Hover Candidate */
                    if (nextState === $cfg.data.ExpandClass) {
                        nextState = $cfg.data.CollapseClass;
                    } else {
                        nextState = $cfg.data.ExpandClass;
                    }

                    /* Clear current handler to prevent uggly toggler */
                    clearTimeout(kit.hoverTimer);

                    kit.hoverTimer = setTimeout(function() {
                        /* Toggle only if the next state if different with current state */
                        if (kit.state !== nextState) {
                            kit.toggle();
                        }
                    }, kit.config.delay);
                });
            }

            /* Does using mouseenter */
            if (kit.config.enter && !kit.config.hover) {
                kit.button.mouseenter(function() {
                    clearTimeout(kit.enterTimer);

                    kit.enterTimer = setTimeout(function() {
                        kit.toggle();
                    }, kit.config.delay);
                });
            }

            /* Cleaning Up Data Attributes */
            if ($cfg.clean || !Automator.debug) {
                kit.holder.remData([$cfg.data.Kit, $cfg.data.KitID]);
                kit.button.remData([$cfg.data.Button, $cfg.data.KitID]);
                kit.content.remData([$cfg.data.Content, $cfg.data.KitID]);

                foreach(Automator(AccordionGroupName).list(), function (id, kit) {
                    kit.clean();
                });
            }
        });

        return this;
    };

    /* Automator Prototypes */
    accordion.prototype = {
        addExpandEffect: function(name, handler) {
            if (isString(name) && isFunction(handler)) {
                Config.effect.expand[name] = handler;
            } else if (isObject(name)) {
                foreach(name, function (name, handler) {
                    Config.effect.expand[name] = handler;
                });
            }

            return this;
        },
        addCollapseEffect: function(name, handler) {
            if (isString(name) && isFunction(handler)) {
                Config.effect.collapse[name] = handler;
            } else if (isObject(name)) {
                foreach(name, function (name, handler) {
                    Config.effect.collapse[name] = handler;
                });
            }

            return this;
        },
    };

    // Registering Automator and Adding Custom Configs.
    Automator(AccordionName, accordion).setup(acSetup).config(acConfig);

    /* Creating Public Configs */
    Config = Automator(AccordionName)._config;
})(jQuery, jQuery.findData);

/**
 * Background Automator.
 */
(function($, $d) {
    'use strict';

    /* Automator Name */
    var AutomatorName = 'dynamic-background';

    var defConf = {
        responsive: true,
        retina: true,
        replace: false,
        clean: false,

        data: {
            Kit: 'background',
            KitID: 'background-id'
        }
    };

    /**
     * Dynamic Background Automator.
     * @param object - jQuery object thats hold background.
     * @returns {DynamicBackround}
     * @constructor
     */
    var DynamicBackround = function(object) {
        /* Wrapping Config */
        var $cfg = this._config;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($cfg.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($cfg.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $cfg.data.Kit + ')');

        object.each(function(idx) {
            var img_src = $(this).getData($cfg.data.Kit);
            var new_src = '';

            if (img_src === 'get-child-img') {
                img_src = $('img', this).attr('src');
            }

            if (isString(img_src)) {
                var img_url = parseURL(img_src);

                if (isObject(img_url)) {
                    /* Proccessing Responsive Background */
                    if ($cfg.responsive == true) {
                        if (window['is-mobile'] === true) {
                            /* Device is Mobile */
                            new_src = img_url.root + img_url.name + '.mob';
                        } else if (window['is-tablet'] === true) {
                            /* Device is Tablet */
                            new_src = img_url.root + img_url.name + '.tab';
                        } else {
                            /* Device is Desktop */
                            new_src = img_url.root + img_url.name;
                        }
                    } else {
                        /* Skitp responsive if disabled */
                        new_src = img_url.root + img_url.name;
                    }

                    /* Proccessing Retina Backround */
                    if ($cfg.retina == true) {
                        /* Proccess if enabled */
                        if (window['is-retina'] === true) {
                            /* Device is Retina */
                            new_src += '@2x.' + img_url.ext;
                        } else {
                            /* Device is non Retina */
                            new_src += '.' + img_url.ext;
                        }
                    } else {
                        /* Skip when disabled */
                        new_src += '.' + img_url.ext;
                    }

                    var target = $(this);

                    $.ajax({
                        url: new_src,
                        type: 'HEAD',
                        success: function() {
                            target.css('backgroundImage', 'url(' + new_src + ')');
                        },
                        error: function() {
                            target.css('backgroundImage', 'url(' + img_src + ')');
                        }
                    });

                    if ($cfg.replace === true || $cfg.clean === true) {
                        target.remData($cfg.data.Kit);
                    }
                }
            }

            if ($cfg.clean === true || !Automator.debug) {
                $(this).remData($cfg.data.Kit);
            }
        });

        return this;
    };

    Automator(AutomatorName, DynamicBackround).setup(defConf);
})(jQuery, jQuery.findData);


/**
 * Box Automator.
 */
(function($, $d) {
    'use strict';

    /* Automator Names */
    var nameof = {
        'box-ratio': 'box-ratio',
        'box-height': 'box-height',
        'box-row-height': 'box-row-height'
    }

    /**
     * Maintain aspect ratio by width.
     * @param object - Object that has attribute 'data-box-ratio'. Leave blank to scan all box.
     * @returns {BoxRatio}
     * @constructor
     */
    var BoxRatio = function(object) {
        /* Wrapping Config */
        var $cfg = this._config;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($cfg.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($cfg.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $cfg.data.Kit + ')');

        /* Enumerating Objects */
        object.each(function() {
            var box_width = $(this).width();
            var box_ratio = $(this).getData($cfg.data.Kit);
            var box_height;

            if (isArray(box_ratio) && box_ratio.length === 2) {
                box_height = Math.round((box_width / box_ratio[0]) * box_ratio[1]);

                $(this).height(box_height);
            } else if (isString(box_ratio)) {
                var ratio = box_ratio.replace(/\s+/g, '').split(':');

                if (ratio.length > 0) {
                    box_height = Math.round((box_width / ratio[0]) * ratio[1]);

                    $(this).height(box_height);
                }
            }

            if ($cfg.clean === true) {
                $(this).remData($cfg.data.Kit);
            }
        });

        return this;
    };

    /* Registering Box Ratio Automator */
    Automator(nameof['box-ratio'], BoxRatio);

    /* Adding Automator to jQuery plugin */
    $.fn.maintainRatio = function(ratio) {
        /* Wrapping Automator */
        var $atm = Automator(nameof['box-ratio']);

        /* Getting ratio */
        if (!isArray(ratio)) ratio = this.getData($atm._config.data.Kit);
        /* Registering ratio */
        if (isArray(ratio)) this.setData($atm._config.data.Kit, ratio);
        /* Building Kit */
        $atm.build(this);

        return this;
    }

    /* Box Height Maintainer */
    var BoxHeightMaintainer = function() {
        this.mode = 'capture-children';

        this.height = 0;
        this.holder = $('<div>');
        this.childs = $('<div>');

        return this;
    };

    /* Kit Prototypes */
    BoxHeightMaintainer.prototype = {
        set: function(name, value) {
            if (isString(name) && isDefined(value)) {
                this[name] = value;
            } else if (isObject(name)) {
                var self = this;
                foreach(name, function (name, value) {
                    self[name] = value;
                });
            }

            return this;
        },
    };

    /**
     * Maintain Box Height.
     * @param object - jQuery object that contains child-box.
     * @constructor
     */
    var boxHeight = function(object) {
        /* Wrapping Config */
        var $cfg = this._config;

        /* Extending Config */
        $cfg.data.Child = 'box-child';

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($cfg.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($cfg.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $cfg.data.Kit + ')');

        /* Enumerating Object */
        object.each(function() {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData($cfg.data.KitID);
            if (!isString(kit_id)) {
                kit_id = $cfg.IDPrefix + ($cfg.counter + 1);

                /* Increasing Counter */
                $cfg.counter++;
            }

            /* Creating New Kit */
            var Kit = new BoxHeightMaintainer().set({
                id: kit_id,
                holder: $(this).setData($cfg.data.KitID, kit_id),
                defcfg: $cfg
            });

            /* Getting Mode */
            var mode = Kit.holder.getData($cfg.data.Kit);
            if (isString(mode)) {
                Kit.mode = mode;
            }

            /* Adding Kit into Collections */
            $cfg.maps[kit_id] = Kit;

            /* Applying ID to childrens */
            if (Kit.mode !== 'fill-parent') {
                $d($cfg.data.Child, Kit.holder).setData($cfg.data.KitID, kit_id);
            }
        });

        /* Building Kits */
        foreach($cfg.maps, function (id, kit) {
            /* Fill Parent first */
            if (kit.mode === 'fill-parent') {
                kit.holder.height(kit.holder.parent().height());
            } else {
                /* Collecting Childrens */
                var childQuery = {};

                childQuery[$cfg.data.Child] = '?';
                childQuery[$cfg.data.KitID] = id;

                kit.childs = $d(childQuery, kit.holder);

                /* Getting the highest height */
                kit.childs.css('height', '');
                foreach(kit.childs, function (hChild) {
                    var height = $(hChild).height();

                    if (isNumber(height)) {
                        if (height > kit.height) {
                            kit.height = height;
                        }
                    }
                });

                /* Applying Height With Specific Mode */
                if (kit.mode === 'capture-children') {
                    kit.holder.height(kit.height);
                } else if (kit.mode === 'fill-children' || kit.mode === 'sync-children') {
                    kit.childs.height(kit.height);
                }
            }

            /* Cleaning Up Data Attributes */
            if ($cfg.clean === true || !Automator.debug) {
                kit.holder.remData([
                    $cfg.data.Kit,
                    $cfg.data.KitID
                ]);
                kit.childs.remData([
                    $cfg.data.Child,
                    $cfg.data.KitID
                ]);
            }
        });

        return this;
    };

    /* Registering Automator */
    Automator(nameof['box-height'], boxHeight).setup('loadtime', 'onload');

    /* Registering jQuery Plugin */
    $.fn.maintainHeight = function(mode) {
        /* Wrapping Automator */
        var $atm = Automator(nameof['box-height']);

        /* Getting Mode */
        if (!isString(mode)) mode = this.getData($atm._config.data.Kit);
        /* Registering Mode */
        if (isString(mode)) this.setData($atm._config.data.Kit, mode);
        /* Building Kit */
        $atm.build(this);

        return this;
    }

    /* Box Row Height Maintainer */
    var BoxRowHeightMaintainer = function() {
        this.column = 3;
        this.holder = $('<div>');
        this.childs = $('<div>');
        this.groups = {};

        return this;
    };

    /* Kit Prototypes */
    BoxRowHeightMaintainer.prototype = {
        set: function(name, value) {
            if (isString(name) && isDefined(value)) {
                this[name] = value;
            } else if (isObject(name)) {
                var self = this;
                foreach(name, function (name, value) {
                    self[name] = value;
                });
            }

            return this;
        }
    };

    /**
     * Maintain Box Row Height
     * @param object = jQuery object that contains child-box.
     * @returns {boxRowHeight}
     */
    var boxRowHeight = function(object) {
        /* Wrapping Config */
        var $cfg = this._config;

        /* Extending Config */
        $cfg.data.Child = 'box-row-child';
        $cfg.data.Group = 'box-row-group';

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($cfg.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($cfg.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $cfg.data.Kit + ')');

        /* Enumerating Kits */
        object.each(function() {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData($cfg.data.KitID);
            if (!isString(kit_id)) {
                kit_id = $cfg.IDPrefix + ($cfg.counter + 1);

                /* Increasing Counter */
                $cfg.counter++;
            }

            /* Creating New Kit */
            var Kit = new BoxRowHeightMaintainer().set({
                id: kit_id,
                holder: $(this).setData($cfg.data.KitID, kit_id)
            });

            /* Getting Mode */
            var column = Kit.holder.getData($cfg.data.Kit);
            if (isString(column)) {
                Kit.column = column;
            }

            /* Adding Kit into Collections */
            $cfg.maps[kit_id] = Kit;

            /* Applying ID to childrens */
            $d($cfg.data.Child, Kit.holder).setData($cfg.data.KitID, kit_id);
        });

        foreach($cfg.maps, function (id, kit) {
            /* Getting Childrens */
            var childQuery = {};

            childQuery[$cfg.data.Child] = '?';
            childQuery[$cfg.data.KitID] = id;

            kit.childs = $d(childQuery);

            /* Enumerating Childrens */
            var counts = 1;
            var groups = 1;

            foreach(kit.childs, function (hChild) {
                /* Converting to jQuery object */
                hChild = $(hChild);

                /* Resetting counter and height if reach column count */
                if (counts === (kit.column + 1)) {
                    counts = 1;
                    groups++;
                } else {
                    counts++;
                }

                /* Creating new group if not exist */
                if (!isObject(kit.groups[groups])) {
                    kit.groups[groups] = {
                        height: 0,
                        childs: []
                    };
                }

                /* Applying Group ID */
                hChild.setData($cfg.data.Group, groups);

                /* Adding item to groups */
                kit.groups[groups].childs.push(hChild);
            });

            /* Maintain Row Height in each group */
            foreach(kit.groups, function (id, group) {
                /* Getting highest height */
                foreach(group.childs, function (child) {
                    child = $(child);

                    if (child.height() > group.height) {
                        group.height = child.height();
                    }
                });

                /* Applying new height */
                foreach(group.childs, function(child) {
                    $(child).height(group.height);
                });
            });

            /* Cleaning Up Data Attributes */
            if ($cfg.clean === true || !Automator.debug) {
                kit.holder.remData([
                    $cfg.data.Kit,
                    $cfg.data.KitID
                ]);
                kit.childs.remData([
                    $cfg.data.Child,
                    $cfg.data.KitID
                ]);
            }
        });

        return this;
    };

    /* Registering Automator */
    Automator(nameof['box-row-height'], boxRowHeight).setup('loadtime', 'onload');

    /* Creating jQuery Plugin */
    $.fn.maintainRowHeight = function(column) {
        /* Wrapping Automator */
        var $atm = Automator(nameof['box-row-height']);

        /* Getting Column Count */
        if (!isNumber(column)) column = this.getData($atm._config.data.Kit);
        /* Registering Column Count */
        if (isNumber(column)) this.setData($atm._config.data.Kit, column);
        /* Building Kit*/
        $atm.build(this);

        return this;
    }

    /**
     * @todo: Simplify the scripts and makes it more smart and configurable.
     */
})(jQuery, jQuery.findData);

/**
 * BabonJS.
 * ContentRotator Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 11/16/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AutomatorName = 'content-rotator';

    /* Default Configs */
    var defConf = {
        IDPrefix    : 'cr-',

        /* Effect Collections */
        effect      : {
            /* Default Effect - Only changing the class */
            'default': function() {
                this.swap();

                return this;
            },

            /* Simple Effect - Using jQuery $.fadeIn() and $.fadeOut() before swapping class */
            'simple': function() {
                var $this = this;

                $this.active.fadeOut(function() {
                    $this.target.fadeIn(function() {
                        $this.swap();
                    });
                });

                return this;
            },
        },

        /* Callback Collections */
        callback    : {}
    };

    /* Default Data-Attribute and Class naming */
    var defData = {
        id          : 'content-rotator-id',
        kit         : 'content-rotator',

        item        : 'content-rotator-item',
        prev        : 'content-rotator-prev',
        next        : 'content-rotator-next',
        select      : 'content-rotator-select',
        default     : 'default',
        progress    : 'content-rotator-progress',

        state       : 'content-rotator-state',
        active      : 'active',
        paused      : 'paused',
        stopped     : 'stopped',
        forward     : 'forward',
        backward    : 'backward'
    };

    // ContentRotator object.
    var ContentRotator = function () {
        this.config = {
            auto: false,
            effect: 'default',
            progress: false,
            onnavigate: 'none',

            select: true,
            before: false,
            after: false
        };

        this.prev = $('<div>');
        this.next = $('<div>');
        this.items = $('<div>');
        this.holder = $('<div>');
        this.selects = $('<div>');

        this.active = $('<div>');
        this.target = $('<div>');

        this.activeS = $('<div>');
        this.targetS = $('<div>');

        this.current = 0;
        this.total = 0;
        this.navdir = 'none';

        return this;
    };

    // ContentRotator Object Prototypes.
    ContentRotator.prototype = {
        // Change or add Kit properties.
        set: function (name, value) {
            var $this = this;

            if (isString(name) && isDefined(value)) {
                this[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    $this[name] = value;
                });
            }

            return this;
        },
        use: function (name, value) {
            var $this = this;

            if (isString(name) && isDefined(value)) {
                this.config[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    $this.config[name] = value;
                });
            }

            return this;
        },

        /* Function to define the target item */
        navigate: function($dir) {
            /* Escape when no dir defined */
            if (!isString($dir) && !isNumber($dir)) return;

            /* Variable Wrapper */
            var $this = this, $next = 0, $data = $this.$data;

            /* Stop auto rotate during navigate */
            $this.stop();

            /* Initializing Direction */
            if ($dir === $data.forward) {
                /* Navigate Forward */
                if ($this.current < ($this.total - 1)) {
                    $next = $this.current + 1;
                } else {
                    $next = 0;
                }
            } else if ($dir === $data.backward) {
                /* Navigate Backward */
                if ($this.current >= 1) {
                    $next = $this.current - 1;
                } else {
                    $next = ($this.total - 1);
                }
            } else if (isNumber($dir)) {
                /* Navigate to index number */
                $next = $dir;
            }

            $this.navdir = $dir;

            /* Get the target item and select */
            $this.target = $($this.items.get($next));

            /* If Select Enabled */
            if ($this.config.select) {
                $this.targetS = $($this.selects.get($next));
            }

            /* Before Target item and select */
            if ($this.config.before) {
                $this.before = $($this.items.get($next - 1));
                if ($this.before.length < 1) {
                    $this.before = $($this.items.get($this.items.length - 1));
                }

                if ($this.config.select) {
                    $this.beforeS = $($this.selects.get($next - 1));
                    if ($this.beforeS.length < 1) {
                        $this.beforeS = $($this.selects.get($this.items.length - 1));
                    }
                }
            }

            /* After Target item and select */
            if ($this.config.after) {
                $this.after = $($this.items.get($next + 1));
                if ($this.after.length < 1) {
                    $this.after = $($this.items.get(0));
                }

                if ($this.config.select) {
                    $this.afterS = $($this.selects.get($next + 1));
                    if ($this.afterS.length < 1) {
                        $this.afterS = $($this.selects.get(0));
                    }
                }
            }

            /* Animate the rotator, or return if no target found with the given index or target is more than one (that confusing). */
            if ($this.target.length === 1) {
                /* Replacing Current Index */
                $this.current = $next;

                /* Animating */
                $this.animate();
            } else {
                return;
            }

            return this;
        },

        /* Function to animate active item and target item */
        animate: function() {
            /* Variable Wrapper */
            var $this = this, $conf = $this.$conf, $data = $this.$data, $anim = $this.config.effect;

            /* Does the selected effect exist? Call it if exist, otherwise use default */
            if ($conf.effect.hasOwnProperty($anim)) {
                $conf.effect[$anim].apply($this);
            } else {
                $conf.effect.default.apply($this);
            }

            return this;
        },

        /* Function to change the class of the active item and target item */
        swap: function() {
            /* Variable Wrapper */
            var $this = this, $conf = $this.$conf, $data = $this.$data;

            /* Removing active class from the active item */
            $this.active.removeClass($data.active);
            $this.activeS.removeClass($data.active);

            /* Adding active calss to the target item */
            $this.target.addClass($data.active);
            $this.targetS.addClass($data.active);

            /* Modifying Data Attribute if shouldnt' to be clean */
            if (!$conf.clean && Automator.debug) {
                /* Removing data state from the active item */
                $this.active.remData($data.state);
                $this.activeS.remData($data.state);

                /* Adding data state to the target item */
                $this.target.setData($data.state, $data.active);
                $this.targetS.setData($data.state, $data.active);
            }

            /* Replacing active item with target item */
            $this.active = $this.target;
            $this.activeS = $this.targetS;

            /* Calling callback if defined and exist */
            if ($conf.callback.hasOwnProperty($this.config.onnavigate)) {
                $conf.callback[$this.config.onnavigate].apply($this);
            }

            /* Restarting auto-rotate if enabled */
            if (isNumber($this.config.auto)) {
                $this.start();
            }

            return this;
        },
        start: function() {
            if (!isNumber(this.config.auto)) return;

            /* Variable Wrapper */
            var $this = this, $data = $this.$data;

            /* Get duration time in ms */
            var duration = ($this.config.auto * 1000);

            /* Get the progress width */
            var width = $this.progress.width();

            /* Count the current position and duration to be used when it's paused */
            if (width > 0) {
                /* Get the style lists */
                var style = $this.progress.style();

                /* Count new duration */
                duration = duration - (Number(style.width.replace('%', '') / 100) * duration);
            }

            /* Animating Progress as a timer :D */
            $this.progress
                /* Remove stop class */
                .removeClass($data.stopped)
                /* Remove puase state */
                .removeClass($data.paused)
                /* Change width to 100% and navigate item when reached 100% */
                .animate({ width: '100%' }, duration, function() {
                    /* Resetting progress width to 0 */
                    $this.progress.width(0);

                    /* Navigate to next item */
                    $this.navigate($data.forward);
                });

            return this;
        },
        stop: function() {
            if (!isNumber(this.config.auto)) return;

            /* Variable Wrapper */
            var $this = this, $data = $this.$data;

            /* Stopping progress animation and adding stop state */
            $this.progress
                /* Stopping animation */
                .stop()
                /* Remove pause state */
                .removeClass($data.paused)
                /* Adding stop state */
                .addClass($data.stopped)
                /* Reset width to 0 */
                .animate({ width: 0 }, 200, function() {
                    $this.progress.css('width', '');
                });

            return this;
        },
        pause: function() {
            if (!isNumber(this.config.auto)) return;

            /* Variable Wrapper */
            var $this = this, $data = $this.$data;

            /* Stopping progress animation and adding pause state */
            $this.progress
                /* Stopping animation */
                .stop()
                /* Remove stop state */
                .removeClass($data.stopped)
                /* Adding stop state */
                .addClass($data.paused);

            return this;
        },
        restart: function() {
            if (!isNumber(this.config.auto)) return;

            /* Variable Wrapper */
            var $this = this;

            /* Stopping current timer */
            $this.stop();

            /* Starting new timer */
            $this.start();

            return this;
        },
    };

    // Automator Constructor.
    var contentRotator = function (object) {
        var $this = this;
        var $conf = this._config;
        var $data = this._config.data;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($data.kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($data.kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $data.kit + ')');

        // Iterating Objects.
        object.each(function () {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData($data.id);
            if (!isString(kit_id)) {
                kit_id = $conf.IDPrefix + ($conf.counter + 1);

                $conf.counter++;
            }

            /* Creating New Kit */
            var kit = new ContentRotator().set({
                $conf: $conf,
                $data: $data,

                id: kit_id,
                holder: $(this).setData($data.id, kit_id)
            });

            /* Getting Config */
            var config = kit.holder.getData($data.kit);
            if (isObject(config)) {
                kit.use(config);
            }

            /* ENUMERATING COMPONENTS */
            /* Rotator Items */
            kit.items = $d($data.item, kit.holder).setData($data.id, kit_id);

            /* Select Buttons If Enabled */
            if (kit.config.select) {
                kit.selects = $d($data.select, kit.holder).setData($data.id, kit_id);
            }

            /* Prev Button */
            kit.prev = $d($data.prev, kit.holder).setData($data.id, kit_id);

            /* Next Button */
            kit.next = $d($data.next, kit.holder).setData($data.id, kit_id);

            /* Progress */
            kit.progress = $d($data.progress, kit.holder).setData($data.id, kit_id);

            /* Adding Kit to Collections */
            $conf.maps[kit_id] = kit;
        });

        /* Re-enumearting Kits to enable usage of rotator inside rotator. */
        foreach($conf.maps, function (id, kit) {
            /* FILTERING COMPONENTS TO PREVENT SELECT MISTAKES */
            /* Items */
            kit.items = kit.items.filter(':hasdata(' + $data.id + ', ' + id + ')');

            /* Updating Total Items */
            kit.total = kit.items.length;

            /* Selects */
            kit.selects = kit.selects.filter(':hasdata(' + $data.id + ', ' + id + ')');

            /* Prev Button */
            kit.prev = kit.prev.filter(':hasdata(' + $data.id + ', ' + id + ')');

            /* Next Button */
            kit.next = kit.next.filter(':hasdata(' + $data.id + ', ' + id + ')');

            /* Progress Bar */
            kit.progress = kit.progress.filter(':hasdata(' + $data.id + ', ' + id + ')');

            /* Creating new progress bar when not exist and should auto-rotate */
            if (kit.progress.length < 1 && isNumber(kit.config.auto)) {
                kit.progress = $('<div class="progress" ' + $data.progress + '>')
                    /* Adding Data Attribute */
                    .setData($data.id, id)
                    /* Prepend to content-rotator holder */
                    .prependTo(kit.holder);

                /* Adding style to hide progress if unused */
                if (!kit.config.progress) {
                    kit.progress.css({ position: 'absolute', top: 0, left: 0, visibility: 'hidden', opacity: 0 })
                }
            }

            /* Finding Default Item */
            var def = kit.items.filter(':hasdata(' + $data.default + ')');

            if (def.length === 1) {
                def = kit.items.index(def);
            } else {
                def = 0;
            }

            /* Activating Default Item */
            kit.navigate(def);

            /* BINDING CLICK EVENTS */
            /* Select Buttons */
            kit.selects.click(function(e) {
                e.stopPropagation();

                var index = kit.selects.index(this);

                if (isNumber(index)) kit.navigate(index);

                return false;
            });

            /* Prev Button */
            kit.prev.click(function(e) {
                e.stopPropagation();

                kit.navigate($data.backward);

                return false;
            });

            /* Next Button */
            kit.next.click(function(e) {
                e.stopPropagation();

                kit.navigate($data.forward);

                return false;
            });

            /* Cleaning up data attribute if shouldn't to be clean */
            if ($conf.clean || !Automator.debug) {
                kit.holder.remData([$data.kit, $data.id]);
                kit.items.remData([$data.item, $data.id, $data.default]);
                kit.selects.remData([$data.select, $data.id]);
                kit.prev.remData([$data.prev, $data.id]);
                kit.next.remData([$data.next, $data.id]);
                kit.progress.remData([$data.progress, $data.id]);
            }

            /* Starting auto-rotate if enabled */
            if (isNumber(kit.config.auto)) {
                kit.start();
            }
        });

        return this;
    };

    /* Automator Prototypes */
    contentRotator.prototype = {
        addAnimation: function(name, handler) {
            var $this = this;

            if (isString(name) && isFunction(handler)) {
                $this._config.effect[name] = handler;
            } else if (isObject(name)) {
                foreach(name, function (name, handler) {
                    $this._config.effect[name] = handler;
                });
            }

            return this;
        },
        addCallback: function(name, handler) {
            var $this = this;

            if (isString(name) && isFunction(handler)) {
                $this._config.callback[name] = handler;
            } else if (isObject(name)) {
                foreach(name, function (name, handler) {
                    $this._config.callback[name] = handler;
                });
            }

            return this;
        }
    }

    // Registering Automator.
    Automator(AutomatorName, contentRotator).setup(defConf).config(defData);
})(jQuery, jQuery.findData);

/**
 * BabonJS.
 * ContentTab Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 11/13/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AutomatorName = 'tab';

    var defConf = {
        effect: {}
    };

    var defData = {
        content: 'tab-content',
        buttons: 'tab-button',
        current: 'current',

        state: 'tab-state'
    };

    // ContentTab object.
    var ContentTab = function () {
        this.config = {
            effect: 'default'
        };

        this.id = '';
        this.holder = $('<div>');
        this.current = {
            button: $('<div>'),
            content: $('<div>')
        };
        this.target = {
            button: $('<div>'),
            content: $('<div>')
        };

        return this;
    };

    // ContentTab Object Prototypes.
    ContentTab.prototype = {
        // Change or add Kit properties.
        set: function (name, value) {
            var $this = this;

            if (isString(name) && isDefined(value)) {
                this[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    $this[name] = value;
                });
            }

            return this;
        },
        use: function(name, value) {
            var $this = this;

            if (isString(name) && isDefined(value)) {
                this[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    $this[name] = value;
                });
            }

            return this;
        },
        switch: function(index) {
            var $this = this;

            /* Getting Target */
            $this.target.button = $($this.buttons.get(index));
            $this.target.content = $($this.content.get(index));

            if ($this.$conf.effect.hasOwnProperty($this.config.effect)) {
                $this.$conf.effect[$this.config.effect].apply($this);
            } else {
                /* Deactivating Current */
                $this.current.button.removeClass($this.$data.current);
                $this.current.content.removeClass($this.$data.current);

                /* Activating Target */
                $this.target.button.addClass($this.$data.current);
                $this.target.content.addClass($this.$data.current);

                /* Clean Attributes */
                if (!$this.$conf.clean && Automator.debug) {
                    $this.current.button.remData($this.$data.state);
                    $this.current.content.remData($this.$data.state);

                    $this.target.button.setData($this.$data.state, $this.$data.current);
                    $this.target.content.setData($this.$data.state, $this.$data.current);
                }
            }

            /* Replacing Current Tab */
            $this.current.button = $this.target.button;
            $this.current.content = $this.target.content;

            return this;
        }
    };

    // Automator Constructor.
    var contentTab = function (object) {
        var $this = this;
        var $conf = this._config;
        var $data = this._config.data;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $data.Kit + ')');

        // Iterating Objects.
        object.each(function () {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData($data.KitID);
            if (!isString(kit_id)) {
                kit_id = $conf.IDPrefix + ($conf.counter + 1);

                /* Increasing Counter */
                $conf.counter++;
            }

            /* Creating new Kit */
            var Kit = new ContentTab().set({
                id: kit_id,

                holder: $(this).setData($data.KitID, kit_id),

                $conf: $conf,
                $data: $data
            });

            /* Getting Configs */
            var config = Kit.holder.getData($data.Kit);

            if (isObject(config)) {
                Kit.use(config);
            }

            /* Finding Content and Buttons */
            $d($data.content, Kit.holder).setData($data.KitID, kit_id);
            $d($data.buttons, Kit.holder).setData($data.KitID, kit_id);

            /* Adding To Collections */
            $conf.maps[kit_id] = Kit;
        });

        /* Re Enumerate Buttons and Contents to prevent conflict with tab-in-tab */
        foreach($conf.maps, function (id, kit) {
            /* Finding Buttons */
            var buttonQuery = {};
            buttonQuery[$data.buttons] = '?';
            buttonQuery[$data.KitID] = id;

            kit.buttons = $d(buttonQuery, kit.holder).click(function(e) {
                e.stopPropagation();

                var index = kit.buttons.index(this);

                kit.switch(index);

                return false;
            });

            /* Finding Contents */
            var contentQuery = {};
            contentQuery[$data.content] = '?';
            contentQuery[$data.KitID] = id;

            kit.content = $d(contentQuery, kit.holder);

            /* Finding Default Tab */
            var def = kit.content.filter(':hasattr(default)');

            if (def.length === 1) {
                def = kit.content.index(def);
            } else {
                def = 0;
            }

            kit.switch(def);

            /* Cleaning up attributes */
            if ($conf.clean || !Automator.debug) {
                kit.holder.remData([$data.Kit, $data.KitID]);

                kit.buttons.remData([$data.button, $data.KitID]);
                kit.content.remData([$data.content, $data.KitID]).removeAttr('default');
            }
        });

        return this;
    };

    contentTab.prototype = {
        addEffect: function(name, handler) {
            var $this = this;

            if (isString(name) && isFunction(handler)) {
                $this._config.effect[name] = handler;
            } else if (isObject(name)) {
                foreach(name, function (name, handler) {
                    $this._config.effect[name] = handler;
                });
            }

            return this;
        }
    };

    // Registering Automator.
    Automator(AutomatorName, contentTab).setup(defConf).config(defData);
})(jQuery, jQuery.findData);

(function($, $d) {
    'use strict';

    /* Defining Automator Name */
    var AutomatorName = 'dropdown';

    var defData = {
        list        : 'dropdown-list',
        item        : 'dropdown-item',
        label       : 'dropdown-label',
        value       : 'value',
        button      : 'dropdown-button',

        state       : 'dropdown-state',
        current     : 'current',
        exclass     : 'expanded',
        coclass     : 'collapsed'
    };

    var defConf = {
        alive: false,
        effect: {
            expand: {
                'default': function() {
                    var $this = this, $data = $this.$data;

                    $this.holder
                        .setData($data.state, $data.exclass)
                        .addClass($data.exclass);

                    $this.button
                        .setData($data.state, $data.exclass)
                        .addClass($data.exclass);

                    $this.lists
                        .setData($data.state, $data.exclass)
                        .addClass($data.exclass);

                    return this;
                },
                'simple': function() {
                    var $this = this, $data = $this.$data;

                    $this.holder
                        .setData($data.state, $data.exclass)
                        .addClass($data.exclass);

                    $this.button
                        .setData($data.state, $data.exclass)
                        .addClass($data.exclass);

                    $this.lists
                        .setData($data.state, $data.exclass)
                        .slideDown()
                        .addClass($data.exclass);

                    return this;
                }
            },
            collapse: {
                'default': function() {
                    var $this = this, $data = $this.$data;

                    $this.holder
                        .remData($data.state, $data.exclass)
                        .removeClass($data.exclass);

                    $this.button
                        .remData($data.state, $data.exclass)
                        .removeClass($data.exclass);

                    $this.lists
                        .remData($data.state, $data.exclass)
                        .removeClass($data.exclass);

                    return this;
                },
                'simple': function() {
                    var $this = this, $data = $this.$data;

                    $this.holder
                        .remData($data.state, $data.exclass)
                        .removeClass($data.exclass);

                    $this.button
                        .remData($data.state, $data.exclass)
                        .removeClass($data.exclass);

                    $this.lists
                        .remData($data.state, $data.exclass)
                        .slideUp()
                        .removeClass($data.exclass);

                    return this;
                }
            }
        },
        select: {}
    };

    /* Dropdown Object */
    var Dropdown = function() {
        this.config = {
            effect: 'default',
            select: 'none',
            type: 'anchor'
        };

        this.holder = $('<div>');
        this.button = $('<span>');

        this.label = $('<span>');
        this.lists = $('<div>');
        this.items = $('<ul>');

        this.select = $('<select>');
        this.active = null;
        this.target = null;

        this.state = 'init';

        return this;
    };

    /* Dropdown Prototype */
    Dropdown.prototype = {
        set: function (name, value) {
            var $this = this;

            if (isString(name) && isDefined(value)) {
                $this[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    $this[name] = value;
                });
            }

            return this;
        },
        use: function (name, value) {
            var $this = this;

            if (isString(name) && isDefined(value)) {
                $this.config[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    $this.config[name] = value;
                });
            }

            return this;
        },
        expand: function() {
            var $this = this, $conf = $this.$conf, $data = $this.$data;

            $this.state = 'expanded';

            if ($conf.effect.expand.hasOwnProperty($this.config.effect)) {
                $conf.effect.expand[$this.config.effect].apply(this);
            } else {
                $conf.effect.expand['default'].apply(this);
            }

            return this;
        },
        collapse: function(ts) {
            var $this = this, $conf = $this.$conf, $data = $this.$data;

            $this.state = 'collapsed';

            if ($conf.effect.collapse.hasOwnProperty($this.config.effect)) {
                $conf.effect.collapse[$this.config.effect].apply(this);
            } else {
                $conf.effect.collapse['default'].apply(this);
            }

            return this;
        },
        toggle: function() {
            var $this = this, $conf = $this.$conf, $data = $this.$data;

            if ($this.state === 'expanded') {
                $this.collapse();
            } else {
                if (!$this.$conf.alive) {
                    Automator('toggle-collapse').collapse('private');
                }
                $this.expand();
            }

            return this;
        },
        choose: function(index) {
            var $this = this, $conf = $this.$conf, $data = $this.$data;

            if (index !== $this.active) {
                /* Removing Selected Item */
                $this.items
                    .removeAttr($data.current)
                    .removeClass($data.current);

                /* Getting Target Option */
                var option = $('option:nth-child(' + (index + 1) + ')', $this.select);
                /* Activating Target Option */
                option.prop('selected', true);

                /* Getting Target Item */
                var item = $($this.items.get(index));
                /* Activating Target Item */
                item
                    .attr($data.current, '')
                    .addClass($data.current);

                /* Replacing Label Text */
                $this.label.html(item.html());

                /* Registering Active Index */
                $this.active = index;
                $this.target = item;

                /* Triggering Select Handler */
                if ($this.state !== 'init') {
                    if ($conf.select.hasOwnProperty($this.config.select) && $this.state !== 'init') {
                        $conf.select[$this.config.select].apply(this);
                    }
                }
            }

            /* Collapsing Dropdown */
            $this.collapse();

            return this;
        }
    };

    var dropdown = function(object) {
        var $this = this;
        var $conf = this._config;
        var $data = this._config.data;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $data.Kit + ')');

        /* Enumerating Objects */
        object.each(function () {
            // Getting Kit ID or create new if not defined.
            var kit_id = $(this).getData($data.KitID);
            if (!isString(kit_id)) {
                kit_id = $conf.IDPrefix + ($conf.counter + 1);

                /* Increasing Counter */
                $conf.counter++;
            }

            // Creating New Kit.
            var Kit = new Dropdown().set({
                $data: $data,
                $conf: $conf,
                id: kit_id,
                holder: $(this).setData($data.KitID, kit_id)
            });

            /* Getting Configuration */
            var config = $(this).getData($data.Kit);

            if (isObject(config)) {
                Kit.use(config);

                if (!config.hasOwnProperty('name')) {
                    Kit.use('name', kit_id);
                }
            } else {
                Kit.use('name', kit_id);
            }

            /* Enumerating Component to assign ID */
            /* Button */
            Kit.button = $d($data.button, Kit.holder).setData($data.KitID, kit_id);

            /* Binding Button Click Event */
            Kit.button.click(function(e) {
                e.stopPropagation();

                Kit.toggle();

                return false;
            });

            /* Label */
            Kit.label = $d($data.label, Kit.holder).setData($data.KitID, kit_id);
            /* Same as button if no label defined */
            if (Kit.label.length < 1) {
                Kit.label = Kit.button;
            }

            /* List */
            Kit.lists = $d($data.list, Kit.holder).setData($data.KitID, kit_id);

            /* Items */
            Kit.items = $d($data.item, Kit.holder).setData($data.KitID, kit_id);

            /* Configuring Dropdown type seconfigt */
            if (Kit.config.type === 'select') {
                /* Creating New Select Object */
                var select = $('<select hidden>')
                    .attr('name', Kit.config.name)
                    .attr('id', Kit.config.name);

                Kit.select = select.appendTo(Kit.holder);

                /* Creating Options */
                foreach(Kit.items, function (obj, i) {
                    var item = $(obj);

                    var option = $('<option>')
                        .appendTo(select)
                        .html(item.html());

                    // Getting Value.
                    var value = item.attr($data.value);

                    if (isString(value)) {
                        option.attr('value', value);
                        Kit.active = i;
                    } else {
                        option.attr('value', item.html());
                        Kit.active = i;
                    }

                    /* Binding Select Event */
                    item.click(function(e) {
                        e.stopPropagation();

                        Kit.choose(i);

                        return false;
                    });
                });

                Kit.select.change(function() {
                    var active = $('option:selected', this);
                    var index = $('option', this).index(active);

                    Kit.choose(index);
                });
            }

            /* Getting Default Item */
            var def = Kit.items.filter(':hasattr(default)');

            if (def.length === 1) {
                def = Kit.items.index(def);
            } else {
                def = 0;
            }

            /* Activating Default Item */
            Kit.choose(def);

            /* Adding Kit to Collections */
            $conf.maps[kit_id] = Kit;

            /* Registering Collapse */
            Automator('toggle-collapse').register(Kit);

            /* Cleaning Up Data Attributes */
            if ($conf.clean || !Automator.debug) {
                Kit.holder.remData([$data.KitID, $data.Kit]);
                Kit.button.remData([$data.KitID, $data.button]);
                Kit.label.remData([$data.KitID, $data.label]);
                Kit.items.remData([$data.KitID, $data.item]);
                Kit.lists.remData([$data.KitID, $data.list]);
            }
        });
    };

    dropdown.prototype = {
        addExpandEffect: function(name, func) {
            var $this = this;

            if (isString(name) && isFunction(func)) {
                $this._config.effect.expand[name] = func;
            } else if (isObject(name)) {
                foreach(name, function (name, func) {
                    $this._config.effect.expand[name] = func;
                });
            }

            return this;
        },
        addCollapseEffect: function(name, func) {
            var $this = this;

            if (isString(name) && isFunction(func)) {
                $this._config.effect.collapse[name] = func;
            } else if (isObject(name)) {
                foreach(name, function (name, func) {
                    $this._config.effect.collapse[name] = func;
                });
            }

            return this;
        },
        addSelectHanlder: function(name, func) {
            var $this = this;

            if (isString(name) && isFunction(func)) {
                $this._config.select[name] = func;
            } else if (isObject(name)) {
                foreach(name, function (name, func) {
                    $this._config.select[name] = func;
                });
            }

            return this;
        },
    }

    /* Registering Automator */
    Automator(AutomatorName, dropdown).setup(defConf).config(defData);
})(jQuery, jQuery.findData);

(function($, $d) {
    'use strict';

    var Config = {
        counter: 0,
        IDPrefix: 'editable-',
        handler: {}
    };

    /**
     * Content Editable Automator.
     * @param object -  Object that has content editable and button.
     * @constructor
     */
    var EditableKit = function(object) {
        !isJQuery(object) ? object = $d('editable-kit') : object;

        object.each(function() {
            var index = (Config.counter + 1);
            var ea_id = (Config.IDPrefix + index);

            var content = $d('editable-content', this).setData('editable-id', ea_id);
            var buttons = $d('editable-button', this).setData('editable-id', ea_id);

            buttons.click(function(e) {
                e.stopPropagation();

                var state = $(this).getData('editable-state');
                var ea_id = $(this).getData('editable-id');

                var edits = $d({ 'editable-content': '?', 'editable-id': ea_id });

                if (state === 'editing') {
                    $(this).setData('editable-state', 'ready');
                    edits.attr('contenteditable', false);

                    var hasHand = Object.keys(Config.handler);

                    if (hasHand.length > 0) {
                        foreach(Config.handler, function (name, func) {
                            func({ button: $(this), content: edits });
                        });
                    }
                } else {
                    $(this).setData('editable-state', 'editing');
                    edits.attr('contenteditable', true);
                }
            });

            Config.counter++;
        });
    };

    EditableKit.prototype = {
        afterEdit: function(name, func) {
            if (isString(name) && isFunction(func)) {
                Config.handler[name] = func;
            }

            return this;
        },
        setup: function(object) {
            if (isObject(object)) {
                foreach(object, function (name, value) {
                    Config[name] = value;
                });
            }

            return this;
        }
    };

    Automator('editable-kit', EditableKit).autobuild(true).escape(function() {
        if (Automator('editable-kit').enabled === false) {
            return true;
        } else {
            return false;
        }
    });
})(jQuery, jQuery.findData);
/**
 * Created by mahdaen on 9/28/14.
 * © 2014 BabonKit. All right reserved.
 */
(function($, $d) {
    'use strict';

    var Config = {
        APIKey: 'AIzaSyAbKrYcLQ9NtXJETMS79aXxDrUzholMzKE',
        gmaps: undefined,

        embed: {
            baseURL: 'https://www.google.com/maps/embed/v1/'
        },

        static: {
            baseURL: 'https://maps.googleapis.com/maps/api/staticmap?',

            type: 'roadmap',
            size: '640x640',
            zoom: '13',

            center: 'Gumelar, Wadaslintang, Indonesia',
            marker: [{
                color: 'red',
                label: 'H',
                icon: 'default',
                pos: '-7.514802,109.8548565'
            }],
            styler: [{
                feature: 'all',
                saturation: -60,
                hue: '0xCCCCCC'
            }]
        },

        basic: {
            type: 'roadmap',
            counter: 0,
            collection: {}
        }
    };

    var GoogleMap = {};

    /**
     * Google Map Javascript Automator.
     * @param object - jQuery object that has attribute 'data-google-map'.
     * @data-google-map - String with 'lat, lng'.
     * @data-gmap-config - Object contains google map options, like center, zoom, type, zoomControl, etc.
     * @data-gmap-marker - Array contains marker object. Each object should have pos: 'lat, lng'.
     * @data-gmap-style - Object gmap skin.
     * @returns {GoogleMap.Basic}
     * @constructor
     */
    GoogleMap.Basic = function(object) {
        if (!window.google) return;
        if (!window.google.maps) return;

        !isJQuery(object) ? object = $d('google-map') : object;

        object.each(function() {
            if (!$(this).hasData('google-map')) return;

            var id = $(this).attr('id');

            if (!isString(id)) {
                id = 'gmap-' + (Config.basic.counter + 1);
                $(this).attr('id', id);

                Config.basic.counter++;
            }

            var GMaps = Config.gmaps = google.maps;

            var core = $(this).getData('google-map');
            var config = $(this).getData('gmap-config');
            var marker = $(this).getData('gmap-markers');
            var styler = $(this).getData('gmap-styles');

            if (isArray(core)) {
                var option = {
                    center: new GMaps.LatLng(core[0], core[1]),
                    type: GMaps.MapTypeId[Config.basic.type.toUpperCase()]
                };

                if (isObject(config)) {
                    foreach(config, function (key, value) {
                        option[key] = value;
                    });
                }

                if (isArray(styler)) {
                    option.styles = styler;
                }

                var map = new GMaps.Map(this, option);

                Config.basic.collection[id] = map;

                if (isArray(marker)) {
                    foreach(marker, function (pin) {
                        if (isString(pin.pos)) {
                            var npin = pin.pos.replace(/\s+/g, '').split(',');

                            if (isArray(npin) && npin.length === 2) {
                                var pinOpt = {
                                    map: map,
                                    position: new GMaps.LatLng(npin[0], npin[1])
                                };

                                foreach(pin, function(key, value) {
                                    if (key !== 'pos' && key !== 'effect') {
                                        if (key === 'icon' && isURL(value)) {
                                            pinOpt[key] = value;
                                        } else if (key !== 'icon') {
                                            pinOpt[key] = value;
                                        }
                                    }
                                });

                                if (isString(pin.effect)) pinOpt.animation = Config.gmaps.Animation[pin.effect.toUpperCase()];

                                var mark = new GMaps.Marker(pinOpt);
                            }
                        }
                    });
                }
            }
        });

        return this;
    };
    GoogleMap.Basic.prototype = {
        list: function() {
            return Config.basic.collection;
        },

        /**
         * Get the map object by map id.
         * @param id
         * @returns {*}
         */
        with: function(id) {
            if (isString(id)) {
                return new GoogleMap.Edit(id);
            } else {
                return this;
            }
        }
    };
    GoogleMap.Edit = function(id) {
        if (isString(id) && Config.basic.collection.hasOwnProperty(id)) {
            this.map = Config.basic.collection[id];

            return this;
        } else {
            return undefined;
        }
    };
    GoogleMap.Edit.prototype = {
        /**
         * Add new marker to map object.
         * @param marker - Array marker collection or object marker.
         * @param center - Boolead whether map should be centered to new marker or not.
         * @returns {GoogleMap.Edit}
         */
        addMarker: function(marker, center) {
            if (isObject(marker)) {
                if (isString(marker.pos)) {
                    var npin = marker.pos.replace(/\s+/g, '').split(',');

                    if (isArray(npin) && npin.length === 2) {
                        var markerOpt = {
                            map: this.map,
                            position: new Config.gmaps.LatLng(npin[0], npin[1])
                        };

                        foreach(marker, function(key, value) {
                            if (key !== 'pos' && key !== 'effect') {
                                markerOpt[key] = value;
                            }
                        });

                        if (isString(marker.effect)) markerOpt.animation = Config.gmaps.Animation[marker.effect.toUpperCase()];

                        if (center === true) {
                            this.map.setCenter(new Config.gmaps.LatLng(npin[0], npin[1]));

                            setTimeout(function() {
                                var mark = new Config.gmaps.Marker(markerOpt);
                            }, 200);
                        } else {
                            var mark = new Config.gmaps.Marker(markerOpt);
                        }
                    }
                }
            } else if (isArray(marker)) {
                var parent = this;
                foreach(marker, function (pin) {
                    parent.addMarker(pin);
                });
            }

            return this;
        },

        /**
         * Zoom Map.
         * @param zoom - Number of zoom value. 1-20.
         * @returns {GoogleMap.Edit}
         */
        zoom: function(zoom) {
            if (isNumber(zoom)) {
                this.map.setZoom(zoom);
            }

            return this;
        }
    };
    Automator('google-map', GoogleMap.Basic);

    /**
     * Build Embeded Google Map.
     * @param object - jQuery object that has attribute 'data-gmap-embed'.
     * @constructor
     */
    GoogleMap.Search = function(object) {
        !isJQuery(object) ? object = $d('gmap-search') : object;

        object.each(function(idx) {
            if (!$(this).hasData('gmap-search')) return;

            var url = Config.embed.baseURL + 'search?key=' + Config.APIKey;
            var query = $(this).attr('data-gmap-search');

            if (isString(query)) {
                url += '&q=' + query;

                var config = $(this).getData('gmap-config');

                if (isObject(config)) {
                    foreach(config, function (key, value) {
                        url += '&' + key + '=' + value;
                    });
                }

                var frame = $('<iframe>').css({ width: '100%', height: '100%', border: 0 }).attr({ frameborder: 0, src: encodeURI(url) });
                $(this).html(frame);
            }
        });
    };
    GoogleMap.Search.prototype = {
        APIKey: function(key) {
            if (isString(key)) {
                Config.APIKey = key;
            }

            return this;
        }
    };
    Automator('google-map-search', GoogleMap.Search).autobuild(true).escape(function() {
        if (Automator('google-map-search').enabled === false) {
            return true;
        } else {
            return false;
        }
    });

    /**
     * Build Static Google Map.
     * @param object
     * @constructor
     */
    GoogleMap.Static = function(object) {
        !isJQuery(object) ? object = $d('gmap-static') : object;

        object.each(function(idx) {
            if (!$(this).hasData('gmap-static')) return;

            var url = Config.static.baseURL;

            var option = {
                type: Config.static.type,
                size: Config.static.size,
                zoom: Config.static.zoom,

                center: undefined,

                marker: $(this).getData('gmap-markers'),
                styler: $(this).getData('gmap-styles')
            };

            var config = $(this).getData('gmap-static');

            if (isObject(config)) {
                foreach(config, function(key, value) {
                    option[key] = value;
                });
            }

            url += '&maptype=' + option.type + '&size=' + option.size + '&zoom=' + option.zoom;

            if (isString(option.center)) url += '&center=' + option.center;

            if (isArray(option.marker)) {
                foreach(option.marker, function (marker) {
                    if (!isString(marker.pos)) return;

                    url += '&markers=';

                    if (isString(marker.color)) url += 'color:' + marker.color;
                    if (isString(marker.label)) url += '|label:' + marker.label;
                    if (isString(marker.icon)) url += '|icon:' + marker.icon;

                    url += '|' + marker.pos;
                });
            }

            if (isArray(option.styler)) {
                foreach(option.styler, function (style) {
                    url += '&style=';

                    foreach(style, function(key, value) {
                        url += key + ':' + value + '|';
                    });
                });
            }

            url = encodeURI(url);

            $(this).html(' ');

            var image = $('<img />').attr('src', url).appendTo(this);
        });
    };
    Automator('google-map-static', GoogleMap.Static).autobuild(true).escape(function() {
        if (Automator('google-map-static').enabled === false) {
            return true;
        } else {
            return false;
        }
    });

    /**
     * Google Map Place Automator.
     * @param object
     * @returns {GoogleMap.Place}
     * @constructor
     */
    GoogleMap.Place = function(object) {
        !isJQuery(object) ? object = $d('gmap-place') : object;

        object.each(function() {
            if (!$(this).hasData('gmap-place')) return;

            var url = Config.embed.baseURL + 'place?key=' + Config.APIKey;
            var query = $(this).attr('data-gmap-place');

            if (isString(query)) {
                url += '&q=' + query;

                var config = $(this).getData('gmap-config');
                if (isObject(config)) {
                    foreach(config, function (key, value) {
                        url += '&' + key + '=' + value;
                    });
                }

                var frame = $('<iframe>').css({ width: '100%', height: '100%', border: 0 }).attr({ frameborder: 0, src: encodeURI(url) });
                $(this).html(frame);
            }
        });

        return this;
    };
    Automator('google-map-place', GoogleMap.Place).autobuild(true).escape(function() {
        if (Automator('google-map-place').enabled === false) {
            return true;
        } else {
            return false;
        }
    });

    /**
     * Google Map Direction.
     * @param object
     * @constructor
     */
    GoogleMap.Direction = function(object) {
        !isJQuery(object) ? object = $d('gmap-direction') : object;

        object.each(function() {
            if (!$(this).hasData('gmap-direction')) return;

            var url = Config.embed.baseURL + 'directions?key=' + Config.APIKey;
            var direct = $(this).getData('gmap-direction');

            if (isObject(direct) && isString(direct.from) && isString(direct.to)) {
                url += '&origin=' + direct.from + '&destination=' + direct.to;

                if (isString(direct.avoid)) {
                    url += '&avoid=' + direct.avoid;
                }

                var config = $(this).getData('gmap-config');
                if (isObject(config)) {
                    foreach(config, function (key, value) {
                        url += '&' + key + '=' + value;
                    });
                }

                console.log(config);

                var frame = $('<iframe>').css({ width: '100%', height: '100%', border: 0 }).attr({ frameborder: 0, src: encodeURI(url) });
                $(this).html(frame);
            }
        });
    };
    Automator('google-map-direction', GoogleMap.Direction).autobuild(true).escape(function() {
        if (Automator('google-map-direction').enabled === false) {
            return true;
        } else {
            return false;
        }
    });

    /* Creating jQuery Plugin */
    $.fn.buildMap = function() {
        if (this.hasData('gmap-search')) {
            Automator('google-map-search').build(this);
        } else if (this.hasData('gmap-static')) {
            Automator('google-map-static').build(this);
        } else if (this.hasData('gmap-place')) {
            Automator('google-map-place').build(this);
        } else if (this.hasData('gmap-direction')) {
            Automator('google-map-direction').build(this);
        } else if (this.hasData('google-map')) {
            Automator('google-map').build(this);
        }

        return this;
    };

 })(jQuery, jQuery.findData);

/**
 * BabonJS.
 * Grid Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 11/18/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AutomatorName = 'grid';

    var defData = {
        column: 'grid-col',
        wrapper: 'grid-wrap'
    };

    // Grid object.
    var Grid = function () {
        this.config = {
            width: false,

            column: 12,
            gutter: 10,

            gutterpos: 'left',

            pull: true,
            wrap: true,
            format: '%'
        };

        this.holder = $('<div>');

        this.wrapper = $('<div>');
        this.columns = $('<div>');

        this.width = 0;
        this.colWidth = 0;
        this.gutWidth = 0;

        return this;
    };

    // Grid Object Prototypes.
    Grid.prototype = {
        // Change or add Kit properties.
        set: function (name, value) {
            var $this = this;

            if (isString(name) && isDefined(value)) {
                this[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    $this[name] = value;
                });
            }

            return this;
        },
        use: function (name, value) {
            var $this = this;

            if (isString(name) && isDefined(value)) {
                this.config[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    $this.config[name] = value;
                });
            }

            return this;
        },
    };

    // Automator Constructor.
    var grid = function (object) {
        var $this = this;
        var $conf = this._config;
        var $data = this._config.data;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $data.Kit + ')');

        // Iterating Objects.
        object.each(function () {
            /* Creating Kit ID */
            var kit_id = $(this).getData($data.KitID);
            if (!isString(kit_id)) {
                kit_id = $conf.IDPrefix + ($conf.counter + 1);

                $conf.counter++;
            }

            /* Creating New Kit */
            var kit = new Grid().set({
                $conf: $conf,
                $data: $data,

                id: kit_id,
                holder: $(this).setData($data.KitID, kit_id)
            });

            /* Getting Config */
            var config = $(this).getData($data.Kit);
            if (isObject(config)) {
                kit.use(config);
            }

            /* Getting Wrapper */
            kit.wrapper = $d($data.wrapper, kit.holder).setData($data.KitID, kit_id);
            kit.columns = $d($data.column, kit.holder).setData($data.KitID, kit_id);

            /* Counting Dimensions */
            if (!kit.config.width) {
                kit.config.width = kit.holder.width();
            }

            var gut_size = ((kit.config.gutter / kit.config.width) * 100);
            var col_size = ((100 / kit.config.column) - gut_size);
            var own_size = (100 + gut_size);

            /* Exporting Dimensions */
            if (kit.config.format === 'px') {
                kit.width = Math.round((own_size / 100) * kit.config.width);
                kit.colWidth = Math.round((col_size / 100) * kit.config.width);
                kit.gutWidth = Math.round((gut_size / 100) * kit.config.width);
            } else if (kit.config.format === '%') {
                kit.width = Math.round(own_size);
                kit.colWidth = Math.round(col_size);
                kit.gutWidth = Math.round(gut_size);
            }

            /* Adding to map */
            $conf.maps[kit_id] = kit;
        });

        /* Re Enumerating Kit */
        foreach($conf.maps, function (id, kit) {
            /* Filtering wrapper and items to ensure the ID is correct */
            kit.wrapper = kit.wrapper.filter(':hasdata(' + $data.KitID + ', ' + id  + ')')

            /* Set the wrapper width and margin to pull */
            if (kit.config.wrap) {
                kit.wrapper.css({
                    width: (kit.width + kit.config.format)
                });
            }
            if (kit.config.pull && kit.gutWidth > 0) {
                kit.wrapper.css('margin-' + kit.config.gutterpos, ('-' + kit.gutWidth + kit.config.format));
            }

            /* Get corrected column and set the column width and margin as gutter */
            kit.columns = kit.columns.filter(':hasdata(' + $data.KitID + ', ' + id  + ')').each(function() {
                var col = $(this).getData($data.column);

                if (isNumber(col)) {
                    var width = ((kit.colWidth * col) + (kit.gutWidth * (col - 1)));

                    $(this).css('width', (width + kit.config.format));

                    if (kit.gutWidth > 0) {
                        $(this).css('margin-' + kit.config.gutterpos, (kit.gutWidth + kit.config.format))
                    }
                }

                if ($(this).hasData('box-ratio')) {
                    $(this).css('height', '').maintainRatio();
                }
            });

            /* Cleaning Up Data Attribute */
            if ($conf.clean || !Automator.debug) {
                kit.holder.remData([$data.Kit, $data.KitID]);
                kit.wrapper.remData([$data.wrapper, $data.KitID]);
                kit.columns.remData([$data.column, $data.KitID]);
            }
        });

        return this;
    };

    // Registering Automator.
    Automator(AutomatorName, grid).config(defData);
})(jQuery, jQuery.findData);

/**
 * Image Automator.
 */
(function($, $d) {
    'use strict';

    /**
     * Define image orientation.
     * @param object - image object. Leave blank for proccessing all images.
     * @return {ImageOrientation}
     * @constructor
     */
    var ImageOrientation = function(object) {
        !isJQuery(object) ? object = $('img') : object;

        object.each(function() {
            var w = $(this).width();
            var h = $(this).height();

            if (w > h) {
                $(this).removeClass('portrait').addClass('landscape');
            } else {
                $(this).removeClass('landscape').addClass('portrait');
            }
        });

        return this;
    };

    Automator('image-orientation', ImageOrientation).autobuild(true).escape(function() {
        if (Automator('image-orientation').enabled === false) {
            return true;
        } else {
            return false;
        }
    });

    /**
     * Responsive Image Automator.
     * @param object - jQuery Image Objects. Leave blank to scan all images that has attribute `responsive`.
     * @constructor
     */
    var ImageResponsive = function(object) {
        !isJQuery(object) ? object = $('img:hasattr(responsive)') : object;

        object.each(function () {
            var img_src = parseURL($(this).attr('src')),
                img_out = '';

            if (window['is-mobile']) {
                img_out = img_src.root + img_src.name + '.mobile.' + img_src.ext;
            } else if (window['is-tablet']) {
                img_out = img_src.root + img_src.name + '.tablet.' + img_src.ext;
            } else {
                img_out = img_src.root + img_src.name + '.' + img_src.ext;
            }

            $(this).attr('src', img_out);
        });
    };

    Automator('image-responsive', ImageResponsive).autobuild(true).escape(function() {
        if (Automator('image-responsive').enabled = false) {
            return true;
        } else {
            return false;
        }
    });

    /**
     * Retina Image Automator.
     * @param object - jQuery Image Objects. Leave blank to scan all image that has attribute `retina`.
     * @constructor
     */
    var ImageRetina = function(object) {
        !isJQuery(object) ? object = $('img:hasattr(retina)') : object;

        object.each(function() {
            var img_src = parseURL($(this).attr('src')),
                img_out = '';

            if (window['is-retina']) {
                img_out = img_src.root + img_src.name + '@2x.' + img_src.ext;
            } else {
                img_out = img_src.root + img_src.name + '.' + img_src.ext;
            }

            $(this).attr('src', img_out);
        });
    }

    Automator('image-retina', ImageRetina).autobuild(true).escape(function() {
        if (Automator('image-retina').enabled === false) {
            return true;
        } else {
            return false;
        }
    });

})(jQuery, jQuery.findData);

/**
 * BabonJS.
 * InputPlaceholder Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 10/16/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AutomatorName = 'input-placeholder';

    // Automator Configurations.
    var Config = {
        counter: 0,
        IDPrefix: 'iph-',
        clean: true,

        // Attributes Naming.
        data: {
            // Kit Constructor.
            Kit: 'placeholder',
            KitID: 'placeholder-id',
            Config: 'placeholder-config',

            // Kit State.
            Write: 'writing',
            Correct: 'correct',
            Error: 'error',
        },

        // Object Collections.
        object: {},

        focus: {
            default: function() {
                if (this.config.native === false) {
                    if (this.isEmpty() && this.config.clean === true) {
                        this.holder.val('');
                    } else if (!this.isEmpty() && this.config.clean === false) {
                        this.holder.focusTo(1, this.holder.val().length);
                    }
                }

                return this;
            }
        },
        blur: {
            default: function() {
                // Remove Writing State.
                this.holder.removeClass(Config.data.Write);

                // Processing Handler.
                if (this.config.native === false && this.isEmpty()) {
                    this.holder.val(this.text);
                }

                this.validate();

                return this;
            }
        },
        write: {
            default: function() {
                this.holder.addClass(Config.data.Write).removeClass(Config.data.Error).removeClass(Config.data.Correct);
                if (this.config.live === true) {
                    this.validate();
                }

                return this;
            }
        },
        error: {
            default: function() {
                this.holder.removeClass(Config.data.Correct).addClass(Config.data.Error);

                return this;
            }
        },
        correct: {
            default: function() {
                this.holder.removeClass(Config.data.Error).addClass(Config.data.Correct);

                return this;
            }
        },
        validate: {
            default: function() {
                var type = this.holder.attr('type');

                if (Config.validate.hasOwnProperty(type)) {
                    Config.validate[type].apply(this, arguments);
                } else {
                    Config.validate.text.apply(this, arguments);
                }

                return this;
            },
            text: function() {
                if (this.isEmpty() === true && this.config.required === true) {
                    this.error();
                } else {
                    this.correct();
                }
            },
            email: function() {
                this.handle('validate', 'text');

                if (!this.isEmpty() && !isEmail(this.holder.val())) this.error();
            },
            password: function() {
                this.handle('validate', 'text');
            }
        }
    };

    // InputPlaceholder object.
    var InputPlaceholder = function () {
        this.config = {
            native: true,
            clean: true,
            required: false,
            min: 1,
            live: false,

            check: 'default',
            blur: 'default',
            focus: 'default',
            write: 'default',
            error: 'none',
            correct: 'none'
        };

        this.holder = $('<input type="text">');
        this.valid = true;
        this.text = '';

        return this;
    };

    // InputPlaceholder Object Prototypes.
    InputPlaceholder.prototype = {
        set: function(name, value) {
            if (isString(name) && isDefined(value)) {
                this[name] = value;
            } else if (isObject(name)) {
                var self = this;

                foreach(name, function (name, value) {
                    self[name] = value;
                });
            }

            return this;
        },
        setup: function(name, value) {
            if (isString(name) && isDefined(value)) {
                this.config[name] = value;
            } else if (isObject(name)) {
                var self = this;

                foreach(name, function (name, value) {
                    self.config[name] = value;
                });
            }

            return this;
        },
        isEmpty: function() {
            var text = this.holder.val();

            if (text.replace(/\s+/g, '').length < this.config.min || this.holder.val() === this.text) {
                return true;
            } else {
                return false;
            }
        },
        handle: function(event, handler) {
            if (isString(event)) {
                if (!isString(handler)) {
                    handler = this.config[event];
                }

                if (Config.hasOwnProperty(event)) {
                    if (Config[event].hasOwnProperty(handler)) {
                        Config[event][handler].apply(this, arguments);
                    }
                }
            }

            return this;
        },
        validate: function() {
            if (Config.validate.hasOwnProperty(this.config.check)) {
                Config.validate[this.config.check].apply(this, arguments);
            }
        },
        error: function() {
            this.valid = false;
            this.handle('error', 'default');
            this.handle('error', this.config.error);

            return this;
        },
        correct: function() {
            this.valid = true;
            this.handle('correct', 'default');
            this.handle('correct', this.config.correct);

            return this;
        },
    };

    // Automator Constructor.
    var inputPlaceholder = function (object) {
        // Querying all kit if not defined.
        !isJQuery(object) ? object = $d(Config.data.Kit) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + Config.data.Kit + ')');

        // Enumerating Objects.
        object.each(function() {
            // Getting Kit ID and create new if not defined.
            var kit_id = $(this).getData(Config.data.KitID);
            if (!isString(kit_id)) {
                kit_id = Config.IDPrefix + (Config.counter + 1);
                $(this).setData(Config.data.KitID, kit_id);
            }

            // Creating New Kit Object.
            var kit = new InputPlaceholder().set({
                'kit_id': kit_id,
                'holder': $(this),
                'cons': Config.data
            });

            // Getting Kit Config.
            var config = $(this).getData(Config.data.Config);
            if (isObject(config)) {
                kit.setup(config);
            }

            // Getting Placeholder Text.
            var text = $(this).attr('data-' + Config.data.Kit);
            if (isString(text)) {
                kit.text = text;
            }

            // Adding placeholder if input value is empty.
            var value = kit.holder.val();
            if (value.replace(/\s+/g, '').length < kit.config.min) {
                if (kit.config.native === true) {
                    kit.holder.attr('placeholder', text);
                } else {
                    kit.holder.val(text);
                }
            }

            // Binding Event Handler.
            $(this).bind('focus', function() {
                kit.handle('focus');
            }).bind('blur', function() {
                kit.handle('blur');
            }).bind('keyup', function() {
                kit.handle('write');
            });

            // Cleaning up attributes.
            if (Config.clean) {
                kit.holder.remData([Config.data.Kit, Config.data.Config, Config.data.KitID]);
            }

            // Adding Kits to collections.
            Config.object[kit_id] = kit;

            // Increasing Counter.
            Config.counter++;
        });

        return this;
    };

    // Automator Prototypes.
    inputPlaceholder.prototype = {
        setup: function (name, value) {
            if (isString(name) && isDefined(value)) {
                Config[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    Config[name] = value;
                });
            }
        },
        with: function (name) {
            if (Config.object.hasOwnProperty(name)) {
                return Config.object[name];
            }
        },
        list: function() {
            return Config.object;
        }
    };

    // Registering Automator and let it autobuild with default escape.
    Automator(AutomatorName, inputPlaceholder);

})(jQuery, jQuery.findData);

/**
 * BabonJS.
 * LinkScroller Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 10/29/14.
 * License: GNU General Public License v2 or later.
 */

(function($, $d) {
    'use strict';

    var AutomatorName = 'link-scroller';

    var Config = {
        counter: 0,
        IDPrefix: 'link-scroller-',

        data: {
            kit: 'link-scroller'
        },

        stopPos: 0,
        independent: true,

        kit: {},
    }

    var linkScroller = function(object) {
        !isJQuery(object) ? object = $d(Config.data.kit) : object;

        object = object.filter(':hasdata(' + Config.data.kit + ')');

        object.each(function() {
            /* Getting Target ID */
            var target = $(this).getData(Config.data.kit);

            /* Getting Scroll Effect */
            var scrollEffect = $(this).getData('link-scroll-effect');
            if (!isString(scrollEffect)) {
                scrollEffect = 'default';
            }

            /* Getting Target */
            var linkTarget = $(target);

            if (linkTarget.length > 0) {
                /* Getting Offset */
                var top = linkTarget.offsets().top;


                $(this).click(function(e) {
                    if (Config.independent) {
                        e.stopPropagation();
                    }

                    var range = (top - Config.stopPos);

                    Automator('scroll-pos').scrollTop(range, scrollEffect);

                    if (Config.independent) {
                        return false;
                    }
                });
            }
        });
    };

    /* Kit Prototype */
    linkScroller.prototype = {
        addEffect: function(name, func) {
            Automator('scroll-pos').addScrollEffect(name, func);

            return this;
        },
        setup: function(name, value) {
            if (isString(name) && isDefined(value)) {
                Config[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    Config[name] = value;
                });
            }

            return this;
        }
    };

    /* Registering Automator */
    Automator(AutomatorName, linkScroller);
})(jQuery, jQuery.findData);
/**
 * BabonJS.
 * LazyLoader Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 10/30/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AutomatorName = 'lazy-loader';

    // Automator Configurations.
    var Config = {
        counter: 0,
        IDPrefix: 'lazy-loader-',
        clean: true,

        // Attributes Naming.
        data: {
            Kit: 'lazy-loader',
            KitID: 'lazy-loader-id',
            KitState: 'lazy-loader-state'
        },

        loadtime: 'load',

        // Object Collections.
        object: {},

        // Effect Collections.
        effect: {
            default: function() {
                this.loaded = true;
                this.holder.addClass(this.config.loadclass);

                if (Config.clean === false) {
                    this.holder.setData(Config.data.KitState, this.config.loadclass);
                }

                return this;
            }
        }
    };

    // LazyLoader object.
    var LazyLoader = function () {
        this.config = {
            delay: 0,
            loadtime: 'winload',
            effect: 'default',
            loadclass: 'loaded'
        };
        this.timeHanlder = setTimeout(function() {}, 0);
        this.holder = $('<div>');

        return this;
    };

    // LazyLoader Object Prototypes.
    LazyLoader.prototype = {
        // Change or add Kit properties.
        set: function (name, value) {
            if (isString(name) && isDefined(value)) {
                this[name] = value;
            } else if (isObject(name)) {
                var self = this;

                foreach(name, function (name, value) {
                    self[name] = value;
                });
            }

            return this;
        },
    };

    // Automator Constructor.
    var lazyLoader = function (object) {
        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d(Config.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d(Config.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + Config.data.Kit + ')');

        // Iterating Objects.
        object.each(function () {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData(Config.data.KitID);
            if (!isString(kit_id)) {
                kit_id = Config.IDPrefix + (Config.counter + 1);

                /* Increasing Counter */
                Config.counter++;
            }

            /* Creating New Kit */
            var Kit = new LazyLoader().set({ id: kit_id, holder: $(this).setData(Config.data.KitID, kit_id) });

            /* Geting Configurations */
            var config = Kit.holder.getData(Config.data.Kit);
            if (isObject(config)) {
                foreach(config, function (key, value) {
                    Kit.config[key] = value;
                });
            }

            /* Getting Delay Time */
            var delay = isNumber(Kit.config.delay) ? Kit.config.delay : 0;

            /* Creating Load Handler */
            var timeHandler = function() {
                var effectName = Kit.config.effect;

                if (isString(effectName) && Config.effect.hasOwnProperty(effectName)) {
                    var effect = Config.effect[effectName];

                    if (isFunction(effect)) {
                        effect.apply(Kit);
                    }
                }
            };

            /* Determine Load Time */
            var loadtime = Kit.config.loadtime;

            if (loadtime === 'winload') {
                $(window).load(function() {
                    clearTimeout(Kit.timeHanlder);

                    Kit.timeHanlder = setTimeout(timeHandler, delay);
                });
            } else if (loadtime === 'docready') {
                clearTimeout(Kit.timeHanlder);

                Kit.timeHanlder = setTimeout(timeHandler, delay);
            } else if (loadtime === 'selfload') {
                Kit.holder.load(function() {
                    clearTimeout(Kit.timeHanlder);

                    Kit.timeHanlder = setTimeout(timeHandler, delay);
                });
            } else  {
                if (isString(loadtime)) {
                    $(loadtime, Kit.holder).load(function() {
                        clearTimeout(Kit.timeHanlder);

                        Kit.timeHanlder = setTimeout(timeHandler, delay);
                    });
                }
            }

            /* Adding Kit to Collections */
            Config.object[kit_id] = Kit;

            /* Clean up Tag */
            if (Config.clean === true) {
                foreach(Config.data, function (key, value) {
                    Kit.holder.remData(value);
                });
            }
        });

        return this;
    };

    // Automator Prototypes.
    lazyLoader.prototype = {
        /* Configuring Automator */
        setup: function (name, value) {
            if (isString(name) && isDefined(value)) {
                Config[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    Config[name] = value;
                });
            }
        },

        /* Adding Effect Handler */
        addEffect: function(name, func) {
            if (isString(name) && isFunction(func)) {
                Config.effect[name] = func;
            } else if (isObject(name)) {
                foreach(name, function (name, func) {
                    Config.effect[name] = func;
                });
            }

            return this;
        },
        /* Getting The Kit Lists */
        list: function() {
            return Config.object;
        }
    };

    // Registering Automator including autobuild and default escape condition.
    Automator(AutomatorName, lazyLoader);
})(jQuery, jQuery.findData);

/**
 * BabonJS.
 * Lightbox Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 11/7/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AutomatorName = 'lightbox';

    var DataCfg = {
        KitID: 'lightbox-window',
        Destroy: 'lightbox-destroy',
        Content: 'lightbox-content',
        Command: 'lightbox-load'
    };
    var DefConf = {
        loadtime: 'onload',
        cache: false,
        before: {},
        after: {},
        open: {},
        exit: {},
        effect: { open: {}, exit: {} }
    };

    // Automator Constructor.
    var lightBox = function (object) {
        var $this = this;
        var $conf = this._config;
        var $data = this._config.data;

        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d($data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d($data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + $data.Kit + ')');

        // Iterating Objects.
        object.each(function () {
            /* Getting ID or create new */
            var kit_id = $(this).getData($data.KitID);

            if (!isString(kit_id)) {
                kit_id = $conf.IDPrefix + ($conf.counter + 1);
                $(this).setData($data.KitID, kit_id);

                $conf.counter++;
            }

            $this.holder = $(this);
            $this.ID = kit_id;

            /* Finding Lightbox Components and setting up ID */
            $this.destroyer = $d($data.Destroy).setData($data.KitID, kit_id);
            $this.container = $d($data.Content).setData($data.KitID, kit_id);
            $this.commander = $d($data.Command).setData($data.KitID, kit_id);

            /* Clean Up Lightbox Component */
            if ($conf.clean === true || !Automator.debug) {
                foreach($data, function (name, data) {
                    $this.holder.remData(data);
                    $this.destroyer.remData(data);
                    $this.container.remData(data);
                });

                $this.commander.remData([$data.KitID]);
            }

            /* Binding Destroyer Click Event */
            $this.destroyer.click(function(e) {
                e.stopPropagation();

                $this.exit();

                return false;
            });

            /* Binding Commander Click Event */
            $this.commander.click(function(e) {
                e.stopPropagation();

                $this.load($(this));

                return false;
            });

            /* Adding Default Class */
            $this.defclass = $this.container.attr('class');
        });

        return this;
    };

    /* Automator Prototypes */
    lightBox.prototype = {
        load: function(target) {
            var $this = this;

            if (isJQuery(target)) {
                target = target.getData($this._config.data.Command);

                if (isObject(target)) {
                    $this.target = target;
                    $this.load(target);
                }
            } else if (isObject(target)) {
                $this.target = target;

                if (target.hasOwnProperty('source')) {
                    /* Hide Current Window before load */
                    $this.hide();

                    /* Triggering Before Load */
                    if (target.hasOwnProperty('before') && $this._config.before.hasOwnProperty(target.before)) {
                        $this._config.before[target.before].apply(this);
                    }

                    /* Loading Content */
                    $.ajax({
                        url: target.source,
                        dataType: 'text/html',
                        cache: $this._config.cache,

                        complete: function(data) {
                            /* Triggering After Load */
                            if (target.hasOwnProperty('after') && $this._config.after.hasOwnProperty(target.after)) {
                                $this._config.after[target.after].apply(this);
                            }

                            /* Opening Lightbox */
                            $this.target.data = data;
                            $this.open();
                        },
                        error: function(data) {
                            $this.container.html('Unable to procceed request!')
                            /* Opening Lightbox */
                            $this.target.data = data;
                            $this.open();
                        }
                    });
                } else if (target.hasOwnProperty('content')) {
                    $this.target.data = {
                        responseText: target.content
                    };

                    $this.open();
                }
            }

            return this;
        },
        hide: function () {
            var $this = this;
            var target = $this.target;

            /* Exit Effect Handler */
            if (target.hasOwnProperty('effect') && $this._config.effect.exit.hasOwnProperty(target.effect)) {
                $this._config.effect.exit[target.effect].apply(this);
            } else {
                $this.holder.removeClass('open');
            }

            return this;
        },
        exit: function(nowait) {
            var $this = this;
            var target = $this.target;

            /* Exit Effect Handler */
            if (target.hasOwnProperty('effect') && $this._config.effect.exit.hasOwnProperty(target.effect)) {
                $this._config.effect.exit[target.effect].apply(this);
            } else {
                $this.holder.removeClass('open');

                if (!nowait) {
                    $this.cleaner = setTimeout(function() {
                        $this.container.attr('class', $this.defclass);
                        $this.container.empty();
                    }, 1000);
                } else {
                    $this.container.attr('class', $this.defclass);
                    $this.container.empty();
                }
            }

            /* Exit Event Handler */
            if (target.hasOwnProperty('exit') && $this._config.exit.hasOwnProperty(target.exit)) {
                $this._config.exit[target.exit].apply(this);
            }

            return this;
        },
        open: function() {
            var $this = this;
            var target = $this.target;

            /* Adding Content to Container */
            this.container.html(target.data.responseText);

            /* Building Automators inside new content */
            Automator.build(this.container);

            /* Open Effect Handler */
            if (target.hasOwnProperty('effect') && $this._config.effect.open.hasOwnProperty(target.effect)) {
                $this._config.effect.open[target.effect].apply(this);
            } else {
                /* Opening Ligthbox */
                $this.holder.addClass('open');
            }

            /* Triggering After Open */
            if (target.hasOwnProperty('open') && $this._config.open.hasOwnProperty(target.open)) {
                $this._config.open[target.open].apply(this);
            }

            return this;
        },

        /* Event Handler Maker */
        beforeload: function(name, func) {
            if (isString(name) && isFunction(func)) {
                this._config.before[name] = func;
            } else if (isObject(name)) {
                var $this = this;

                foreach(name, function (name, func) {
                    $this._config.before[name] = func;
                });
            }

            return this;
        },
        afterload: function(name, func) {
            if (isString(name) && isFunction(func)) {
                this._config.after[name] = func;
            } else if (isObject(name)) {
                var $this = this;

                foreach(name, function (name, func) {
                    $this._config.after[name] = func;
                });
            }

            return this;
        },
        afteropen: function(name, func) {
            if (isString(name) && isFunction(func)) {
                this._config.open[name] = func;
            } else if (isObject(name)) {
                var $this = this;

                foreach(name, function (name, func) {
                    $this._config.open[name] = func;
                });
            }

            return this;
        },
        afterexit: function(name, func) {
            if (isString(name) && isFunction(func)) {
                this._config.exit[name] = func;
            } else if (isObject(name)) {
                var $this = this;

                foreach(name, function (name, func) {
                    $this._config.exit[name] = func;
                });
            }

            return this;
        }
    }

    // Registering Automator.
    Automator(AutomatorName, lightBox).setup(DefConf).config(DataCfg);

    /* Lightbox Destroyer Loader */
    Automator(DataCfg.Destroy, function() {
        var at = Automator(AutomatorName);

        $d(at._config.data.Destroy).each(function() {
            var id = at.ID;

            at.destroyer.push($(this).setData(at._config.data.KitID, id));

        }).click(function (e) {
            e.stopPropagation();

            Automator(AutomatorName).exit();

            return false;
        });
    }, false);

    Automator(DataCfg.Command, function() {
        var at = Automator(AutomatorName);

        $d(at._config.data.Command).each(function() {
            var id = at.ID;

            at.commander.push($(this).setData(at._config.data.KitID, id));

        }).click(function (e) {
            e.stopPropagation();

            Automator(AutomatorName).load($(this));

            return false;
        });
    }, false);
})(jQuery, jQuery.findData);

(function($) {
    'use strict';
    var Config = {
        handleDelay: 0,
        timeHanlder: setTimeout(function() {}, 0),
        scrollOwner: $(),
        scrollHolder: $(),

        onReachTop: [],
        onReachRight: [],
        onReachBottom: [],
        onReachLeft: [],
        onScrolling: [],

        enableEffect: true,
        effect: {
            default: function(range) {
                if (isNumber(range)) {
                    if (Config.enableEffect) {
                        Config.scrollOwner.animate({
                            scrollTop: range
                        }, 500);
                    } else {
                        Config.scrollOwner.scrollTop(range);
                    }
                }
            }
        }
    };

    var ScrollPos = function() {
        window.scrollPos = { dir: 'vertical', x: 'left', y: 'top' };

        // Getting Scroll Holder.
        Config.scrollOwner = $.findData('scroll-owner');
        Config.scrollHolder = $.findData('scroll-holder');

        if (Config.scrollOwner.length < 1) {
            Config.scrollOwner = $(window);
            Config.enableEffect = false;
        }
        if (Config.scrollHolder.length < 1) {
            Config.scrollHolder = $('body');
        }

        // Setting up scroller.
        Config.scrollHolder.setData('scroll-holder', scrollPos);

        var handleScroll = function() {
            // Getting Window Innser Size.
            var windWidth = innerWidth;
            var windHeight = innerHeight;

            // Getting Scroll Holder Size.
            var holdWidth = Config.scrollHolder.innerWidth();
            var holdHeight = Config.scrollHolder.innerHeight();

            // Getting End of X and Y.
            var right = (holdWidth - windWidth);
            var bottom = (holdHeight - windHeight);

            // Determine the Y position.
            if (scrollY === 0) {
                scrollPos.y = 'top';

                foreach(Config.onReachTop, function (func) {
                    func();
                });
            } else if (scrollY === bottom) {
                scrollPos.y = 'bottom';

                foreach(Config.onReachBottom, function (func) {
                    func();
                });
            } else {
                scrollPos.y = scrollY;

                if (scrollY > 0) {
                    scrollPos.dir = 'vertical';
                }

                foreach(Config.onScrolling, function (func) {
                    func();
                });
            }

            // Determine the X position.
            if (scrollX === 0) {
                scrollPos.x = 'left';

                foreach(Config.onReachLeft, function (func) {
                    func();
                });
            } else if (scrollX === right) {
                scrollPos.x = 'right';

                foreach(Config.onReachRight, function (func) {
                    func();
                });
            } else {
                scrollPos.x = scrollX;

                if (scrollX > 0) {
                    scrollPos.dir = 'horizontal';
                }

                foreach(Config.onScrolling, function (func) {
                    func();
                });
            }

            // Applying position to holder.
            Config.scrollHolder.setData('scroll-holder', scrollPos);
        };

        $(window).scroll(function() {
            if (isNumber(Config.handleDelay) && Config.handleDelay !== 0) {
                clearTimeout(Config.timeHanlder);

                Config.timeHanlder = setTimeout(handleScroll, Config.handleDelay);
            } else {
                handleScroll();
            }
        });
    };

    ScrollPos.prototype = {
        onReachTop: function(func) {
            if (isFunction(func)) {
                Config.onReachTop.push(func);
            } else if (isArray(func)) {
                foreach(func, function (func) {
                    if (isFunction(func)) {
                        Config.onReachTop.push(func);
                    }
                });
            }

            return this;
        },
        onReachRight: function(func) {
            if (isFunction(func)) {
                Config.onReachRight.push(func);
            } else if (isArray(func)) {
                foreach(func, function (func) {
                    if (isFunction(func)) {
                        Config.onReachRight.push(func);
                    }
                });
            }

            return this;
        },
        onReachBottom: function(func) {
            if (isFunction(func)) {
                Config.onReachBottom.push(func);
            } else if (isArray(func)) {
                foreach(func, function (func) {
                    if (isFunction(func)) {
                        Config.onReachBottom.push(func);
                    }
                });
            }

            return this;
        },
        onReachLeft: function(func) {
            if (isFunction(func)) {
                Config.onReachLeft.push(func);
            } else if (isArray(func)) {
                foreach(func, function (func) {
                    if (isFunction(func)) {
                        Config.onReachLeft.push(func);
                    }
                });
            }

            return this;
        },
        onScroll: function(func) {
            if (isFunction(func)) {
                Config.onScrolling.push(func);
            } else if (isArray(func)) {
                foreach(func, function (func) {
                    if (isFunction(func)) {
                        Config.onScrolling.push(func);
                    }
                });
            }

            return this;
        },
        setDelay: function(delay) {
            if (isNumber(delay)) {
                Config.handleDelay = delay;
            }

            return this;
        },
        addScrollEffect: function(name, func) {
            if (isString(name) && isFunction(func)) {
                Config.effect[name] = func;
            } else if (isObject(name)) {
                foreach(name, function (name, func) {
                    Config.effect[name] = func;
                });
            }

            return this;
        },
        scrollTop: function(range, effect) {
            if (isNumber(range)) {
                if (isString(effect) && Config.enableEffect) {
                    if (Config.effect.hasOwnProperty(effect)) {
                        Config.effect[effect](range);
                    } else {
                        Config.scrollOwner.scrollTop(range);
                    }
                } else {
                    Config.scrollOwner.scrollTop(range);
                }
            }

            return this;
        }
    };

    Automator('scroll-pos', ScrollPos);
})(jQuery);
/**
 * BabonJS.
 * ScrollDocker Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 10/29/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AutomatorName = 'scroll-docker';

    // Automator Configurations.
    var Config = {
        counter: 0,
        IDPrefix: 'scroll-docker-',
        allowReconfigure: false,
        clean: true,

        // Attributes Naming.
        data: {
            Kit: 'scroll-docker',
            KitID: 'scroll-docker-id',
            KitTrigger: 'scroll-docker-pos',
            KitState: 'scroll-docker-state',

            EnterClass: 'enter',
            LeaveClass: 'leave'
        },

        /* Object Collections */
        object: {},
        docker: {},
        dockenter: {},
        dockleave: {},

        /* Object Event Handler */
        enter: {},
        leave: {},
    };

    /* Creating Scroll Handler */
    Automator('scroll-pos').onScroll(function() {
        var wpos = window.scrollPos;

        foreach(Config.dockenter, function (pos, kit) {
            if (isNumber(wpos.y) && wpos.y >= pos) {
                if (kit.state !== Config.data.EnterClass) {
                    kit.state = Config.data.EnterClass;
                    kit.holder.setData(Config.data.KitState, Config.data.EnterClass).removeClass(Config.data.LeaveClass).addClass(Config.data.EnterClass);

                    if (Config.enter.hasOwnProperty(kit.config.handler)) {
                        Config.enter[kit.config.handler].apply(kit);
                    }
                }

                /* Get Outside */
                if (kit.config.outside === true) {
                    if (kit.state === Config.data.EnterClass) {
                        if (kit.outside !== true) {
                            if (wpos.y > kit.config.outsidepos) {
                                kit.outside = true;
                                kit.holder.toggleClass('outside');
                            }
                        } else if (kit.outside === true) {
                            if (wpos.y < kit.config.outsidepos) {
                                kit.outside = false;
                                kit.holder.toggleClass('outside');

                                if (Config.enter.hasOwnProperty(kit.config.handler)) {
                                    Config.enter[kit.config.handler].apply(kit);
                                }
                            }
                        }
                    }
                }
            }
        });
        foreach(Config.dockleave, function(pos, kit) {
            if (isNumber(wpos.y) && wpos.y <= pos) {
                if (kit.state === Config.data.EnterClass) {
                    kit.state = Config.data.LeaveClass;
                    kit.holder.setData(Config.data.KitState, Config.data.LeaveClass).removeClass(Config.data.EnterClass).addClass(Config.data.LeaveClass);

                    if (Config.leave.hasOwnProperty(kit.config.handler)) {
                        Config.leave[kit.config.handler].apply(kit);
                    }
                }
            }
        });
    });

    // ScrollDocker object.
    var ScrollDocker = function () {
        this.config = {
            handler: 'none',
            enterpos: 0,
            leavepos: 0,
            outside: true,
            outsidepos: 0
        };

        this.id = '';
        this.state = 'ready';
        this.holder = $('<div>');

        return this;
    };

    // ScrollDocker Object Prototypes.
    ScrollDocker.prototype = {
        // Change or add Kit properties.
        set: function (name, value) {
            if (isString(name) && isDefined(value)) {
                this[name] = value;
            } else if (isObject(name)) {
                var self = this;

                foreach(name, function (name, value) {
                    self[name] = value;
                });
            }

            return this;
        },
    };

    // Automator Constructor.
    var scrollDocker = function (object) {
        // Querying all kit if not defined.
        !isJQuery(object) && !isString(object) ? object = $d(Config.data.Kit) : object;

        // Checking if object is context.
        isString(object) ? object = $d(Config.data.Kit, object) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + Config.data.Kit + ')');

        // Iterating Objects.
        object.each(function () {
            /* Getting Kit ID or create new if not defined */
            var kit_id = $(this).getData(Config.data.KitID);
            if (!isString(kit_id)) {
                kit_id = Config.IDPrefix + (Config.counter + 1);

                /* Increasing Counter */
                Config.counter++;
            }

            /* Creating new Kit and asign ID */
            var Kit = new ScrollDocker().set({ 'id': kit_id, holder: $(this).setData(Config.data.KitID, kit_id) });

            /* Adding Kit to Collections */
            Config.object[kit_id] = Kit;

            /* Getting Configuration */
            var config = $(this).getData(Config.data.Kit);
            if (isObject(config)) {
                foreach(config, function (name, value) {
                    if (name === 'enterpos' || name === 'leavepos') {
                        if (isString(value)) {
                            if (value.search('%') > -1) {
                                value = Number(value.replace('%', ''));
                                value = (value / 100 * window.innerHeight);
                            } else {
                                value = Number(value);
                            }
                        }
                    }
                    Kit.config[name] = value;
                });
                if (!config.hasOwnProperty('leavepos')) {
                    Kit.config.leavepos = Kit.config.enterpos;
                }
            }

            /* Registering Docker to Scroll Handler */
            var kit_top = Kit.holder.offset().top;

            var dc_pos_etr = (kit_top - Kit.config.enterpos);
            var dc_pos_lve = (kit_top - Kit.config.leavepos);

            /* Configuring Outside Area */
            if (Kit.config.outside === true) {
                Kit.config.outsidepos = (dc_pos_etr + Kit.config.enterpos);
            }

            /* Writing Trigger Pos */
            Kit.holder.setData(Config.data.KitTrigger, { enter: dc_pos_etr, leave: dc_pos_lve });

            /* Registering Docker */
            Config.dockenter[dc_pos_etr] = Kit;
            Config.dockleave[dc_pos_lve] = Kit;

            /* Cleanup Data Tag */
            if (Config.clean === true) {
                foreach(Config.data, function(key, value) {
                    Kit.holder.remData(value);
                });
            }
        });

        return this;
    };

    // Automator Prototypes.
    scrollDocker.prototype = {
        addEnter: function(name, func) {
            if (isString(name) && isFunction(func)) {
                Config.enter[name] = func;
            } else if (isObject(name)) {
                foreach(name, function (name, func) {
                    Config.enter[name] = func;
                });
            }

            return this;
        },
        addLeave: function(name, func) {
            if (isString(name) && isFunction(func)) {
                Config.leave[name] = func;
            } else if (isObject(name)) {
                foreach(name, function (name, func) {
                    Config.leave[name] = func;
                });
            }

            return this;
        },

        // Configuring Automator.
        setup: function (name, value) {
            if (isString(name) && isDefined(value)) {
                Config[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    Config[name] = value;
                });
            } else {
                return Config;
            }

            return this;
        },
        config: function(name, value) {
            if (isString(name) && isDefined(value)) {
                Config.data[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    Config.data[name] = value;
                });
            } else {
                return Config.data;
            }

            return this;
        },

        // Selecting Kit Object by KitID.
        with: function (name) {
            if (Config.object.hasOwnProperty(name)) {
                return Config.object[name];
            }
        },
    };

    // Registering Automator including autobuild and default escape condition.
    Automator(AutomatorName, scrollDocker);
})(jQuery, jQuery.findData);

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

/**
 * Citraland Megah Batam.
 * Virtual Map Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 10/12/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name.
    var AutomatorName = 'virtual-map';

    // Automator Core Configuration.
    var Config = {
        counter: 0,
        IDPrefix: 'virtual-map-',
        allowReconfigure: false,
        allowEscape: true,

        // Constuctor Naming.
        data: {
            // HTML Data Attributes Naming.
            Kit: 'virtual-map',
            KitID: 'virtual-map-id',
            KitConfigured: 'virtual-map-configured',
            Pin: 'virtual-map-pin',
            PinID: 'virtual-map-pin-id',
            Info: 'virtual-map-info',
            InfoDestroy: 'virtual-map-info-destroy',

            // Data State.
            PinPlaced: 'placed',
            InfoActive: 'active',
        },

        hoverDelay: 200,
        hoverDelayHandler: setTimeout(function() {}, 0),

        map: {},
        initializer: {},
        effect: {
            default: function() {
                foreach(this.pins, function (pin) {
                    var pin = $(pin);

                    setTimeout(function() {
                        $(pin).addClass(Config.data.PinPlaced);
                    }, ($(pin).getData(Config.data.PinID) * 100));
                });

                return this;
            }
        },
        viewer: {
            default: function(index) {
                this.targetInfo.addClass(Config.data.InfoActive);
            }
        },
        destroyer: {
            default: function() {
                if (this.hasOwnProperty('targetInfo')) {
                    this.targetInfo.removeClass(Config.data.InfoActive);
                }
            }
        }
    };

    var VirtualMap = function() {
        // Kit Config.
        this.config = {
            baseWidth: 0,
            baseHeight: 0,
            action: 'click',
            effect: 'default',
            destroyer: 'default',
            viewer: 'default'
        };

        // Attributes Naming.
        this.cons = Config.data;

        // Kit Holder
        this.holder = $('<div>');

        return this;
    };

    VirtualMap.prototype = {
        insert: function() {

            return this;
        },
        set: function(key, value) {
            if (isString(key) && isDefined(value)) {
                this[key] = value;
            } else if (isObject(key)) {
                var self = this;

                foreach(key, function(key, value) {
                    self[key] = value;
                });
            }

            return this;
        },
        dropPins: function() {
            if (Config.effect.hasOwnProperty(this.config.effect) && isFunction(Config.effect[this.config.effect])) {
                Config.effect[this.config.effect].apply(this);
            }

            return this;
        },
        showInfo: function() {
            if (Config.viewer.hasOwnProperty(this.config.viewer) && isFunction(Config.viewer[this.config.viewer])) {
                Config.viewer[this.config.viewer].apply(this, arguments);
            }

            return this;
        },
        destroyInfo: function() {
            if (Config.destroyer.hasOwnProperty(this.config.destroyer) && isFunction(Config.destroyer[this.config.destroyer])) {
                Config.destroyer[this.config.destroyer].apply(this, arguments);
            }

            return this;
        }
    };

    /**
     * Virtual Map Automator.
     * @param object - jQuery object that contains attribute 'data-virtual-map'.
     * @constructor
     */
    var virtualMap = function (object) {
        !isJQuery(object) ? object = $d(Config.data.Kit) : object;

        // If object is jQuery object but it's not a virtual map, then use it as query context.
        if (isJQuery(object) && !object.hasData(Config.data.Kit)) object = $d(Config.data.Kit, object);

        // Initializing Map.
        object.each(function() {
            // Check if already configured and skip if not allowed.
            if (Config.allowReconfigure === false && $(this).getData(Config.data.KitConfigured) === true) return;

            // Creating Map ID if not defined.
            var map_id = $(this).getData(Config.data.KitID);
            if (!isString(map_id)) {
                map_id = Config.IDPrefix + (Config.counter + 1);

                // Applying Map ID to map holder.
                $(this).setData(Config.data.KitID, map_id);
            }

            // Creating new Map Object.
            var map = new VirtualMap().set({ holder: $(this), map_id: map_id });

            // Getting Map Config and applying config to map.
            var config = $(this).getData(Config.data.Kit);
            if (isObject(config)) {
                foreach(config, function(name, value) {
                    map.config[name] = value;
                });
            }

            // Enumerating Map Pins, Map Info, Map Info Destroyer.
            var pins = $d(Config.data.Pin, this).setData(Config.data.KitID, map_id);
            var infos = $d(Config.data.Info, this).setData(Config.data.KitID, map_id);
            var destroyers = $d(Config.data.InfoDestroy, this).setData(Config.data.KitID, map_id);

            // Adding map to collections.
            Config.map[map_id] = map;

            // Increasing Counter.
            Config.counter++;
        });

        // Reinitializing Map to prevent error if contains map inside map.
        foreach(Config.map, function (map_id, map) {
            // Checking if already configured and determine does it should be reconfigured or not.
            if (Config.allowReconfigure === false && map.holder.getData(Config.data.KitConfigured) === true) {
                return;
            } else {
                map.holder.setData(Config.data.KitConfigured, true);
            }

            // Enumerating Map Pin and Map Info to assign indexes.
            var pinQuery = {};
            pinQuery[Config.data.Pin] = '?';
            pinQuery[Config.data.KitID] = map_id;

            var pins = $d(pinQuery).each(function(idx) {
                // Applying Map Pin ID.
                $(this).setData(Config.data.PinID, (idx + 1));

                // Getting Pin Position.
                var pos = $(this).getData(Config.data.Pin);

                // Applying Pin Position.
                if (isObject(pos) && pos.hasOwnProperty('x') && pos.hasOwnProperty('y') && isNumber(pos.x) && isNumber(pos.y)) {
                    var x = ((pos.x / map.config.baseWidth) * 100);
                    var y = ((pos.y / map.config.baseHeight) * 100);

                    // Setting up pin position.
                    $(this).css({ left: x + '%', top: y + '%' });
                }

                // Binding Action.
                if (map.config.action === 'click' || map.config.action === 'mouseenter') {
                    $(this).bind(map.config.action, function(e) {
                        e.stopPropagation();

                        // Getting Map ID and Pin ID.
                        var id = $(this).getData(Config.data.KitID);
                        var ix = $(this).getData(Config.data.PinID);

                        // Getting Map Object.
                        var map_object = Automator(AutomatorName).with(id);

                        // Getting Target Info.
                        var target = map_object.infos.filter(':hasdata(' + Config.data.PinID + ', ' + ix + ')');

                        // Adding Target Info into Map Object.
                        map_object.set('targetInfo', target);

                        // Prevent hover mistakes if type of action is mouseenter using timeout. Otherwise, show the info.
                        if (map_object.config.action === 'mouseenter') {
                            Config.hoverDelayHandler = setTimeout(function() {
                                map_object.destroyInfo().showInfo(ix);
                            }, Config.hoverDelay);
                        } else {
                            map_object.destroyInfo().showInfo(ix);
                        }

                        return false;
                    });

                    if (map.config.action === 'mouseenter') {
                        $(this).mouseleave(function(e) {
                            e.stopPropagation();

                            clearTimeout(Config.hoverDelayHandler);

                            return false;
                        });
                    }
                }
            });

            // Map Info.
            var infoQuery = {};
            infoQuery[Config.data.Info] = '?'
            infoQuery[Config.data.KitID] = map_id;

            var infos = $d(infoQuery).each(function(idx) {
                // Applying Map Pin ID.
                $(this).setData(Config.data.PinID, (idx + 1));
            });

            // Binding Destroy Action.
            var destroyerQuery = {};
            destroyerQuery[Config.data.InfoDestroy] = '?';
            destroyerQuery[Config.data.KitID] = map_id;

            var destroyers = $d(destroyerQuery).click(function(e) {
                e.stopPropagation();

                var id = $(this).getData(Config.data.KitID);
                Automator(AutomatorName).with(id).destroyInfo();

                return false;
            });

            if (Config.allowEscape === true) {
                $(window).bind('keyup', function(e) {
                    if (e.keyCode === 27) {
                        Automator(AutomatorName).with(map_id).destroyInfo();
                    }
                });
            }

            // Adding Pins and Infos into Map Object.
            map.set({ pins: pins, infos: infos, destroyers: destroyers });

            // Dropping Pins.
            map.dropPins();

            // Calling Custom Initializer.
            foreach(Config.initializer, function(name, handler) {
                handler.apply(map);
            });
        });
    };

    virtualMap.prototype = {
        with: function(name) {
            if (isString(name) && Config.map.hasOwnProperty(name)) {
                return Config.map[name];
            }

            return this;
        },
        addInitializer: function(name, handler) {
            if (isString(name) && isFunction(handler)) {
                Config.initializer[name] = handler;
            } else if (isObject(name)) {
                foreach(name, function (name, handler) {
                    Config.initializer[name] = handler;
                });
            }

            return this;
        },
        addEffect: function(name, handler) {
            if (isString(name) && isFunction(handler)) {
                Config.effect[name] = handler;
            } else if (isObject(name)) {
                foreach(name, function (name, handler) {
                    Config.effect[name] = handler;
                });
            }

            return this;
        },
        addViewer: function(name, handler) {
            if (isString(name) && isFunction(handler)) {
                Config.viewer[name] = handler;
            } else if (isObject(name)) {
                foreach(name, function (name, handler) {
                    Config.viewer[name] = handler;
                });
            }

            return this;
        },
        setup: function(name, value) {
            if (isString(name) && isDefined(value)) {
                Config[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (name, value) {
                    Config[name] = value;
                });
            }

            return this;
        },
        getConfig: function() {
            return Config;
        }
    };

    Automator(AutomatorName, virtualMap).autobuild(true).escape(function () {
        if (Automator(AutomatorName).enabled === false) {
            return true;
        } else {
            return false;
        }
    });
})(jQuery, jQuery.findData);
