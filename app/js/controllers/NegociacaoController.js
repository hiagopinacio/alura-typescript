class NegociacaoController {
    constructor() {
        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');
    }
    adiciona(event) {
        event.preventDefault();
        const negociacao = new Negociacao(new Date(this._inputData.value.replace("/-/g", ",")), parseInt(this._inputQuantidade.value), parseFloat(this._inputValor.value));
        console.log('negociacao :>> ', negociacao);
    }
}
