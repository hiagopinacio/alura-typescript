System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function debounce(milisegundos = 500) {
        return function (target, propertyKey, descriptor) {
            const metodoOriginal = descriptor.value;
            let timer = 0;
            descriptor.value = function (...args) {
                if (event)
                    event.preventDefault();
                clearInterval(timer);
                timer = setTimeout(() => metodoOriginal.apply(this, args), milisegundos);
            };
            return descriptor;
        };
    }
    exports_1("debounce", debounce);
    return {
        setters: [],
        execute: function () {
        }
    };
});
