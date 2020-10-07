// app/ts/controllers/NegociacaoController.ts
import { Negociacao, Negociacoes, NegociacaoParcial } from "../models/index";
import { MensagemView, NegociacoesView } from "../views/index";
import { domInject, debounce } from "../helpers/decorators/index";

export class NegociacaoController {

    @domInject('#data')
    private _inputData: JQuery
    @domInject('#quantidade')
    private _inputQuantidade: JQuery
    @domInject('#valor')
    private _inputValor: JQuery
    private _negociacoes = new Negociacoes()
    private _negociacoesView = new NegociacoesView("#tabela-negociacoes", true)
    private _mensagemView = new MensagemView('#mensagemView')

    @debounce(500)
    adiciona() {

        

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

    @debounce(500)
    importarDados() {
        function isOk(res: Response) {
            if (res.ok) {
                return res
            } else {
                throw new Error(res.statusText);

            }
        }

        fetch("http://localhost:8080/dados")
            .then(res => isOk(res))
            .then(res => res.json())
            .then((dados: NegociacaoParcial[]) => {
                dados.map(
                    dado => new Negociacao(new Date(), dado.montante, dado.vezes)
                ).forEach(
                    negociacao => this._negociacoes.adiciona(negociacao)
                )
                this._negociacoesView.update(this._negociacoes)
                this._mensagemView.update("Importação realizada com sucesso.")
            })
            .catch(err => {
                console.log(err.message)
                this._mensagemView.update("Erro ao realizar importações.")
            });
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