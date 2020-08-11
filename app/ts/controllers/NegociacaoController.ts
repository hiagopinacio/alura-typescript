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

        let data = new Date(this._inputData.val().replace("/-/g", ","))

        if (this._ehDiaUtil(data)) {

            const negociacao = new Negociacao(
                data,
                parseInt(this._inputQuantidade.val()),
                parseFloat(this._inputValor.val())
            )

            this._negociacoes.adiciona(negociacao)

            this._negociacoesView.update(this._negociacoes)
            this._mensagemView.update("Negociação adicionada com sucesso!")

        } else {
            this._mensagemView.update("ERRO: Negociações são permitidas apenas em dia útil!")

        }
    }

    private _ehDiaUtil(data: Date) {
        return data.getUTCDay() != DiaDaSemana.Sabado && data.getUTCDay() != DiaDaSemana.Domingo;
    }
}

enum DiaDaSemana {
    Domingo,
    Segunda,
    Terca,
    Quarta,
    Quinta,
    Sexta,
    Sabado
}