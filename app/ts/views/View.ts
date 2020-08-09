// ./ts/views/View.ts
export abstract class View<T> {

    private _element: JQuery

    constructor(selector: string, readonly escapa?:boolean) {

        this._element = $(selector)
    }

    update(model: T) {
        let template = this.template(model)
        if(this.escapa){
            template = template.replace(/<script>[\s\S]*?<\/script>/, '');
        }
        this._element.html(template)
    }

    abstract template(model: T): string;
}