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
