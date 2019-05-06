import { useState, useContext, useEffect } from "react";
import { FirebaseContext } from "../components/Firebase";

const useAuthentication = () => {
  const [authUser, setAuthUser] = useState(null);
  const firebase = useContext(FirebaseContext);
  const localStorageUser = JSON.parse(localStorage.getItem("authUser"));

  useEffect(() => {
    const listener = firebase.onAuthUserListener(
      newUser => {
        setAuthUser(newUser);
        localStorage.setItem("authUser", JSON.stringify(newUser));
      },
      () => {
        localStorage.removeItem("authUser");
        setAuthUser(null);
      }
    );

    return () => {
      listener();
    };
  }, []);

  return localStorageUser || authUser;
};

export default useAuthentication;
