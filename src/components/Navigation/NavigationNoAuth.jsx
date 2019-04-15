import React from "react";
import { Button } from "@material-ui/core";
import { link1, signInLink } from "../../constants/navlinks";

const NavigationNoAuth = () => (
  <>
    <Button component={link1} color="inherit">
      No Auth Link 1
    </Button>
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
