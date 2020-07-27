# Elaborando uma solução de view

---
## Criando mais um modelo

Podemos guardar as negociações criadas em um Array. Porém o array do JavaScript permite dezenas de operações, sendo assim, vamos encapsular um array dentro da classe Negociacoes e fazer com que todo acesso ao array encapsulado passe pelos métodos da classe.

Para declarar um array, devemos informar qual tipo de dados será gravado neste array. Um array de números, por ex.:

```ts
private meuArray: Array<number>
```

Pdemos declarar este array de uma forma alternativa:

```ts
private meuArray: number[]
```

Vamos criar o arquivo `app/ts/models/Negociacoes.ts`. Ele terá uma única propriedade, um array de negociações, o qual inicializaremos com valor vazio. Também terá os métodos `adiciona`, e `toArray`:

```ts
class Negociacoes {

    private _negociacoes: Negociacao[] = [];

    adiciona(negociacao: Negociacao) {

        this._negociacoes.push(negociacao);
    }

    paraArray() {

       return this._negociacoes;
    }
}
```
Lembrar de importar o arquivo criado no HTML


---
## Guardando negociações





---
## Apresentando o modelo para o usuário





---
## Template dinâmico