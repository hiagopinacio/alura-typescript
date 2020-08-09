# 2 - Lapidando nosso código

---
## 2.1. Propriedades readonly

o TypeScript possui um atalho para declaração de propriedades somente leitura.
Isso nos permite definir parâmetros que podem ser lidos sem a necessidade de criar um getter.
Para isso, basta usarmos o modificador `readonly`:

```ts
// ./ts/models/negociacao.ts
export class Negociacao {

    constructor(readonly data: Date, readonly quantidade: number, readonly valor: number) {}

    get volume() {

        return this.quantidade * this.valor;
    }
}
```

Veja que não foi necessário criar os getters para que pudéssemos acessar as propriedades que antes eram privadas. Agora, qualquer atribuição feita às propriedades resultarão em erro de compilação.


---
## 2.2. Parâmetros opcionais

Podemos definir um parâmetro opcional adicionando integação na frente do seu nome no construtor:

```ts
// ...

constructor(readonly verifica?:boolean){
    // ...
```

> **Obs**: Parâmetros obrigatórios devem sempre vir antes dos parâmetros opcionais. 

Como exemplo vamos adicionar um parametro opcional na classe View para remover tags scripts do template se o parâmetro for verdadeiro:

```ts
// ./ts/views/View.ts
export abstract class View<T> {

    private _element: JQuery

    constructor(selector: string, readonly escapa?:boolean) {

        this._element = $(selector)
    }

    update(model: T) {
        let template = this.template(model)
        if(this.escapa){
            template = template.replace(/<script>[\s\S]*?<\/script>/, '');
        }
        this._element.html(template)
    }

    abstract template(model: T): string;
}
```

```ts
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

```

Perceba que podemos criar Views passando o parâmetro booleano `escapa`, como no caso de `_negociacoesView`, ou não, como em `_mensagemView`.

---
## 2.3. Ativando strictNullChecks

Muitas vezes, atribuímos `null` e `undefined` à variáveis para realizarmos alguma espécie de controle. Mas esses tipos podem causar problemas em runtime em nosso código se não tivermos cuidado com eles. Por exemplo:

```ts
let date = new Date()
date = null // algo permitido
date = undefined // algo permitido
```

Contudo, o TypeScript possui o modo `strictNullChecks`. Neste modo, `null` e `undefined` não fazem parte do domínio dos tipos e só podem ser atribuídos a eles mesmos. Com a exceção de `undefined`, que pode ser atribuído a `void`. Isso pode ser interessante para evitarmos valores nulos e indefinidos em nosso projeto. 

Vamos ativá-lo em tsconfig.json:
```json
{
    "compilerOptions": {
        "target": "es6",
        "outDir": "app/js",
        "noEmitOnError": true, 
        "noImplicitAny": true,
        "removeComments": true,
        "module": "system",
        "strictNullChecks": true
    },
    "include": [
        "app/ts/**/*"
    ]
}
```

Surgiram erros nos nossos códigos que vamos resolver a seguir.

### Definindo valor default para variável opcional.

Na classe `View`, definimos o parametro opcional `escapa` com o tipo `boolean`. Porém, por padrão, é atribuído o valor `undefined` caso essa propriedade não seja passada no construtor.

Para declarar um valor padrão utilizamos  seguinte sitaxe:

```
variavel?:tipo = valorDefault
```

Assim a classe View ficaria:

```ts
// ./ts/views/View.ts
export abstract class View<T> {

    private _element: JQuery

    constructor(selector: string, readonly escapa?:boolean) {

        // omitido ...
}
```
Mas ainda há um problema com outra classe, a classe `Negociacoes`:

### Arrays não tipados: 
Na classe `Negociacoes`:

```ts
// app/ts/models/Negociacoes.ts
import { Negociacao } from './Negociacao'

export class Negociacoes {

    private _negociacoes: Negociacao[] = []

    adiciona(negociacao: Negociacao): void {

        this._negociacoes.push(negociacao)
    }

    toArray(): Negociacao[] {

        return [].concat(this._negociacoes)
    }
}
```

Existe o seguinte erro no retorno da função toArray:

```ts
argument of type 'Negociacao[]' is not assignable to parameter of type 'never[]'.
  Type 'Negociacao' is not assignable to type 'never'.
```

Aqui, definimos o retorno do tipo como sendo Negociacao[]. Porem, estamos concatenando negociações em um array não tipado:

```ts
return [].concat(this._negociacoes)
```

Devemos declarar o tipo do array antes de concatenar as negociações, podemos fazer isso com a sitaxe `as`:

```ts
return ([] as Negociacao[]).concat(this._negociacoes)
```

---
## 2.4. Para saber mais: strictNullChecks, exemplo 1






---
## 2.5. Para saber mais: strictNullChecks, exemplo 2






---
## 2.6. Para saber mais: o tipo never






---
## 2.7. Trabalhando com Enuns






---
## 2.8. Para saber mais: um detalhe importante sobre enum






