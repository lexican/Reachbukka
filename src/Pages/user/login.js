import React, { Component} from "react";
import { Redirect, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import './login.scss'
import fire from '../../firebase'
//import Footer from "../../components/Footer/Footer";
const validateRegisterInput = require("../../validation/login");

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: "",
      emailError: "",
      passwordError: "",
      redirectTo: null,
      isSubmitting: false
    };
  }
  
  onChangeEmail = e => {
    this.setState({
      email: e.target.value
    });
  };

  onChangePassword = e => {
    this.setState({
      password: e.target.value
    });
  };

  handleEmailBlur = event => {
    this.setState({
      emailError: "",
      error: ""
    });
  };
  
  handlePasswordBlur = event => {
    this.setState({
      passwordError: "",
      error: ""
    });
  };

  onSubmit(e) {
    //const { updateMessage, updateUser } = this.context;
    this.setState({
      isSubmitting: true
    })
    e.preventDefault();
    //updateMessage("");
    const { email, password } = this.state;
    const { errors, isValid } = validateRegisterInput(email, password);
    if (!isValid) {
      if (errors.email) {
        this.setState({
          emailError: errors.email,
          isSubmitting: false
        });
      }
      if (errors.password) {
        this.setState({
          passwordError: errors.password,
          isSubmitting: false
        });
      }
    } else {
      fire.auth().signInWithEmailAndPassword(email, password).then(user=> {
        //console.log("New user : " + JSON.stringify(user));
        this.redirect();
      })
      .catch((error) => {
        console.log("error: " + error.message);
          this.setState({error: "Invalid Username or Password", isSubmitting: false})
      });
    }
  }

  redirect =  () => {
    console.log("Redirect called");
    this.setState({
      redirectTo: "/",
      isSubmitting: false,
      isLoading: false
    });
  }

  componentDidMount(){
    this.getUser();
}



getUser = async () => {
  this.setState(() => {
    return {
      isLoading: true,
    };
  });
    fire.auth().onAuthStateChanged(userAuth => {
        if(userAuth != null){
            this.setState({ user: userAuth, loggedIn: true, redirectTo: '/', isLoading: false});
        }else{
            this.setState({ user: null, loggedIn: false, isLoading: false});
        }
      });
  }

  render() {
    const {redirectTo, isSubmitting, isLoading, user} = this.state;
    if (redirectTo) {
      return <Redirect to={ redirectTo } />;
    } else if(isLoading == false && user === null) {
      const { error, emailError, passwordError } = this.state;
      return (
        <React.Fragment>
          <Navbar/>
          <section className="" id="signin">
            <div className="container">
              <div className="signin-wrapper">
                <div className="row d-flex justify-content-center">
                  <div className="text-center col-12 h3 font-family-roboto mt-4">Login</div>
                <div className="signin-inner">
                  <form onSubmit={e => {
                          this.onSubmit(e);
                        }}>
                    <div className="form-group">
                      {error ? (
                            <p className="error">{error}</p>
                            ) : null}	
                      <label>Email</label>
                      <input type="email" className="form-control" value={this.state.email}
                            onChange={this.onChangeEmail}
                            onBlur={this.handleEmailBlur}
                            placeholder="Enter email"/>
                      {emailError ? (
                        <div className="">
                          <span className="error">{emailError}</span>
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <label >Password</label>
                      <input type="password" className="form-control" 
                        value={this.state.password}
                        onChange={this.onChangePassword}
                        onBlur={this.handlePasswordBlur}
                        placeholder="Password"/>
                      {passwordError ? (
                        <div className="">
                          <span className="error">{passwordError}</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="d-flex justify-content-end my-1">
{/*                         <div className="">
                          <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                            <label className="form-check-label">Remember me</label>
                          </div>
                        </div> */}
                        <div className="">
                          <Link to="/forgetpassword" className="grey mr-4">
                              Forget password?
                          </Link>
                        </div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-block text-center">Login</button>
                  </form>
                  <div className="mt-3">
                    <p className="form-group align-items-between">Not registered?<Link to="/signup" className="m-2 grey">Sign Up</Link></p>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </section>
        </React.Fragment>
      );
    }

    return null
  }
}


// {message && (
//   <div className="d-flex justify-content-center d-block">
//     <div className="alert alert-success ">{message}</div>
//   </div>
// )}