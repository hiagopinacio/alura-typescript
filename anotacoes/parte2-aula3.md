# 3 - O poder dos decorators

## 3.1 Requisitos não funcionais

Supondo que queremos calcular o tempo de execução de cada um de nossos métodos, deveríamos adicionar uma lógica em cada método para calcular este tempo. Ex.:

```ts

meuMetodo() {
    const t1 = performace.now()

    // lógica do método

    const t2 = performace.now()

    console.log(`tempo de execução de meuMetodo: ${t2-t1} ms`)
    }

```

O problema é que começariamos a ter um código espalhado pela nossa aplicação. Por mais que o código seja isolado em uma função, teremos que lembrar de chamar a função no início e no final do método. Será que há uma solução para isso? Queremos poder isolar o código que teste a performance em um único lugar. 

---
## 3.2 Decorator de método

Podemos utilizar decorators para alterar o comportamento de métodos, por exemplo, adicionando etapas de execução antestes e depois do método. Para tal, precisamos ativar em nosso compilador `TypeScript` a configuração `experimentalDecorators`. Quando `true`, permite utilizar decorators, estrutura que atenderá nossa finalidade. 

```json
{
    "compilerOptions": {
        "target": "es6",
        "outDir": "app/js",
        "noEmitOnError": true, 
        "noImplicitAny": true,
        "removeComments": true,
        "module": "system",
        "strictNullChecks": true,
        "experimentalDecorators": true
    },
    "include": [
        "app/ts/**/*"
    ]
}
```

Vamos criar o arquivo `app/ts/helpers/decorators/logarTempoDeExecucao.ts` e nele exportamos uma função de mesmo nome:

```ts
export function logarTempoDeExecucao() {

}
```
Essa função indica o nome do nosso decorator.

O decorator deve retornar uma função, que é onde deve estar sua implementação:

```ts
export function logarTempoDeExecucao() {

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    }
}
```

A função retornada não recebe três parâmetros por acaso:
1. O primeiro **`target`** é aquele que possui uma referência para o elemento cujo método foi decorado por logarTempoDeExecucao.
2. O segundo parâmetro é uma string que nos retorna o nome do método decorado. 
3. Por fim, o `descriptor` nos dará acesso ao método que desejamos modificar sua execução, através de `descriptor.value`.

```ts
export function logarTempoDeExecucao() {

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const metodoOriginal = descriptor.value;

        // aqui vamos substituir descriptor.value pela lógica do nosso decorator

        return descriptor;
    }
}

```
O valor de `descriptor.value` será `function(...args: any[])`. Isso se dá dessa forma, porque o método que estamos sobrescrevendo pode receber zero, um ou mais parâmetros de tipos que desconhecemos. Usamos `...` para indicar um **REST PARAMETER**, algo que não é exclusivo do TypeScript, mas do ES2015:

```ts
export function logarTempoDeExecucao() {

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const metodoOriginal = descriptor.value;

        descriptor.value = function(...args: any[]) {

            const retorno = metodoOriginal.apply(this, args);
            return retorno;
        }

        return descriptor;
    }
}
```

Fazemos `metodoOriginal.apply(this, args)` para invocar o método original, capturar seu resultado, caso exista e retorná-lo. Ainda não há a nossa lógica do teste de performance. Por enquanto vamos deixar assim. Não deve ocorrer nenhum erro e o comportamento da nossa aplicação deve continuar o mesmo. Mas para que possamos utilizá-lo, vamos exportá-lo através de um barril e importá-lo em `View`.


Primeiro, criando o barril

```ts
// app/ts/helpers/decorators/index.ts
export * from './logarTempoDeExecucao';
```


Agora, importando e utilizando em View:

```ts
import { logarTempoDeExecucao } from '../helpers/decorators/index';

export abstract class View<T> {

    // omitido

    @logarTempoDeExecucao()
    update(model: T) {

        //restante omitido

```

Usamos decorator através de um `@`, seguido do nome do decorator, abrindo e fechando parênteses no final, justo, porque um decorator nada mais é do que uma função.

Recarregando nossa aplicação tudo continua funcionando. Agora precisamos escrever a lógica do teste de performance em nosso decorator.

---
## 3.3 Medindo o tempo de execução de métodos

Agora, só precisamos guardar o tempo antes da chamada do método original e logo depois da sua chamada, para no fim, realizarmos o cálculo do tempo gasto. Inclusive, vamos exibir no console os parâmetros recebidos pelo método, inclusive seu retorno:

```ts
export function logarTempoDeExecucao() {

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

            const metodoOriginal = descriptor.value;

            descriptor.value = function(...args: any[]) {
                console.log('-----------------------')
                console.log(`Parâmetros do método ${propertyKey}: ${JSON.stringify(args)}`);
                const t1 = performance.now();
                const resultado = metodoOriginal.apply(this, args);
                console.log(`Resultado do método: ${JSON.stringify(resultado)}` )
                const t2 = performance.now();
                console.log(`${propertyKey} demorou ${t2 - t1} ms`);
                console.log('-----------------------')
                return resultado;
            }
            return descriptor;
    }

}

```

como `args` é um array, devemos usar `JSON.stringify(args)` para exibilo como texto no console.

### Passando parametro para decorators

Podemos passar parametros para os decorators.
Para exemplificar, vamos passar um parâmetro booleano que permite exibir o tempo de execução em segundos:

```ts
export function logarTempoDeExecucao(emSegundos: boolean = false) {

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

            const metodoOriginal = descriptor.value;

            descriptor.value = function(...args: any[]) {

                let divisor = 1;
                let unidade = 'milisegundos'
                if(emSegundos) {
                    divisor = 1000;
                    unidade = 'segundos';
                }

                console.log('-----------------------')
                console.log(`Parâmetros do método ${propertyKey}: ${JSON.stringify(args)}`);
                const t1 = performance.now();
                const resultado = metodoOriginal.apply(this, args);
                console.log(`Resultado do método: ${JSON.stringify(resultado)}` )
                const t2 = performance.now();
                console.log(`${propertyKey} demorou ${(t2 - t1)/divisor} ${unidade}`);
                console.log('-----------------------')
                return resultado;
            }
            return descriptor;
    }
}
```

---
## 3.4 Criando nosso próprio DOM Injector e Lazy loading

O construtor `NegociaçãoController` busca os elementos no DOM mesmo que os usuários não interajam com eles.

Podemos melhorar isso com auxílio de um decorator, criando uma estratégia de *lazy loading*. Por debaixo dos panos, vamos substituir cada propriedade por um getter. Sendo um getter, podemos escrever um bloco de código que ainda assim para o JavaScript ele será considerado uma propriedade. Nesse bloco de código, só buscaremos o elemento do DOM quando o getter for acessado pela primeira vez. Novos acessos retornarão o mesmo elemento!

```ts
// app/ts/helpers/decorators/domInject.ts 

export function domInject(seletor: string) {

    return function(target: any, key: string) {

        let elemento: JQuery;

        const getter = function() {

            if(!elemento) {
                console.log(`buscando  ${seletor} para injetar em ${key}`);
                elemento = $(seletor);
            }

            return elemento;
        }
    }
}

```

Criamos uma função que será nosso getter, mas como faremos a substituição da propriedade alvo do decorator pelo getter que criamos? Faremos isso com auxílio de Object.defineProperty:

```ts
// app/ts/helpers/decorators/domInject.ts 

export function domInject(seletor: string) {

    return function(target: any, key: string) {

        let elemento: JQuery;

        const getter = function() {

            if(!elemento) {
                console.log(`buscando  ${seletor} para injetar em ${key}`);
                elemento = $(seletor);
            }

            return elemento;
        }

        Object.defineProperty(target, key, {
           get: getter
       });
    }
}
```

Não podemos nos esquecer de exportar o decorator através de `app/ts/helpers/decorators/index.ts`.

Por fim, vamos importá-lo em NegociacaoController e utilizá-los nas propriedades da classe, não esquecendo de remover a busca manual dos elementos do seu constructor:

```ts
import { NegociacoesView, MensagemView } from '../views/index';
import { Negociacoes, Negociacao } from '../models/index';
import { domInject } from '../helpers/decorators/index';

export class NegociacaoController {

    @domInject('#data')
    private _inputData: JQuery;

    @domInject('#quantidade')
    private _inputQuantidade: JQuery;

    @domInject('#valor')
    private _inputValor: JQuery;

    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemView = new MensagemView('#mensagemView');

    constructor() {
       // removeu a busca manual dos elementos
        this._negociacoesView.update(this._negociacoes);
    }
// código posterior omitido
```

Assim, criamos um decorator que realiza injeção de elementos do DOM com o padrão lazy loading.

---
## 3.5 Para saber mais: decorator de classe

Em TypeScript também podemos criar decoradores de classes. Um decorador de classe nos dá acesso ao construtor da classe que estamos decorando. Vejamos um exemplo:

```typescript
export function meuDecoratorDeClasse() {

    return function(constructor: any) {

       // guarda o constructor original, pois iremos definir um novo
        const original = constructor;

       // cria um novo constructor. Como ele pode receber nenhum ou mais parâmetros, usamos ...args: any[]
        const novo: any = function (...args: any[]) {
            console.log("Criando uma instância com New: " + original.name); 
            // cria a instância da classe quando for chamado 
            return new original(...args);
        }

       // importante! O prototype do novo constructor deve ser o mesmo do original
        novo.prototype = original.prototype;

        // retorna o novo constructor
        return novo;
    }
}
```

Nosso decorator exibirá apenas uma mensagem no console indicando que chamará o constructor da classe. 

```ts
// código anterior omitido

@meuDecoratorDeClasse()
export class NegociacaoController {
   // código omitido 
}
```