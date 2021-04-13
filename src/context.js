import React, { Component } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import fire from "./firebase";
const db = fire.firestore();
const { parse, stringify } = require("flatted");

const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    products: null,
    filteredProducts: null,
    categories: [],
    detailProduct: {},
    cart: [],
    modalOpen: false,
    modalProduct: [],
    cartSubTotal: 0,
    cartTotal: 0,
    showCartBody: false,
    cartOpen: false,
    checkoutOpen: false,
    error: "",

    message: "",

    isAdmin: false,
    isVendor: false,
    username: "",
    loggedIn: false,
    isLoading: true,
  };
  componentDidMount() {
    this.setProducts();
    this.setCart();
    this.getCategoies();
    //this.clearCart()
    //this.getUser();
  }

  getUser = async () => {
    if (localStorage.getItem("token")) {
      let token = localStorage.getItem("token");
      axios
        .get("/api/user/", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          // Success 🎉
          //console.log("SUCCESS", response.data);
          this.setState(() => {
            return {
              loggedIn: true,
              isAdmin: response.data.user.isAdmin,
              isVendor: response.data.user.isVendor,
              username: response.data.user.username,
              profile_pics: response.data.user.img,
              isLoading: false,
            };
          });
        })

        .catch((error) => {
          if (error.response) {
            this.setState(() => {
              return {
                loggedIn: false,
                username: "",
                isAdmin: false,
                isVendor: false,
              };
            });
          } else if (error.request) {
            this.setState(() => {
              return {
                error: "An error just ocured.",
              };
            });
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    } else {
      this.setState(() => {
        return {
          loggedIn: false,
          username: "",
          isAdmin: false,
          isVendor: false,
        };
      });
    }
  };

  getCategoies = () => {
    const db = fire.firestore();
    db.collection("category")
      .orderBy("name", "desc")
      .get()
      .then((data) => {
        let categories = [];
        data.forEach((doc) => {
          categories.push({
            id: doc.id,
            name: doc.data().name,
          });
        });
        //console.log("products: " + products);
        this.setState({
          categories: [...categories],
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  setProducts = () => {
    db.collection("products")
      //.orderBy('createdAt', 'desc')
      .get()
      .then((data) => {
        let products = [];
        data.forEach((doc) => {
          products.push({
            id: doc.id,
            available: doc.data().available,
            categoryId: doc.data().categoryId,
            price: parseInt(doc.data().price),
            product_image: doc.data().product_image,
            title: doc.data().title,
          });
        });
        this.setState(() => {
          return {
            products: [...products],
            filteredProducts: [...products],
          };
        });
      })
      .catch((err) => {
        return {
          products: [],
          filteredProducts: [],
        };
        console.error(err);
      });
  };

  setCart = () => {
    if (localStorage.getItem("cartitems")) {
      const cartitems = localStorage.getItem("cartitems");
      this.setState(
        () => {
          return {
            cart: parse(cartitems),
          };
        },
        () => {
          this.addTotals();
        }
      );
    }
  };
  getItem = (id) => {
    const product = this.state.products.find((item) => item._id === id);
    return product;
  };

  // getCategoryName = (name) => {
  //   const category = this.state.categories.filter(
  //     (category) => category.name === name
  //   );
  //   //console.log("category" + JSON.stringify(category));
  //   return category[0].id;
  //   //return db.collection("category").doc(category[0].id);
  // };

  addToCart = (product) => {
    const newItem = {
      //product_id: product.id,
      available: product.available,
      categoryId: product.categoryId,
      price: product.price,
      product_image: product.product_image,
      title: product.title,
      cart_id: uuidv4(),
      count: 1,
      total: product.price,
    };

    //console.log("Product: " + stringify(product))

    // console.log("New cart item: " + stringify(newItem))

    const temp = [...this.state.cart];

    this.setState(
      () => {
        return {
          cart: [...temp, newItem],
        };
      },
      () => {
        this.addTotals();
        this.updateLocalStorageCart();
      }
    );
  };

  openModal = async (id) => {
    const product = this.getItem(id);
    await this.setState(() => {
      return { modalProduct: product, modalOpen: !this.state.modalOpen };
    });
  };
  closeModal = async () => {
    await this.setState(() => {
      return { modalProduct: [], modalOpen: !this.state.modalOpen };
    });
  };
  showCartModalBody = () => {
    this.setState(() => {
      return { showCartBody: !this.state.showCartBody };
    });
  };
  openCart = () => {
    this.setState(() => {
      return { cartOpen: !this.state.cartOpen };
    });
  };
  openCheckout = () => {
    this.setState(() => {
      return { checkoutOpen: !this.state.checkoutOpen };
    });
  };
  increment = (id) => {
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find((item) => item.cart_id === id);
    const index = tempCart.indexOf(selectedProduct);
    let product = tempCart[index];
    product.count = product.count + 1;
    product.total = product.count * product.price;
    this.setState(
      () => {
        return {
          cart: [...tempCart],
        };
      },
      () => {
        this.addTotals();
        this.updateLocalStorageCart();
      }
    );
  };

  decrement = (id) => {
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find((item) => item.cart_id === id);
    const index = tempCart.indexOf(selectedProduct);
    let product = tempCart[index];
    product.count = product.count - 1;

    if (product.count === 0) {
      this.removeItem(id);
      console.log("product count: " + product.count);
    } else {
      product.total = product.count * product.price;
      this.setState(
        () => {
          return {
            cart: [...tempCart],
          };
        },
        () => {
          this.addTotals();
          this.updateLocalStorageCart();
        }
      );
    }
  };

  removeItem = (id) => {
    console.log("id: " + id);
    let tempCart = [...this.state.cart];
    tempCart = tempCart.filter((item) => item.cart_id !== id);
    this.setState(
      () => {
        return {
          cart: [...tempCart],
        };
      },
      () => {
        this.addTotals();
        this.updateLocalStorageCart();
      }
    );
  };

  clearCart = () => {
    this.setState(
      () => {
        return { cart: [] };
      },
      () => {
        this.clearLocalStorageCart();
        this.addTotals();
      }
    );
  };
  addTotals = () => {
    let total = 0;
    this.state.cart.map((item) => (total += item.total));
    this.setState(() => {
      return {
        cartTotal: total,
      };
    });
  };

  updateLocalStorageCart = () => {
    localStorage.setItem("cartitems", stringify(this.state.cart));
  };
  f;

  clearLocalStorageCart = () => {
    localStorage.setItem("cartitems", "");
  };

  filterItems = (category = "All") => {
    var id = category;
    console.log("id: " + id);
    if (category === "All") {
      db.collection("products")
        .get()
        .then((data) => {
          let tempProducts = [];
          data.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
            tempProducts.push({
              id: doc.id,
              available: doc.data().available,
              categoryId: doc.data().categoryId,
              price: parseInt(doc.data().price),
              product_image: doc.data().product_image,
              title: doc.data().title,
            });
          });
          console.log("tempProducts size: " + tempProducts.length);
          this.setState(() => {
            return {
              filteredProducts: [...tempProducts],
            };
          });
        })
        .catch((err) => {
          console.error(err);
        });
      //tempProducts = [...this.state.products];
    } else {
      // console.log("this.getname(category)", this.getCategoryName(category));
      //.where("username", "==", username)
      db.collection("products")
        .where(
          "categoryId",
          "==",
          db.collection("category").doc(category)
        )
        .get()
        .then((data) => {
          let tempProducts = [];
          data.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
            tempProducts.push({
              id: doc.id,
              available: doc.data().available,
              categoryId: doc.data().categoryId,
              price: parseInt(doc.data().price),
              product_image: doc.data().product_image,
              title: doc.data().title,
            });
          });
          console.log("tempProducts size: " + tempProducts.length);
          this.setState(() => {
            return {
              filteredProducts: [...tempProducts],
            };
          });
        })
        .catch((err) => {
          console.error(err);
        });

      // console.log(stringify(tempProducts));
      // console.log("tempProducts[0].categoryId" + stringify(tempProducts[0].categoryId))

      // for(var i = 0; i < tempProducts.length; i++){
      //   console.log("In here" + tempProducts[i].categoryId.id)
      // tempProducts[i].categoryId.get().then(item => {
      //   console.log("Category: " + stringify(item));
      // })
      //   if(tempProducts[i].categoryId === this.getCategoryName(category)){
      //     console.log("True");
      //   }else{
      //     console.log("False");
      //   }
      // }

      // tempProducts = tempProducts.filter(
      //   (item) => item.categoryId === this.getCategoryName(category)
      // );

      // console.log("Category", category);
      // console.log(tempProducts);
      // console.log(this.getCategoryName(category));

      // if (!tempProducts) {
      //   this.setState(() => {
      //     return { filteredProducts: [] };
      //   });
      //   //console.log("No item fr this product")
      // } else {
      //   this.setState(() => {
      //     return { filteredProducts: tempProducts };
      //   });
      // }

      //console.log('filteredProducts', this.state.filteredProducts);
    }

    // if (!tempProducts) {
    //   this.setState(() => {
    //     return { filteredProducts: [] };
    //   });
    //   //console.log("No item fr this product");
    // } else {
    //   this.setState(() => {
    //     return { filteredProducts: tempProducts };
    //   });
    // }

    // console.log("filteredProducts", this.state.filteredProducts);
  };

  updateMessage = (message) => {
    this.setState(() => {
      return { message: message };
    });
  };

  updateUser = (data) => {
    this.setState(() => {
      return {
        loggedIn: data.loggedIn,
        username: data.username,
        isAdmin: data.isAdmin,
      };
    });
  };
  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart,
          filterItems: this.filterItems,
          showCartModaBody: this.showCartModalBody,
          updateMessage: this.updateMessage,
          updateUser: this.updateUser,
          openCart: this.openCart,
          openCheckout: this.openCheckout,
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}
const ProductConsumer = ProductContext.Consumer;
export { ProductProvider, ProductConsumer, ProductContext };
