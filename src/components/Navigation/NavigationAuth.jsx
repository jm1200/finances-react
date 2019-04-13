import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";
import { NavLink } from "react-router-dom";
import SignOut from "../SignOut";
import { DispatchContext } from "../App";

const accountPageLink = props => {
  return <NavLink to={ROUTES.ACCOUNT} {...props} />;
};

const NavigationAuth = ({ authUser }) => {
  const dispatch = useContext(DispatchContext).dispatch;
  const navState = useContext(DispatchContext).AppState.navState;

  const openAdminTools = event => {
    //console.log("clicked, ", navState.adminToolsAnchorEl);
    const payload = navState.adminToolsAnchorEl ? null : event.currentTarget;
    dispatch({ type: "ADMIN", payload });
  };

  return (
    <>
      {authUser && authUser.roles.includes(ROLES.ADMIN) ? (
        <Button onClick={openAdminTools} color="inherit">
          Admin Tools
        </Button>
      ) : null}
      <Button
        component={accountPageLink}
        //onClick={this.handleMenuClose}
        color="inherit"
      >
        Account
      </Button>

      <SignOut />
    </>
  );
};

export default NavigationAuth;
