import { MeuObjeto } from './MeuObjeto';
// app/ts/models/Negociacoes.ts

import { Negociacao } from './Negociacao'

export class Negociacoes implements MeuObjeto<Negociacoes> {

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

    ehIgual(negociacoes:Negociacoes):boolean {
        return JSON.stringify(this._negociacoes) == JSON.stringify(negociacoes.toArray())

    }
}
