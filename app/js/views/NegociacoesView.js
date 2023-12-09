System.register(["./View"], function (exports_1, context_1) {
    "use strict";
    var View_1, NegociacoesView;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (View_1_1) {
                View_1 = View_1_1;
            }
        ],
        execute: function () {
            NegociacoesView = class NegociacoesView extends View_1.View {
                template(negociacoes) {
                    const tbody = negociacoes.toArray().map(negociacao => `
        <tr>
            <td>${negociacao.reprData} </td>
            <td> ${negociacao.quantidade} </td>
            <td> ${negociacao.valor} </td>
            <td> ${negociacao.volume} </td>
        </tr>     
        `).join('');
                    return `
        <table class= "table table-hover table-bordered" >
            <thead>
                <tr>
                    <th>DATA</th>
                    <th>QUANTIDADE</th>
                    <th>VALOR</th>
                    <th>VOLUME</th>
                </tr>
            </thead>

            <tbody>
                ${tbody}
            </tbody>

            <tfoot >
            </tfoot>
        </table>
        <script>
            alert("oi, me remova passando escapa = true no construtor da view")
        </script>               
        `;
                }
            };
            exports_1("NegociacoesView", NegociacoesView);
        }
    };
});
