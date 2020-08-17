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

### 3.2.1 - Criando o Decorator

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
## 3. Esboço de um decorator de método


---
## 3. TypeScript e Decorators


---
## 3. Sobre o descriptor


---
## 3. Medindo o tempo de execução de métodos


---
## 3. Criando nosso próprio DOM Injector e Lazy loading


---
## 3. Para saber mais: decorator de classe


---
## 3. Revisão


---
## 3. Consolidando seus conhecimentos


---