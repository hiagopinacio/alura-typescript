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
## 5.1 - Interface em ação



---
## 5.1 - Evitando importar negociações duplicadas



---
## 5.1 - Estendendo interfaces



---
## 5.1 - Sabatina



---
## 5.1 - Sintaxe inválida



---
## 5.1 - Para saber mais: TypeScript e Node.js



---
## 5.1 - Union Types e Type Guards



---
## 5.1 - Type alias



---
## 5.1 - Revisão



---
## 5.1 - Mensagens de alto nível



---
## 5.1 - Async/await



---
## 5.1 - Consolidando seus conhecimentos



---
## 5.1 - Considerações finais



---
## 5.1 - Projeto final completo



---