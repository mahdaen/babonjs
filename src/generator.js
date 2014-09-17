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
