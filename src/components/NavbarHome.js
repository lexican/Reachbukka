import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import SideNavBar from "./SideNavBar";
import "./index.scss";
import { ProductConsumer } from "../context";
import { AuthContext } from "../AuthContext";
import fire from "../firebase";
//const {parse, stringify} = require('flatted');
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//<FontAwesomeIcon icon="angle-down" />
const db = fire.firestore();
//var usersRef = db.collection("users");
export default class NavbarHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loggedIn: false,
      auth: null,
      isAdmin: false,
    };
  }
  handleScroll = () => {
    // find current scroll position
    const currentScrollPos = window.pageYOffset;
    const { prevScrollPos } = this.state;

    // set state based on location info (explained in more detail below)
    // this.setState({
    //   visible:
    //     (prevScrollPos > currentScrollPos &&
    //       prevScrollPos - currentScrollPos > 70) ||
    //     currentScrollPos < 10,
    // });

    this.setState({
      visible: window.scrollY > 100,
    });

    // set state to new scroll position
    this.setState({ prevScrollPos: currentScrollPos });
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.getUser();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
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
            if (doc.data().role == "Admin") {
              this.setState({
                isAdmin: true,
              });
            }
            console.log("Document data:", doc.data());
          }
        });
        this.setState({ user: userAuth, loggedIn: true });
      } else {
        this.setState({ user: null, loggedIn: false });
      }
    });
  };

  toggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
    console.log("is Open", this.state.isOpen);
  };

  logout = (event) => {
    fire.auth().signOut();
  };

  render() {
    const menuClass = `dropdown-menu${this.state.isOpen ? " show" : ""}`;
    const { loggedIn, auth, isAdmin } = this.state;
    var displayName = "";
    var username = "";
    if (auth != null) {
      displayName = auth.displayName;
      username = auth.username;
      const words = displayName.split(" ");
      displayName =
        words[0].substring(0, 1).toUpperCase() +
        words[0].substring(1) +
        " " +
        words[1].substring(0, 1).toUpperCase() +
        words[1].substring(1);
    } else {
      displayName = "";
      username = "";
    }

    var styleName = "navbar navbar-expand-md";
    if (this.state.visible) {
      styleName = "navbar navbar-expand-lg active";
    }

    return (
      <>
        <div className="homenavbar" id="navbarcontainer">
          <nav className={styleName}>
            <header>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Link to="/#" className="navbar-brand primary-color">
                    <div id="logo"></div>
                  </Link>
                </div>
              </div>
            </header>
            <SideNavBar />
            <div
              className="collapse navbar-collapse"
              id="navbarsExample01"
            >
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <NavLink to="/" className="nav-link">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/menu" className="nav-link">
                    Menu
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/contactus" className="nav-link">
                    Contact Us
                  </NavLink>
                </li>
                <li className="nav-item">
                  <div className="dropdown">
                    <span
                      id="dropdown"
                      type="button"
                      className="nav-link"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      onClick={(e) => {
                        this.toggleOpen(e);
                      }}
                    >
                      Account
                      <span className="pl-2"></span>
                    </span>
                    <div className={menuClass} aria-labelledby="dropdown">
                      {!loggedIn && (
                        <>
                          <NavLink
                            className="login text-center mb-2"
                            to="/login"
                          >
                            Login
                          </NavLink>
                          <NavLink className="signup text-center" to="/signup">
                            Sign Up
                          </NavLink>
                        </>
                      )}
                      {loggedIn && (
                        <li className="nav-user">{"Hi, " + displayName}</li>
                      )}
                      {loggedIn && (
                        <NavLink
                          to={"/profile/" + username}
                          className="dropdown-item"
                        >
                          <span className="">Profile</span>
                        </NavLink>
                      )}
                      {isAdmin && (
                        <NavLink
                          to="/admin/dashboard"
                          className="dropdown-item"
                        >
                          Dashboard
                        </NavLink>
                      )}
                      {loggedIn && (
                        <NavLink to="/orders" className="dropdown-item">
                          Orders
                        </NavLink>
                      )}
                      {/* 
                      {isVendor && (
                        <NavLink
                          to="/vendor/dashboard"
                          className="dropdown-item"
                        >
                          Vendor Db
                        </NavLink>
                      )} */}
                      {loggedIn && (
                        <>
                          <div class="dropdown-divider"></div>
                          <NavLink
                            className="login text-center"
                            to="/"
                            onClick={(e) => {
                              this.logout();
                            }}
                          >
                            Logout
                          </NavLink>
                        </>
                      )}
                    </div>
                  </div>
                </li>
                <li className="nav-item">
                  <ProductConsumer>
                    {(value) => {
                      return (
                        <NavLink to="/cart" className="nav-link">
                          <span className="mr-1">Cart</span>
                          <span className="badge">{value.cart.length}</span>
                        </NavLink>
                      );
                    }}
                  </ProductConsumer>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </>
    );
  }
}

NavbarHome.contextType = AuthContext;
