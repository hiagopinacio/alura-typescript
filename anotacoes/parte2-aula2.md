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
## 2.5. Para saber mais: strictNullChecks

Podemos indicar que uma função pode devolver mais de um tipo, Por exemplo uma função que pode retornar boolean ou null:

```ts
// deixarmos explícitos que a função pode retornar boolean ou null
function minhaFuncao(flag: boolean): boolean | null{

    let valor = null;
    if(flag) return null;
    return true;
}

let x = minhaFuncao(false);
```

Agora, como explicitamos que seu retorno pode ser também `null`, nosso código passará pelo `strictNullChecks`. Curiosamente, linguagens como a Golang permitem uma função ou método ter mais de um tipo de retorno.

---
## 2.6. Para saber mais: o tipo never

TypeScript possui um tipo curioso, o tipo `never`. Este tipo é aplicável à métodos ou funções que por algum motivo, planejado ou não, podem não terminar sua execução de seu bloco.

Exemplos clássicos são os de métodos que caem em um loop infinito ou de métodos que sempre retornam exceções. Exceções fazem com que o método não execute até o fim.

Não confundir o tipo `never` com o tipo `void`. O segundo, apesar de indicar que a função ou método nada retorna, indica que a função ou método executará até o fim, mesmo que não retorne nada.

Geralmente não usamos esse tipo em nosso código, mas ele pode aparecer como aviso do compilador. Quando aparecer, você já saberá que a execução do seu método nunca chegará até o fim, sendo um forte indicativo de um bug em seu código.

---
## 2.7. Trabalhando com Enuns

Enumeratons permite definir valores numéricos para nomes de parâmetros de uma forma elegante.
O type Script possui o `enum` para este propósito.

Por exemplo, o enum abaixo define valores numéricos para os dias da semana:

```ts
enum DiaDaSemana {
    Domingo,
    Segunda,
    Terca,
    Quarta, 
    Quinta, 
    Sexta, 
    Sabado, 
}
```
Por padrão, o valor de cada um começa de 0, e cada parametro a seguir é o valor do anterior mais um.

Poderíamos definir `Domingo =1`, desta forma, `Segunda` teria o valor 2 sem a necessidade de explicita-lo.

Vamos utilizar o `enum` do tipeScript para permitir negociações apenas em dias úteis.

O método `date.getDay()`, sendo `date` uma instância de `Date`, retorna um valor de 0 a 6 que representa o dia da semana, sendo 0 para domingo e indo a té 6 para sábado.

Com o método `getDay()` e com o `enum DiaDaSemana` exemplificado acima, podemos criar a função `_ehDiaUtil` que recebera uma instância de `Date` e retornará verdadeiro se a data está entre segunda e sexta-feira:

```ts
_ehDiaUtil(data: Date) {

    return data.getDay() != DiaDaSemana.Sabado && data.getDay() != DiaDaSemana.Domingo;
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
```

Podemos utilizar esta função no controller `NegociacaoController` para adicionarmos negociações em dias uteis, ou retornar uma mensagem de erro caso contrário.:

```ts
// app/ts/controllers/NegociacaoController.ts

// código omitido

export class NegociacaoController {

    // código omitido

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
```

---
## 2.8. Para saber mais: um detalhe importante sobre enum






