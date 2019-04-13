import React from "react";
import { Button } from "@material-ui/core";
import * as ROUTES from "../../constants/routes";
import { NavLink } from "react-router-dom";

const signInLink = props => {
  return <NavLink to={ROUTES.SIGN_IN} {...props} />;
};

const NavigationNoAuth = () => (
  <>
    <Button
      component={signInLink}
      //onClick={this.handleMenuClose}
      color="inherit"
    >
      Sign In
    </Button>
  </>
);

export default NavigationNoAuth;
