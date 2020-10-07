import { Imprimivel } from './Imprimivel';
// app/ts/models/Negociacoes.ts

import { Negociacao } from './Negociacao'

export class Negociacoes implements Imprimivel {

    private _negociacoes: Negociacao[] = []

    adiciona(negociacao: Negociacao): void {

        this._negociacoes.push(negociacao)
    }

    toArray(): Negociacao[] {

        return ([] as Negociacao[]).concat(this._negociacoes)
    }

    paraTexto(): void {
        console.log('-- paraTexto --');
        console.log(JSON.stringify(this._negociacoes));
    }
}
