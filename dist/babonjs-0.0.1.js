/**
 * BabonJS
 * Just another Javascript library.
 * Created by Nanang Mahdaen El Aung
 * © 2014 BabonKit. All right reserved.
 *
 * External libraries:
 * jQuery, Enquire.
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
    var __extend = function (obj) {
        if (typeof obj === 'object' && obj.indexOf === undefined) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    window[key] = obj[key];
                }
            }
        }
    };
    
    /* Creating Native Functions */
    __extend({
        /* Object Type */

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
    });
    
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
    
    /* Hiding Prototype */
    if (Object.defineProperty) {
        foreach(xObject.prototype, function(key, value) {
            Object.defineProperty(xObject.prototype, key, {
                enumerable: false,
            });
        });
    }
    
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
    
    /* Locking prototypes if possible */
    if (Object.defineProperty) {
        foreach(xAProto, function(key) {
            Object.defineProperty(xArray.prototype, key, {
                enumerable: false
            });
        });
    }
    
    __extend({
        xObject: function(OBJECT) {return new xObject(OBJECT)},
        xArray: function(ARRAY) {return new xArray(ARRAY)},
        __extend__: __extend
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

    var Registry = function(name, value, option) {
        /* Continue only when type of name is string*/
        if (isString(name)) {
            if (isDefined(value)) {
                this.locked = false;

                /* Checking whether registry already exist or not and locked or not */
                if (typeof AppReg[name] !== 'undefined' && AppReg[name].locked === true) {
                    this.locked = true;
                }

                this.value = value;

                if (this.locked) {
                    return console.warn('Registry ' + name + ' already exists as Protected Registry. Please use ".update()" method and give your key to update the registry.');
                } else {
                    if (isObject(option) && option.locked === true && isString(option.key)) {
                        this.locked = true;
                        this.unlock = option.key;

                        AppReg[name] = this;
                    } else {
                        this.locked = false;
                        this.unlock = null;

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
            if (this.locked === true) {
                if (!key || key !== this.unlock) {
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
                    this.name = name;
                    this.func = builder;

                    this.auto = false;
                    this.dont = [];

                    AutomatorMaps.automator[name] = this;

                    if (isBoolean(auto)) {
                        this.auto = auto;

                        if (auto === true) {
                            AutomatorMaps.prebuilds.push(name);
                        }
                    }
                } else {
                    /* Escape when error happens */
                    return console.error('Can not create automator "' + name + '" with ' + typeof builder + ' as a builder.');
                }
            } else {
                /* Continue selecting automator if no builder */
                if (AutomatorMaps.automator[name]) {
                    return AutomatorMaps.automator[name];
                } else {
                    /* Escape when error happens */
                    return console.error('Can not get automator "' + name + '" of undefined.');
                }
            }
        }

        return this;
    };

    /* Creating the Automator Prototypes */
    Automator.prototype = {
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
                this.func(arguments);
            } else {
                /* Call the builder with forwarding arguments */
                this.func(arguments);
            }

            return this;
        },

        /**
         * Removing Automator.
         * @returns {undefined}
         */
        remove: function() {
            delete AutomatorMaps.automator[this.name];
            return undefined;
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
            var idx = AutomatorMaps.prebuilds.indexOf(this.name);

            if (bool === false && idx > -1) {
                    AutomatorMaps.prebuilds[idx] = undefined;
            } else if (bool === true && idx === -1) {
                AutomatorMaps.prebuilds.push(this.name);
            }

            this.auto = bool;
            return this;
        },

        /**
         * Check whether the automator is enabled or disabled. No parameters needed.
         * @returns {boolean}
         */
        enabled: function() {
            var idx = AutomatorMaps.disableds.indexOf(this.name);

            if (idx > -1) {
                return false;
            } else {
                return true;
            }
        }
    };

    /* Binding auto-builder to the window on-ready */
    $(document).ready(function() {
        foreach(AutomatorMaps.prebuilds, function (name) {
            if (isString(name) && Automator(name)) {
                Automator(name).build();
            }
        });
    });

    /**
     * Automator Generator Wrapper
     * @param name
     * @param builder
     * @param auto
     * @returns {Automator}
     */
    var automator = function(name, builder, auto) { return new Automator(name, builder, auto); };

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
    var GeneratorMaps = {
        generator: {},
    }
}));

/* BABONKIT CORE CONSTRUCTOR. */
(function($) {
    /* Creating Constructor */
    var _K_ = function(name, init_config) {
        this.version = '0.1.0';
        this.build = '920';
        
        if (isString(name)) {
            if (__lists.hasOwnProperty(name)) {
                /* Creating new object */
                var object = new __lists[name](init_config);
                object['kit-name'] = name;
                
                /* Applying core object to new object */
                foreach(__core_props, function(key, value) {
                    object[key] = value;
                });
                
                /* Applying constructor prototypes if defined */
                if (object.hasOwnProperty('__constructor')) {
                    if (!object.constructor.prototype) object.constructor.prototype = {};
                    
                    var constructor = __lists[object.__constructor];
                    if (constructor) {
                        foreach(constructor.prototype, function(key, value) {
                            object.constructor.prototype[key] = value;
                        });
                    }
                }
                
                /* Creating new name if undefined */
                if (!object.name) {
                    object.name = __random(name);
                }
                
                /* Adding ID to object and adding object to mounted lists */
                object['kit-id'] = __mount.count++;
                __mount.lists[object['kit-id']] = object;
                
                /* Adding commont attributes to outer and inner node */
                object.outer.setData({
                    'kit': name,
                    'kit-id': object['kit-id'],
                    'outer-box': ''
                }).addClass(object.name);
                object.inner.setData({
                    'kit-id': object['kit-id'],
                    'inner-box': ''
                });
                $('*', object.inner).setData('kit-id', object['kit-id']);
                
                return object;
            } else {
                return new BabonKit('template');
            }
        }
        
        return this;
    };
    var BabonKit = function(STR_KIT_NAME, OBJ_INIT_CONFIG) {return new _K_(STR_KIT_NAME, OBJ_INIT_CONFIG)}
    
    /* Creating Object Lists */
    var __registry = {
        lists: {},
        count: {},
        mount: {
            lists: {},
            count: 0},
        build: {},
        config: {
            'pre-build': false,
            'is-retina': false
        }
    };
    BabonKit.registry = __registry;
    
    /* Creating Core Object Properties */
    var __core_props = {
        'kit-id': 0,
        'childs': {},
        'parent': null,
        'babonkit': '0.1.0'
    };
    
    /* Creating Template */
    var Template = function(init) {
        /* Object must have object holder */
        this.outer = $('<div class="object-sample"><div class="frame">');
        /* Object must have inner holder. Used as receiver of append method. */
        this.inner = $('<div class="inner">').appendTo($('.frame', this.outer));
        
        /* Handling init config */
        if (init) {
            if (init.name) this.name = init.name;
            if (init.outer) this.outer = init.outer;
            if (init.inner) this.inner = init.inner;
        }
        
        /* Adding object name as outer class name */
        this.outer.addClass(this.name);
        
        return this;
    };
    Template.prototype = {
        content: function(content) {
            this.inner.html(content);
            
            return this;
        },
        mount: function() {
            console.log('test');
            
            return this;
        }
    };
    
    /* Prototyping */
    var __core_proto = {
        append: function(object, target_node){
            if (isBabonKit(object)) {
                if (!isString(target_node)) {
                    if (isJQuery(this.inner) && isJQuery(object.outer)) {
                        this.inner.append(object.outer);
                    }
                } else {
                    if (isJQuery(this[target_node]) && isJQuery(object.outer)) {
                        this[target_node].append(object.outer);
                    }
                }
                
                this.childs[object.name] = object;
                object.parent = this;
            }
            
            return this;
        },
        appendTo: function(target, target_node){
            if (isBabonKit(target)) {
                if (isString(target_node)) {
                    if (isJQuery(target[target_node]) && isJQuery(this.outer)) {
                        target[target_node].append(this.outer);
                    }
                } else {
                    if (isJQuery(target.inner) && isJQuery(this.outer)) {
                        target.inner.append(this.outer);
                    }
                }
                
                target.childs[this.name] = this;
                this.parent = target;
            }
            
            return this;
        },
        prepend: function(object, target_node) {
            if (isBabonKit(object)) {
                if (!isString(target_node)) {
                    if (isJQuery(this.inner) && isJQuery(object.outer)) {
                        this.inner.prepend(object.outer);
                    }
                } else {
                    if (isJQuery(this[target_node]) && isJQuery(object.outer)) {
                        this[target_node].prepend(object.outer);
                    }
                }
                
                this.childs[object.name] = object;
                object.parent = this;
            }
            
            return this;
        },
        prependTo: function(target, target_node) {
            if (isBabonKit(target)) {
                if (isString(target_node)) {
                    if (isJQuery(target[target_node]) && isJQuery(this.outer)) {
                        target[target_node].prepend(this.outer);
                    }
                } else {
                    if (isJQuery(target.inner) && isJQuery(this.outer)) {
                        target.inner.prepend(this.outer);
                    }
                }
                
                target.childs[this.name] = this;
                this.parent = target;
            }
            
            return this;
        },
        remove: function() {
            if (this.outer) {
                this.outer.remove();
            }
            if (this.parent) {
                /*this.parent.childs[this.name] = null;*/
                delete this.parent.childs[this.name];
            }
            
            return this;
        },
        style: function(object, target_node) {
            if (isObject(object)) {
                if (isString(target_node) && isJQuery(this[target_node])) {
                    this[target_node].css(object);
                } else {
                    if (isJQuery(this.outer)) {
                        this.outer.css(object);
                    }
                }
            }
            
            return this;
        },
        renderTo: function(object) {
            if (isObject(object)) return this;
            
            var target = $(object);
            
            if (target && target.length > 0) {
                target.append(this.outer);
            }
            
            return this;
        }
    };
    var __defl_proto = function(object) {
        /* Checking whether object has prototype or not. */
        if (!object.prototype) {
            object.prototype = {};
        }
        /* Appending default prototype */
        for(var key in __core_proto) {
            if (__core_proto.hasOwnProperty(key) && !object.prototype.hasOwnProperty(key)) {
                object.prototype[key] = __core_proto[key];
            }
        }
        
        return object;
    }
    
    /* Creating registry lists wrapper */
    var __lists = __registry.lists;
    var __count = __registry.count;
    var __mount = __registry.mount;
    var __build = __registry.build;
    var __setup = __registry.config;
    
    /* Random name generator and index increaser */
    var __random = function(name) {
        if (name && __count[name]) {
            return name + '-' + __count[name]++;
        }
    };
    
    /* Creating Registrar */
    var _R_ = function(name, object) {
        if (isString(name)) {
            if (object) {
                if (__lists[name]) {
                    return __lists[name];
                } else {
                    object = __defl_proto(object);
                    __count[name] = 1;
                    if (object.hasOwnProperty('build')) __build[name] = object.build;
                    return __lists[name] = object;
                }
            }
        } else if (isObject(name)) {
            foreach(name, function(name, object) {
                if (!__lists[name]) {
                    object = __defl_proto(object);
                    if (object.hasOwnProperty('build')) __build[name] = object.build;
                    __lists[name] = object;
                    __count[name] = 1;
                }
            });

            return __lists;
        }
        
        return new BabonKit();
    };
    BabonKit.register = function(STR_KIT_NAME, FUNC_KIT_HANLDER) {return _R_(STR_KIT_NAME, FUNC_KIT_HANLDER)};
    
    /* Creating HTML Decoder */
    BabonKit.encode = function(obj) {
        !isJQuery(obj) ? obj = $(obj) : obj;
        
        return obj;
    };
    
    /* Creating Object Extender */
    var constructor = function(name) {
        if (isString(name)) {
            this.__constructor = name;
        }
        
        return this;
    };
    var _X_ = function(src, des, args) {
        if (!isString(src) || !isObject(des) || !isArray(args)) return false;
        var obj = __lists[src];
        
        if (isFunction(obj)) {
            constructor.call(des, src);
            obj.apply(des, args);
        }
        
        return this;
    };
    BabonKit.extend = function(KIT_SOURCE, KIT_TARGET, OBJ_INIT_CONFIG) {return _X_(KIT_SOURCE, KIT_TARGET, OBJ_INIT_CONFIG)};
    
    /* Creating Renderer */
    BabonKit.render = function(name) {
        if (isString(name)) {
            if (__lists[name] && __lists[name].hasOwnProperty('render')) {
                __lists[name].render();
            }
        } else if (isArray(name)) {
            foreach(name, function(name, i) {
                if (__lists[name] && __lists[name].hasOwnProperty('render')) __lists[name].render();
            });
        } else {
            if (__lists && isObject(__lists)) {
                foreach(__lists, function(name, object) {
                    if (object.hasOwnProperty('render')) object.render();
                });
            }
        }
        
        return new BabonKit();
    };
    
    /* Creating builder */
    var _B_ = function (object, rule) {
        /* If the object is jQuery object, then build only this object. */
        if (isJQuery(object)) {
            if (object.length === 1) {
                if (isString(rule)) {
                    var builder = __build[rule];
                    if (builder) return builder(object);
                } else {
                    /* Getting kit name */
                    var kit = object.getData('kit');

                    /* If has kit name, then find the builder. */
                    if (isString(kit)) {
                        var builder = __build[kit];

                        /* If builder is available, then run it and return the result */
                        if (isFunction(builder)) {
                            return builder(object);
                        }
                    }
                }
            } else {
                foreach(object, function(object) {
                    BabonKit.build($(object), rule);
                });
            }
        } else if (isString(object)) {
            /* Run specific builder if the given argument is only string or builder name. */
            if (isFunction(__build[object])) {
                return __build[object];
            }
        } else {
            /* Run all builder if no argument defined */
            foreach(__build, function(name, object) {
                object();
            });
        }
    };
    BabonKit.build = function(JQUERY_OBJECT, STR_KIT_NAME) {return _B_(JQUERY_OBJECT, STR_KIT_NAME)};
    
    /* Builder Maker */
    var _B_R_ = function(name, func) {
        if (isString(name) && isFunction(func)) {
            /* Return existing builder if already exists */
            if (__build[name]) return __build[name];
            /* Register new builder if not exists */
            return __build[name] = func;
        } else {
            return console.error('Name should be string, and function should be function!');
        }
    };
    BabonKit.builder = BabonKit.build.register = function(STR_NAME, FUNC_HANLDER) {return _B_R_(STR_NAME, FUNC_HANLDER)};
    $.fn.buildKit = function() {return BabonKit.build(this);};
    $.fn.build = function(name, option) {
        if (isString(name)) {
            BabonKit.build(name)(this);
        }

        return this;
    }
    
    /* Creating configurator */
    var _C_ = function(name, value) {
        if (isString(name)) {
            if (value) {
                return __setup[name] = value;
            } else {
                if (__setup[name]) return __setup[name];
            }
        } else if (isObject(name)) {
            foreach(name, function(key, value) {
                __setup[key] = value;
            });
            
            return name;
        } else {
            return __setup;
        }
    };
    BabonKit.config = function(STR_CONFIG_KEY, CONFIG_VALUE) {return _C_(STR_CONFIG_KEY, CONFIG_VALUE)};

    /* Creating finder */
    var _F_ = function(name) {
        var list = Object.keys(__lists);
        if (isString(name) && list.indexOf(name) > 0) return list.indexOf(name);
        
        return undefined;
    };
    BabonKit.find = function(STR_KIT_NAME) {return _F_(STR_KIT_NAME)};

    /* Adding template to lists */
    BabonKit.register({
        'template': Template,
    });
    
    /* Attaching BabonObject to window */
    window.BabonKit = window.$_babon = BabonKit;
    
    /* Startup Builder */
    $(document).ready(function() {
        if (BabonKit.config('pre-build') === true) {
            BabonKit.build();
        }
    });
})(jQuery);
/* Require JS */
(function(factory){
    if (typeof define !== 'undefined' && define.amd) {
        define(factory);
    }
}(function() {
    return window.BabonKit;
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
(function($, $$, $$$) {
    /* Detecting Retina Display */
    if (window.devicePixelRatio && window.devicePixelRatio > 1) {
        $$.config('is-retina', true);
    }

    /* Dynamic Background Image */
    $$.builder('background', function(object) {
        !isJQuery(object) ? object = $$$('background') : object;

        if ($$.config('responsive-background-image') && window['__is-tablet'] || window['__is-mobile']) {
            $_tablet.onReady(function() {
                object.each(function() {
                    var target = $(this);

                    var background = $(this).getData('background');
                    if (background === 'get-child-img') {
                        background = $('img', this).attr('src');
                    }

                    if (isString(background)) {
                        var img_url = parseURL(background);
                        if (isObject(img_url)) {
                            img_url = img_url.root + img_url.name + '@tablet.' + img_url.ext;

                            $.ajax({
                                url: img_url,
                                type: 'HEAD',
                                success: function() {
                                    target.css('backgroundImage', 'url(' + img_url + ')');
                                },
                                error: function() {
                                    target.css('backgroundImage', 'url(' + background + ')');
                                }
                            });
                        }
                    }
                });
            });
            $_mobile.onReady(function() {
                object.each(function() {
                    var target = $(this);

                    var background = $(this).getData('background');
                    if (background === 'get-child-img') {
                        background = $('img', this).attr('src');
                    }

                    if (isString(background)) {
                        var img_url = parseURL(background);

                        if (isObject(img_url)) {
                            img_url = img_url.root + img_url.name + '@mobile.' + img_url.ext;

                            $.ajax({
                                url: img_url,
                                type: 'HEAD',
                                success: function() {
                                    target.css('backgroundImage', 'url(' + img_url + ')');
                                },
                                error: function() {
                                    target.css('backgroundImage', 'url(' + background + ')');
                                }
                            });
                        }
                    }
                });
            });
        } else {
            object.each(function() {
                var background = $(this).getData('background');

                if (background === 'get-child-img') {
                    background = $('img', this).attr('src');
                }
                if (isString(background)) {
                    var target = this;
                    $(this).css({
                        backgroundImage: 'url(' + background + ')'
                    });
                }
            });
        }

        return object;
    });
    $.fn.applyBackground = function() {
        return $$.build('background')(this);
    }

    $$.builder('img:retina', function(object) {
        if (!$$.config('is-retina') || !$$.config('retina-images')) return;

        !isJQuery(object) ? object = $$$('retina-image') : object;

        return object.each(function() {
            var image = $(this);
            var source = image.attr('src');
            var im_src;

            if (source) {
                var parse = parseURL(source);

                if (parse) {
                    im_src = parse.root + parse.name + '@2x.' + parse.ext;
                }
            }

            if (im_src) {
                $.ajax({
                    url: im_src,
                    success: function(data) {
                        image.css({
                            width: image.width(),
                            height: image.height()
                        }).attr('src', im_src);
                    }
                });
            }
        });
    });
})(jQuery, BabonKit, jQuery.findData);

/**
 * Dynamic Background Automator.
 * Autmatically detect responsive and retina, then set the background dynamically.
 * @responsive {string:pattern} - background.jpg, background.retina.jpg, background.mobile.jpg, background.mobile.retina.jpg, etc.
 * @options - mobile, tablet, retina.
 * @credits - Created by Nanang Mahdaen El Agung.
 */

(function($, $$, $$$) {
    /* Setting up registry */
    Registry('enable-responsive-background', true, {locked: true, key: 'BGD-RSP'});
    Registry('enable-retina-background', true, {locked: true, key: 'BGD-RTN'});

    var bgAtom = $$('bg:dynamic', function(object) {
        !isJQuery(object) ? object = $$$('bg-dynamic') : object;

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
                    if (Registry('enable-responsive-background').value == true) {
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
                    if (Registry('enable-retina-background').value == true) {
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
                }
            }
        });
    })
        .autobuild(true)
        .escape(function() {
            if ($$('bg:dynamic').enabled() === false) {
                return true;
            } else {
                return false;
            }
        }
    );

    Automator.disable('bg:dynamic');

})(jQuery, Automator, jQuery.findData);
