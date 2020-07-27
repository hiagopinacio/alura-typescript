
# 4 Herança, reaproveitamento de código
---
## 4.1 Herança
Para criarmos outra classe `View`, precisaríamos repetir o código do construtor de `NegociacoesView`, podemos então isolar esse código dentro de uma classe View.

Porém nosso parâmetro não pode ser privado, pois ele será utilizado por outra classe.
Só queremos permitir esta modificação por uma classe que seja filha de `View`, para isso, existe o modificador `protected`.

Então, declararemos em um novo arquivo `app/ts/views/View.ts`:

```ts
// app/ts/views/View.ts
class View {

    protected _elemento: Element;

    constructor(seletor: string) {

        this._elemento = document.querySelector(seletor);
    }
}
```

Com isso em `NegociacoesView` podemos remover o construtor e herda-lo de View:

```ts
class NegociacoesView extends View{

    update(model: Negociacoes) {

        this._elemento.innerHTML = this.template(model);
    }

    template(negociacoes: Negociacoes): string {

        // código omitido 

    }
```

Porém, toda classe que herda de view, também terão os métodos `update`  e `template`. Sendo que o método **`update`** será **praticamente identico**, e o método **`template`** deve ser **sobrescrito** pelas classes filhas:

```ts
// app/ts/views/View.ts
class View {

    //codigo omitido

    // erro compilacao
    update(model): void {
        this._elemento.innerHTML = this.template(model);
    }

    // erro compilacao
    template(model): string {

        throw new Error('Você deve implementar o método template');
    }

}
```

**Problema**: o objeto recebido pelos métodos update e template deve ser tipado, porém, ele pode ser diferente para cada classe que herdar de View.

---
## 4.1 Lidando com tipos Genéricos

Para resolver o problema anterior, podemos lançar mão de um recurso chamado **`generics`**.
Na declaração da classe View, passamos uma variável genérica, que representará um tipo. Normalmente utiliza-se **"T"** de type da seguinte forma: `class View<T>`, assim, podemos utilizar `T` no restante do código para representar este tipo. Com isso nossa classe utilizando generics, ficaria:

```ts
// app/ts/views/View.ts
class View<T> {

    //codigo omitido

    update(model: T): void {
        this._elemento.innerHTML = this.template(model);
    }

    template(model: T): string {

        throw new Error('Você deve implementar o método template');
    }

}
```
 E na classe `NegociacoesView`, passamos o tipo utilizado por ela na herança com `extends View<Negociacao>`. Além disso não precisamos mais da classe update, pois ela será herdada:

```ts
class NegociacoesView extends View<Negociacoes>{

    template(model: Negociacoes): string {

        // código omitido

    }
}
```

#### Precisamos do modificador protected em View?

Perceba que agora, a classe filha implementa apenas o método `template()`, ou seja, ela não precisa mais acessar a propriedade `_element` da classe mãe. com isso nosso parâmetro em View() pode ser privado:

```ts
// app/ts/views/View.ts
class View {

    private _elemento: Element;

    // restante do código omitido ...
}
```



---
## 4.1 Criando outra View

Vamos criar outra **view** para apresentar uma mensagem ao usuário quando uma negociação for adicionada.

em um novo arquivo `app/ts/views/MensagemView.ts`:

```ts
class MensagemView extends View<string> {

    template(model: string): string {

        return `<p class="alert alert-info">${model}</p>`;
    }
}
```

Criamos uma tag no template e importamos os scripts:

```html
<!-- ... codigo omitido -->

<div id="mensagemView"></div>

<!-- ... codigo omitido -->

    <script src="js/models/Negociacao.js"></script>
    <script src="js/models/Negociacoes.js"></script>
    <script src="js/views/View.js"></script>
    <script src="js/views/NegociacoesView.js"></script>
    <script src="js/views/MensagemView.js"></script>
    <script src="js/controllers/NegociacaoController.js"></script>
    <script src="js/app.js"></script>
</body>

</html>
```
Agora basta criar uma instancia dela no *controller* , e chamar o método update:

---
## 4.1 Classes Abstratas

A nossa classe `View`, não tem um template implementado, por isso ela nunca deve ser instanciada:

```ts
const view = new View<string>() //não deve acontecer!!
```

Por isso, devemos torna-la abstrada, e o typeScript permite declararmos isso com o modificador `abstract`:

```ts
// app/ts/views/View.ts
abstract class View<T> {

    // restante do código omitido ...
}
```

Assim, conseguimos se tentarmos instancia-la pegamos o erro em tempo de compilação!

Outro erro que estamos pegando apenas em tempo de execução é a não implementação do método template. Em vez de lançar um erro ao ser executado por uma classe filha que não o sobrescreveu, podemos defini-lo como um método abstrato:

```ts
abstract template(model: T): string;
```

 Com isso passamos a pegar este erro também, em tempo de compilação. A classe View fica:

```ts
// app/ts/views/View.ts
abstract class View<T> {

    private _element: Element

    constructor(selector: string) {

        this._element = document.querySelector(selector)
    }

    update(model: T) {
        this._element.innerHTML = this.template(model)
    }

    abstract template(model: T): string;
}
```


