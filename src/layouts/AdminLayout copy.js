import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import '../scss/style.scss';
//import componentLoader from "../admin/utils/index"

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
//const TheLayout2 = React.lazy(() => import('../containers/TheLayout'));

//const TheLayout = componentLoader(TheLayout2);


// const CustomComponent = React.lazy(
//   () =>
//     new Promise((resolve, reject) =>
//       setTimeout(() => resolve(import('../containers/TheLayout')), 100)
//     )
// );


// Pages
// const Login = React.lazy(() => import('../views/pages/login/Login'));
// const Register = React.lazy(() => import('../views/pages/register/Register'));
// const Page404 = React.lazy(() => import('../views/pages/page404/Page404'));
// const Page500 = React.lazy(() => import('../views/pages/page500/Page500'));

class AdminLayout extends Component {

  render() {
    return (
      <Router>
          <React.Suspense fallback={loading}>
            <Switch>
              {/* <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} /> */}
              <Route path="/" name="Home" render={props => <CustomComponent {...props}/>} />
            </Switch>
          </React.Suspense>
      </Router>
    );
  }
}

export default AdminLayout;