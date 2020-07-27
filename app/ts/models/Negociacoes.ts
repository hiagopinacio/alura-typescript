class Negociacoes {

    private _negociacoes: Negociacao[] = []

    adiciona(negociacao: Negociacao) {

        this._negociacoes.push(negociacao)
    }

    toArray() {

        return this._negociacoes
    }
}