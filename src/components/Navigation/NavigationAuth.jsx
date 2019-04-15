import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import * as ROLES from "../../constants/roles";
import { accountPageLink, link1 } from "../../constants/navlinks";
import SignOut from "../SignOut";
import { AppStateContext } from "../App";

const NavigationAuth = ({ authUser }) => {
  const dispatch = useContext(AppStateContext).dispatchActionFunctions;
  const navState = useContext(AppStateContext).AppState.navState;

  const openAdminTools = event => {
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
      <Button component={accountPageLink} color="inherit">
        Account
      </Button>
      <Button component={link1} color="inherit">
        With Auth Link 1
      </Button>

      <SignOut />
    </>
  );
};

export default NavigationAuth;
