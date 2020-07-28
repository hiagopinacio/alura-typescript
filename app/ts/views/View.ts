export abstract class View<T> {

    private _element: JQuery

    constructor(selector: string) {

        this._element = $(selector)
    }

    update(model: T) {
        this._element.html(this.template(model))
    }

    abstract template(model: T): string;
}