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
## 1.2. De namespaces para ES2015 modules


---
## 1.3. O papel de um carregador de módulos


---
## 1.4. Servidor local


---
## 1.5. Organizando módulos em barris