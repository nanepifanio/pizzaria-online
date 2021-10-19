const qs = (elemento) => document.querySelector(elemento);
const qsa = (elemento) => document.querySelectorAll(elemento);

let modalQt = 1;
let modalKey = 0;
let pizzaSizePrice = [];
let pizzaPrice = 0;

pizzaJson.map((item, index) => {
  let pizzaItem = qs(".pizza-item").cloneNode(true);

  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;

  pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price
    .toFixed(2)
    .replace(".", ",")}`;

  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

  pizzaItem.querySelector(".pizza-item--img img").src = item.img;

  pizzaItem.setAttribute("data-key", index);

  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();

    let key = e.target.closest(".pizza-item").getAttribute("data-key");

    modalQt = 1;

    modalKey = key;

    qs(".pizzaBig img").src = pizzaJson[key].img;

    qs(".pizzaInfo h1").innerHTML = pizzaJson[key].name;

    qs(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;

    qs(".pizzaInfo--size.selected").classList.remove("selected");

    qsa(".pizzaInfo--size").forEach((element, elementIndex) => {
      if (elementIndex == 2) {
        element.classList.add("selected");
      }

      element.querySelector("span").innerHTML =
        pizzaJson[key].sizes[elementIndex];
    });

    qs(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price
      .toFixed(2)
      .replace(".", ",")}`;

    pizzaSizePrice = [
      pizzaJson[key].price * 0.5,
      pizzaJson[key].price * 0.75,
      pizzaJson[key].price,
    ];

    pizzaPrice = pizzaSizePrice[2];

    qs(".pizzaInfo--qt").innerHTML = modalQt;

    qs(".pizzaWindowArea").style.opacity = 0;
    qs(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      qs(".pizzaWindowArea").style.opacity = 1;
    }, 200);
  });

  qs(".pizza-area").append(pizzaItem);
});

qsa(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (element) => {
    element.addEventListener("click", closeModal);
  }
);

function closeModal() {
  qs(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    qs(".pizzaWindowArea").style.display = "none";
  }, 500);
}

let modalSize = 2;

qsa(".pizzaInfo--size").forEach((element) => {
  element.addEventListener("click", () => {
    qs(".pizzaInfo--size.selected").classList.remove("selected");

    element.classList.add("selected");

    let size = Number(element.getAttribute("data-key"));

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

qs(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    qs(".pizzaInfo--qt").innerHTML = modalQt;

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

qs(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  qs(".pizzaInfo--qt").innerHTML = modalQt;

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

const cart = [];

qs(".pizzaInfo--addButton").addEventListener("click", () => {
  const size = Number(qs(".pizzaInfo--size.selected").getAttribute("data-key"));

  const identifier = pizzaJson[modalKey].id + "@" + size;

  const checkIdentifierIndex = cart.findIndex(
    (item) => item.identifier == identifier
  );

  if (checkIdentifierIndex > -1) {
    cart[checkIdentifierIndex].qt += modalQt;
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      subPrice: pizzaPrice,
      qt: modalQt,
    });
  }

  updateCart();

  closeModal();
});

function updateCart() {
  qs(".menu-openner span").innerHTML = cart.length;

  qs(".menu--desktop-opener").style.display = "none";

  if (cart.length > 0) {
    qs(".menu-openner").style.cursor = "pointer";

    qs("aside").classList.add("show");

    qs(".menu-closer").style.display = "block";

    qs(".cart").innerHTML = "";

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for (let i in cart) {
      const pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);

      subtotal += cart[i].subPrice * cart[i].qt;

      const pizzaCart = qs(".cart--item").cloneNode(true);

      pizzaCart.querySelector(".cart--item img").src = pizzaItem.img;

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

      pizzaCart.querySelector(".cart--item--qt").innerHTML = cart[i].qt;

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

      pizzaCart
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qt++;
          updateCart();
        });

      qs(".cart").append(pizzaCart);
    }

    qs(".subtotal span:last-child").innerHTML = `R$ ${subtotal
      .toFixed(2)
      .replace(".", ",")}`;

    desconto = subtotal * 0.1;
    qs(".desconto span:last-child").innerHTML = `R$ ${desconto
      .toFixed(2)
      .replace(".", ",")}`;

    total = subtotal - desconto;
    qs(".total span:last-child").innerHTML = `R$ ${total
      .toFixed(2)
      .replace(".", ",")}`;
  } else {
    qs("aside").classList.remove("show");
    qs("aside").style.left = "100vw";
  }
}

qs(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    qs("aside").style.left = "0";
  }
});

qs(".menu-closer").addEventListener("click", () => {
  qs("aside").style.left = "100vw";

  if (document.body.offsetWidth > "1000") {
    qs("aside").classList.remove("show");

    qs(".menu--desktop-opener").style.opacity = 0;
    qs(".menu--desktop-opener").style.display = "flex";
    setTimeout(() => {
      qs(".menu--desktop-opener").style.opacity = 1;
    }, 300);
    qs(".menu--desktop-opener span:first-child").innerHTML = cart.length;
  }
});

qs(".menu--desktop-opener").addEventListener("click", () => {
  qs("aside").classList.add("show");
  qs(".menu--desktop-opener").style.display = "none";
});
