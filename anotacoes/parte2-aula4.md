# 4 - API externa e interface](./anotacoes/parte2_aula4.md)**

## 4.1 - API externa

Vamos consumir uma api externa para pegar dados de negociações.
Esta api nos retorna uma lista com negociações que utilizam as chaves `montante` e `vezes`.

o pacote api neste repositorio, roda na porta 8080 com `npm start`.

Podemos adicionar uma função ao botão importa em  `./app.ts`:

```ts
import { NegociacaoController } from './controllers/NegociacaoController';

const controller = new NegociacaoController();
$('.form').submit(controller.adiciona.bind(controller));
$('#botao-importa').click(controller.importarDados.bind(controller));
```

E criamos o método  `importarDados` em `NegociacaoController`:
```ts
// app/ts/controllers/NegociacaoController.ts

    importarDados() {

        alert('oi');

    }
```

---
## 4.2 - Definindo uma interface para a API

Podemos definir uma interface para nossa API. Assim, caso uma chave mude, podemos fazer a alteração na interface, o que geraria erros de compilação nos locais onde a chave antiga é utilizada no código:

```ts
// ./ts/models/NegociacaoParcial.ts

export interface NegociacaoParcial {
    vezes: number
    montande: number
}
```

Não esquecer de exportar em `index.ts` e importa-la no controller.

A alternativa a interface, seria definir o tipo `any` no retorno da API, mas se tiver algum erro de digitação, ele será pego somente em tempo de execução.

---
## 4.3 - Consumindo API externa

Na função `importaDados` de `NegociacaoController`:

1. Utilizamos o `fetch` para fazer as requisições. o `fetch` utiliza Promise por padrão e já traz na própria resposta o método `.json()`. 
    ```ts
        importarDados() {

            fetch('http://localhost:8080/dados')
                .then(res => res.json())   
        }
    ```
3. Como usamos arrow function sem bloco, o resultado da instrução `res.json()` é retornado automaticamente sem a necessidade de usarmos um `return` e quando fazemos isso, temos acesso ao retorno na próxima chamada encadeada à função `then`.
    ```ts
        importarDados() {

            fetch('http://localhost:8080/dados')
                .then(res => res.json())
                .then((dados: NegociacaoParcial[]) => {
                    dados
                        .map(dado => new Negociacao(new Date(), dado.vezes, dado.montante))
                        .forEach(negociacao => this._negociacoes.adiciona(negociacao));
                    this._negociacoesView.update(this._negociacoes);
                })
        }
    ```

1. Por fim, criamos uma função para verificar o status da requisicao, e utilizamos `catch` para tratar o request:
   ```ts
    importarDados() {

        function isOK(res: Response) {

            if(res.ok) {
                return res;
            } else {
                throw new Error(res.statusText);
            }
        }

        fetch('http://localhost:8080/dados')
            .then(res => isOK(res))
            .then(res => res.json())
            .then((dados: NegociacaoParcial[]) => {
                dados
                    .map(dado => new Negociacao(new Date(), dado.vezes, dado.montante))
                    .forEach(negociacao => this._negociacoes.adiciona(negociacao));
                this._negociacoesView.update(this._negociacoes);
            })
            .catch(err => console.log(err.message));       
    }
   ```

---
## 4.4 - Revisando decorators

Vamos criar um decorator para postergar a execução de uma requisição e impedir que ela seja executada sequencialmente se o botao for clicado repetidas vezes.


```ts
// app/ts/helpers/decorators/debounce.ts

export function debounce(milissegundos = 500) {

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const metodoOriginal = descriptor.value;

        let timer = 0;

        descriptor.value = function(...args: any[]) {
            if(event) event.preventDefault();
            clearInterval(timer);
            timer = setTimeout(() => metodoOriginal.apply(this, args), milissegundos);
        }

        return descriptor;
    }
}

```

a linha `if(event) event.preventDefault();` é necessária para utilizarmos o decorator em botoes de submit de formulários, pois como o decorator posterga a execução do código, a página iria recarregar. Também é necessário remover event como entrada no método original, assim, obteremos ele de maneira implícita:

```ts
//...

import {debounce } from "../helpers/decorators/index";
//...

export class NegociacaoController {

//...

    @debounce(500)
    adiciona() {

        //...

    }

    //..
```

agora, ao clicar repetidamente em adicionar, ele só executará uma vez 500 ms após o ultimo clique.


---
## 4.5 - Isolando o acesso à API em um serviço

A lógica de acesso à nossa API esta fixa no método `importaDados` de `NegociacaoController`. O problema dessa abordagem é que se quisermos acessar a API em outro controller, teremos que repetir código. Podemos enviar isso isolando a lógica de importação na classe `NegociacaoService`.

```ts
// app/ts/services/NegociacaoService.ts

import { NegociacaoParcial, Negociacao } from '../models/index';

export class NegociacaoService {

    obterNegociacoes(handler: Function): Promise<Negociacao[]> {

        return fetch('http://localhost:8080/dados')
            .then(res => handler(res))
            .then(res => res.json())
            .then((dados: NegociacaoParcial[]) => 
                dados.map(dado => new Negociacao(new Date(), dado.vezes, dado.montante))
            )

    }
}

```
Um ponto a destacar é que nosso método recebe uma `handler`, isto é, a função que considerará ou não a operação válida.

O retorno do método será a `Promise`, resultado de `fetch`. No entanto, `Promise` é um tipo genérico e precisamos indicar qual tipo estará disponível ao acessarmos seu retornado através de `then`. É por isso que usamos `Promise<Negociacao[]>`, pois através de then teremos acesso ao array de negociações.

Como de costume, vamos criar um barrel para facilitar a importação do serviço:

```ts
// app/ts/services/index.ts 
export * from './NegociacaoService';
```

Agora, vamos importar nosso serviço, inclusive adicionar como propriedade de NegociacaoController uma instância dessa classe para que possamos utilizá-la:

```ts
import { NegociacoesView, MensagemView } from '../views/index';
import { Negociacao, Negociacoes } from '../models/index';
import { domInject, throttle } from '../helpers/decorators/index';
import { NegociacaoParcial } from '../models/index';
import { NegociacaoService } from '../services/index';

export class NegociacaoController {

    // código anterior omitido

   // mais uma propriedade da classe!
    private _service = new NegociacaoService();

// código anterior omitido 

    @throttle()
    importaDados() {

        function isOk(res: Response) {

            if(res.ok) {
                return res;
            } else {
                throw new Error(res.statusText);
            }
        }

        this._service
            .obterNegociacoes(isOk)
            .then(negociacoes => {
                negociacoes.forEach(negociacao => 
                    this._negociacoes.adiciona(negociacao));
                this._negociacoesView.update(this._negociacoes);
            });       
    }
```

---
## 4.6 - Interface de função

O método `importaNegociacoes` de NegociacaoService aceita receber uma função. No entanto, podemos passar qualquer função, o que pode resultar em erro.

Vamos criar uma interface de função para definir os tipos de entrada e saida desta função:

```ts
// app/ts/services/NegociacaoService.ts

import { NegociacaoParcial, Negociacao } from '../models/index';

export class NegociacaoService {

    obterNegociacoes(handler: ResponseHandler): Promise<Negociacao[]> {

        return fetch('http://localhost:8080/dados')
            .then(res => handler(res))
            .then(res => res.json())
            .then((dados: NegociacaoParcial[]) => 
                dados.map(dado => new Negociacao(new Date(), dado.vezes, dado.montante))
            )

    }
}

export interface ResponseHandler {

    (res: Response): Response
}
```
A interface `ResponseHandler` é o tipo que define que a função deve receber um parâmetro do tipo `Response` e devolver um `Response`. Inclusive, lá no método `obterNegociacoes` mudamos o tipo de Function para `ResponseHandler`.

Agora, em `NegociacaoController`, nosso código não compila se passarmos uma função indevida e somos alertados disso através do compilador do TypeScript.

Podemos até declarar o tipo da função isOk se quisermos:
```ts
    const isOk: ResponseHandler = (res: Response) => {
        if(res.ok) return res;
        throw new Error(res.statusText);
    }
```