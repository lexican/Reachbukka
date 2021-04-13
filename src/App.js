import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { ToastContainer } from "react-toastify";
// import PrivateRoute from "./layouts/PrivateRoute";
//import AdminLayout from "./layouts/AdminLayout";
import General from "./layouts/General";
import "react-toastify/dist/ReactToastify.css";
import 'react-confirm-alert/src/react-confirm-alert.css';

import Loading from "./loading/loading"

import TheLayout from "./containers/TheLayout";

//import { fab } from "@fortawesome/free-brands-svg-icons";
import "./scss/style.scss";

import {
  //   faCheck,
  //   faHome,
  //   faAngleRight,
  //   faCartPlus,
  //   faSearch,
  //   faSignOutAlt,
  //   faTrash,
  //   faUser,
  //   faKey,
  //   faEdit,
  //   faTimes,
  //   faPen,
  //   faCheckCircle,
  //   faPhone,
  //   faTags,
  //   faTruck,
  //   faClock,
  //   faWallet,
  //   faLocationArrow,faAngleDown,faAngleUp,
  faPlus,
  faMinus,
  faTimes,
  faLocationArrow,
  faCheckCircle,
  faAngleDown,
  faAngleUp,
  faEdit,

  //faArrowLeft, faMapMarker
} from "@fortawesome/free-solid-svg-icons";

import {
  faFacebookF,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

import Page404 from "./views/pages/page404/Page404";
import Page500 from "./views/pages/page500/Page500";

import fire from "./firebase";
const db = fire.firestore();

library.add(
  faFacebookF,
  faTwitter,
  faInstagram,
  faPlus,
  faMinus,
  faTimes,
  faLocationArrow,
  faCheckCircle,
  faAngleDown,
  faAngleUp,
  faEdit
);

// const Loading = (
//   <div className="pt-3 text-center">
//     <div className="sk-spinner sk-spinner-pulse"></div>
//   </div>
// );

// Containers

// const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// // Pages
// const Login = React.lazy(() => import('./views/pages/login/Login'));
// const Register = React.lazy(() => import('./views/pages/register/Register'));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isAdmin: false,
    };
  }
  componentDidMount() {
    this.getUser();
  }
  getUser = async () => {
    this.setState({
      loading: true,
    });
    fire.auth().onAuthStateChanged((userAuth) => {
      //console.log("logged in user: " + JSON.stringify(userAuth));
      if (userAuth != null) {
        db.collection("users")
          .where("id", "==", userAuth.uid)
          .get()
          .then((snapshot) => {
            // if (snapshot.empty) {
            //   console.log('No matching documents.');
            //   return;
            // }
            snapshot.forEach((doc) => {
              console.log(doc.id, "=>", doc.data().role);
              if (doc.data().role == "Admin") {
                console.log("Admin agang");
                this.setState({
                  loading: false,
                  isAdmin: true,
                });
              }
            });
          })
          .catch((err) => {
            this.setState({
              loading: false,
              //admin: false,
            });
            console.error(err);
          });
      } else {
        this.setState({
          loading: false,
          //admin: false
        });
      }
    });
  };
  render() {
    const { loading, isAdmin } = this.state;
    return (
      <>
        <ToastContainer />

        <Router>
            <Route
              exact
              path="/404"
              name="Page 404"
              render={(props) => <Page404 {...props} />}
            />
            <Route
              exact
              path="/500"
              name="Page 500"
              render={(props) => <Page500 {...props} />}
            />
            <Route
              path="/admin"
              render={(props) => {
                if (!loading) {
                  if (isAdmin) {
                    return <TheLayout {...props} />;
                  } else {
                    return <div>Access Forbidden</div>;
                  }
                } else {
                  return <Loading/>;
                }
              }}
            />
            <Route path="/" render={(props) => <General {...props} />} />
        </Router>
      </>
    );
  }
}

export default App;

{
  /* <Redirect to="/404" /> */
}

{
  /* <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
<Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
<Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
<Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
<Route path="/" name="Home" render={props => <TheLayout {...props}/>} /> */
}
