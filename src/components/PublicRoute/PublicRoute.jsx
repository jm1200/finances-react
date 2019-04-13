import React from "react";
import { Route, Redirect } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

export const PublicRoute = ({ component: Component, authUser, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (authUser) {
          // logged in so redirect to home page with the return url
          return (
            <Redirect
              // to={{ pathname: "/login", state: { from: props.location } }}
              to={ROUTES.HOME}
            />
          );
        }

        // not authorised so return component
        return <Component {...props} />;
      }}
    />
  );
};
