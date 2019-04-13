import { useState, useContext, useEffect } from "react";
import { FirebaseContext } from "../components/Firebase";

const useAuthentication = () => {
  const [authUser, setAuthUser] = useState(null);
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    const listener = firebase.onAuthUserListener(
      authUser => {
        setAuthUser(authUser);
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
