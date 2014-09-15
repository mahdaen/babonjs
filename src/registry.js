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
