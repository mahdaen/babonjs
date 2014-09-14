/* EXTENDING NATIVE FUNCTIONS */
(function() {
    /* Window Object Extender. */
    var __extend = function (obj) {
        if (typeof obj === 'object' && !Array.isArray(obj)) {
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
        isString: function(obj) {
            return typeof obj === 'string' ? true : false;
        },
        isObject: function(obj) {
            return typeof obj === 'object' && !Array.isArray(obj) && !obj.constructor.prototype.hasOwnProperty('splice') ? true : false;
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
        
        /* For Each Looping */
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

        /* URL Parser */
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