import React, { useReducer, useState, useEffect, useContext } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import { useAuthentication } from "../../custom-hooks";

//Components
import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForget from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
// import AdminPage from "../Admin";
import UsersPage from "../UsersPage";
import UserDetails from "../UsersPage/UserDetails";

//Router Components
import * as ROUTES from "../../constants/routes";
import { PublicRoute } from "../PublicRoute/PublicRoute";
import { PrivateRoute } from "../PrivateRoute/PrivateRoute";

//Reducers
import { navStateReducer, initialNavState } from "../Navigation/NavReducer";
import { FirebaseContext } from "../Firebase";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

export const AppStateContext = React.createContext(null);

const App = () => {
  const firebase = useContext(FirebaseContext);
  const [authUser, setAuthUser] = useState(null);
  useEffect(() => {
    firebase.onAuthUserListener(
      newUser => {
        setAuthUser(newUser);
      },
      () => {
        setAuthUser(null);
      }
    );
  }, []);
  // useEffect(() => {
  //   const listener = firebase.onAuthUserListener(
  //     newUser => {
  //       setAuthUser(newUser);
  //     },
  //     () => {
  //       setAuthUser(null);
  //     }
  //   );

  //   return () => {
  //     listener();
  //   };
  // }, []);
  const userState = authUser;
  console.log(userState);
  //const firebase = useContext(FirebaseContext);

  const [navState, dispatchNavAction] = useReducer(
    navStateReducer,
    initialNavState
  );

  //Global dispatch function
  const dispatchActionFunctions = action => {
    [dispatchNavAction].forEach(fn => fn(action));
  };
  const AppState = { navState };
  const appContext = { dispatchActionFunctions, AppState };
  console.log(appContext);

  return (
    <div>
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <AppStateContext.Provider value={appContext}>
            <CssBaseline />
            <BrowserRouter>
              <Navigation />

              <Route exact path={ROUTES.LANDING} component={LandingPage} />

              <PublicRoute
                component={SignUpPage}
                path={ROUTES.SIGN_UP}
                authUser={userState}
              />
              <PublicRoute
                component={SignInPage}
                path={ROUTES.SIGN_IN}
                authUser={userState}
              />

              <PublicRoute
                component={PasswordForget}
                path={ROUTES.PASSWORD_FORGET}
                authUser={userState}
              />

              <PrivateRoute
                component={HomePage}
                path={ROUTES.HOME}
                authUser={userState}
                roles={"USER"}
              />
              <PrivateRoute
                component={AccountPage}
                path={ROUTES.ACCOUNT}
                authUser={userState}
                roles={"USER"}
              />
              {/* <PrivateRoute
                component={AdminPage}
                path={ROUTES.ADMIN}
                authUser={userState}
                roles={"ADMIN"}
              /> */}
              <PrivateRoute
                component={UsersPage}
                path={ROUTES.USERS}
                authUser={userState}
                roles={"ADMIN"}
              />
              <PrivateRoute
                component={UserDetails}
                path={ROUTES.USER_DETAILS}
                authUser={userState}
                roles={"ADMIN"}
              />
            </BrowserRouter>
          </AppStateContext.Provider>
        </ThemeProvider>
      </React.Fragment>
    </div>
  );
};

export default App;
