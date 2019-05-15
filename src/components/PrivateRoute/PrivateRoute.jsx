import React from "react";
import { Route, Redirect } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

export const PrivateRoute = ({
  component: Component,
  roles,
  authUser,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (!authUser) {
          // not logged in so redirect to login page with the return url
          return (
            <Redirect
              // to={{ pathname: "/login", state: { from: props.location } }}
              to={ROUTES.SIGN_IN}
            />
          );
        }

        // check if route is restricted by role
        if (roles && authUser.roles.indexOf(roles) === -1) {
          // role not authorised so redirect to home page
          return <Redirect to={ROUTES.HOME} />;
        }

        // authorised so return component
        return <Component authUser={authUser} {...props} />;
      }}
    />
  );
};
