import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import { FirebaseContext } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { __RouterContext } from "react-router-dom";

const SignOut = ({ Component = Button, navState, dispatch }) => {
  const firebase = useContext(FirebaseContext);
  const router = useContext(__RouterContext);
  const signOut = () => {
    if (navState && navState.sideNav) {
      dispatch({ type: "SIDENAVTOGGLE" });
    }
    firebase.doSignOut().then(() => {
      router.history.push(ROUTES.LANDING);
    });
  };
  return (
    <>
      <Component color="inherit" onClick={signOut}>
        Sign Out
      </Component>
    </>
  );
};

export default SignOut;
