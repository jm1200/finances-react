import React, { useContext } from "react";
import { AppStateContext } from "../App";
import { Menu, MenuItem } from "@material-ui/core";
import { usersPageLink, link2, link3 } from "../../constants/navlinks";
const AdminToolsMenu = () => {
  const dispatch = useContext(AppStateContext).dispatchActionFunctions;
  const navState = useContext(AppStateContext).AppState.navState;

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
      <MenuItem component={usersPageLink} onClick={handleMenuClose}>
        Users
      </MenuItem>
      <MenuItem component={link2} onClick={handleMenuClose}>
        Admin link 2
      </MenuItem>
      <MenuItem component={link3} onClick={handleMenuClose}>
        Admin link 3
      </MenuItem>
    </Menu>
  );
};

export default AdminToolsMenu;
