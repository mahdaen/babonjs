/* BABON CORE OBJECTS */
(function() {
    /* Babon core object */
    var Tools = {};
    
    /* Babon object collections. */
    Tools.variables = {};
    Tools.constants = {};
    Tools.functions = {};

    /* Babon variable setter/getter. */
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
    
    /* Babon constant setter/getter. */
    Tools.cons = function(name, value) {
        if (name) {
            if (value) {
                if (typeof value === 'function') return console.warn("You can't register constant as a function. Please use Babon.func() rather than Babon.cons().");
                if (Tools.constants[name]) return console.warn('Constant "' + name + '" alerady registered.');
                return Tools.constants[name] = value;
            } else {
                return Tools.constants[name];
            }
        }
    };
    
    /* Babon protected function setter/getter */
    Tools.func = function (name, func) {
        if (name) {
            if (func && typeof func === 'function') {
                if (Tools.functions[name]) return console.warn('Function "' + name + '" alerady registered.');
                Tools.functions[name] = func;
                
                return Tools.functions[name];
            } else {
                return Tools.functions[name];
            }
        }
    };
    
    Tools.proto = function(name, proto_name, func) {
        if (name && Tools.functions[name] && proto_name && typeof proto_name === 'string' && func && typeof func === 'function') {
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