# 5 - Mais sobre interfaces

## 5.1 - Interface de método e Polimorfismo: Chega de múltiplos console.log

Vamos definir uma função para imprimir objetos.
Para isso, vamos criar o arquivo `ts/helpers/Utils.ts`.

```ts
export function imprime(...objetos: any[]) {
    objetos.forEach(objeto => objeto.paraTexto());
}

```

E claro, nosso barrel:

```ts
// app/ts/helpers/index.ts 

export * from './Utils';

```

Pra isso, precisamos garantir que os objetos que passamos pra imprime, tenho o método `paraTexto` implementado.
Poderíamos garantir este comportamento, implementando uma classe abstrada, porém em TypeScript, uma classe só pode herdar de uma classe apenas. Quando queremos apenas obrigar classes a seguirem um método contrato de método, podemos também trabalhar com interfaces.

Vamos criar uma interface Imprimivel que define a obrigatoriedade de implementarmos o método paraTexto():

```ts
// app/ts/models/Imprimivel.ts

export interface Imprimivel {

    paraTexto(): void;
}
```

```ts
export * from './Negociacao';
export * from './Negociacoes';
export * from './NegociacaoParcial';
export * from './Imprimivel';
```

Agora, vamos fazer com que `Negociacao` e `Negociacoes` implementes a inteface `Imprimivel`:

```ts
import { Imprimivel } from './Imprimivel';

export class Negociacao implements Imprimivel {

    constructor(readonly data: Date, readonly quantidade: number, readonly valor: number) {}

    get volume() {

        return this.quantidade * this.valor;
    }

    paraTexto(): void {
        console.log('-- paraTexto --');
        console.log(
            `Data: ${this.data}
            Quantidade: ${this.quantidade}, 
            Valor: ${this.valor}, 
            Volume: ${this.volume}`
        )
    }
}
```

```ts
import { Negociacao } from './Negociacao';
import { Imprimivel } from './Imprimivel';


export class Negociacoes implements Imprimivel {

    private _negociacoes: Negociacao[] = [];

    adiciona(negociacao: Negociacao): void {

        this._negociacoes.push(negociacao);
    }

    paraArray(): Negociacao[] {

        return ([] as Negociacao[]).concat(this._negociacoes);
    }

    paraTexto(): void {
        console.log('-- paraTexto --');
        console.log(JSON.stringify(this._negociacoes));
    }
}
```

Agora podemos mudar a tipagem da função `imprime` pra receber objetos com o tipo `Imprimivel`:

```ts
import { Imprimivel } from '../models/index';

export function imprime(...objetos: Imprimivel[]) {
    objetos.forEach(objeto => objeto.paraTexto());
}
```

---
## 5.2 - Evitando importar negociações duplicadas

Para evitar importar negociações repetidas, vamos criar um método para comparar igualdade de negocicões. Vamos fazer isso através de uma interface, para que todas as classes que forem implementar igualdade, implementem com o mesmo nome.

Vamos criar a interface :

```ts
// app/ts/models/Igualavel.ts

export interface Igualavel<T> {

    ehIgual(objeto: T): boolean
}
```

Tivermos que lançar mão do uso de generics, pois o método ehIgual deve receber o tipo indicado por T. 

Não podemos nos esquecer de exportá-la:
```ts
// app/ts/models/index.ts 

export * from './Negociacao';
export * from './Negociacoes';
export * from './NegociacaoParcial';
export * from './Imprimivel';
export * from './Igualavel';
```

Agora, vamos fazer com que a classe Negociacao implemente a interface. Diferente da herança com extends, podemos implementar quantas interfaces quisermos:

```ts
import { Imprimivel, Igualavel } from './index';

export class Negociacao implements Imprimivel, Igualavel<Negociacao> {

    constructor(readonly data: Date, readonly quantidade: number, readonly valor: number) {}

    get volume() {

        return this.quantidade * this.valor;
    }

    paraTexto(): void {
        console.log('-- paraTexto --');
        console.log(
            `Data: ${this.data}
            Quantidade: ${this.quantidade}, 
            Valor: ${this.valor}, 
            Volume: ${this.volume}`
        )
    }

    ehIgual(negociacao: Negociacao): boolean {

        return this.data.getDate() == negociacao.data.getDate()
            && this.data.getMonth() == negociacao.data.getMonth()
            && this.data.getFullYear() == negociacao.data.getFullYear();
    }
}
```

Agora, vamos usar nosso método `ehIgual` para evitar a importação de negociações duplicada, usam conhecimento fundamental das funções filter, some e forEach:

```ts
    @debounce()
    importaDados() {

        this._service
            .obterNegociacoes(res => {

                if(res.ok) {
                    return res;
                } else {
                    throw new Error(res.statusText);
                }
            })
            .then(negociacoesParaImportar => {

                const negociacoesJaImportadas = this._negociacoes.paraArray();

                negociacoesParaImportar
                    .filter(negociacao => 
                        !negociacoesJaImportadas.some(jaImportada => 
                            negociacao.ehIgual(jaImportada)))
                    .forEach(negociacao => 
                    this._negociacoes.adiciona(negociacao));

                this._negociacoesView.update(this._negociacoes);
            });
    }
```
---
## 5.3 - Estendendo interfaces

A implementação de `Imprimivel` e `Igualavel` é algo bem comum de implementarmos para praticamente todos nossas classes do modelo. É por isso que podemos criar uma interface que estende essas duas que criamos, bastando implementarmos a nova interface agregado.

Vamos criar a interface MeuObjeto:

```ts
import { Imprimivel, Igualavel } from './index';

export interface MeuObjeto<T> extends Imprimivel, Igualavel<T>  { }
```

```ts
export * from './Negociacao';
export * from './Negociacoes';
export * from './NegociacaoParcial';
export * from './Imprimivel';
export * from './Igualavel';
export * from './MeuObjeto';
```


Agora, vamos fazer com que Negociacao e Negociacoes implementem MeuObjeto:

```ts
import { MeuObjeto } from './index';

export class Negociacao implements MeuObjeto<Negociacao> {

   // código omitido 
}
```

Por fim, vamos implementar em Negociacoes:

```ts   
import { Negociacao, MeuObjeto } from './index';

export class Negociacoes implements MeuObjeto<Negociacoes> {

    private _negociacoes: Negociacao[] = [];

    adiciona(negociacao: Negociacao): void {

        this._negociacoes.push(negociacao);
    }

    paraArray(): Negociacao[] {

        return ([] as Negociacao[]).concat(this._negociacoes);
    }

    paraTexto(): void {
        console.log('-- paraTexto --');
        console.log(JSON.stringify(this._negociacoes));
    }

   // precisamos implementar o método ehIgual
    ehIgual(negociacoes: Negociacoes): boolean {

        return JSON.stringify(this._negociacoes) == JSON.stringify(negociacoes.paraArray());
    }
}
```

---
## 5.4 - Union Types e Type Guards

Aprendemos que o uso de herança e interfaces nos permite escrever códigos genéricos que se beneficiam da tipagem estática. Contudo, há outra forma de escrevermos um código genérico sem o uso de interfaces e sem apelarmos diretamente para o uso do tipo `any`.

Temos a seguinte função que espera receber um token de autenticação para então tratá-lo:

```ts
function processaToken(token: string) {
    // muda o dígito 2 por X!
    return token.replace(/2/g,'X');
}
const tokenProcessado = processaToken('1234');
```

Excelente, mas no sistema legado que estamos utilizando TypeScript, em algums momentos processaToken não recebe uma string, mas um number.

Podemos fazer com que a função aceite tanto string quanto number através de union types. Alterando nosso código:

```ts
function processaToken(token: string | number) {

    // muda o dígito 2 por X!
    // erro de compilação aqui
    return token.replace(/2/g,'X');
}

// compila
const tokenProcessado1 = processaToken('1234');
// compila
const tokenProcessado2 = processaToken(1234);
```

Porem o método `replace` só existe em string e não em number.
para resovermos isso, podemos utilizar **Type Guards**.

Podemos fazer com que nosso código compile checando o tipo dentro da função:

```ts
function processaToken(token: string | number) {

    if(typeof(token) === 'string') {

        // typescript entende que é o tipo string e faz autocomplete para este tipo. A função replace só existe em string
        return token.replace(/2/g,'X');
    } else {
        // toFixed só existe em number!
        return token.toFixed().replace(/2/g,'X');
    }
}

const tokenProcessado1 = processaToken('1234');
const tokenProcessado2 = processaToken(1234);
```

---
## 5.5 - Type alias

É possível criar um alias para todos os tipos envolvidos em um union type. Vejamos:

```ts
// criando o alias!
type MeuToken = string |  number;

function processaToken(token: MeuToken) {

    if(typeof(token) === 'string') {

        return token.replace(/2/g,'X');
    } else {

        return token.toFixed().replace(/2/g,'X');
    }

}
```

---
## 5.6 - Async/await


TypeScript se baseia no ES2015, todavia, na versão ES2017 foi introduzida a sintaxe `async/await`. Ela funciona da seguinte maneira. Dentro de uma uma função ou método `async`, isto é, uma função ou método declarado como `async` `NomeDoMetodoOuFuncao`, podemos tratar o retorno de `promises` de uma maneira muito especial.

Por padrão, capturamos o retorno de uma promise dentro da função `then`. Mas se dentro de uma função `async`, usamos a instrução `await` antes da chamada de um método que retorne uma `promise`, podemos capturar seu retorno sem a necessidade da chamada de `then`, como se ela fosse uma função síncrona tradicional. 
Vejamos um exemplo:

// o método importDados é um método async!

```ts

@debounce(500)
    async importarDados() {


        const isOk: ResponseHandler = (res: Response) => {
            if (res.ok) return res
            throw new Error(res.statusText);
        }

        try {
            const negociacoesParaImportar = await this._negociacaoService.obterNegociacoes(isOk)


            const negociacoesJaImportadas = this._negociacoes.toArray()

            negociacoesParaImportar.filter(
                negociacao => !negociacoesJaImportadas.some(
                    jaImportada => negociacao.ehIgual(jaImportada)
                )
            ).forEach(negociacao =>
                this._negociacoes.adiciona(negociacao));
            this._negociacoesView.update(this._negociacoes);

        } catch (error) {

            console.log(error.message)
            this._mensagemView.update("Erro ao realizar importações.")

        }
    }

```

Mas se não chamamos mais then, não chamaremos também catch, certo? Então, como conseguiremos tratar possíveis erros? Quando usamos async/wait, por mais que o código seja assíncrono, podemos usar try e catch para lidar com possíveis exceções em nosso código. Por mais que nosso código pareça um código síncrono, ele continua sendo um código assíncrono.

A boa notícia é que mesmo o TypeScript suportando apenas o ES2015 ele introduziu em sua sintaxe o async/await do ES2017 a partir da sua versão 2.3. Isso não quer dizer que somos obrigados a utilizá-la, mas seu uso melhor bastante a legibilidade do nosso código.