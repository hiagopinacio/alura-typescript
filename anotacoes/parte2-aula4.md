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
## 4.1 - API externa


---
## 4.1 - Revisando decorators


---
## 4.1 - Sobre decorators


---
## 4.1 - Isolando o acesso à API em um serviço


---
## 4.1 - Interface de função


---
## 4.1 - Sobre interface de funções


---
## 4.1 - Revisão


---
## 4.1 - Consolidando seus conhecimentos


---