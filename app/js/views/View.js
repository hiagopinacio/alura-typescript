System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var View;
    return {
        setters: [],
        execute: function () {
            View = class View {
                constructor(selector, escapa) {
                    this.escapa = escapa;
                    this._element = $(selector);
                }
                update(model) {
                    let template = this.template(model);
                    if (this.escapa) {
                        template = template.replace(/<script>[\s\S]*?<\/script>/, '');
                    }
                    this._element.html(template);
                }
            };
            exports_1("View", View);
        }
    };
});
