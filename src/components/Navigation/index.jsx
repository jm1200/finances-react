import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import AuthContext from "../Session";
import { makeStyles } from "@material-ui/styles";
import {
  Typography,
  Button,
  IconButton,
  Toolbar,
  AppBar
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import NavigationNoAuth from "./NavigationNoAuth";
import NavigationAuth from "./NavigationAuth";
import AdminToolsMenu from "./AdminToolsMenu";

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
    }
  };
});

const Navigation = () => {
  const authUser = useContext(AuthContext);
  const classes = useStyles();

  const titleLink = authUser ? homePageLink : landingPageLink;

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>

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

          {authUser ? (
            <NavigationAuth authUser={authUser} />
          ) : (
            <NavigationNoAuth />
          )}
        </Toolbar>
      </AppBar>
      <AdminToolsMenu />
    </div>
  );
};

// const signUpLink = props => {
//   return <NavLink to="/SignUp" {...props} />;
// };
// const browseArticlesLink = props => {
//   return <NavLink to="/BrowseArticles" {...props} />;
// };
// const addEditArticleLink = props => {
//   return <NavLink to="/AddEditArticle" {...props} />;
// };
// const themesLink = props => {
//   return <NavLink to="/Themes" {...props} />;
// };
// const profileLink = props => {
//   return <NavLink to="/Profile" {...props} />;
// };
// const usersLink = props => {
//   return <NavLink to="/Users" {...props} />;
// };
// const addThemeLink = props => {
//   return <NavLink to="/AddTheme" {...props} />;
// };
const landingPageLink = props => {
  return <NavLink to={ROUTES.LANDING} {...props} />;
};
const homePageLink = props => {
  return <NavLink to={ROUTES.HOME} {...props} />;
};

export default Navigation;
