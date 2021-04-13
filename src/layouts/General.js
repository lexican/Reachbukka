import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../Pages/Home";
import Login from '../Pages/user/login'
import SignUn from '../Pages/user/signup'
import product_details_page from '../components/Products/ProductDetails.js'
import menu from '../Pages/Menu/menu'
import cart from '../Pages/cart/Cart'
import Checkout from '../Pages/cart/checkout'
import Orders from '../Pages/orders/index'
import ContactUs from '../Pages/ContactUs'
import Profile from '../Pages/user/profile'
import EditProfile from '../Pages/user/editprofile'
import ForgetPassword from "../Pages/user/ForgetPassword"

export default class General extends Component {

  render() {
    return (
      <div className="main___content">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUn} />
          <Route path="/product-details/:id/:name" component={product_details_page} />
          <Route path="/menu" component={menu} />
          <Route path="/cart" component={cart} />
          <Route exact path="/checkout" component={Checkout} />
          <Route exact path="/orders" component={Orders} />
          <Route exact path="/contactus" component={ContactUs} />

          <Route exact path="/profile/edit/:user" component={EditProfile} />

          <Route exact path="/profile/:user" component={Profile} />
          
          <Route exact path="/forgetpassword" component={ForgetPassword} />
        </Switch>
      </div>
    );
  }
}
