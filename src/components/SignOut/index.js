import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import { FirebaseContext } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { __RouterContext } from "react-router-dom";

const SignOut = () => {
  const firebase = useContext(FirebaseContext);
  const router = useContext(__RouterContext);

  const signOut = () => {
    firebase.doSignOut().then(() => {
      router.history.push(ROUTES.LANDING);
    });
  };
  return (
    <>
      <Button color="inherit" onClick={signOut}>
        Sign Out
      </Button>
    </>
  );
};

export default SignOut;
