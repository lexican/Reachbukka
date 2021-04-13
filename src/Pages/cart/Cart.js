import React, { Component } from "react";
import { ProductConsumer } from "../../context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Redirect, Link } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import CartItem from "./CartItem";
import { numberWithCommas } from "../../components/Utils/util";
import Cart_skeleton from "./CartItem/Cart_skeleton";

import './index.scss'

const REACT_APP_HOSTNAME = process.env.REACT_APP_HOSTNAME;

export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo: "",
      error: "",
      fillColor: "",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }
/* 
  handleModal = (e, openCheckout, loggedIn, cart, value) => {
    console.log("before", value);
    e.preventDefault();
    if (cart.length === 0) {
      this.setState(() => {
        return {
          error: "Cart is currently empty",
        };
      });
    } else if (!loggedIn) {
      this.setState(() => {
        return {
          redirectTo: "/login",
        };
      });
    } else {
      openCheckout();
    }
    console.log("after", value);
  }; */

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  render() {
    //const { loggedIn } = this.context;
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />;
    } else {
      return (
        <>
          <Navbar history={this.props.history} />
          <section id="cart">
            <div className="hh">
              <h1 className="_26fa9_oe_eV">Shopping Cart</h1>
            </div>
            <div className="my-3 row">
              <Link to="/menu">
                <button className="btn-outline">
                  <span>
                    <FontAwesomeIcon icon="arrow-left" className="mr-2" />
                  </span>
                  Continue Shopping
                </button>
              </Link>
            </div>
            <ProductConsumer>
              {(value) => {
                const { cart, cartTotal } = value;
                return (
                  <>
                    {cart.length > 0 && (
                      <div className="row">
                        <div className="px-0 col-xl-8">
                          <div class="shopping-cart">
                            <div className="_1di_ii d-flex" id="top">
                              <div className="v1">
                                <p className="m-0">Items</p>
                              </div>
                              <div className="v2 d-flex justify-content-between">
                                <p className="m-0">Quantity</p>
                                <p className="m-0">Price</p>
                              </div>
                              <div className="v3">
                                <p className="m-0">Actions</p>
                              </div>
                            </div>
                            <div className="_1di_iw1">
                              <div className="d-flex justify-content-end">
                                Total:
                                <span className="text-right pl-2">
                                  {"\u20A6" + numberWithCommas(cartTotal)}
                                </span>
                              </div>
                            </div>
                            {cart.map((item) => {
                              return <CartItem item={item} value={value} />;
                            })}
                          </div>
                        </div>
                        <div className="px-0 col-xl-4 _ni_2a">
                          <div className="cart-summary ml-xl-3">
                            <div className="title _1di_ii d-flex justify-content-between">
                              <h4 className="_aah_ui ">Order Summary</h4>
                              <h3 className="_aah_ui">1 Item</h3>
                            </div>
                            <div className="_1di_ii d-flex justify-content-between">
                              <span>Subtotal:</span>
                              <ProductConsumer>
                                {(value) => {
                                  const { cartTotal } = value;
                                  return (
                                    <span className="text-right">
                                      {"\u20A6" + numberWithCommas(cartTotal)}
                                    </span>
                                  );
                                }}
                              </ProductConsumer>
                            </div>
                            <div className="_1di_ii d-flex justify-content-between">
                              <span className="mr-4">Delivery Charge</span>
                              <span className="text-right">
                                Add your Delivery address at checkout to see
                                delivery charges
                              </span>
                            </div>
                            <div className="_1di_ii title d-flex justify-content-between">
                              <span>Total:</span>
                              <ProductConsumer>
                                {(value) => {
                                  const { cartTotal } = value;
                                  return (
                                    <span className="text-right">
                                      {"\u20A6" + numberWithCommas(cartTotal)}
                                    </span>
                                  );
                                }}
                              </ProductConsumer>
                            </div>
                            <div className="d-flex justify-content-end">
                              <span className="_1di_iii">
                                Excluding delivery charges
                              </span>
                            </div>
                            <div className="_ii_ii5s">
                              <Link to="/checkout">
                                <button className="btn text-center">
                                  Continue to Checkout
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {cart.length === 0 && (
                      <div className="row">
                        <div className="col-12 d-flex justify-content-center">
                          <div>
                            <img
                              src="https://firebasestorage.googleapis.com/v0/b/reachbukka.appspot.com/o/cart-empty.png?alt=media&token=53afb3d7-c60a-4054-bae8-8c0cb630dfa3"
                              alt="Empty Cart"
                            />
                          </div>
                        </div>
                        <div className="col-12 d-flex justify-content-center">
                          <p className="text-center">
                            Your Cart is Currently Empty!
                          </p>
                        </div>
                        <div className="col-12 d-flex justify-content-center">
                          <Link to="/menu">
                            <button className="btn banner-btn">
                              Continue Shopping
                            </button>
                          </Link>
                        </div>
                      </div>
                    )}
                    {cart.length > 0 && (
                      <div className="_ii_ii5s dl-none">
                        <Link to="/checkout">
                          <button className="btn text-center">
                            Continue to Checkout
                          </button>
                        </Link>
                      </div>
                    )}
                  </>
                );
              }}
            </ProductConsumer>
          </section>
          <Footer />
        </>
      );
    }
  }
}
Cart.contextType = AuthContext;
