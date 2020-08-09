# 1 -  NameSpace e módulos externos

---
## 1.1. Organização do código através de namespaces

O TypeScript oferece o conceito de namespace. Podemos agrupar classes dentro de um mesmo namepace e acessá-las através dele. 

```ts
namespace Humanoides {

    export class Homem {

        // código omitido 
    }    

    export class Monstro {

        // código omitido 
    }        

    export class Hibrido {

        // código omitido 
    }            
}
```

Veja que além do namespace, é necessário adicionarmos a instrução `export` para que a classe esteja disponível.

utilização das classes definidas no namespace Humanoides:

```ts
class App {

    constructor() {

        let homem = new Humanoides.Homem();
        let monstro = new Humanoides.Monstro();
        let hibrido = new Humanoides.Hibrido();
    }
}
```

Infelizmente, essa solução não resolve o problema de termos que nos preocupar com a ordem de importação dos scripts no template html, um dos tendões de Aquiles do mundo JavaScript. É por isso que o TypeScript aceita também o sistema de módulos do ES2015. Será ele que utilizaremos, em vez do sistema de namespace.

---
## 1.2. ES2015 modules

A sintaxe de módulos do ES2015 considera cada script um módulo e através das instruções `import` e `export` importamos e exportamos artefatos respectivamente. Ex.:

- Exportando uma classe:

    ```ts
    export class MyClass { // codigo da classe }
    ```

- importando uma classe:

    ```ts
    import { MyClass } from './path/to/MyClass';

    var myClass = new MyClass()
    ```

Podemos agora adequar todos os arquivos para o sistema de módulos do ES2015:

- *app/ts/views/View.ts*:

    ```ts
    export abstract class View<T> {
        
        // código omitido
    }
    ```

- *app/ts/views/MensagemView.ts*:

    ```ts
    import { View } from './View'
    export class MensagemView extends View<string> {

        // código omitido
    }
    ```

- *app/ts/models/Negociacao.ts*:

    ```ts
    export class Negociacao {
        
        // código omitido
    }
    ```

- *aapp/tsp/models/Negociacoes.ts*:
    ```ts
    import { Negociacao } from './Negociacao'
    export class Negociacoes {
        
        // código omitido
    }
    ```

- *app/ts/views/NegociacoesView.ts*:
    ```ts
    import { View } from './View'
    import { Negociacoes } from '../models/Negociacoes'
    export class NegociacoesView extends View<Negociacoes> {
        
        // código omitido
    }
    ```



- *app/ts/controllers/NegociacaoController.ts*:
    ```ts
    import { Negociacao } from "../models/Negociacao";
    import { Negociacoes } from "../models/Negociacoes";
    import { MensagemView } from "../views/MensagemView";
    import { NegociacoesView } from "../views/NegociacoesView";

    export class NegociacaoController {
        
        // código omitido
    }
    ```
- *app/ts/app.ts*:

    ```ts
    import { NegociacaoController } from './controllers/NegociacaoController'
    
    // código omitido
    ```

Isso ainda não é suficiente, precisamos utilizar um loader, uma biblioteca que seja capaz de carregar o módulo app.js e a partir deles carregar todos os demais módulos.



---
## 1.3. O papel de um carregador de módulos
Vamos alterar o arquivo `tsconfig.json` e indicar para o TypeScript que ele deve usar o sistema de módulos do `System.js`:
```json
{
    "compilerOptions": {
        "target": "es6",
        "outDir": "app/js",
        "noEmitOnError": true, 
        "noImplicitAny": true,
        "removeComments": true,
        "module": "system"
    },
    "include": [
        "app/ts/**/*"
    ]
}
```

Agora, quando nossos arquivos são compilados, eles possuem essa estranha estrutura:

```js
System.register(["../views/NegociacoesView", "../views/MensagemView", "../models/Negociacoes", "../models/Negociacao"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var NegociacoesView_1, MensagemView_1, Negociacoes_1, Negociacao_1, NegociacaoController;
    return {
   // código posterior omitido
```

Por fim, vamos importar o loader utilizá-lo para carregar `js/app/js`. É a partir dele que os demais serão carregados.

```html
    <div id="negociacoesView"></div>
    <script src="lib/jquery.min.js"></script>

    <script src="lib/system.js"></script>
    <script>
         System.defaultJSExtensions = true;
        System.import('js/app.js').catch(err => console.error(err));
    </script>
```

Contudo, isso não é suficiente. Loaders usam XMLHttpRequest, ou seja, realizam requisições Ajax para baixar os módulos e para isso precisamos de um servidor que disponibiliza nossa aplicação para o browser.

---
## 1.4. Servidor local

Utilizaremos o lite-server. Além dele servir a pasta `alurabank/app` para nós, ele ainda suporta **livereloading** através do `BrowserSync` que traz embutido. Isso é perfeito, pois toda vez que os arquivos `.ts` forem modificados e os arquivos `.js` gerados nosso navegador automaticamente será recarregado.

Dentro da pasta `alurabank`, vamos instalar o `lite-server`:

```sh
npm install lite-server@2.3.0 --save-dev
```

Agora, em `alurabank/package.json` vamos adicionar a chamada do servidor através do script "server"

```json
{
    // ... omitido
    "scripts":{
        // ... omitido

        "server": "lite-server --baseDir=app"
    }
    // omitido ...
}
```

Assim, quando executamos no terminal `npm run server` nosso servidor subirá e podemos acessar nossa aplicação através de `localhost:3000`.

### 1.4.2 Rodando scripts paralelamente com o módulo concurrently

Vamos instalar o módulo `concurrently`. Ele nos permitirá rodar os dois scripts que criamos em paralelo nas plataformas Windows, MAC e Linux.

Dentro da pasta alurabank vamos executar o comando:

```shell
npm install concurrently@3.4.0 --save-dev 
```

Vamos renomear o script `"start"` para `"watch"` e adicionar novamente o script `"start"` que chamará o módulo `concurrently`:

```json
{
  "name": "alurabank",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "compile": "tsc",
    "watch": "tsc -w",
    "server": "lite-server --baseDir=app",
    "start": "concurrently \"npm run watch\" \"npm run server\""
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/jquery": "^2.0.42",
    "concurrently": "^3.4.0",
    "lite-server": "^2.3.0",
    "typescript": "^2.3.2"
  }
}
```

Excelente, agora, no terminal, basta executarmos o comando `npm start` para termos os dois serviços rodando em paralelo em um único terminal.

---
## 1.5. Organizando módulos em barris

Podemos simplificar bastante a importação dos módulos através da estratégia **Barrel** (barril). Nela, um módulo importa e exporta todos os artefatos de uma pasta permitindo assim que apenas o barril seja importado na cláusula `from`.

Criaremos os seguintes arquvos:

```ts
// app/ts/views/index.ts

export * from './View'; 
export * from './MensagemView'; 
export * from './NegociacoesView';
```

```ts
// app/ts/models/index.ts

export * from './Negociacao'; 
export * from './Negociacoes';
```

Agora podemos diminuir nossos imports:

```ts
// app/ts/controllers/NegociacaoController.ts
import { NegociacoesView, MensagemView } from '../views/index';
import { Negociacoes, Negociacao } from '../models/index';

export class NegociacaoController {
// código posterior omitido
```

```ts
// app/ts/vies/NegociacoesView.ts
import { View } from './View';
import { Negociacoes } from '../models/index';

export class NegociacoesView extends View<Negociacoes> {
// código posterior omitido

```

O loader utilizado nos obriga a escrever index no final da importação do módulo. Projetos em Angular e Ionic que fazem uso do Webpack podem omiti-lo na importação. O importante é sabermos desta forma prática de organizar nossos módulos.