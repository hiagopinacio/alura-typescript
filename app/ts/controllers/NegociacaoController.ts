class NegociacaoController {

    private _inputData: HTMLInputElement
    private _inputQuantidade: HTMLInputElement
    private _inputValor: HTMLInputElement
    private _negociacoes = new Negociacoes()
    private _negociacoesView = new NegociacoesView("#tabela-negociacoes")
    private _mensagemView = new MensagemView('#mensagemView')

    constructor() {
        let $ = document.querySelector.bind(document)
        this._inputData = <HTMLInputElement>$('#data')
        this._inputQuantidade = <HTMLInputElement>$('#quantidade')
        this._inputValor = <HTMLInputElement>$('#valor')

    }

    adiciona(event: Event) {

        event.preventDefault()

        const negociacao = new Negociacao(
            new Date(this._inputData.value.replace("/-/g", ",")),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        )

        this._negociacoes.adiciona(negociacao)

        this._negociacoesView.update(this._negociacoes)
        this._mensagemView.update("Negociação adicionada com sucesso!")

        console.log('negociacoes :>> ', this._negociacoes);
    }
}