import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
//import axios from "axios";
import Navbar from "../../components/Navbar";
//import { AuthContext } from 'AuthContext';
//import Footer from "components/navbar/Footer";
//import { toast } from 'react-toastify';
import "./login.scss";
import fire from "../../firebase";

import firebase from '@firebase/app';
import '@firebase/firestore' 

const { stringify } = require("flatted");
const validateRegisterInput = require("../../validation/register");

// Get the FieldValue object

export default class Signup extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      password2: "",
      redirectTo: null,
      redirectOnLoggedIn: "/menu",
      error: "",
      usernameError: "",
      emailError: "",
      firstNameError: "",
      lastNameError: "",
      passwordError: "",
      password2Error: "",
      user: null,
      loggedIn: false,
      isGettingUser: false,
      isLoading: false,
    };
  }
  componentDidMount() {
    this.getUser();
  }

  getUser = async () => {
    this.setState(() => {
      return {
        isGettingUser: true,
      };
    });
    fire.auth().onAuthStateChanged((userAuth) => {
      if (userAuth != null) {
        this.setState({
          user: userAuth,
          loggedIn: true,
          redirectTo: "/",
          isGettingUser: false,
        });
      } else {
        this.setState({ user: null, loggedIn: false, isGettingUser: false });
      }
    });
  };

  // updateToast = () =>{
  // 	toast.error('An error just occured', {
  // 		position: "bottom-left",
  // 		autoClose: 5000,
  // 		hideProgressBar: false,
  // 		closeOnClick: true,
  // 		pauseOnHover: true,
  // 		draggable: true,
  // 		progress: undefined,
  // 		});
  // }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleEmailBlur = (event) => {
    this.setState({
      emailError: "",
    });
  };

  handleUsernameBlur = (event) => {
    this.setState({
      usernameError: "",
    });
  };

  handleFirstNameBlur = (event) => {
    this.setState({
      firstNameError: "",
    });
  };

  handleLastNameBlur = (event) => {
    this.setState({
      lastNameError: "",
    });
  };

  handlePasswordBlur = (event) => {
    this.setState({
      passwordError: "",
    });
  };

  handlePassword2Blur = (event) => {
    this.setState({
      password2Error: "",
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState(() => {
      return {
        error: "",
      };
    });
    //console.log('props:	' + JSON.stringify(this.props));
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      password2,
      //isLoading
    } = this.state;
    this.setState({ isLoading: true });
    const { errors, isValid } = validateRegisterInput(
      username,
      firstName,
      lastName,
      email,
      password,
      password2
    );
    if (!isValid) {
      console.log("errors: " + JSON.stringify(errors));
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
      if (errors.username) {
        this.setState({
          usernameError: errors.username,
        });
      }
      if (errors.email) {
        this.setState({
          emailError: errors.email,
        });
      }
      if (errors.password) {
        this.setState({
          passwordError: errors.password,
        });
      }
      if (errors.password2) {
        this.setState({
          password2Error: errors.password2,
        });
      }
      this.setState(() => {
        return {
          isLoading: false
        };
      });
    } else {
      const db = fire.firestore();
      var usersRef = db.collection("users");
      usersRef
        .where("username", "==", username)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            console.log("Username is available");
            usersRef
              .where("email", "==", email)
              .get()
              .then((snapshot) => {
                if (snapshot.empty) {
                  console.log("Email is available");
                  fire
                    .auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then((item) => {
                      //var user = fire.auth().currentUser
                      fire.auth().onAuthStateChanged((userAuth) => {
                        if (userAuth != null) {
                          console.log("user.uid:", stringify(userAuth));
                          console.log("id: " + userAuth.uid);
                          db.collection('users').doc(userAuth.uid).set({
                            username: username,
                            photoUrl: "",
                            email: email,
                            displayName: lastName + " " + firstName,
                            bio: "",
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            isLoading: false
                          });
                          console.log("New user created.");
                        }
                      });
                      //this.redirect();
                    })
                    .catch((error) => {
                      this.setState({ fireErrors: error.message, isLoading: false });
                    });
                } else {
                  console.log("Email already taken");
                  this.setState(() => {
                    return {
                      emailError: "Email already exist",
                      isLoading: false
                    };
                  });
                  //throw new Error("Email already taken");
                }
              });
          } else {
            console.log("Username already taken");
            this.setState(() => {
              return {
                usernameError: "Username already taken",
                isLoading: false
              };
            });
            //throw new Error("username already taken");
          }
        });
      // .then((createdUser) => {
      //   console.log(createdUser);
      //   console.log("Setting additional parameters")
      //   //Create the user doc in the users collection
      //   // db.collection("users")
      //   //   .doc(createdUser.user.uid)
      //   //   .set({ username: this.state.username });
      // })
      // .catch((err) => {
      //   console.log("Error: ", err);
      // });
    }
  };

  redirect =  () => {
    console.log("Redirect called");
    this.setState({
      redirectTo: "/",
      isSubmitting: false,
      isLoading: false
    });
  }

  render() {
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      Password2,
      usernameError,
      emailError,
      firstNameError,
      lastNameError,
      passwordError,
      password2Error,
      error,
      redirectTo,
      user,
      isLoading,
      isGettingUser
    } = this.state;
    if (redirectTo) {
      return <Redirect to={{ pathname: "/" }} />;
    } else if (isGettingUser === false && user === null) {
      return (
        <>
          <Navbar/>
          <section className="" id="signin">
            <div className="container">
              <div className="signin-wrapper">
                <div className="row d-flex justify-content-center">
                  <div className="text-center col-12 h3 font-family-roboto mt-4">
                    Sign Up
                  </div>
                  <div className="signin-inner">
                    <form>
                      <div className="form-group">
                        {error ? (
                          <p className="error text-center">{error}</p>
                        ) : null}
                        <label>Firstname</label>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="Firstname"
                          className="form-control"
                          value={firstName}
                          onChange={this.handleChange}
                          onBlur={this.handleFirstNameBlur}
                        />

                        {firstNameError ? (
                          <p className="error">{firstNameError}</p>
                        ) : null}
                      </div>
                      <div className="form-group">
                        <label>Lastname</label>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Lastname"
                          className="form-control"
                          value={lastName}
                          onChange={this.handleChange}
                          onBlur={this.handleLastNameBlur}
                        />
                        {lastNameError ? (
                          <p className="error">{lastNameError}</p>
                        ) : null}
                      </div>
                      <div className="form-group">
                        <label>Username</label>
                        <input
                          type="text"
                          name="username"
                          placeholder="Username"
                          className="form-control"
                          value={username}
                          onChange={this.handleChange}
                          onBlur={this.handleUsernameBlur}
                        />
                        {usernameError ? (
                          <p className="error">{usernameError}</p>
                        ) : null}
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          className="form-control"
                          value={email}
                          onChange={this.handleChange}
                          onBlur={this.handleEmailBlur}
                        />
                        {emailError ? (
                          <p className="error">{emailError}</p>
                        ) : null}
                      </div>
                      <div className="form-group">
                        <label>Password</label>
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          className="form-control"
                          value={password}
                          onChange={this.handleChange}
                          onBlur={this.handlePasswordBlur}
                        />
                        {passwordError ? (
                          <p className="error">{passwordError}</p>
                        ) : null}
                      </div>
                      <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                          type="password"
                          name="password2"
                          placeholder="Confirm Password"
                          className="form-control"
                          value={Password2}
                          onChange={this.handleChange}
                          onBlur={this.handlePassword2Blur}
                        />
                        {password2Error ? (
                          <p className="error">{password2Error}</p>
                        ) : null}
                      </div>
                      <div className="form-group">
                        <button
                        disabled={isLoading}
                          className="btn btn-primary btn-block text-center"
                          onClick={(event) => {
                            this.handleSubmit(event);
                          }}
                          type="submit"
                        >
                          Sign up
                        </button>
                      </div>
                    </form>
                    <div className="mt-3">
                      <p className="align-items-between">
                        Already registered?
                        <Link to="/login" className=" m-2 grey">
                          Login
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      );
    }
    return null;
  }
}
