# Bem começado, metade feito

---
## O projeto e sua Estrutura

O projeto consiste em uma página contendo um formulário para adicionar Negiciações.

Abaixo do formulário, há uma tabela com as negociações.

O HTML e CSS já estão implementados, também existem libs js que serão utilizadas no decorrer do projeto.

---
## Modelando uma Negociação

Vamos criar o script que declarará nossa classe `Negociacao` em `app/js/models/Negociacao.js`:

```js
class Negociacao {

    constructor(data, quantidade, valor) {
        this._data = data
        this._quantidade = quantidade
        this._valor = valor

    }

    get data() {
        return this._data
    }

    get quantidade() {
        return this._quantidade
    }

    get valor() {
        return this._valor
    }

}
```

importamos o script em `app/index.html`:

```html
<script src="js/models/Negociacao.js"></script>
```
Agora, vamos criar o arquivo app/js/app.js que será o ponto de entrada da nossa aplicação. Não podemos esquecer e importá-lo em app/index.html:

```html
<!-- client/index.html -->
<!-- código anterior omitido -->
        <script src="js/models/Negociacao.js"></script>
        <script src="js/app.js"></script>
    </body>
<html>
```

Vamos testar a primeira regra. Uma negociação obrigatoriamente deve ter uma data, quantidade e valor:

```js
// app/js/app.js


let negociacao = new Negociacao(new Date(), 2, 100);
console.log(negociacao);
```


---
## Colocando o código a prova






---
## Instalação e Configuração do compilador






---
## Modelando com TypeScript






---
## Automatizando o processo de Compilação





