import React, { useReducer } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import AuthContext from "../Session";
import { useAuthentication } from "../../custom-hooks";

//Components
import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForget from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";

//Router Components
import * as ROUTES from "../../constants/routes";
import { PublicRoute } from "../PublicRoute/PublicRoute";
import { PrivateRoute } from "../PrivateRoute/PrivateRoute";

//Reducers
import { navStateReducer, initialNavState } from "../Navigation/NavReducer";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

export const DispatchContext = React.createContext(null);

const App = () => {
  const authUser = useAuthentication();

  const [navState, dispatchNavAction] = useReducer(
    navStateReducer,
    initialNavState
  );

  //Global dispatch function
  const dispatch = action => {
    [dispatchNavAction].forEach(fn => fn(action));
  };
  const AppState = { navState };

  console.log("App: ", authUser);
  return (
    <div>
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <AuthContext.Provider value={authUser}>
            <DispatchContext.Provider value={{ dispatch, AppState }}>
              <CssBaseline />
              <BrowserRouter>
                <Navigation />

                <Route exact path={ROUTES.LANDING} component={LandingPage} />

                <PublicRoute
                  component={SignUpPage}
                  path={ROUTES.SIGN_UP}
                  authUser={authUser}
                />
                <PublicRoute
                  component={SignInPage}
                  path={ROUTES.SIGN_IN}
                  authUser={authUser}
                />

                <PublicRoute
                  component={PasswordForget}
                  path={ROUTES.PASSWORD_FORGET}
                  authUser={authUser}
                />

                <PrivateRoute
                  component={HomePage}
                  path={ROUTES.HOME}
                  authUser={authUser}
                  roles={"USER"}
                />
                <PrivateRoute
                  component={AccountPage}
                  path={ROUTES.ACCOUNT}
                  authUser={authUser}
                  roles={"USER"}
                />
                <PrivateRoute
                  component={AdminPage}
                  path={ROUTES.ADMIN}
                  authUser={authUser}
                  roles={"ADMIN"}
                />
              </BrowserRouter>
            </DispatchContext.Provider>
          </AuthContext.Provider>
        </ThemeProvider>
      </React.Fragment>
    </div>
  );
};

export default App;
