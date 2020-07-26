class NegociacaoController {

    private _inputData: HTMLInputElement
    private _inputQuantidade: HTMLInputElement
    private _inputValor: HTMLInputElement

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

        console.log('negociacao :>> ', negociacao);
    }
}