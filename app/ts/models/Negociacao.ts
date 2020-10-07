export class Negociacao {
    constructor(
        readonly data: Date,
        readonly quantidade: number,
        readonly valor: number) {

    }
  
    get volume() {
        return this.quantidade * this.valor;
    }

    get reprData() {
        return [this.data.getUTCDate(), this.data.getUTCMonth() + 1, this.data.getUTCFullYear()].join('/')
    }
}