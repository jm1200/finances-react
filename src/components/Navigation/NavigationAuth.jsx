import React from "react";
import { Button } from "@material-ui/core";
import * as ROLES from "../../constants/roles";
import SignOut from "../SignOut";
import { authLinks } from "./navlinks";

const NavigationAuth = ({ authUser, navState, dispatch }) => {
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
      {authUser &&
        authLinks.map(obj => {
          return (
            <Button key={obj.label} color="inherit" component={obj.link}>
              {obj.label}
            </Button>
          );
        })}

      <SignOut navState={navState} dispatch={dispatch} />
    </>
  );
};

export default NavigationAuth;
