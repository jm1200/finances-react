import React, { useReducer } from "react";
import { homePageLink, landingPageLink } from "./navlinks";
import { makeStyles } from "@material-ui/styles";
import {
  Typography,
  Button,
  IconButton,
  Toolbar,
  AppBar,
  Drawer
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import NavigationNoAuth from "./NavigationNoAuth";
import NavigationAuth from "./NavigationAuth";
import AdminToolsMenu from "./AdminToolsMenu";
import SideNav from "./SideNav";

import { navStateReducer, initialNavState } from "./NavReducer";

const useStyles = makeStyles(theme => {
  return {
    root: {
      flexGrow: 1
    },
    grow: {
      flexGrow: 1
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20
    },
    list: {
      width: 250
    }
  };
});

const Navigation = ({ authUser }) => {
  const [navState, dispatchNavAction] = useReducer(
    navStateReducer,
    initialNavState
  );
  const classes = useStyles();
  //const tablet = useMediaQuery("(max-width: 950px)");
  const phone = useMediaQuery("(max-width: 600px)");
  const desktop = useMediaQuery("(min-width: 601px)");

  const titleLink = authUser ? homePageLink : landingPageLink;

  const toggleSideNav = () => {
    dispatchNavAction({ type: "SIDENAVTOGGLE" });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {phone && (
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={toggleSideNav}
            >
              <MenuIcon />
            </IconButton>
          )}

          <div className={classes.grow}>
            <Button component={titleLink} color="inherit">
              <Typography variant="h6" color="inherit" className={classes.grow}>
                Finances
              </Typography>
            </Button>
          </div>
          {desktop && (
            <>
              {authUser ? (
                <NavigationAuth
                  authUser={authUser}
                  navState={navState}
                  dispatch={dispatchNavAction}
                />
              ) : (
                <NavigationNoAuth
                  navState={navState}
                  dispatch={dispatchNavAction}
                />
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer open={navState.sideNav} onClose={toggleSideNav}>
        <div tabIndex={0} role="button">
          <SideNav
            authUser={authUser}
            navState={navState}
            dispatch={dispatchNavAction}
          />
        </div>
      </Drawer>
      <AdminToolsMenu navState={navState} dispatch={dispatchNavAction} />
    </div>
  );
};

export default Navigation;
