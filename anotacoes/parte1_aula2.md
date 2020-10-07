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

Nossa instância de Negociacao esta recebendo como valores das propriedades `_data`, `_quantidade` e `_valor` valor em string. Lembre-se que isso acontece porque os elementos do DOM que guardam os valores digitados pelo usuário sempre os guardam como string. 

Isso acontece porque TypeScript adotar o tipo `any` implícitamente por padrão. O tipo `any` indica que a variável, propriedade, parâmetro de método ou seu retorno podem ser de qualquer tipo.

Podemos impedir que o TypeScript assuma implicitamente o tipo any, forçando-nos a explicitar a tipagem.
Para isso, definimos a configuração **`"noImplicitAny": true`** no arquivo `./tsconfig.json`:

```json
{
    "compilerOptions": {
        "target": "es6",
        "outDir": "app/js",
        "noEmitOnError": true,
        "noImplicitAny": true
    },
    "include": [
        "app/ts/**/*"
    ]
}
```
Os parâmetros sem tipos definidos, agora apresentam erro de compilacão.

---
## Tipando explicitamente

Podemos indicar o tipo das propriedades de uma classe através de `:Tipo`. Precisamos também tipar os parâmetros recebidos no constructor():

```ts
// app/ts/models/Negociacao.ts

class Negociacao {

    private _data: Date;
    private _quantidade: number;
    private _valor: number;

    constructor(data: Date, quantidade: number,  valor: number) {

        this._data = data;
        this._quantidade = quantidade;
        this._valor = valor;
    }

    // código posterior omitido
```

Para evitar declarar as propriedades e também os parâmetros no constructor, repetindo a definição da tipagem, o TypeScript permite atalho. Podemos passar o modificador de privacidade e o tipo nos parâmetros do constructor. Isso é suficiente para que o compilador do TypeScript receba os parâmetros e os considere propriedades da classe: 

```ts
// app/ts/models/Negociacao.ts 

class Negociacao {

    constructor(
        private _data: Date, 
        private _quantidade: number,  
        private _valor: number) {}
```

---
## Para saber mais: string vs String e number vs Number

Os tipos que começam em minúsculo equivalem a declaração literal. Vejamos um exemplo:

```js
let nome = 'Flávio';
let idade = 20;
```

O TypeScript infere o tipo, sendo assim, a sintaxe é a mesma coisa que:

```js
let nome: string = 'Flávio';
let idade: number = 20;
```

Se fizermos `typeof` nas duas variáveis temos como resultado `string` e `number` respectivamente:

```js
let nome: string = 'Flávio';
console.log(typeof(nome));  // string
let idade: number = 20; 
console.log(typeof(idade));// number
```

Contudo, JavaScript permite criar strings e números não como literais, mas como **objetos**:

```js
let nome = new String('Flávio');
console.log(typeof(nome)); // Object
let idade = new Number(20);
console.log(typeof(idade)); // Object
```

Qual a diferença?

Os tipos `string` e `number` são literais e guardam um valor primitivo. Contudo, se tentarmos chamar algum método em variáveis declaradas com esses tipos, eles são empacotados automaticamente (auto-boxing) para `String` e `Number` respectivamente.

É por isso que esse código funciona:

```js
let nome = 'Flávio';
nome.replace('/vio/', 'vião'); // faz auto-boxing
```

Dessa forma, TypeScript permite distinguir entre o tipo literal e o tipo objeto. Contudo, **a boa prática é usarmos os tipos literais `number` e `string`**, porque em JavaScript `new String()` e `new Number()` são raramente usados.

---
## Casting explícito

Nossos inputs do formulário são do tipo HTMLInputElement. Assim, podemos definir os parâmetros do controller:

```ts
// app/ts/controllers/NegociacaoController.ts

class NegociacaoController {

    private _inputData: HTMLInputElement;
    private _inputQuantidade: HTMLInputElement;
    private _inputValor: HTMLInputElement;

       // código posterior omitido
```

Porém, ao atribuir os valores destes parâmetros, a função `document.querySelector()` retorna elementos do tipo `Element`, um tipo mais genérico, pois seu retorno pode ser elementos que representam inputs, tabelas, destaques entre outros.

Como estes elementos são do tipo input, realizamos uma conversão explícita:

```ts
// app/ts/controllers/NegociacaoController.ts

// código anterior omitido -->

    constructor() {

        this._inputData = <HTMLInputElement>document.querySelector('#data');
        this._inputQuantidade = <HTMLInputElement>document.querySelector('#quantidade');
        this._inputValor = <HTMLInputElement>document.querySelector('#valor');
    }

```

Também é necessário tipar o parâmetro event do método adiciona(). No caso, utilizaremos o tipo Event:

```ts
// app/ts/controllers/NegociacaoController.ts
// código anterior omitido 

    adiciona(event: Event) {

        event.preventDefault()

        const negociacao = new Negociacao(
            this._inputData.value,
            this._inputQuantidade.value,
            this._inputValor.value
        )

        console.log('negociacao :>> ', negociacao);
    }
```

Porém agora o compilador retorna um erro, pois a propriedade `value` de um `HTMLInputElement` é do tipo string. Precisamos converter os dados antes que sejam passados para o constructor() da classe `Negociação` de acordo com os tipos esperados por ela.

---
## Adequando valores aos tipos
 
 Podemos criar uma instancia de Date passando uma string no formato `"aaaa,dd,mm"`. Ao pegar a propriedade value de um input do tipo date, recebemos uma string no formato `aaaa-dd-mm`. Basta usar o método replace na string recebida passando uma espressão regular para substiur `-` por `,`:

```ts
 String.replace("/-/g", ",")
```

Para transformar string para o tipo inteiro:
```ts
parseInt()
```

Finalmente, para transformar string para o tipo `float`:
```ts
parseFloat()
```

Desta forma, nosso método adiciona fica:

```ts
// app/ts/controllers/NegociacaoController.ts
// código anterior omitido 

    adiciona(event: Event) {

        event.preventDefault()

        const negociacao = new Negociacao(
            new Date(this._inputData.value.replace("/-/g", ",")),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        )

        console.log('negociacao :>> ', negociacao);
    }

```