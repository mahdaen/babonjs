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

    /* Creating Babon Object */
    var xObject = function(obj) {
        if (isObject(obj)) {
            var tar = this;
            foreach(obj, function(key, value) {
                tar[key] = value;
            });
        }

        return this;
    };

    /* Creating Prototype */
    xObject.prototype = {
        keys: function() {
            return Object.keys(this);
        },
        length: function() {
            return this.keys().length;
        },
        sort: function() {
            var obj = new xObject();
            var obs = this;
            var key = this.keys().sort();
            foreach(key, function(key) {
                obj[key] = obs[key];
            });

            return obj;
        },
        del: function(key) {
            if (isString(key) && this.hasOwnProperty(key)) {
                delete this[key];
            } else if (isArray(key)) {
                var obj = this;
                foreach(key, function(key) {
                    delete obj[key];
                });
            }

            return this;
        },
        circle: function(dir) {
            var keys = this.keys();
            if (keys.length < 2) return this;

            var objn = new xObject();
            var objo = this;
            var skip = 0;

            if (isString(dir) && dir === 'reverse') {
                skip = (keys.length - 1);
                var skey = keys[skip];
                objn[skey] = objo[skey];
            }

            foreach(keys, function(key, idx) {
                if (idx !== skip) objn[key] = objo[key];
            });

            if (!isString(dir)) {
                var skey = keys[skip];
                objn[skey] = objo[skey];
            }

            return objn;
        },
        each: function(func) {
            if (isFunction(func)) {
                foreach(this, func);
            }

            return this;
        }
    };

    /* Applying Native Object prototypes */
    foreach(Object.prototype, function(key, value) {
        xObject.prototype[key] = value;
    });

    /* Extended Array */
    var xArray = function(array) {
        !array ? array = [] : array;

        if (isArray(array)) {
            var obj = this;
            foreach(array, function(value, index) {
                obj.push(value);
            });
        }
        return this;
    };

    /* Cloning native array prototypes */
    xArray.prototype = Object.create(Array.prototype);

    /* Creating custom prototypes */
    var xAProto = {
        each: function(func) {
            if (isFunction(func)) {
                foreach(this, func);
            }

            return this;
        },
        del: function(index) {
            var on = new xArray();
            if (isString(index)) {
                index = this.indexOf(index);
            }
            if (isNumber(index)) {
                var odd = this;
                foreach(odd, function(val, idx) {
                    if (idx !== index) {
                        on.push(val);
                    }
                });
            } else if (isArray(index)) {
                on = this;
                foreach(index, function(val, idx) {
                    on = on.del(val);
                });
            }

            return on;
        },
        circle: function(dir) {
            !dir ? dir = 'backward' : dir;
            var arr = new xArray();

            if (dir === 'backward') {
                var odd = this;
                foreach(odd, function(val, idx) {
                    if (idx !== 0) arr.push(val);
                });
                arr.push(this[0]);
            } else if (dir === 'forward') {
                var ln = (this.length - 1);
                arr.push(this[ln]);
                var odd = this;
                foreach(odd, function(val, idx) {
                    if (idx !== ln) arr.push(val);
                });
            }

            return arr;
        }
    };

    /* Applying custom prototypes */
    foreach(xAProto, function(key, value) {
        xArray.prototype[key] = value;
    });

    Extend({
        xObject: function(OBJECT) {return new xObject(OBJECT)},
        xArray: function(ARRAY) {return new xArray(ARRAY)},
        __extend__: Extend
    });
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

    // Css Object Getter.
    $.fn.style = function() {
        var style = this.attr('style').replace(/\s+\;/g, ';');
        var stlis = {};

        style = style.split(';');

        for (var i = 0; i < style.length; ++i) {
            var next = style[i];


            if (typeof next === 'string' && next.length > 0) {
                next = next.replace(/\:\s+/g, ':').split(':');
                var key = next[0].replace(/\s+/g, '');

                stlis[key] = next[1];
            }
        }

        return stlis;
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
    
    window.$_data = $.findData = DataFinder;
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
        window.Registry = registry();
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
    /* Escape when no jQuery defined */
    if (typeof jQuery === 'undefined') return console.error('BabonKit requires: jQuery 1.10+ and Enquire!');

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
                        this._constructor = function(){};
                        this._constructor.id = name;
                        this._constructor.func = builder;

                        this.auto = true;
                        this.dont = [];
                        this._constructor.hand = {};

                        this._constructor.type = 'automator';

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

    /* Binding auto-builder to the window on-ready */
    $(document).ready(function() {
        foreach(AutomatorMaps.prebuilds, function (name) {
            if (isString(name) && AutomatorMaps.prebuilds.indexOf(name) !== -1) {
                Automator(name).build();
            }
        });
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

    /**
     * Core Automator Generator. Use it when you want to create automator and need to add your own prototypes.
     * @type {Automator}
     */
    automator.core = Automator;

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

    window.$_media = window.atmedia = function(STR_QUERY) {return new _MQ_(STR_QUERY)};
})(enquire);
(function($, $d) {
    'use strict';

    var Config = {
        counter: 0,
        groups: 0,

        active: 'down',
        effect: 'default',
        hover: false,
        IDPrefix: 'accordion-',
        closeOthers: true,

        effectHandler: {
            classic: function(data) {
                var button = data.button,
                    content = data.content;

                if (data.hasOwnProperty('recent')) {
                    var all_button = data.recent.buttons;
                    var all_content = data.recent.contents;

                    all_button.removeClass(Config.active);
                    all_content.removeClass(Config.active);
                }

                button.toggleClass(Config.active);
                content.toggleClass(Config.active);

                return data;
            },
            default: function(data) {
                var button = data.button,
                    content = data.content;

                if (data.hasOwnProperty('recent')) {
                    var all_button = data.recent.buttons;
                    var all_content = data.recent.contents;

                    all_button.removeClass(Config.active);
                    all_content.slideUp();
                }

                button.toggleClass(Config.active);
                content.slideToggle();

                return data;
            }
        }
    };

    Registry('accordion-kit:config', Config, {lock: true, key: 'ACC-001'});

    /**
     * Simple Accordion Kit.
     * @param object
     * @constructor
     */
    var AccordionKit = function(object) {
        !isJQuery(object) ? object = $d('accordion-kit') : object;

        object.each(function () {
            var index = (Config.counter + 1);
            var ac_id = (Config.IDPrefix + index);

            $(this).setData('accordion-kit', ac_id);

            var content = $d('accordion-content', this).setData('accordion-id', ac_id);
            var buttons = $d('accordion-button', this).setData('accordion-id', ac_id)

            buttons.each(function() {
                var ac_st = $(this).getData('accordion-action');

                if (ac_st !== 'initialised') {
                    $(this).setData('accordion-action', 'initialised');

                    $(this).click(function(e) {
                        e.stopPropagation();

                        /* Getting Accordion ID and Group ID */
                        var ac_id = $(this).getData('accordion-id');
                        var ac_gp = $(this).getData('accordion-group-id');

                        /* Getting Current Button and Content */
                        var button = $(this);
                        var content = $d({ 'accordion-content': '?', 'accordion-id': ac_id });

                        /* Getting Handler Name */
                        var model = $d({ 'accordion-kit': ac_id }).getData('accordion-effect');

                        if (!isString(model)) {
                            model = Config.effect;
                        }

                        /* Getting Handler Function */
                        var handler = Config.effectHandler.classic;
                        if (Config.effectHandler.hasOwnProperty(model)) {
                            handler = Config.effectHandler[model];
                        }

                        /* Determine whether grouped or not */
                        if (isString(ac_gp) && Config.closeOthers === true && $(this).hasClass(Config.active) === false) {
                            /* If grouped, getting the recents active accordion */
                            var ct_all = $d({ 'accordion-content': '?', 'accordion-group-id': ac_gp });
                            var bt_all = $d({ 'accordion-button': '?', 'accordion-group-id': ac_gp });

                            handler({
                                button: button,
                                content: content,
                                recent: {
                                    buttons: bt_all,
                                    contents: ct_all
                                }
                            });
                        } else {
                            handler({
                                button: button,
                                content: content
                            });
                        }

                        return false;
                    });

                    if (Config.hover === true) {
                        $(this).mouseenter(function() {
                            $(this).click();
                        });
                    }
                }
            });

            Config.counter++;
        });

        return this;
    };
    AccordionKit.prototype = {
        setup: function(option) {
            if (isObject(option)) {
                foreach(option, function(key, value) {
                    Config[key] = value;
                });
            }

            return this;
        },
        addEffectHanlder: function(name, func) {
            if (isString(name) && isFunction(func)) {
                Config.effectHandler[name] = func;
            }

            return this;
        }
    };

    var AccordionGroup = function(object) {
        !isJQuery(object) ? object = $d('accordion-group') : object;

        object.each(function() {
            var index = (Config.groups + 1);
            var gp_id = (Config.IDPrefix + 'group-' + index);

            $(this).setData('accordion-group', gp_id);

            $(':hasdata(accordion-kit), :hasdata(accordion-button), :hasdata(accordion-content)', this).setData('accordion-group-id', gp_id);

            Config.groups++;
        });
    };

    Automator('accordion-kit', AccordionKit).autobuild(true).escape(function() {
        if (Automator('accordion-kit').enabled === false) {
            return true;
        } else {
            return false;
        }
    });

    Automator('accordion-group', AccordionGroup).autobuild(true).escape(function() {
        if (Automator('accordion-group').enabled === false) {
            return true;
        } else {
            return false;
        }
    });
})(jQuery, jQuery.findData);

/**
 * Background Automator.
 */
(function($, $d) {
    'use strict';

    var Config = {
        responsive: true,
        retina: true,
        replace: false
    };

    /**
     * Dynamic Background Automator.
     * @param object - jQuery object thats hold background.
     * @returns {DynamicBackround}
     * @constructor
     */
    var DynamicBackround = function(object) {
        !isJQuery(object) ? object = $d('bg-dynamic') : object;

        object.each(function(idx) {
            var img_src = $(this).getData('bg-dynamic');
            var new_src = '';

            if (img_src === 'get-child-img') {
                img_src = $('img', this).attr('src');
            }

            if (isString(img_src)) {
                var img_url = parseURL(img_src);

                if (isObject(img_url)) {
                    /* Proccessing Responsive Background */
                    if (Config.responsive == true) {
                        if (window['is-mobile'] === true) {
                            /* Device is Mobile */
                            new_src = img_url.root + img_url.name + '.mobile.';
                        } else if (window['is-tablet'] === true) {
                            /* Device is Tablet */
                            new_src = img_url.root + img_url.name + '.tablet.';
                        } else {
                            /* Device is Desktop */
                            new_src = img_url.root + img_url.name + '.';
                        }
                    } else {
                        /* Skitp responsive if disabled */
                        new_src = img_url.root + img_url.name + '.';
                    }

                    /* Proccessing Retina Backround */
                    if (Config.retina == true) {
                        /* Proccess if enabled */
                        if (window['is-retina'] === true) {
                            /* Device is Retina */
                            new_src += 'retina.' + img_url.ext;
                        } else {
                            /* Device is non Retina */
                            new_src += img_url.ext;
                        }
                    } else {
                        /* Skip when disabled */
                        new_src += img_url.ext;
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

                    if (Config.replace === true) {
                        target.remData('bg-dynamic');
                    }
                }
            }
        });

        return this;
    };
    DynamicBackround.prototype = {
        setup: function(object) {
            if (isObject(object)) {
                foreach(object, function (key, value) {
                    Config[key] = value;
                });
            }

            return this;
        }
    }

    Automator('bg-dynamic', DynamicBackround).autobuild(true).escape(function() {
        if (Automator('bg-dynamic').enable === false) {
            return true;
        } else {
            return false;
        }
    });
})(jQuery, jQuery.findData);


/**
 * Box Automator.
 */
(function($, $d) {
    'use strict';

    /**
     * Maintain aspect ratio by width.
     * @param object - Object that has attribute 'data-box-ratio'. Leave blank to scan all box.
     * @returns {BoxRatio}
     * @constructor
     */
    var BoxRatio = function(object) {
        !isJQuery(object) ? object = $d('box-ratio') : object;

        object.each(function() {
            var box_width = $(this).width();
            var box_ratio = $(this).getData('box-ratio');
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
        });

        return this;
    };

    /* Registering Box Ratio Automator */
    Automator('box-maintain-ratio', BoxRatio).autobuild(true).escape(function() {
        if (Automator('box-maintain-ratio').enabled === false) {
            return true;
        } else {
            return false;
        }
    });
    /* Adding Automator to jQuery plugin */
    $.fn.maintainRatio = function() {
        Automator('box-maintain-ratio').build(this);

        return this;
    }

    /**
     * Maintain Box Height.
     * @param object - jQuery object that contains child-box.
     * @constructor
     */
    var BoxHeight = function(object) {
        !isJQuery(object) ? object = $d('box-height') : object;

        object.each(function(idx) {
            var parent_height = 0;
            var mode = $(this).getData('box-height');

            var box_parent = $(this).getData('box-parent');

            if (!box_parent) box_parent = 'box-' + (idx + 1);
            $(this).setData('box-parent', box_parent);

            var child_box = $d('box-child', this);
            child_box.setData('box-parent', box_parent);

            child_box = $d({
                'box-child': '?',
                'box-parent': box_parent
            });

            foreach(child_box, function(obj, i) {
                var ch = $(obj).height();

                if (ch > parent_height) {
                    parent_height = ch;
                }
            });

            if (mode === 'capture-children' && parent_height > 0) {
                $(this).height(parent_height);
            } else if (mode === 'fill-children' && parent_height > 0) {
                child_box.height(parent_height);
            }
        });

        return this;
    };

    Automator('box-maintain-height', BoxHeight).autobuild(true).escape(function() {
        if (Automator('box-maintain-height').enabled === false) {
            return true;
        } else {
            return false;
        }
    });
    $.fn.maintainHeight = function() {
        Automator('box-maintain-height').build(this);

        return this;
    }

    /**
     * Maintain box height by row group.
     * @param object - jQuery object thats hold box.
     * @returns {BoxHeightGroup}
     * @constructor
     */
    var BoxHeightGroup = function(object) {
        !isJQuery(object) ? object = $d('box-height-group') : object;

        var groups = [];
        /* Indexing Groups */
        foreach(object, function(dom) {
            var groupId = $(dom).getData('box-height-group');
            if (groupId && groups.indexOf(groupId) < 0) {
                groups.push(groupId);
            }
        });

        /* Parsing Groups */
        foreach(groups, function(groupId) {
            var grouped_object = $d('box-height-group', groupId);

            if (grouped_object) {
                var high = 0, height;

                foreach(grouped_object, function(dom) {
                    if ($(dom).height() > high) {
                        high = $(dom).height();
                    }
                });

                if (high > 0) {
                    grouped_object.height(high);
                }
            }
        });

        return this;
    };

    Automator('box-maintain-height-group', BoxHeightGroup).autobuild(true).escape(function() {
        if (Automator('box-maintain-height-group').enabled === false) {
            return true;
        } else {
            return false;
        }
    });
    $.fn.maintainHeightGroup = function() {
        Automator('box-maintain-height-group').build(this);

        return this;
    }
})(jQuery, jQuery.findData);


(function($, $d) {
    'use strict';

    var Config = {
        counter: 0,
        IDPrefix: 'dropdown-',

        allowReconfigure: false,

        animator: {
            /**
             * Default Dropdown showing effect.
             * @param data
             */
            default: function(data) {
                if (data.state === 'down') {
                    data.parent.remData('toggle-state').removeClass('down');
                    data.button.remData('toggle-state').removeClass('down');
                    data.list.remData('toggle-state').removeClass('down');
                } else if (data.state === 'up') {
                    Automator('toggle-state-destroyer').build(false);

                    data.parent.setData('toggle-state', 'down').addClass('down');
                    data.button.setData('toggle-state', 'down').addClass('down');
                    data.list.setData('toggle-state', 'down').addClass('down');
                }
            }
        },
        handler: {
            default: function (data) {
                data.active.setData('dropdown-item', 'ready').removeClass('current');
                data.target.setData('dropdown-item', 'current').addClass('current');

                data.label.html(data.target.html());
            }
        }
    };

    var DropDown = function(object) {
        !isJQuery(object) ? object = $d('dropdown-kit') : object;

        object.each(function() {
            if (Config.allowReconfigure === false && $(this).getData('dropdown-configured') === true) {
                return;
            } else {
                $(this).setData('dropdown-configured', true);
            }

            var index = (Config.counter + 1);
            var dd_id = (Config.IDPrefix + index);

            var dd_tp = $(this).setData('dropdown-id', dd_id).getData('dropdown-kit');

            var button = $d('dropdown-button', this).setData('dropdown-id', dd_id);
            var list = $d('dropdown-list', this).setData('dropdown-id', dd_id);

            if (dd_tp === 'select') {
                var label = $d('dropdown-label', this).setData('dropdown-id', dd_id);
                var first;

                var items = $d('dropdown-item', this).setData('dropdown-id', dd_id).each(function(idx) {
                    var isCur = $(this).getData('dropdown-item');

                    if (idx === 0) {
                        label.html($(this).html());
                        $(this).setData('dropdown-item', 'current').addClass('current');

                        first = this;
                    }

                    if (isCur === 'current') {
                        label.html($(this).html());
                        $(this).addClass('current');

                        $(first).setData('dropdown-item', 'ready').removeClass('current');
                    }

                    $(this).click(function(e) {
                        e.stopPropagation();

                        /* Toggling the dropdown */
                        Automator('toggle-state-destroyer').build(false);

                        /* Skip if already active */
                        if ($(this).getData('dropdown-item') === 'current') return false;

                        var dd_id = $(this).getData('dropdown-id');

                        var target = $(this);
                        var parent = $d({ 'dropdown-kit': '?', 'dropdown-id': dd_id });

                        var onselect = parent.getData('dropdown-onselect');

                        var active = $d({ 'dropdown-item': 'current', 'dropdown-id': dd_id }, parent);

                        var label = $d({ 'dropdown-label': '?', 'dropdown-id': dd_id }, parent);
                        var button = $d({ 'dropdown-button': '?', 'dropdown-id': dd_id }, parent);
                        var list = $d({ 'dropdown-list': '?', 'dropdown-id': dd_id }, parent);

                        Config.handler.default({
                            target: target,
                            active: active,
                            label: label,

                            button: button,
                            parent: parent,
                            list: list
                        });

                        if (isString(onselect) && Config.handler.hasOwnProperty(onselect)) {
                            Config.handler[onselect]({
                                target: target,
                                active: active,
                                label: label,

                                button: button,
                                parent: parent,
                                list: list
                            });
                        }

                        return false;
                    });
                });
            }

            Config.counter++;

            button.click(function(e) {
                e.stopPropagation();

                var dd_id = $(this).getData('dropdown-id');
                var state = $(this).getData('toggle-state');
                var effect = $(this).getData('dropdown-effect');

                if (!state) {
                    state = 'up';
                }

                var parent = $d({ 'dropdown-kit': '?', 'dropdown-id': dd_id });
                var button = $d({ 'dropdown-button': '?', 'dropdown-id': dd_id }, parent);
                var list = $d({ 'dropdown-list': '?', 'dropdown-id': dd_id }, parent);

                if (!isString(effect) || !Config.animator.hasOwnProperty(effect)) {
                    effect = 'default';
                }

                Config.animator[effect]({
                    state: state,
                    parent: parent,
                    button: button,
                    list: list
                });

                return false;
            });
        });

        return this;
    };

    DropDown.prototype = {
        setup: function(object) {
            if (isObject(object)) {
                foreach(object, function (key, value) {
                    Config[key] = value;
                });
            }

            return this;
        },
        addEffect: function(name, func) {
            if (isString(name) && isFunction(func)) {
                Config.animator[name] = func;
            }

            return this;
        },
        addHandler: function(name, func) {
            if (isString(name) && isFunction(func)) {
                Config.handler[name] = func;
            }

            return this;
        }
    }

    Automator('dropdown-kit', DropDown).autobuild(true).escape(function() {
        if (Automator('dropdown-kit').enabled === false) {
            return true;
        } else {
            return false
        }
    });
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
    Automator('google-map', GoogleMap.Basic).autobuild(true).escape(function() {
        if (Automator('google-map').enabled === false) {
            return true;
        } else {
            return false;
        }
    });

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

/* CONTENT SLIDER KITS */
(function($, $$, $$$) {
    Registry('content-slider:count', 0, {lock: true, key: 'CSL-001'});

    __extend__({
        __sliderlist: []
    });

    var xParser = function(object) {
        if (!isJQuery(object)) {
            object = $$$('content-slider-kit');
        } else {
            if (object.length == 1 && !object.hasData('content-slider-kit')) {
                object = $$$('content-slider-kit', object);
            }
        }

        return object.each(function() {
            var index = Registry('content-slider:count').value;
            /* Creating Slider ID */
            var slider_id = (index + 1);

            /* Writing slider ID to all instance */
            $(this).setData('slider-id', slider_id);

            /* Parsing each Slider item and registering ID */
            $$$('slider-item', this).setData('slider-id', slider_id).each(function(index) {
                /* Creating Slider item ID */
                var item_id = (index + 1);
                /* Writing Slider item ID */
                $(this).setData('slider-item-id', item_id);

                /* Activating first slider */
                if (item_id === 1) {
                    $(this).setData('slider-state', 'active').addClass('active');
                }
            });

            /* Parsing each Slider Selector and registering ID */
            $$$('slider-select', this).setData('slider-id', slider_id).each(function(index) {
                /* Creating Slider item ID */
                var item_id = (index + 1);
                /* Writing Slider item ID */
                $(this).setData('slider-item-id', item_id);

                /* Activating first slider */
                if (item_id === 1) {
                    $(this).setData('slider-state', 'active').addClass('active');
                }
            });

            /* Parsing navigator */
            $$$('slider-next', this).setData('slider-id', slider_id);
            $$$('slider-prev', this).setData('slider-id', slider_id);

            Registry('content-slider:count').update((index + 1), 'CSL-001');
        });
    }
    var xAnimator = {};
    var xSlider = function(root) {
        if (isString(root)) {
            var jq = $(':hasdata(content-slider-kit).' + root);
            if (isJQuery(jq) && jq.length === 1) {
                return new xSlider(jq);
            }
        }

        if (!isJQuery(root) || !root.hasData('slider-id')) return;

        var handler = this;

        this.parent = root;
        this.slider = $$$('slider-item', root);

        /* Parsing Slider Effect */
        this.effect = root.getData('slider-effect');
        if (!isString(this.effect)) {
            this.effect = 'simple';
        }

        /* Parsing Slider Config */
        this.anim_config = root.getData('slider-config');
        if (!isObject(this.anim_config)) {
            this.anim_config = {
                speed: 1,
                easing: 'Linear.easeInOut'
            }
        }

        /* Binding Selector Actions */
        this.select = $$$('slider-select', root).each(function() {
            $(this).click(function() {
                if ($(this).hasData('slider-state')) return false;
                handler.navigate($(this));

                return false;
            });
        });

        /* Binding Navigator Actions */
        this.next = $(':hasdata(slider-next)', root).click(function() {
            handler.navigate('next');

            return false;
        });
        this.prev = $(':hasdata(slider-prev)', root).click(function() {
            handler.navigate('prev');

            return false;
        });

        return this;
    }
    xSlider.prototype = {
        navigate: function(direction) {
            var handler = this;
            if (isJQuery(direction)) {
                var item_id = direction.getData('slider-item-id');

                handler.current = $$$({
                    'slider-item': '?',
                    'slider-state': 'active'
                }, handler.parent);

                handler.target = $$$({
                    'slider-item': '?',
                    'slider-item-id': String(item_id),
                }, handler.parent);
            } else if (isString(direction)) {
                handler.current = $$$({
                    'slider-item': '?',
                    'slider-state': 'active'
                }, handler.parent);

                var cr = handler.current.getData('slider-item-id');
                var to = 1;

                if (direction === 'next') {
                    if (cr === handler.slider.length) {
                        to = 1;
                    } else {
                        to = cr + 1;
                    }
                } else if (direction === 'prev') {
                    if (cr === 1) {
                        to = handler.slider.length;
                    } else {
                        to = cr - 1;
                    }
                }

                handler.target = $$$({
                    'slider-item': '?',
                    'slider-item-id': String(to)
                }, handler.parent);
            }

            /* Animating Content */
            this.animate();

            return this;
        },
        animate: function(option) {
            xAnimator[this.effect]({
                active: this.current,
                target: this.target,
                config: this.anim_config,
                slider: this
            });

            return this;
        },
        swap: function() {
            var c_id = this.current.getData('slider-item-id');
            var t_id = this.target.getData('slider-item-id');

            this.current.removeClass('active').remData('slider-state');
            this.target.addClass('active').setData('slider-state', 'active');
            $$$({
                'slider-select': '?',
                'slider-item-id': String(c_id)
            }, this.parent).removeClass('active').remData('slider-state');
            $$$({
                'slider-select': '?',
                'slider-item-id': String(t_id)
            }, this.parent).addClass('active').setData('slider-state', 'active');

            return this;
        }
    }

    /* Creating animaton maker */
    xSlider.animator = function(name, func) {
        if (isString(name) && isFunction(func)) {
            return xAnimator[name] = func;
        } else if (isObject(name)) {
            foreach(name, function(name, func) {
                if (isString(name) && isFunction(func)) {
                    xAnimator[name] = func;
                }
            });
        }
    };

    // Simple slider handler.
    xSlider.animator('simple', function(data) {
        data.slider.swap();
    });

    /* Creating prebuilt animation */
    xSlider.animator('fade', function(data) {
        var speed = 1;

        if (isNumber(data.config.speed)) {
            speed = data.config.speed;
        }

        /* Fading Out Active Slider */
        TweenMax.to(data.active, speed, {
            opacity: 0,
            ease: Linear.easeInOut,
            onCompleteParams: [data.slider, data.active],
            onComplete: function(slider, active) {
                active.css('display', '');
                slider.swap();
            }
        });

        /* Fading In Target Slider */
        data.target.css({
            opacity: 0,
            display: 'block'
        });
        TweenMax.to(data.target, speed, {
            opacity: 1,
            ease: Linear.easeInOut
        });

        return data.slider;
    });

    /* Registering automator */
    Automator('content-slider', function(object) {
        object = xParser(object);

        foreach(object, function(slider) {
            __sliderlist.push(new xSlider($(slider)));
        });

        this.list = __sliderlist;

        return this;
    })
        .autobuild(true)
        .escape(function() {
            if (Automator('content-slider').enabled() === false) {
                return true;
            } else {
                return false;
            }
        }
    );

    __extend__({
        xSlider: function(object) {return new xSlider(object)},
        xSliderAnimator: xSlider.animator
    });

})(jQuery, Automator, jQuery.findData);
/**
 * Tab Kit Automator.
 */
(function($, $d) {
    'use strict';

    var Config = {
        counter: 0,
        IDPrefix: 'tab-',

        allowReconfigure: false,

        handler: [],
        animator: {
            default: function(data) {
                /* Deactivate current tab */
                data.active.remData('tab-state').removeClass('current');

                /* Activating this tab */
                data.target.setData('tab-state', 'current').addClass('current');

                if (data.handle.length > 0) {
                    foreach(data.handle, function (handler) {
                        handler({
                            active: data.active,
                            target: data.target
                        });
                    });
                }

                return this;
            }
        }
    };

    Registry('tab-kit:config', Config, {lock: true, key: 'TAB-001'});

    /**
     * Tab Automator Kit.
     * @param object - jQuery object that hold the tab kit.
     * @return {TabKit}
     * @constructor
     */
    var TabKit = function(object) {
        !isJQuery(object) ? object = $d('tab-kit') : object;

        /* Enumerating Object to assign ID. Prevent issues when we have Tab inside Tab */
        object.each(function() {
            /* Skip if reconfigure is not allowed and tab already configured */
            if (Config.allowReconfigure === false && $(this).getData('tab-configured') === true) return;

            var index = (Config.counter + 1);
            var ta_id = (Config.IDPrefix + index);

            $(this).setData('tab-kit', ta_id);

            /* Embedding Tab ID */
            $d('tab-button', this).setData('tab-id', ta_id);
            $d('tab-content', this).setData('tab-id', ta_id);

            Config.counter++;
        });

        /* Enumerating Indexes and assigning events. */
        foreach(Config.counter, function (index) {
            var tab_id = (Config.IDPrefix + (index + 1));
            var tab_ct = $d({ 'tab-kit': tab_id });
            var tab_cs = tab_ct.getData('tab-configured');

            /* Skip if reconfigure is not allowed and tab already configured */
            if (Config.allowReconfigure === false && tab_cs === true) {
                return;
            } else if (Config.allowReconfigure === true && tab_cs === true) {
                tab_ct.setData('tab-configured', 'reconfigured');
            } else {
                tab_ct.setData('tab-configured', true);
            }

            var tab_ef = tab_ct.getData('tab-effect');

            if (!isString(tab_ef) || !Config.animator.hasOwnProperty(tab_ef)) {
                tab_ef = 'default';
            }

            /* Enumerating Buttons */
            var buttons = $d({ 'tab-button': '?', 'tab-id': tab_id }).setData('tab-effect', tab_ef);

            /* Enumerating Buttons */
            var content = $d({ 'tab-content': '?', 'tab-id': tab_id });

            /* Configuring buttons */
            buttons.each(function(idx) {
                var idx = (idx + 1);
                var stt = $(this).getData('action-state');

                $(this).setData('tab-index', idx);

                if (idx === 1) {
                    $(this).setData('tab-state', 'current').addClass('current');
                }

                if (!stt) {
                    $(this).setData('action-state', 'initialised');

                    /* Binding Action */
                    $(this).click(function() {
                        if ($(this).getData('tab-state') === 'current') return false;

                        var tab_id = $(this).getData('tab-id');
                        var tab_ix = $(this).getData('tab-index');
                        var tab_ef = $(this).getData('tab-effect');

                        var active = $(':hasdata(tab-id, ' + tab_id + '):hasdata(tab-state, current)');
                        var target = $(':hasdata(tab-id, ' + tab_id + '):hasdata(tab-index, ' + tab_ix + ')');

                        Config.animator[tab_ef]({
                            active: active,
                            target: target,
                            handle: Config.handler
                        });

                        return false;
                    });
                }
            });

            /* Configuring contents */
            content.each(function(idx) {
                var idx = (idx + 1);

                $(this).setData('tab-index', idx);

                if (idx === 1) {
                    $(this).setData('tab-state', 'current').addClass('current');
                }
            });
        });

        return this;
    };

    /* TabKit Prototype */
    TabKit.prototype = {
        /**
         * Add Callback to TabKit.
         * @param func - Javascript function that handle tab changes. We give argument {active, target}.
         * @return {TabKit}
         */
        addCallback: function(func) {
            if (isFunction(func)) {
                Config.handler.push(func);
            }

            return this;
        },

        /**
         * Add Custom Effect Handler to TabKit.
         * @param name - String the effect name. e.g: fade
         * @param func - Function that handle the effect. We give argument {active, target, handle}. You've to Execute all callback in 'handle' object after finishing effect.
         * @return {TabKit}
         */
        addEffect: function(name, func) {
            if (isString(name) && isFunction(func)) {
                Config.animator[name] = func;
            }

            return this;
        },

        /**
         * Configuring TabKit.
         * @param object - Object contains config key and value. Avaliable key: IDPrefix [default: "tab-"], allowReconfigure [default: false]
         * @return {TabKit}
         */
        setup: function(object) {
            if (isObject(object)) {
                foreach(object, function (key, value) {
                    Config[key] = value;
                });
            }

            return this;
        }
    }

    /* Registering TabKit into Automator */
    Automator('tab-kit', TabKit).autobuild(true).escape(function() {
        if (Automator('tab-kit').enabled === false) {
            return true;
        } else {
            return false;
        }
    });
})(jQuery, jQuery.findData);

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

/**
 * Citraland Megah Batam.
 * Content Rotator Automator Scripts.
 * Language: Javascript.
 * Created by mahdaen on 10/13/14.
 * License: GNU General Public License v2 or later.
 */

(function ($, $d) {
    'use strict';

    // Automator Name Variable.
    var AutomatorName = 'content-rotator';

    // Rotator Main Configuration.
    var Config = {
        counter: 0,
        IDPrefix: 'rotator-',
        allowReconfigure: false,

        // Constructor Naming.
        data: {
            // HTML Data Attributes Naming.
            Kit: 'content-rotator',
            KitID: 'content-rotator-id',
            KitConfigured: 'content-rotator-configured',

            Item: 'content-rotator-item',
            ItemID: 'content-rotator-item-id',
            ItemState: 'content-rotator-item-state',

            Prev: 'content-rotator-prev',
            Next: 'content-rotator-next',
            Select: 'content-rotator-select',

            Progress: 'content-rotator-progress',

            // Data State Naming.
            ItemActive: 'active',

            ProgressStopped: 'stopped',
            ProgressPaused: 'paused',

            NavigateNext: 'forward',
            NavigatePrev: 'backward'
        },

        rotator: {},
        animator: {
            default: function() {
                this.swap();
            },
            fade: function() {
                var self = this;

                self.active.fadeOut();
                self.target.fadeIn();

                self.swap();
            }
        }
    };

    // Rotator Object.
    var ContentRotator = function() {
        // Rotator Object Configuration.
        this.config = {
            // Auto rotate Items.
            auto: false,

            // Animation Name.
            animationName: 'default',

            // Animation Speed.
            animationSpeed: 0
        };

        // Attributes Naming.
        this.cons = Config.data;

        // Creating temporary holder.
        this.holder = $('<div>');

        return this;
    };

    // Rotator Prototypes.
    ContentRotator.prototype = {
        navigate: function(direction) {
            var next = 0;

            if (isString(direction)) {
                // Handle for next and prev navigation.
                if (direction === Config.data.NavigateNext) {
                    if (this.current === this.total) {
                        next = 1;
                    } else {
                        next = (this.current + 1);
                    }
                } else if (direction === Config.data.NavigatePrev) {
                    if (this.current === 1) {
                        next = this.total;
                    } else {
                        next = (this.current - 1);
                    }
                } else {
                    return this;
                }

                this.target = this.items.filter(':hasdata(' + Config.data.ItemID + ', ' + next + ')');
                this.current = next;
            } else if (isNumber(direction) && direction >= 1 && direction <= this.total) {
                // Handle for index specific navigation.
                this.target = this.items.filter(':hasdata(' + Config.data.ItemID + ', ' + direction + ')');
                this.current = direction;
            }

            // Animating Items.
            this.animate();

            return this;
        },
        animate: function() {
            var anim = this.config.animationName;

            if (Config.animator.hasOwnProperty(anim) && isFunction(Config.animator[anim])) {
                Config.animator[anim].apply(this);
            } else {
                this.swap();
            }

            return this;
        },
        swap: function() {
            // Deactivating Active Item.
            this.active.removeClass(Config.data.ItemActive).remData(Config.data.ItemState);

            // Activating Target Item.
            this.target.addClass(Config.data.ItemActive).setData(Config.data.ItemState, Config.data.ItemActive);

            // Replacing active item with target item.
            this.active = this.target;

            // Starting auto rotate content.
            if (isNumber(this.config.auto)) {
                this.restart();
            }

            return this;
        },
        start: function() {
            var duration = (this.config.auto * 1000),
                w = this.progress.width();

            if (w > 0) {
                var style = this.progress.style(),
                    width = Number(style.width.replace('%', ''));

                duration = duration - ((width / 100) * duration);
            }

            this.progress.removeClass(Config.data.ProgressStopped).animate({
                width: '100%'
            }, duration, function() {
                // Getting Rotator ID and Resetting Width.
                var rt_id = $(this).css({ width: 0 }).getData(Config.data.KitID);

                Automator(AutomatorName).with(rt_id).navigate(Config.data.NavigateNext);
            });

            return this;
        },
        restart: function() {
            this.stop();
            this.start();

            return this;
        },
        stop: function() {
            this.progress.stop().addClass(Config.data.ProgressStopped).width(0);

            return this;
        },
        pause: function() {
            this.progress.stop().addClass(Config.data.ProgressPaused);

            return this;
        },
        set: function(key, value) {
            if (isString(key)) {
                if (value) this[key] = value;
            } else if (isObject(key)) {
                var self = this;

                foreach(key, function (key, value) {
                    self[key] = value;
                });
            }

            return this;
        }
    };

    /**
     * Content Rotator Automator Constructor.
     * @param object - jQuery object that has attribute 'data-rotator-kit'.
     * @required htmlTag - 'data-rotator-kit' as holder, 'data-rotator-item' as rotator item, 'data-rotator-select' as selector, 'data-rotator-next' as navigate forward, 'data-rotator-prev' as navigate backward.
     * @config data-object - 'auto' with number duration, 'animationName' for custom animation, 'animationSpeed' for custom animation speed. Sample: `data-rotator-kit="auto: 5000, animationName: 'fade', animationSpeed: 1000"`.
     * @returns {contentRotator}
     * @constructor
     */
    var contentRotator = function (object) {
        !isJQuery(object) ? object = $d(Config.data.Kit) : object;

        // Filtering object to makes only kit left.
        object = object.filter(':hasdata(' + Config.data.Kit + ')');

        // Initializing Rotator.
        object.each(function() {
            // Check if already configured and skip if not allowed.
            if (Config.allowReconfigure === false && $(this).getData(Config.data.KitConfigured) === true) return;

            // Creating Rotator ID if not defined.
            var rt_id = $(this).getData(Config.data.KitID);

            if (!isString(rt_id)) {
                rt_id = Config.IDPrefix + (Config.counter + 1);

                // Applying Rotator ID to Rotator Holder.
                $(this).setData(Config.data.KitID, rt_id);
            }

            // Creating Rotator Object.
            var rotator = new ContentRotator().set('holder', $(this));

            // Getting Rotator Config.
            var config = $(this).getData(Config.data.Kit);

            // Apllying rotator object config.
            if (isObject(config)) {
                foreach(config, function (key, value) {
                    rotator.config[key] = value;
                });
            }

            // Getting Rotator Items.
            var items = $d(Config.data.Item, this).setData(Config.data.KitID, rt_id);

            // Getting Rotator Selector.
            var select = $d(Config.data.Select, this).setData(Config.data.KitID, rt_id);

            // Getting Rotator Navigator and Binding Click Function.
            var prev = $d(Config.data.Prev, this).setData(Config.data.KitID, rt_id).click(function(e) {
                e.stopPropagation();

                rotator.navigate(Config.data.NavigatePrev);

                return false;
            });
            var next = $d(Config.data.Next, this).setData(Config.data.KitID, rt_id).click(function(e) {
                e.stopPropagation();

                rotator.navigate(Config.data.NavigateNext);

                return false;
            });

            // Adding navigator to Rotator Object.
            rotator.set({
                'nav_prev': prev,
                'nav_next': next
            });

            // Creating Rotator Progress Controll if not exist.
            var prog = $d(Config.data.Progress, this).setData(Config.data.KitID, rt_id);

            var progressQuery = {};
            progressQuery[Config.data.Progress] = '';
            progressQuery[Config.data.KitID] = rt_id;

            if (prog.length < 1) {
                prog = $('<div>').setData(progressQuery).addClass(Config.data.Progress).css({ width: 0, position: 'absolute' }).prependTo(this);
            }

            // Adding Progress to Rotator Object.
            rotator.set('progress', prog);

            // Adding Rotator Object to list.
            Config.rotator[rt_id] = rotator;

            // Increasing Counter.
            Config.counter++;
        });

        // Reinitializing Rotator to prevent wrong items index number for rotator inside rotator.
        foreach(Config.rotator, function (rt_id, rotator) {
            // Checking if already configured and determine does it should be reconfigured or not.
            if (Config.allowReconfigure === false && rotator.holder.getData(Config.data.KitConfigured) === true) {
                return;
            } else {
                rotator.holder.setData(Config.data.KitConfigured, true);
            }

            // Temporary Default Item.
            var default_item;
            var default_select = 0;

            // Initializing Rotator Items.
            var itemQuery = {};
            itemQuery[Config.data.Item] = '?';
            itemQuery[Config.data.KitID] = rt_id;

            var items = $d(itemQuery).each(function(index) {
                // Applying Item Index ID.
                $(this).setData(Config.data.ItemID, (index + 1));

                // Setting first item as default activated item.
                if (index === 0) {
                    default_item = $(this);
                    default_select = 0;
                    rotator.current = 1;
                    rotator.active = $(this);
                }

                // If this is default, then replace the first activated item with this.
                if ($(this).getData(Config.data.Item) === 'default') {
                    default_item = $(this);
                    default_select = index;
                    rotator.current = (index + 1);
                    rotator.active = $(this);
                }
            });

            // Activating Default Item.
            default_item.setData(Config.data.ItemState, Config.data.ItemActive).addClass(Config.data.ItemActive);

            // Initializing Rotator Selectors.
            var selectorQuery = {};
            selectorQuery[Config.data.Select] = '?';
            selectorQuery[Config.data.KitID] = rt_id;

            var selects = $d(selectorQuery).each(function(index) {
                // Applying Item Index ID.
                $(this).setData(Config.data.ItemID, (index + 1));

                // Activating Default Select.
                if (index === default_select) {
                    $(this).setData(Config.data.ItemState, Config.data.ItemActive).addClass(Config.data.ItemActive);
                }

                // Biding Click Function.
                $(this).click(function(e) {
                    e.stopPropagation();

                    var rt_id = $(this).getData(Config.data.KitID);
                    var index = $(this).getData(Config.data.ItemID);

                    if (isString(rt_id) && isNumber(index)) {
                        rotator.navigate(index);
                    }

                    return false;
                });
            });

            // Adding Rotator Items and Selects to Rotator Object.
            if (items.length > 0) {
                rotator.set({ 'items': items, total: items.length });
            }
            if (selects.length > 0) {
                rotator.set('selects', selects);
            }
        });

        // Initializing Auto Rotate.
        foreach(Config.rotator, function (name, rotator) {
            if (isNumber(rotator.config.auto)) {
                rotator.start();
            }
        });

        return this;
    };

    // Automator Prototypes.
    contentRotator.prototype = {
        addAnimation: function(animationName, func) {
            if (isString(animationName) && isFunction(func)) {
                Config.animator[animationName] = func;
            } else if (isObject(animationName)) {
                foreach(animationName, function (name, func) {
                    if (isFunction(func)) {
                        Config.animator[name] = func;
                    }
                });
            }

            return this;
        },
        with: function(rotator_id) {
            if (isString(rotator_id)) {
                if (Config.rotator[rotator_id]) {
                    return Config.rotator[rotator_id];
                }
            }

            return this;
        },
        setup: function(name, value) {
            if (isString(name) && isDefined(value)) {
                Config[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (configName, value) {
                    Config[configName] = value;
                });
            } else {
                return Config;
            }

            return this;
        },
        construct: function(name, value) {
            if (isString(name) && isDefined(value)) {
                Config.data[name] = value;
            } else if (isObject(name)) {
                foreach(name, function (configName, value) {
                    Config.data[configName] = value;
                });
            }

            return this;
        }
    };

    // Registering Automator including autobuild and default escape condition.
    Automator(AutomatorName, contentRotator).autobuild(true).escape(function () {
        if (Automator(AutomatorName).enabled === false) {
            return true;
        } else {
            return false;
        }
    });
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

(function($, $d) {
    'use strict';

    var PlaceholderToggle = function(object) {
        !isJQuery(object) ? object = $d('placeholder-toggle') : object;

        object.each(function() {

            $(this).focus(function() {
                $(this).addClass('accepted');
            }).blur(function() {
                var min_len = $(this).getData('min-text-length');
                var txt = $(this).prop('value');

                if (txt.length === 0) {
                    $(this).removeClass('accepted');
                }
                if (isNumber(min_len) && txt.length < min_len) {
                    $(this).removeClass('accepted');
                }
            });
        });
    };

    Automator('placeholder-toggle', PlaceholderToggle).autobuild(true).escape(function() {
        if (Automator('placeholder-toggle').enabled === false) {
            return true;
        } else {
            return false;
        }
    });
})(jQuery, jQuery.findData);
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