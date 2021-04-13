import React, { Component } from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fire from "../../firebase";
import "./profile.scss";
import Skeleton from "react-loading-skeleton";
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValidUser: true,
      isLoading: false,
      loggedIn: false,
      displayName: "",
      username: "",
      img: "",
      email: "",
    };
  }
  componentDidMount() {
    this.getUser();
  }

  getUser = async () => {
    this.setState(() => {
      return {
        isLoading: true,
      };
    });
    fire.auth().onAuthStateChanged((userAuth) => {
      if (userAuth != null) {
        this.setState({
          loggedIn: false,
        });
        this.getProfile(userAuth.uid);
      } else {
        this.getProfile();
      }
    });
  };

  getProfile = (id) => {
    if (this.props.match.params.user !== "") {
      const db = fire.firestore();
      var usersRef = db.collection("users");
      usersRef
        .where("username", "==", this.props.match.params.user)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            this.setState(() => {
              return {
                isLoading: false,
                isValidUser: false,
              };
            });
          } else {
             snapshot.forEach((doc) => {
            //   console.log(doc.id, "=>", doc.data());
            //   console.log("this.state.userId", "=>", id);
              if (id === doc.id) {
                this.setState(() => {
                  return {
                    loggedIn: true,
                  };
                });
              }
              // var displayName = "";
              // var username = "";
              // var img = "";
              // var email = "";
              // if (auth != null) {
              //   displayName = auth.displayName;
              //   username = auth.username;
              //   const words = displayName.split(" ");
              //   displayName =
              //     words[0].substring(0, 1).toUpperCase() +
              //     words[0].substring(1) +
              //     " " +
              //     words[1].substring(0, 1).toUpperCase() +
              //     words[1].substring(1);
              //   img = auth.photoUrl;
              //   email = auth.email;
              // } else {
              //   displayName = "";
              //   username = "";
              //   img = "";
              //   email = "";
              // }
              this.setState(() => {
                return {
                  displayName: doc.data().displayName,
                  username: doc.data().username,
                  img: doc.data().img ? doc.data().img : -1,
                  email: doc.data().email,
                  isLoading: false,
                };
              });
            });
          }
        });
    }
  };

  logout(event, updateUser) {
    // event.preventDefault();
    // console.log("logging out");
    // if (localStorage.getItem("token")) {
    //   localStorage.removeItem("token");
    // }
    // updateUser({
    //   loggedIn: false,
    //   username: null,
    //   profile_pics: null,
    // });
    // this.setState(() => {
    //   return { redirectTo: "/" };
    // });
  }

  render() {
    const {
      loggedIn,
      isLoading,
      img,
      isValidUser,
      username,
      email,
      displayName,
    } = this.state;

    return (
      <section id="profile">
        <Navbar history={this.props.history} />
        <React.Fragment>
          <div className="profile-wrapper"></div>
          <div className="profile-details">
            {isLoading && (
              <>
                <div className="profile-pic_skeleton">
                  <Skeleton circle={true} height={150} width={150} />
                </div>
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </>
            )}
            {!isLoading && isValidUser && (
              <>
                {img === -1 && <div className="profile-pic_2"></div>}
                {img !== -1 && (
                  <img src={img} className="profile-pic" alt="..." />
                )}
                <p>{username} </p>
                <p>{displayName} </p>
                <p>{email} </p>
              </>
            )}

            {!isLoading && loggedIn && (
              <React.Fragment>
                <div className="">
                  <Link
                    to={"/profile/edit/" + this.props.match.params.user}
                    className="edit-btn"
                  >
                    Edit
                    <span className="ml-2">
                      <FontAwesomeIcon icon="edit" />
                    </span>
                  </Link>
                </div>
                <button
                  className="btn profile-logout-btn"
                  onClick={(e) => {
                    this.logout();
                  }}
                >
                  Logout
                </button>
                {this.state.isLoading}
              </React.Fragment>
            )}
            {!isLoading && !isValidUser && (
              <>
                <p>User does not exist</p>
              </>
            )}
          </div>
        </React.Fragment>
        );
      </section>
    );
  }
}
