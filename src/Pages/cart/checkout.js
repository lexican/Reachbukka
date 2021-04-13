import React, { Component } from "react";
import { ProductConsumer } from "../../context";
import { Link, Redirect } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import CartItem from "./CartItem";
import { numberWithCommas } from "../../components/Utils/util";
import Select from "react-select";
import checkoutValidate from "../../validation/checkoutValidate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import fire from "../../firebase";

import { toast } from "react-toastify";

import { PaystackConsumer } from "react-paystack";

import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { stringify } from "flatted";

const REACT_APP_PAYSTACKPUBLICKEY = process.env.REACT_APP_PAYSTACKPUBLICKEY;
const REACT_APP_EMAIL = process.env.REACT_APP_EMAIL;
const REACT_APP_HOSTNAME = process.env.REACT_APP_HOSTNAME;

const db = fire.firestore();
export default class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      redirectTo: "",
      error: "",
      selectedAddress: null,
      isValid: false,
      firstName: "",
      lastName: "",
      mobileNumber: "",
      firstNameError: "",
      lastNameError: "",
      mobileNumberError: "",
      addressError: "",
      deliveryCharges: 0,
      options: [],
      modal: false,
    };
  }

  setModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  loadLocations = () => {
    db.collection("locations")
      .orderBy("name", "desc")
      .get()
      .then((data) => {
        let newOptions = [];
        data.forEach((doc) => {
          newOptions.push({
            id: doc.id,
            name: doc.data().name,
            amount: doc.data().amount,
          });
        });
        console.log("products: " + stringify(newOptions));
        this.setState({
          options: newOptions,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadLocations();
    this.getUser();
  }

  getUser = async () => {
    fire.auth().onAuthStateChanged((userAuth) => {
      //console.log("logged in user: " + JSON.stringify(userAuth));
      if (userAuth != null) {
        this.setState({ user: userAuth, loggedIn: true });
      } else {
        this.setState({ user: null, loggedIn: false, redirectTo: '/login' });
      }
    });
  };

  handleChange = (selectedAddress) => {
    this.setState({
      selectedAddress: selectedAddress,
      deliveryCharges: Number(selectedAddress.amount),
    });
    //console.log(`Option selected:`, selectedAddress);
  };

  handleFirstNameBlur = (event) => {
    this.setState({
      firstNameError: "",
      error: "",
    });
  };

  handleLastNameBlur = (event) => {
    this.setState({
      lastNameError: "",
      error: "",
    });
  };

  handleMobileNumberBlur = (event) => {
    this.setState({
      mobileNumberError: "",
      error: "",
    });
  };

  handleAddressBlur = (event) => {
    this.setState({
      addressError: "",
      error: "",
    });
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  handleSubmit(e) {
    //console.log("submit");
    //const { updateMessage, updateUser } = this.context;
    e.preventDefault();
    //updateMessage("");
    const { firstName, lastName, mobileNumber, selectedAddress } = this.state;
    const { errors, isValid } = checkoutValidate(
      firstName,
      lastName,
      mobileNumber,
      selectedAddress
    );
    //console.log("errors", errors);
    if (!isValid) {
      toast.error("Please fill out the Delivery Address details properly", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      this.setState({
        isValid: false,
      });
      if (errors.firstName) {
        this.setState({
          firstNameError: errors.firstName,
        });
      }
      if (errors.lastName) {
        this.setState({
          lastNameError: errors.lastName,
        });
      }
      if (errors.mobileNumber) {
        this.setState({
          mobileNumberError: errors.mobileNumber,
        });
      }
      if (errors.address) {
        this.setState({
          addressError: errors.address,
        });
      }
    } else {
      this.setState({
        isValid: true,
        modal: !this.state.modal,
      });
    }
  }

  handleSuccessTransaction = async (
    e,
    cart,
    cartTotal,
    clearCart,
    type,
    total,
    deliveryAddress,
    firstName,
    lastName,
    mobileNumber,
    paid,
    ref_no
  ) => {
    const docRef = db.collection("orders");

    //db.collection("cities").doc(category[0].id)

    await docRef.add({
      status: "Pending",
      total: total,
      phoneNumber: mobileNumber,
      mode: type,
      paid: paid,
      address: {'name': deliveryAddress.name, 'amount': deliveryAddress.amount},
      fullname: lastName + " " + firstName,
      date: new Date(),
      ref_no: ref_no,
      cart: [...cart],
      userId: db.collection("users").doc(this.state.user.uid),
    });
    toast.success("Your Order has been successfully placed.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    console.log("success transaction");
    clearCart()
  };

  handleFailedTransaction = () => {
    console.log("Faliled transaction");
  };

  render() {
    //const { loggedIn } = this.context;

    const {
      selectedAddress,
      isValid,
      firstName,
      firstNameError,
      lastName,
      lastNameError,
      mobileNumber,
      mobileNumberError,
      addressError,
      deliveryCharges,
      options,
      modal,
      redirectTo
    } = this.state;

    if (redirectTo) {
      return <Redirect to={{ pathname: redirectTo }} />;
    } 
      return (
        <>
          <Navbar history={this.props.history} />
          <ProductConsumer>
            {(value) => {
              const { cartTotal, cart, clearCart } = value;
              var total = value.cartTotal + deliveryCharges;
              var referenceNo = new Date().getTime(); //new Date().getTime();
              const config = {
                reference: referenceNo,
                email: REACT_APP_EMAIL,
                amount: total * 100,
                publicKey: REACT_APP_PAYSTACKPUBLICKEY,
              };

              const componentProps = {
                ...config,
                text: "Paystack Button Implementation",
                onSuccess: (e) =>
                  this.handleSuccessTransaction(
                    e,
                    cart,
                    cartTotal,
                    clearCart,
                    "",
                    total,
                    selectedAddress,
                    firstName,
                    lastName,
                    mobileNumber,
                    true,
                    referenceNo
                  ),
                onClose: (e) => this.handleFailedTransaction(e),
              };

              return (
                <React.Fragment>
                  <section id="cart">
                    <div className="checkout-top">
                      <h1 className="_26fa9_oe_eV">Checkout</h1>
                    </div>
                    <div className="my-3"></div>
                    <div className="row pb-3">
                      <div className="px-0 col-xl-8">
                        {cart.length > 0 && (
                          <div className="mb-3">
                            <div className="shopping-cart">
                              <div className="delivery-hd d-flex justify-content-between">
                                <div className="delivery-hd-1">
                                  Delivery Address
                                </div>
                                <div className="d-flex align-items-center">
                                  {selectedAddress ? (
                                    <span className="c3_c3 mt-1">
                                      {selectedAddress.name}
                                    </span>
                                  ) : (
                                    <span className="c2_c2 mt-1">
                                      Please choose a delivery location.
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    class="btn ch_11"
                                    onClick={() => this.setModal(!modal)}
                                  >
                                    <FontAwesomeIcon
                                      icon="location-arrow"
                                      className="mr-1"
                                    />
                                    (change)
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {cart.length > 0 && (
                          <>
                            <div class="shopping-cart mb-xl-3">
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
                                  <div>
                                    SubTotal:
                                    <span className="text-right pl-2 mr-4">
                                      {"\u20A6" + numberWithCommas(cartTotal)}
                                    </span>
                                  </div>
                                  Total + Delivery:
                                  <span className="text-right pl-2">
                                    {"\u20A6" + numberWithCommas(total)}
                                  </span>
                                </div>
                              </div>
                              {cart.map((item) => {
                                return (
                                  <CartItem
                                    item={item}
                                    value={value}
                                    key={item.id}
                                  />
                                );
                              })}
                            </div>
                          </>
                        )}
                        {!cart.length && <cart_skeleton />}
                      </div>
                      {cart.length > 0 && (
                        <div className="px-0 col-xl-4 pl-xl-3 pl-lg-0 pl-md-0 pl-sm-0 pl-xs-0 _ni_2a">
                          <div className="cart-summary">
                            <div className="title _1di_ii d-flex justify-content-between">
                              <h4 className="_aah_ui ">Order Summary</h4>
                              <h3 className="_aah_ui">1 Item</h3>
                            </div>
                            <div className="_1di_ii d-flex justify-content-between">
                              <span>Subtotal:</span>
                              <span className="text-right">
                                {"\u20A6" + numberWithCommas(cartTotal)}
                              </span>
                            </div>

                            <div className="_1di_ii d-flex justify-content-between">
                              <span className="mr-4">Delivery Charges</span>
                              {selectedAddress ? (
                                <span>
                                  {" "}
                                  {"\u20A6" +
                                    numberWithCommas(selectedAddress.amount)}
                                </span>
                              ) : (
                                <span className="text-right">
                                  Add your Delivery address
                                </span>
                              )}
                            </div>
                            <div className="_1di_ii title d-flex justify-content-between">
                              <span>Total:</span>
                              <span className="text-right">
                                {"\u20A6" + numberWithCommas(total)}
                              </span>
                            </div>
                            <div className="d-flex justify-content-end">
                              <span className="_1di_iii">
                                Including delivery charges
                              </span>
                            </div>
                            <div className="lg-btn-wrapper d-flex">
                              <PaystackConsumer {...componentProps}>
                                {({ initializePayment }) => (
                                  <button
                                    className="btn pay-now-lg mr-2"
                                    disabled={!isValid}
                                    onClick={(e) => {
                                      console.log(
                                        "REACT_APP_EMAIL",
                                        REACT_APP_EMAIL
                                      );
                                      console.log(
                                        "REACT_APP_PAYSTACKPUBLICKEY",
                                        REACT_APP_PAYSTACKPUBLICKEY
                                      );
                                      console.log("config", config);
                                      initializePayment();
                                    }}
                                  >
                                    Pay Now
                                  </button>
                                )}
                              </PaystackConsumer>
                              <button
                                className="btn book-now-lg ml-2"
                                disabled={!isValid}
                                onClick={(e) => {
                                  //(e, cart, cartTotal, clearCart, type, total, deliveryAddress, firstName, lastName, mobileNumber, paid, ref_no
                                  this.handleSuccessTransaction(
                                    e,
                                    cart,
                                    cartTotal,
                                    clearCart,
                                    "Pay On Delivery",
                                    total,
                                    selectedAddress,
                                    firstName,
                                    lastName,
                                    mobileNumber,
                                    false,
                                    new Date().getTime()
                                  );
                                }}
                              >
                                Book Now
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

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
                      <div className="sm-btn-wrapper d-flex">
                        <PaystackConsumer {...componentProps}>
                          {({ initializePayment }) => (
                            <button
                              className="btn pay-now-lg mr-2"
                              disabled={!isValid}
                              onClick={(e) => {
                                console.log("REACT_APP_EMAIL", REACT_APP_EMAIL);
                                console.log(
                                  "REACT_APP_PAYSTACKPUBLICKEY",
                                  REACT_APP_PAYSTACKPUBLICKEY
                                );
                                console.log("config", config);
                                initializePayment();
                              }}
                            >
                              Pay Now
                            </button>
                          )}
                        </PaystackConsumer>
                        <button
                          className="btn book-now-lg ml-2"
                          disabled={!isValid}
                          onClick={(e) => {
                            this.handleSuccessTransaction(
                              e,
                              cart,
                              cartTotal,
                              clearCart,
                              "COD",
                              total,
                              selectedAddress,
                              firstName,
                              lastName,
                              mobileNumber
                            );
                          }}
                        >
                          Book Now
                        </button>
                      </div>
                    )}
                  </section>
                </React.Fragment>
              );
            }}
          </ProductConsumer>
          <Footer />

          <CModal show={modal} onClose={() => this.setModal()}>
            <CModalHeader closeButton>
              <CModalTitle>Delivery Address</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div>
                <div class="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="First Name"
                    name="firstName"
                    onChange={(e) => this.handleInputChange(e)}
                    onBlur={(e) => this.handleFirstNameBlur(e)}
                    value={firstName}
                  />
                  {firstNameError ? (
                    <div className="">
                      <span className="error">{firstNameError}</span>
                    </div>
                  ) : null}
                </div>
                <div class="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Last Name"
                    name="lastName"
                    onChange={(e) => this.handleInputChange(e)}
                    onBlur={(e) => this.handleLastNameBlur(e)}
                    value={lastName}
                  />
                  {lastNameError ? (
                    <div className="">
                      <span className="error">{lastNameError}</span>
                    </div>
                  ) : null}
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">Mobile Number</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Mobile Number"
                    name="mobileNumber"
                    onChange={(e) => this.handleInputChange(e)}
                    onBlur={(e) => this.handleMobileNumberBlur(e)}
                    value={mobileNumber}
                  />
                  {mobileNumberError ? (
                    <div className="">
                      <span className="error">{mobileNumberError}</span>
                    </div>
                  ) : null}
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">Delivery Address</label>
                  <Select
                    value={selectedAddress}
                    onChange={(e) => this.handleChange(e)}
                    options={options}
                    onBlur={(e) => this.handleAddressBlur(e)}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                  />
                  {addressError ? (
                    <div className="">
                      <span className="error">{addressError}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => this.setModal()}>
                Cancel
              </CButton>
              <form>
                <button
                  type="button"
                  class="btn btn-primary"
                  onClick={(e) => this.handleSubmit(e)}
                  data-dismiss="modal"
                >
                  Save Address
                </button>
              </form>
            </CModalFooter>
          </CModal>
        </>
      );
    
  }
}
Checkout.contextType = AuthContext;
