// shoppings
const shopIcon = document.querySelector(".shop__icon");
const shopCount = document.querySelector(".shop__count");
const shopCashier = document.querySelector(".shop__cashier");
const addedProduct = document.querySelector(".added__products");
const removeAll = document.querySelector(".removeAll");
const totalPrice = document.querySelector(".total");

const productCart = document.querySelector(".products");
const cartDetail = document.querySelector("[data-cartDetail]");
const singleProducts = document.querySelector("[data-singleProduct]");
const shadow = document.querySelector(".shadow");
const close = document.querySelector(".close");

// store in the local storage
class Storage {
  static addStorage(product) {
    let setStorage = localStorage.setItem("product", JSON.stringify(product));
    return setStorage;
  }

  static getStorage() {
    let getItem = JSON.parse(localStorage.getItem("product")) || [];
    return getItem;
  }
}

// store all products;
let cart = Storage.getStorage();

// fetch the products
class fetchData {
  async getProducts() {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

// display the products
class UI {
  allCarts(products) {
    let cart = products.map((product) => {
      return `<div class="product">
          <div class="image">
            <img
              src=${product.img_url}
              alt="product"
            />
            <div class="buttons">
              <span class="addProduct"
              data-id=${product.id}
                ><i class="fa-solid fa-cart-plus"></i
              ></span>
              <span class="seeProduct"
              data-id=${product.id}
              ><i class="fa-solid fa-eye"></i></span>
            </div>
          </div>
          <div class="product__body">
            <h1>${product.title}</h1>
            <div class="stars">
              ${Array(product.review)
                .fill()
                .map(
                  (_, i) =>
                    `<span>
                    <i class="fa-solid fa-star"></i>
                  </span>`
                )
                .join("")}
            </div>
            <span class="price">${product.price}$</span>
            <p class="disc">
              ${product.description.substring(0, 44)}...
            </p>
          </div>
        </div>`;
    });

    productCart.innerHTML = cart.join("");
  }

  findButtons(products) {
    //disable button
    const addCart = [...document.querySelectorAll(".addProduct")];

    productCart.addEventListener("click", (e) => {
      // open single product
      if (e.target.classList.contains("seeProduct")) {
        const btnId = e.target.dataset.id;
        cartDetail.classList.add("active");
        shadow.classList.add("active");
        this.singleCart(products, btnId);
      }

      if (e.target.classList.contains("addProduct")) {
        window.scroll({
          top: 0,
          behavior: "smooth",
        });
        shopCashier.classList.toggle("active");
        const btnId = e.target.dataset.id;
        this.addProduct(products, btnId);
        this.updates();
        this.disableBtn(addCart);
        shadow.classList.add("active");
      }
    });

    //close single product
    close.addEventListener("click", () => {
      cartDetail.classList.remove("active");
      shadow.classList.remove("active");
    });

    //open shopping cart
    shopIcon.addEventListener("click", () => {
      shopCashier.classList.toggle("active");
      shadow.classList.toggle("active");
    });

    //   add new product to cart
    addedProduct.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete")) {
        const btnId = e.target.dataset.id;
        cart = cart.filter((item) => item.id !== +btnId);
        Storage.addStorage(cart);
        this.disableBtn(addCart);
        this.updates();

        if (cart.length === 0) {
          shopCashier.classList.remove("active");
        }
      }
    });

    //disable carts btn
    this.disableBtn(addCart);

    //remove all products
    removeAll.addEventListener("click", () => {
      cart = [];
      Storage.addStorage(cart);
      this.updates();
    });
  }

  updates() {
    this.displayShop();
    this.shopNumber();
    this.priceSum();

    if (cart.length > 1) {
      removeAll.style.display = "block";
    } else {
      removeAll.style.display = "none";
    }
  }

  // display single cart details
  singleCart(products, btnId) {
    const newProduct = products.find((product) => product.id === +btnId);
    const singleProduct = `
          <img
            src=${newProduct.img_url}
            alt="product"
          />
          <div class="details">
            <h1>${newProduct.title}</h1>
            <p style="padding: 0.5rem 0">Description :</p>
            <p>
              ${newProduct.description}
            </p>
            <div class="stars">
              ${Array(newProduct.review)
                .fill()
                .map(
                  (_, i) =>
                    `<span>
                    <i class="fa-solid fa-star"></i>
                  </span>`
                )
                .join("")}
            </div>
            <p>${newProduct.price}$</p>
          </div>
        </div>
        `;
    singleProducts.innerHTML = singleProduct;
  }

  // add products to cart

  addProduct(products, btnId) {
    let newProduct = products.find((product) => product.id === +btnId);
    cart = [...cart, newProduct];
    Storage.addStorage(cart);
    this.updates();
  }

  // display added cart
  displayShop() {
    let cartProduct = cart.map(
      (product) =>
        `
        <div class="product">
            <img
              src=${product.img_url}
              alt=""
            />
            <div class="texts">
              <h1>${product.title}</h1>
              <p>${product.description.substring(0, 15)}</p>
              <span class="price">${product.price}$</span>
              <div class="remove">
                <button data-id=${product.id} class="delete">Remove</button>
              </div>
            </div>
        </div>
        `
    );
    addedProduct.innerHTML = cartProduct.join("");
  }

  shopNumber() {
    shopCount.innerHTML = cart.length;
  }

  disableBtn(addCart) {
    addCart.forEach((btn) => {
      let cartExist = cart.find((item) => item.id === +btn.dataset.id);
      if (cartExist) {
        btn.classList.add("disable");
      } else {
        btn.classList.remove("disable");
      }
    });
  }

  // calculate the shop prices
  priceSum() {
    let newPrice = cart.reduce((acc, item) => acc + item.price, 0);
    totalPrice.innerText = newPrice.toFixed(2) + "$";
  }
}

// call them to be displayed in the browser
window.addEventListener("DOMContentLoaded", async () => {
  let products = new fetchData();
  let ui = new UI();
  ui.displayShop();
  ui.updates();

  products.getProducts().then((product) => {
    ui.allCarts(product);
    ui.findButtons(product);
  });
});
