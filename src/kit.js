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
