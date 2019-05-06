import React, { useContext } from "react";
import { AppStateContext } from "../App";
import { Menu, MenuItem } from "@material-ui/core";
import { adminToolsMenuOptions } from "./navlinks";

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
      {adminToolsMenuOptions.map(obj => {
        return (
          <MenuItem
            key={obj.label}
            component={obj.link}
            onClick={handleMenuClose}
          >
            {obj.label}
          </MenuItem>
        );
      })}
    </Menu>
  );
};

export default AdminToolsMenu;
