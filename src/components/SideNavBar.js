import React, { Component } from "react";
import { slide as SideNavMenu } from "react-burger-menu";
import { Link } from "react-router-dom";
//import { AuthContext } from "AuthContext";
import "./index2.scss";
import { ProductConsumer } from "../context";

import fire from "../firebase";
const db = fire.firestore();

export default class SideNavBar extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      loggedIn: false,
      isAdmin: false,
      isVendor: false,
      auth: null,
    };
  }
  componentDidMount() {
    this.getUser();
  }

  getUser = () => {
    fire.auth().onAuthStateChanged((userAuth) => {
      if (userAuth != null) {
        const usersRef = db.collection("users").doc(userAuth.uid);
        usersRef.get().then((doc) => {
          if (!doc.exists) {
            console.log("No such document!");
          } else {
            this.setState({
              auth: doc.data(),
            });
            console.log("Document data:", doc.data());
            if (doc.data().role == "Admin") {
              this.setState({
                isAdmin: true,
              });
            }
          }
        });
        this.setState({ user: userAuth, loggedIn: true });
      } else {
        this.setState({ user: null, loggedIn: false });
      }
    });
  };

  logout = (event) => {
    fire.auth().signOut();
  };

  render() {
    const { loggedIn, isAdmin, isVendor, auth } = this.state;
    var username = "";
    if (auth != null) {
      username = auth.username;
    } else {
      username = "";
    }
    return (
      <SideNavMenu left width={"280px"}>
        <div className="side-navbar-brand">
          <Link to="/" className="primary-color">
            <div id="logo"></div>
          </Link>
        </div>
        <div className="side-navbar-body">
          <Link to="/" className="sidenav-items">
            Home
          </Link>
          <Link to="/menu" className="sidenav-items">
            Menu
          </Link>

          <ProductConsumer>
            {(value) => {
              return (
                <Link to="/cart" className="sidenav-items">
                  <span className="mr-1">Cart</span>
                  <span className="badge">{value.cart.length}</span>
                </Link>
              );
            }}
          </ProductConsumer>
          {loggedIn && (
            <Link to={"/profile/" + username} className="sidenav-items">
              <span className="">Profile</span>
            </Link>
          )}
          {loggedIn && (
            <Link to="/orders" className="sidenav-items">
              Orders
            </Link>
          )}

          {loggedIn && isVendor && (
            <Link to="/vendor/dashboard" className="sidenav-items">
              VendorDB
            </Link>
          )}

          {loggedIn && isAdmin && (
            <Link to="/admin/dashboard" className="sidenav-items">
              Dashboard
            </Link>
          )}
          {!loggedIn && (
            <>
              <Link className="sidenav-items" to="/login">
                Login
              </Link>
              <Link className="sidenav-items" to="/signup">
                Sign Up
              </Link>
            </>
          )}
          <Link to="/contactus" className="sidenav-items">
            Contact Us
          </Link>
          {loggedIn && (
            <>
              <div class="sidenav-items"></div>
              <Link
                className="login text-center"
                to="/"
                onClick={(e) => {
                  this.logout();
                }}
              >
                Logout
              </Link>
            </>
          )}
        </div>
      </SideNavMenu>
    );
  }
}
//SideNavBar.contextType = AuthContext;
