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
    /* Creating Object Locker */
    Object.defineProperty(window, 'lock', {
        writable: false,

        /**
         * Lock object properties.
         * @param key {string:required} - The property name.
         * @param object {object:optional} - The property parent. "window" object will used if not defined.
         */
        value: function(key, object) {
            !isObject(object) ? object = window : object;

            if (isString(key)) {
                Object.defineProperty(object, key, {
                    writable: false,
                    enumerable: false,
                    configurable: false
                });
            } else if (isArray(key)) {
                for (var i = 0; i <= key.length; ++i) {
                    if (isString(key[i])) {
                        Object.defineProperty(object, key[i], {
                            writable: false,
                            enumerable: false,
                            configurable: false
                        });
                    }
                }
            }
        }
    });

    /* Creating Object Hider */
    Object.defineProperty(window, 'hide', {
        writable: false,

        /**
         * Hide object properties.
         * @param key {string:required} - The property name.
         * @param object {object:optional} - The property parent. "window" object will used if not defined.
         */
        value: function(key, object) {
            !isObject(object) ? object = window : object;

            if (isString(key)) {
                Object.defineProperty(object, key, {
                    enumerable: false
                });
            } else if (isArray(key)) {
                for (var i = 0; i <= key.length; ++i) {
                    Object.defineProperty(object, key[i], {
                        enumerable: false
                    });
                }
            }
        }
    });

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

    var natives = {
        /**
         * Check whether object is defined or not, whether the object is match with type.
         * @param obj {*} - Object that will be checked. Use these functions for checking arguments only.
         * @returns {boolean}
         */
        isDefined: function(obj) {
            return typeof obj !== 'undefined' ? true : false;
        },
        isString: function(obj) {
            return typeof obj === 'string' ? true : false;
        },
        isObject: function(obj) {
            return typeof obj === 'object' && obj.indexOf === undefined && !obj.constructor.prototype.hasOwnProperty('splice') ? true : false;
        },
        isArray: function(obj) {
            return Array.isArray(obj) || obj.constructor.prototype.hasOwnProperty('splice') && !isJQuery(obj) ? true : false;
        },
        isFunction: function(obj) {
            return typeof obj === 'function' ? true : false;
        },
        isNumber: function(obj) {
            return typeof obj === 'number' ? true : false;
        },
        isBoolean: function(obj) {
            return obj === true || obj === false ? true : false;
        },

        /* DOM Type */
        isBabonKit: function(obj) {
            return obj.babonkit ? true : false;
        },
        isJQuery: function(obj) {
            return obj && obj.hasOwnProperty('length') && obj.jquery ? true : false;
        },
        isAutomator: function(obj) {
            return obj && obj._constructor.type === 'automator' ? true : false;
        },
        isGenerator: function(obj) {
            return obj && obj._constructor.type == 'generator' ? true : false;
        },
        isHTML: function(obj) {
            return obj && obj.ELEMENT_NODE ? true : false;
        },

        /* String Type */
        isColor: function(obj) {
            return /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/.test(obj) ? true : false;
        },
        isURL: function(obj) {
            return /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i.test(obj) ? true : false;
        },
        isEmail: function(obj) {
            return /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i.test(obj) ? true : false;
        },
        isDate: function(obj) {
            return !isNaN(new Date(obj).getDate()) ? true : false;
        },

        /**
         * Foreach loop for both object and array.
         * @param object {object:required} - Obejct that will pe parsed.
         * @param func {funtion:required} - Function that will be called in each loop. For array, we give "value" and "index" as arguments. For object, we give "key" and "value" as arguments.
         * @returns {object itself}
         */
        foreach: function(object, func) {
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
                } else {
                    return console.error('Invalid arguments!');
                }
            }

            return object;
        },

        /**
         * Extract url path.
         * @param url {string:required} - URL string that will be extracted.
         * @returns {{root: string, name: string, ext: string}}
         */
        parseURL: function(url) {
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
        }
    };
    Extend(natives);

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

    /* Hiding Prototype */
    foreach(xObject.prototype, function(key, value) {
        lock(key, xObject.prototype);
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

    /* Locking prototypes if possible */
    foreach(xAProto, function(key) {
        lock(key, xAProto);
    });

    Extend({
        xObject: function(OBJECT) {return new xObject(OBJECT)},
        xArray: function(ARRAY) {return new xArray(ARRAY)},
        __extend__: Extend
    });

    /* Locking Native Objects */
    foreach(['__extend__', 'xObject', 'xArray'], function(key) {
        lock(key);
    });
    foreach(natives, function(key) {
        lock(key);
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
                if (data.search(/(\:)/) > -1) {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        try {
                            eval('data = {' + data + '}');
                        } catch (e) {}
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

                ratio = func('box:count-ratio')(width, height).split(',');

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

    lock(['__tools__', 'cons', 'vars', 'func', '__tools__']);
})();
/* DOM DATA ATTRIBUTE FILTERS. */
(function($) {
    var DataFinder = function(name, value, from) {
        /* If name is string, then pass single query */
        if (isString(name)) {
            /* If value is defined and not object or array, then pass query with value. */
            if (isString(value) || isNumber(value) || isBoolean(value)) {
                /* If from is jquery object or html object, then pass query with value and context */
                if (isJQuery(from) || isHTML(from)) {
                    return $(':hasdata(' + name + ', ' + value + ')', from);
                }
                /* Else if no form defined, then pass query without context */
                else {
                    return $(':hasdata(' + name + ', ' + value + ')');
                }
            }
            /* If value is jquery object or html element, then pass query wihtout value but has a context */
            else if (isJQuery(value) || isHTML(value)) {
                return $(':hasdata(' + name + ')', value);
            }
            /* If no value defined, then pass query without value or find element that has a attribute. */
            else {
                return $(':hasdata(' + name + ')');
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

                lock('_constructor', this);
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

    foreach(Registry.prototype, function (name) {
        lock(name, Registry.prototype);
    });

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
        lock('Automator');
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

                        this.auto = false;
                        this.dont = [];
                        this._constructor.hand = {};

                        this._constructor.type = 'automator';

                        if (isBoolean(auto)) {
                            this.auto = auto;

                            if (auto === true) {
                                AutomatorMaps.prebuilds.push(name);
                            }
                        }

                        /* Locking constructor name */
                        lock('_constructor', this);
                        lock(['id', 'func', 'type'], this._constructor);

                        return this;
                    };

                    Automator.prototype = defaultModules;

                    foreach(builder.prototype, function(name, func) {
                        Automator.prototype[name] = func;
                        lock(name, Automator.prototype);
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
                this.dont.push(args);
            } else if (isArray(args)) {
                var parent = this;

                foreach(args, function (func) {
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

    /* Locking prototypes */
    foreach(automator.module, function(key) {
        lock(key, automator.module);
    });

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
        }

        return name;
    };

    /**
     * Get the list of automators.
     * @returns {Array}
     */
    automator.list = Object.keys(AutomatorMaps.automator);

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
        lock('Generator');
    }
}(function () {
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

                    /* Locking and hiding properties */
                    lock('_constructor', this);
                    lock(['id', 'type', 'fluid'], this._constructor);
                    hide(['locked', 'unlock', 'func'], this._constructor);

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
        make: function() {
            var mst = this;
            var cst = this._constructor;

            var Generator = function() {
                this._constructor = cst._constructor;
                lock('_constructor', this);

                for(var key in mst) {
                    if (mst.hasOwnProperty(key)) {
                        this[key] = mst[key];
                        hid(key, this);
                    }
                }

                return this;
            };

            Generator.prototype = defaultModules;
            foreach(this._constructor.func.prototype, function(name, func) {
                Generator.prototype[name] = func;
            });
            foreach(Generator.prototype, function(name, func) {
                lock(name, Generator.prototype);
            });

            return this._constructor.func.apply(new Generator(), arguments);
        },
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

    /* Locking prototypes if possible */
    foreach(generator.module, function(key) {
        lock(key, generator.module);
    });

    var reconstructor = function() {
        return this;
    };

    generator.extend = function(from, into, args) {
        var master = GeneratorMaps.generator[from];

        if (isGenerator(master)) {
            reconstructor.call(into, from);
            master.constructor.func.apply(into, args);
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

    hide(['is-mobile', 'is-tablet', 'is-desktop', 'is-retina']);

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