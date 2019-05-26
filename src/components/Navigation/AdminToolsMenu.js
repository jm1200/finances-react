import React from "react";
import { Menu, MenuItem } from "@material-ui/core";
import { adminToolsMenuOptions } from "./navlinks";

const AdminToolsMenu = ({ navState, dispatch }) => {
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
