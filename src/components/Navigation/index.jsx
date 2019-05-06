import React, { useContext } from "react";
import { homePageLink, landingPageLink } from "./navlinks";
import { AppStateContext } from "../App";
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
  //const authUser = useContext(AppStateContext).AppState.userState;
  const navState = useContext(AppStateContext).AppState.navState;
  const dispatch = useContext(AppStateContext).dispatchActionFunctions;
  const classes = useStyles();
  //const tablet = useMediaQuery("(max-width: 950px)");
  const phone = useMediaQuery("(max-width: 600px)");
  const desktop = useMediaQuery("(min-width: 601px)");

  const titleLink = authUser ? homePageLink : landingPageLink;

  const toggleSideNav = () => {
    dispatch({ type: "SIDENAVTOGGLE" });
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
            <Button
              component={titleLink}
              //onClick={this.handleMenuClose}
              color="inherit"
            >
              <Typography variant="h6" color="inherit" className={classes.grow}>
                Website-Boilerplate
              </Typography>
            </Button>
          </div>
          {desktop && (
            <>
              {authUser ? (
                <NavigationAuth authUser={authUser} />
              ) : (
                <NavigationNoAuth />
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer open={navState.sideNav} onClose={toggleSideNav}>
        <div tabIndex={0} role="button">
          <SideNav />
        </div>
      </Drawer>
      <AdminToolsMenu />
    </div>
  );
};

export default Navigation;
