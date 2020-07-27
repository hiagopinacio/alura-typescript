# 5 -  TypeScript definitions

## 5.1 JQuery, tem espaço?

Vamos exemplificar o problema utilizando o JQuery. Importando o script no HTML:

```html
<script src="lib/jquery.min.js"></script>
```

Agora vamos obter um elemento do DOM na classe View:

```ts
abstract class View<T> {

    private _elemento: Element;

    constructor(seletor: string) {

       // erro de compilação
        this._elemento = $(seletor);
    }
 
    update(model: T) {

        this._elemento.innerHTML = this.template(model);
    }

    abstract template(model: T): string;
}
```

Desta forma, recebemos um erro de compilação, pois o typeScript não reconhece a variável global do JQuery, o `$`. Além disso, ele também não conhece o tipo do seu retorno.

Poderíamos resolver isso declarando um tipo `any` para o `$`, antes de definir a classe:

```ts
declare var $: any;

abstract class View<T> {

    // código omitido

}
```

além disso, teríamos que mudar o tipo do parâmetro `_element`

pra `any`:
```ts
declare var $: any;

abstract class View<T> {

    protected _elemento: any;

    // restante do código omitido

}
```

Com isso, perderíamos a maior qualidade do typeScript, a tipagem.

Para resolver este problema existem os chamados ***TypeScript Declaration File***. Este arquivo possui informações dos nomes de métodos e funções, inclusive tipos que podem ser utilizados pelo TypeScript. Quando carregado, o TypeScript conseguirá, baseado nesse arquivo, realizar checagem estática inclusive lançar mão de todos seu poder através de seu editor ou IDE favorita. 

## 5.2 Instalando TypeScript Definitions

Você pode instalar o type definiton de qualquer biblioteca, contanto que ele exista. Contudo, pode ser que nem existe um arquivo `tsd` para determinada biblioteca. Sendo assim, a solução com `declare var` continua sendo válida. 

Vamos instalar o tipo do jQuery. Vale lembrar que esse tipo não foi definido pela equipe do jQuery:

```sh
npm install @types/jquery@2.0.42 --save-dev
```

Agora, podemos usar o jQuery na declaração das nossas classes.

- Em `View`:

    ```ts
    abstract class View<T> {

        private _element: JQuery

        constructor(selector: string) {

            this._element = $(selector)
        }

        update(model: T) {
            this._element.html(this.template(model))
        }

        abstract template(model: T): string;
    }
    ```
- em `NegociacaoController`:

    ```ts
    class NegociacaoController {

        private _inputData = $('#data')
        private _inputQuantidade = $('#quantidade')
        private _inputValor = $('#valor')
        private _negociacoes = new Negociacoes()
        private _negociacoesView = new NegociacoesView("#tabela-negociacoes")
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
    ```

- e em `app`:
    ```ts
    // app/ts/app.ts

    const controller = new NegociacaoController();

    $('.form').submit(controller.adiciona.bind(controller));
    ```


## 5.3 Extirpando os comentários do processo de compilação

Existe uma propriedade do typescript que remover os comentários no código compilado.
Para isso podemos adicionar `"removeComments": true` no `compilerOptions` do arquivo `tsconfig.json`:

```json
{
    "compilerOptions": {
        "target": "es6",
        "outDir": "app/js",
        "noEmitOnError": true,
        "noImplicitAny": true,
        "removeComments": true
    },
    "include": [
        "app/ts/**/*"
    ]
}
```

com esta propriedade, o código:

```ts
const controller = new NegociacaoController()
//USANDO JQUERY!
$('.form').submit(controller.adiciona.bind(controller))
```

é compilado para:

```js
const controller = new NegociacaoController();
$('.form').submit(controller.adiciona.bind(controller));
```
