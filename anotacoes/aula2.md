# Benefícios da tipagem estática


---
## Capturando os dados do formulário

Vamos criar uma classe que lidará com as ações do usuário, a classe `NegociacaoController`. Ela ficará no namespace `controllers`. 

```js
// app/ts/controllers/NegociacaoController.ts 

class NegociacaoController {

    private _inputData;
    private _inputQuantidade;
    private _inputValor;

    constructor() {

        this._inputData = document.querySelector('#data');
        this._inputQuantidade = document.querySelector('#quantidade');
        this._inputValor = document.querySelector('#valor');
    }

    adiciona(event) {

        event.preventDefault();

        const negociacao = new Negociacao(
            this._inputData.value,
            this._inputQuantidade.value,
            this._inputValor.value);

        console.log(negociacao);
    }
}
```

Não podemos nos esquecer de importar o script gerado pelo processo de compilação. O script do *controller* deve ser importado antes do script do *`app`*, pois será utilizado por ele: 

```html
<!-- app/index.html -->
<!-- código anterior omitido -->
    <script src="js/models/Negociacao.js"></script>
    <script src="js/controllers/NegociacaoController.js"></script>
    <script src="js/app.js"></script>
<!-- código posterior omitido -->
```
Agora, vamos alterar `app.ts`, para que crie uma instância de `NegociacaoController` para em seguida associar ao evento `submit` do formulário de `index.html` a chamada do método `adiciona`. 

```js
// app/ts/app.ts

const controller = new NegociacaoController();
document
    .querySelector('.form')
    .addEventListener('submit',controller.adiciona.bind(controller));
```

---
## O tipo implícito any


---
## Tipando explicitamente


---
## Para saber mais: string vs String e number vs Number


---
## Um problema não esperado


---
## Casting explícito


---
## Adequando valores aos tipos


---
## Para saber mais: input type Date no microssoft Edge e no Firefox

  
