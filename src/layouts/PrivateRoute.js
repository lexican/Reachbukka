import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
const PrivateRoute = ({
  component: Component,
  isLoading,
  isAdmin,
  ...otherProps
}) => {
  //const { isLoading, isAdmin } = otherProps;

  return (
    <Route
      {...otherProps}
      render={(props) => {
        if (isAdmin) {
          return <Component {...props} />;
        }
        return (
          <Redirect
            to={otherProps.redirectTo ? otherProps.redirectTo : "/404"}
          />
        );
      }}
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default PrivateRoute;
{/* <Redirect
to={otherProps.redirectTo ? otherProps.redirectTo : "/404"}
/> */}