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

    toArray() {

       return this._negociacoes;
    }
}
```

O método toArray, retorna o atributo privado `_negociacoes`. isso implica que ele poderia ser alterado fora da classe. 
Podemos resolver isso facilmente através da programação defensiva, retornando um novo array toda vez que o método `paraArray()` for chamado, sendo assim, qualquer mudança será efetuada na cópia e não no array original encapsulado por Negociacoes:

```ts
return [].concat(this._negociacoes);
```

No entanto, fazendo esta cópia, não especificamos o tipo de dados do array retornado, apenas adicionamos nele, dados do tipo Negociação. Podemos resolver isso tipando o retorno da nossa função.

Tipamos métodos adicionando `:Tipo` imediatamente os (). Ex.:

```ts
dobra(a:number): number {return 2*a}
```

Vamos fazer isso para os métodos `adiciona()` e `toArray()`:

```ts
class Negociacoes {

    private _negociacoes: Negociacao[] = []

    adiciona(negociacao: Negociacao): void {

        this._negociacoes.push(negociacao)
    }

    toArray(): Negociacao[] {

        return [].concat(this._negociacoes)
    }
}
```



---
## Guardando negociações

Em NegociacaoController, vamos criar uma instância de Negociacoes.

Já podemos inicializar a variável com uma instância de Negociacoes, sem dizer explicitamente seu tipo:

```ts
class NegociacaoController {

    private _inputData: HTMLInputElement;
    private _inputQuantidade: HTMLInputElement;
    private _inputValor: HTMLInputElement;
    // removeu o tipo!
    private _negociacoes = new Negociacoes();
```

O TypeScript consegue entender que, se estamos criando uma instância de Negociacoes, a propriedade não tipada que receber seu valor assumirá o tipo Negociacoes.

Agora, vamos alterar o método adiciona() de NegociacaoController e armazenar cada negociação criada no modelo Negociacoes:

```ts
    adiciona(event: Event) {

        event.preventDefault();

        const negociacao = new Negociacao(
            new Date(this._inputData.value.replace(/-/g, ',')), 
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        );

        this._negociacoes.adiciona(negociacao);

        // imprime a lista de negociações encapsulada 
        console.log(this._negociacoes.paraArray());
    }

```

Podemos testar nossa programação defensiva e tentar zerar o array antes de exibi-lo no console:

```ts
this._negociacoes.paraArray().length = 0
```

Mesmo assim, o array ainda é exibido, pois o que está sendo apagado é uma cópia do nosso array encapsulado.

Vale observar que, como tipamos a saída do método `Negociacoes.toArray()`, o editor consegue realizar o ***auto complete*** para cada item do array.

---
## Apresentando o modelo para o usuário





---
## Template dinâmico