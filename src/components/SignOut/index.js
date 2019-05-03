import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import { FirebaseContext } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { __RouterContext } from "react-router-dom";
import { AppStateContext } from "../App";

const SignOut = ({ Component = Button }) => {
  const firebase = useContext(FirebaseContext);
  const router = useContext(__RouterContext);
  const navState = useContext(AppStateContext).AppState.navState;
  const dispatch = useContext(AppStateContext).dispatchActionFunctions;

  const signOut = () => {
    firebase.doSignOut().then(() => {
      router.history.push(ROUTES.LANDING);
      if (navState.sideNav) {
        dispatch({ type: "SIDENAVTOGGLE" });
      }
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
