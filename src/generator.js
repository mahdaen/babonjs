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
