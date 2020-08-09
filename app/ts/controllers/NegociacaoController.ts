// app/ts/controllers/NegociacaoController.ts
import { Negociacao, Negociacoes } from "../models/index";
import { MensagemView, NegociacoesView } from "../views/index";

export class NegociacaoController {

    private _inputData = $('#data')
    private _inputQuantidade = $('#quantidade')
    private _inputValor = $('#valor')
    private _negociacoes = new Negociacoes()
    private _negociacoesView = new NegociacoesView("#tabela-negociacoes", true)
    private _mensagemView = new MensagemView('#mensagemView')

    adiciona(event: Event) {

        event.preventDefault()

        const negociacao = new Negociacao(
            new Date(this._inputData.val().replace("/-/g", ",")),
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val())
        )

        this._negociacoes.adiciona(negociacao)

        this._negociacoesView.update(this._negociacoes)
        this._mensagemView.update("Negociação adicionada com sucesso!")

        console.log('negociacoes :>> ', this._negociacoes);
    }
}

