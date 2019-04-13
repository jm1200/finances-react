import React, { useContext } from "react";
import { DispatchContext } from "../App";
import { Menu, MenuItem } from "@material-ui/core";
import { NavLink } from "react-router-dom";
const AdminToolsMenu = () => {
  const dispatch = useContext(DispatchContext).dispatch;
  const navState = useContext(DispatchContext).AppState.navState;

  const isAdminToolsMenuOpen = Boolean(navState.adminToolsAnchorEl);

  const handleMenuClose = () => {
    dispatch({ type: "ADMIN", payload: null });
  };

  return (
    <Menu
      anchorEl={navState.adminToolsAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isAdminToolsMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem component={addEditArticleLink} onClick={handleMenuClose}>
        Add Article
      </MenuItem>
      <MenuItem component={addThemeLink} onClick={handleMenuClose}>
        Add Theme
      </MenuItem>
      <MenuItem component={usersLink} onClick={handleMenuClose}>
        Users
      </MenuItem>
    </Menu>
  );
};

export default AdminToolsMenu;

const addEditArticleLink = props => {
  return <NavLink to="/AddEditArticle" {...props} />;
};
const addThemeLink = props => {
  return <NavLink to="/AddTheme" {...props} />;
};
const usersLink = props => {
  return <NavLink to="/Users" {...props} />;
};
