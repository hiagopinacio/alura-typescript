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

A linguagem JavaScript não me proíbe de instanciar uma Negociação sem parâmetros.

```js
let negociacao = new Negociacao();
```

Além disso, nada nos impede de acessarmos as propriedade que começa com _:

```js
negociacao._quantidade = 10
```

O uso do prefixo é apenas uma convenção para indicar que a propriedade é privada.

Por mais que a linguagem JavaScript tenha evoluído, ela não consegue lidar com questões como essa sem termos que apelar para convenções ou aplicar técnicas que aumentam bastante a complexidade do nosso código.

O TypeScript consegue pegar em tempo de desenvolvimento estes erros que só podem ser detectados em tempo de execução no JavaScript.

---
## Instalação e Configuração do compilador

#### Precisamos criar o `package.json` que descreve os módulos do npm.

Dentro da pasta do projeto:

```sh
npm init
```

Podemos teclar ENTER para todas as perguntas. No final, teremos o arquivo `./package.json`:

#### Instalação do typescript:

```sh
npm install typescript@2.3.2 --save-dev
```

Dentro de instantes ele será instalado dentro da pasta alurabank/node_modules.
O instalador adiciona esta informação no `package.json` na chave `"devDependencies": {}`

#### O arquivo tsconfig.json

Precisamos criar o arquivo `./tsconfig.json` que guardará as configurações do nosso compilador. Configuração mínima:

```json
{
    "compilerOptions": {    // configurações do compilador:
        "target": "es6",    //  codigo será compilado em **`es6`**
        "outDir": "app/js"  //  diretório de saida do compilador
    },
    "include": [            // fonte dos arquivos a serem compilados.
        "app/ts/**/*"         
    ]
}
```

#### Script para o compilador

Uma boa prática é criarmos um script em nosso `package.json` que se encarregará de chamr o compilador para nós através do terminal.
Para isso, precisamos adicionar dentro da chave `scripts`, uma chamada para o **`tsc`**. Podemos nomear esta chamada de **`compile`**, por exemplo:

```json
{
  "name": "alurabank",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "compile": "tsc" // script compile chama o tsc (compilador)
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "typescript": "^2.3.2"
  }
}
```

#### Executando o script compiler:

Através do terminal, dentro da pasta do projeto:

```sh
npm run compile
```

Os código dentro dos diretórios definidos no arquivo `tsconfig.json` serão compilados pro formato e local definido.

---
## Modelando com TypeScript






---
## Automatizando o processo de Compilação





