System.register(["../models/index", "../views/index"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var index_1, index_2, NegociacaoController;
    return {
        setters: [
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (index_2_1) {
                index_2 = index_2_1;
            }
        ],
        execute: function () {
            NegociacaoController = class NegociacaoController {
                constructor() {
                    this._inputData = $('#data');
                    this._inputQuantidade = $('#quantidade');
                    this._inputValor = $('#valor');
                    this._negociacoes = new index_1.Negociacoes();
                    this._negociacoesView = new index_2.NegociacoesView("#tabela-negociacoes");
                    this._mensagemView = new index_2.MensagemView('#mensagemView');
                }
                adiciona(event) {
                    event.preventDefault();
                    const negociacao = new index_1.Negociacao(new Date(this._inputData.val().replace("/-/g", ",")), parseInt(this._inputQuantidade.val()), parseFloat(this._inputValor.val()));
                    this._negociacoes.adiciona(negociacao);
                    this._negociacoesView.update(this._negociacoes);
                    this._mensagemView.update("Negociação adicionada com sucesso!");
                    console.log('negociacoes :>> ', this._negociacoes);
                }
            };
            exports_1("NegociacaoController", NegociacaoController);
        }
    };
});
