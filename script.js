/*
Para não precisar ficar escrevendo o querySelector e o querySelectorAll toda hora, essas funções irão auxiliar nesse quesito.
*/
const qs = (elemento) => document.querySelector(elemento);
const qsa = (elemento) => document.querySelectorAll(elemento);

// Variável que controla a quantidade de pizzas que o usuário quer pedir
let modalQt = 1;

// Guarda efetivamente qual pizza foi selecionada no modal, para podermos manipular as informações no carrinho
let modalKey = 0;

// Variável que armazena os preços das pizzas para todos os tamanhos
let pizzaSizePrice = [];

// Armazena definitivamente o preço da pizza selecionada de acordo com o tamanho e com a qtd escolhida, para seu valor ser adicionado ao array do carrinho para ser manipulado posteriormente.
let pizzaPrice = 0;

//Mapeia todo o array pizzaJson contendo os objetos json e retorna cada elemento dele juntamente com o índice.
pizzaJson.map((item, index) => {
  //cloneNode(true) clona a própria tag e todos os elementos aninhados dentro da tag (incluindo seu conteúdo, se tiver) que contém a classe .pizza-item, mostrando eles na tela. Ou seja, para cada pizza diferente, ele irá substituir a estrutura dinamicamente.
  let pizzaItem = qs(".pizza-item").cloneNode(true);

  //Coloca dinâmicamente os nomes das pizzas em cada div clonada que contém a classe .pizza-item--name acessando a propriedade name de cada objeto (item) do array pizzaJson. Nesse caso, como pizza item não é nenhum objeto que tenha acesso a alguma classe que contenha a função 'qs' que eu criei, devo utilizar o querySelector mesmo.
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;

  //Adiciona os preços dinâmicamente nas divs que contém a classe .pizza-item--price, acessando a propriedade price dos objetos do array.
  pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price
    .toFixed(2)
    .replace(".", ",")}`;

  //Adiciona as descrições dinâmicamente nas divs que contém a classe .pizza-item--desc, acessando a propriedade description dos objetos do array.
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

  //Adiciona as imagens dinâmicamente nas divs que contém a classe .pizza-item--img, selecionando especificamente a tag img que está aninhada logo após para que o atributo src seja acessado. A propriedade img dos objetos do array é acessada também para adicionar seu valor ao src da tag img.
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;

  //Adiciona o atributo data-key a tag que contém a classe .pizza-item e atribui a esse atributo o índice do objeto no array, para identificar no modal qual pizza foi selecionada e, assim, colocar as informações dela dinâmicamente no modal e, ainda, facilitar a adição da mesma ao carrinho.
  pizzaItem.setAttribute("data-key", index);

  //Ao clicar no link da pizza, executa essa função e abre o Modal:
  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    //Previne que a página atualize ao clicar no link da pizza
    e.preventDefault();

    // O objeto .target referencia nesse caso o próprio elemento do click, ou seja, a tag anchor. O método closest pega o elemento mais próximo dessa tag, nesse caso, o elemento que contém a classe .pizza-item, ou seja, a partir da tag anchor, selecionar o elemento mais próximo que contenha essa essa classe. A partir daí, podemos pegar o atributo data-key para podermos manipular o que for necessário e mostrar no modal a pizza em que clicamos.
    let key = e.target.closest(".pizza-item").getAttribute("data-key");

    // Seta a quantidade de pizzas pra 1 sempre que clicamos numa pizza diferente
    modalQt = 1;

    // Armazena a chave da pizza selecionada, para usar nas infos do carrinho
    modalKey = key;

    // Coloca a imagem da pizza selecionada no modal
    qs(".pizzaBig img").src = pizzaJson[key].img;

    // Coloca o nome da pizza selecionada no modal
    qs(".pizzaInfo h1").innerHTML = pizzaJson[key].name;

    // Coloca a descrição da pizza selecionada no modal
    qs(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;

    // Quando selecionamos uma pizza, queremos sempre que o tamanho selecionado pra ela seja o grande. Caso eu selecione algum tamanho diferente em alguma pizza (por exemplo, o pequeno), ao acessar outra pizza, esse tamanho previamente selecionado ficará como padrão. Então, essa parte do código é justamente para resetar todos os tamanhos, sumindo com a classe selected deles.
    qs(".pizzaInfo--size.selected").classList.remove("selected");

    // Coloca os tamanhos em grama da pizza selecionada no modal. O forEach percorre o vetor NodeList (criado pelo querySelectorAll)com todos os elementos que contém a classe .pizzaInfo--size e aplica uma função para cada um
    qsa(".pizzaInfo--size").forEach((element, elementIndex) => {
      // Essa parte do código faz com que a classe selected seja adiconada sempre no tamanho grande (que tem o índice 2), satisfazendo a condição de sempre ao clicar numa pizza, o tamanho grande seja o selecionado previamente.
      if (elementIndex == 2) {
        element.classList.add("selected");
      }

      // A partir do elemento percorrido com a classe .pizzaInfo--size, seleciona a tag span aninhada nele e adiciona o peso em gramas retirado da propriedade sizes (que é um vetor) do pizzaJson, percorrendo esse vetor (sizes) a partir do index do próprio elemento.
      element.querySelector("span").innerHTML =
        pizzaJson[key].sizes[elementIndex];
    });

    // Coloca o preço da pizza selecionada no modal
    qs(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price
      .toFixed(2)
      .replace(".", ",")}`;

    // Armazena os preços das pizzas para cada tamanho, tendo como referência o preço da pizza selecionada recebido pelo objeto json.
    pizzaSizePrice = [
      pizzaJson[key].price * 0.5,
      pizzaJson[key].price * 0.75,
      pizzaJson[key].price,
    ];

    // Armazena o valor original da pizza selecionada, ou seja, do tamanho grande
    pizzaPrice = pizzaSizePrice[2];

    // Coloca a quantidade de pizzas na tag que contém a classe .pizzaInfo--qt ao clicar no simbolo de + ou de -
    qs(".pizzaInfo--qt").innerHTML = modalQt;

    // Mostra o Modal na tela de forma suave, dando um intervalo de 200 milisegundos para que a opacidade do modal seja máxima, ou seja, 1, fazendo ele aparecer completamente. Assim, é dado tempo suficiente para que o modal apareça gradativamente na tela, seguindo a transição de .5s definida no CSS.
    qs(".pizzaWindowArea").style.opacity = 0;
    qs(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      qs(".pizzaWindowArea").style.opacity = 1;
    }, 200);
  });

  //Preenche as informações de pizzaItem em .pizza-area. O .append difere do .appendChild na questão de ele não precisar de um elemento html para ser adicionado no document.
  qs(".pizza-area").append(pizzaItem);
});

//Eventos de clique do Modal

// Cria um array NodeList com os elementos que contém as classe .pizzaInfo--cancelButton e .pizzaInfo--cancelMobileButton. Ao clicar em Cancelar (.pizzaInfo--cancelButton) ou em Voltar (.pizzaInfo--cancelMobileButton), passa como parâmetro um dos dois elementos através de uma arrow function no método forEach e chama a função closeModal.
qsa(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (element) => {
    element.addEventListener("click", closeModal);
  }
);

// Fecha o modal ao clicar no botão cancelar, adicionar ao carrinho ou no botão voltar, no caso do mobile:
function closeModal() {
  // Seta a opacidade para 0 para fazer o modal desaparecer suavemente de acordo com a propriedade transition do CSS (em .5s) e, após meio segundo, que é o tempo em que o modal irá desaparecer, tira ele completamente da tela com o display none, para que as pizzas abaixo possam ser clicadas normalmente e também para não atrapalhar o carrinho.
  qs(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    qs(".pizzaWindowArea").style.display = "none";
  }, 500);
}

// Armazena definitivamente qual tamanho da pizza está selecionado no momento, para mudar o preço daquela pizza naquele tamanho especificamente ao escolher a quantidade. O valor 2 refere-se ao tamanho previamente selecionado, que é o Grande.
let modalSize = 2;

// Muda o tamanho de pizza
qsa(".pizzaInfo--size").forEach((element) => {
  element.addEventListener("click", () => {
    // Remove a classe selected de todos os elementos que tenham essa classe ao clicar em um tamanho de pizza diferente
    qs(".pizzaInfo--size.selected").classList.remove("selected");

    // Adiciona a classe selected especificamente ao elemento (tamanho da pizza) clicado
    element.classList.add("selected");

    let size = Number(element.getAttribute("data-key"));

    // Altera visualmente o preço da pizza ao escolher os tamanhos e reseta a quantidade ao escolher outro tamanho
    switch (size) {
      case 0:
        qs(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaSizePrice[size]
          .toFixed(2)
          .replace(".", ",")}`;
        modalSize = size;
        modalQt = 1;
        qs(".pizzaInfo--qt").innerHTML = modalQt;
        pizzaPrice = pizzaSizePrice[size];
        break;
      case 1:
        qs(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaSizePrice[size]
          .toFixed(2)
          .replace(".", ",")}`;
        modalSize = size;
        modalQt = 1;
        qs(".pizzaInfo--qt").innerHTML = modalQt;
        pizzaPrice = pizzaSizePrice[size];
        break;
      default:
        qs(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaSizePrice[size]
          .toFixed(2)
          .replace(".", ",")}`;
        modalSize = size;
        modalQt = 1;
        qs(".pizzaInfo--qt").innerHTML = modalQt;
        pizzaPrice = pizzaSizePrice[size];
    }
  });
});

// Evento de clique para o botão - do modal
qs(".pizzaInfo--qtmenos").addEventListener("click", () => {
  // Somente quando a quantidade da pizza selecionada for maior que 1 que haverá o decréscimo de quantidade, para evitar chegar a quantidade 0 de pizza ou em números negativos.
  if (modalQt > 1) {
    // Subtrai a qt a variável modalQt e mostra visualmente
    modalQt--;
    qs(".pizzaInfo--qt").innerHTML = modalQt;

    // Altera o preço da pizza de acordo com a quantidade e com o tamanho atual selecionado
    switch (modalSize) {
      case 0:
        qs(".pizzaInfo--actualPrice").innerHTML = `R$ ${(
          pizzaSizePrice[modalSize] * modalQt
        ).toFixed(2)}`;
        pizzaPrice = pizzaSizePrice[modalSize];
        break;
      case 1:
        qs(".pizzaInfo--actualPrice").innerHTML = `R$ ${(
          pizzaSizePrice[modalSize] * modalQt
        ).toFixed(2)}`;
        pizzaPrice = pizzaSizePrice[modalSize];
        break;
      default:
        qs(".pizzaInfo--actualPrice").innerHTML = `R$ ${(
          pizzaSizePrice[modalSize] * modalQt
        ).toFixed(2)}`;
        pizzaPrice = pizzaSizePrice[modalSize];
    }
  }
});

// Evento de clique para o botão + do modal
qs(".pizzaInfo--qtmais").addEventListener("click", () => {
  // Adiciona a qt a variável modalQt e mostra visualmente
  modalQt++;
  qs(".pizzaInfo--qt").innerHTML = modalQt;

  // Altera o preço da pizza de acordo com a quantidade e com o tamanho atual selecionado
  switch (modalSize) {
    case 0:
      qs(".pizzaInfo--actualPrice").innerHTML = `R$ ${(
        pizzaSizePrice[modalSize] * modalQt
      )
        .toFixed(2)
        .replace(".", ",")}`;
      pizzaPrice = pizzaSizePrice[modalSize];
      break;
    case 1:
      qs(".pizzaInfo--actualPrice").innerHTML = `R$ ${(
        pizzaSizePrice[modalSize] * modalQt
      )
        .toFixed(2)
        .replace(".", ",")}`;
      pizzaPrice = pizzaSizePrice[modalSize];
      break;
    default:
      qs(".pizzaInfo--actualPrice").innerHTML = `R$ ${(
        pizzaSizePrice[modalSize] * modalQt
      )
        .toFixed(2)
        .replace(".", ",")}`;
      pizzaPrice = pizzaSizePrice[modalSize];
  }
});

// Array que junta todas as infos necessárias da pizza selecionada para manipular no carrinho de compras
let cart = [];

// Pega as informações da pizza adicionada ao carrinho
qs(".pizzaInfo--addButton").addEventListener("click", () => {
  //Qual o tamanho?
  let size = Number(qs(".pizzaInfo--size.selected").getAttribute("data-key"));

  // Identificador para ajudar na verificação se duas ou mais pizzas iguais (mesmo id) e do mesmo tamanho (mesmo size) foram adicionadas ao carrinho, para evitar que seja criado um novo ítem no vetor cart ao invés de somente aumentar a quantidade na pizza previamente adicionada.
  let identifier = pizzaJson[modalKey].id + "@" + size;

  // Percorre cada ítem do vetor cart e procura dentro da propriedade identifier de cada ítem o índice em que um identifier é ígual ao outro, retornando o índice da primeira ocorrência. Caso não ache nada, retorna -1.
  let checkIdentifierIndex = cart.findIndex(
    (item) => item.identifier == identifier
  );

  // Evita que o ítem com identifier repetido seja adicionado como um novo ítem no vetor, somente fazendo a atualização na quantidade dele caso seja encontrado. Caso não encontre nada, adiciona um novo ítem ao vetor.
  if (checkIdentifierIndex > -1) {
    // Essa checagem também ajuda na hora de adicionar a pizza visualmente ao carrinho, pois como só irá atualizar a qtd do ítem, não irá criar um novo objeto.
    cart[checkIdentifierIndex].qt += modalQt;
  } else {
    // Adiciona informações de id (para saber qual pizza foi adicionada, através da variável modal key), tamanho, quantidade (modalQt) e o identifier.
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      subPrice: pizzaPrice,
      qt: modalQt,
    });
  }

  // Atualiza o carrinho sempre que uma nova pizza é adicionada
  updateCart();

  // Fecha o Modal
  closeModal();
});

// Eventos de clique carrinho

// Abre o carrinho e atualiza as informações da pizza adicionada e dos preços
function updateCart() {
  // Mostra a quantidade de itens no carrinho no menu mobile
  qs(".menu-openner span").innerHTML = cart.length;

  // Fecha sempre o ícone de carrinho no desktop ao adicionar um novo ítem no carrinho
  qs(".menu--desktop-opener").style.display = "none";

  // Verifica se o carrinho está vazio ou se tem pelo menos um ítem no carrinho. Caso tenha algo, abre o menu. Caso não, fecha o menu
  if (cart.length > 0) {
    // Faz o cursor ao passar em cima do carrinho mobile ficar com o estilo pointer
    qs(".menu-openner").style.cursor = "pointer";

    // Faz o menu do carrinho aparecer na tela, adicionando na tag aside a classe .show pré-definida no CSS
    qs("aside").classList.add("show");

    // Mostra o botão de fechar o menu
    qs(".menu-closer").style.display = "block";

    // Evita que pizzas já adicionadas na tag que contém a classe .cart se repitam visualmente, limpando a mesma antes de preenche-la novamente na iteração logo abaixo.
    qs(".cart").innerHTML = "";

    // Variável que armazena o preço subtotal da (ou das) pizzas adicionadas ao carrinho
    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    // Adiciona visualmente as pizzas no carrinho, soma o subtotal, dá funcionalidade ao aumento e diminuição de quantidade no carrinho
    for (let i in cart) {
      // Verifica a pizza adicionada ao carrinho e atribui todas as informações dessa pizza (ou seja, o objeto) retirada do array pizzaJson na variável pizzaItem. Essa verificação é feita acessando a propriedade id do objeto contido no array pizzaJson, ou seja, se o objeto do array cart contiver o valor da propriedade id igual ao do objeto do array pizzaJson, o método find, que percorre os elementos do array pizzaJson, irá retornar esse objeto e armazenar na pizzaItem.
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);

      // Soma o subtotal das pizzas adicionadas ao carrinho de acordo com a quantidade.
      subtotal += cart[i].subPrice * cart[i].qt;

      // Clona a estrutura que contém a classe .cart--item para poder preenchê-la dinâmicamente.
      let pizzaCart = qs(".cart--item").cloneNode(true);

      // Adiciona a imagem da pizza
      pizzaCart.querySelector(".cart--item img").src = pizzaItem.img;

      // Adiciona o nome da pizza juntamente com seu tamanho ao carrinho
      switch (cart[i].size) {
        case 0:
          pizzaCart.querySelector(
            ".cart--item-nome"
          ).innerHTML = `${pizzaItem.name} (P)`;
          break;
        case 1:
          pizzaCart.querySelector(
            ".cart--item-nome"
          ).innerHTML = `${pizzaItem.name} (M)`;
          break;
        case 2:
          pizzaCart.querySelector(
            ".cart--item-nome"
          ).innerHTML = `${pizzaItem.name} (G)`;
      }

      // Adiciona a quantidade da pizza ao carrinho
      pizzaCart.querySelector(".cart--item--qt").innerHTML = cart[i].qt;

      // Diminui a quantidade de pizza no carrinho
      pizzaCart
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });

      // Aumenta a quantidade de pizza no carrinho
      pizzaCart
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qt++;
          updateCart();
        });

      // Adiciona a estrutura clonada em pizzaCart visualmente na tag contendo a classe .cart
      qs(".cart").append(pizzaCart);
    }

    // Mostra visualmente no carrinho o subtotal
    qs(".subtotal span:last-child").innerHTML = `R$ ${subtotal
      .toFixed(2)
      .replace(".", ",")}`;

    // Desconto de 10% sobre o subtotal
    desconto = subtotal * 0.1;
    qs(".desconto span:last-child").innerHTML = `R$ ${desconto
      .toFixed(2)
      .replace(".", ",")}`;

    //Total, subtraindo o desconto
    total = subtotal - desconto;
    qs(".total span:last-child").innerHTML = `R$ ${total
      .toFixed(2)
      .replace(".", ",")}`;
  } else {
    // Fecha o carrinho se a qtd de pizzas for igual a 0, tanto no desktop quanto no mobile
    qs("aside").classList.remove("show");
    qs("aside").style.left = "100vw";
  }
}

// Abre o menu mobile ao clicar no ícone do carrinho quando ele estiver com alguma pizza dentro
qs(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    qs("aside").style.left = "0";
  }
});

// Fecha o carrinho ao clicar no botão de fechar no menu mobile e no desktop. No caso do desktop, faz aparecer um ícone de carrinho flutuante.
qs(".menu-closer").addEventListener("click", () => {
  qs("aside").style.left = "100vw";

  // Verifica se a área da tela corresponde ao tamanho de um desktop para poder aplicar o ícone de carrinho flutuante na tela
  if (document.body.offsetWidth > "1000") {
    qs("aside").classList.remove("show");

    // Mostra o ícone de carrinho suavemente no desktop
    qs(".menu--desktop-opener").style.opacity = 0;
    qs(".menu--desktop-opener").style.display = "flex";
    setTimeout(() => {
      qs(".menu--desktop-opener").style.opacity = 1;
    }, 300);
    qs(".menu--desktop-opener span:first-child").innerHTML = cart.length;
  }
});

// Ao clicar no botão do carrinho que aparece ao fechar o carrinho com o mesmo contendo produtos dentro no menu desktop, abre o menu novamente.
qs(".menu--desktop-opener").addEventListener("click", () => {
  qs("aside").classList.add("show");
  qs(".menu--desktop-opener").style.display = "none";
});
