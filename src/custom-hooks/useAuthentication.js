import { useState, useContext, useEffect } from "react";
import { FirebaseContext } from "../components/Firebase";

const useAuthentication = (calledBy = "nothing") => {
  console.log("called by: ", calledBy);
  const [authUser, setAuthUser] = useState(null);
  const firebase = useContext(FirebaseContext);

  const user = {
    email: "jh_mcneill@yahoo.ca",
    emailVerified: false,
    firstName: "John",
    lastName: "McNeill",
    roles: ["ADMIN"],
    uid: "0a7CVdDY9NVGPuuo26ynAGf5TGJ2"
  };
  useEffect(() => {
    const listener = firebase.onAuthUserListener(
      newUser => {
        setAuthUser(newUser);
      },
      () => {
        setAuthUser(null);
      }
    );

    return () => {
      listener();
    };
  }, []);

  return authUser;
};

export default useAuthentication;

//const localStorageUser = JSON.parse(localStorage.getItem("authUser"));
// localStorage.setItem("authUser", JSON.stringify(authUser));
// localStorage.removeItem("authUser");
