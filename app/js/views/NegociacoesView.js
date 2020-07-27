class NegociacoesView extends View {
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
        `;
    }
}
