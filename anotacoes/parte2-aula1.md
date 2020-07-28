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


---
## 1.4. Servidor local


---
## 1.5. Organizando módulos em barris