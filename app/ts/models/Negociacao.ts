import { Imprimivel } from "./Imprimivel";

export class Negociacao implements Imprimivel{
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

    paraTexto() {
        console.log('-- paraTexto --');
        console.log(
            `Data: ${this.data}
            Quantidade: ${this.quantidade}, 
            Valor: ${this.valor}, 
            Volume: ${this.volume}`
        )
    }
}