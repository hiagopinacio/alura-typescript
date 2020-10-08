import { MeuObjeto } from "./MeuObjeto";

export class Negociacao implements MeuObjeto<Negociacao>{
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

    ehIgual(negociacao: Negociacao): boolean{
        return this.data.getUTCDate() == negociacao.data.getUTCDate()
            && this.data.getMonth() == negociacao.data.getMonth()
            && this.data.getFullYear() == negociacao.data.getFullYear()
            && this.quantidade == negociacao.quantidade
            && this.valor == negociacao.valor
    }
}