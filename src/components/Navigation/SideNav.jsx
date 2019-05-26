import React from "react";
import { List, ListItem, Divider } from "@material-ui/core";
import { authLinks, noAuthLinks, adminToolsMenuOptions } from "./navlinks";
import SignOut from "../SignOut";

const SideNav = ({ authUser, navState, dispatch }) => {
  const toggleSideNav = () => {
    dispatch({ type: "SIDENAVTOGGLE" });
  };

  return (
    <div className="list">
      <List>
        {authUser ? (
          <SideNavAuth
            navState={navState}
            dispatch={dispatch}
            toggleSideNav={toggleSideNav}
          />
        ) : (
          <SideNavNoAuth toggleSideNav={toggleSideNav} />
        )}
        {authUser && authUser.roles.includes("ADMIN") ? (
          <SideNavAdmin toggleSideNav={toggleSideNav} />
        ) : null}
      </List>
    </div>
  );
};

export default SideNav;

const SideNavNoAuth = ({ toggleSideNav }) => {
  return (
    <>
      {noAuthLinks.map(obj => {
        return (
          <ListItem
            key={obj.label}
            component={obj.link}
            onClick={toggleSideNav}
          >
            {obj.label}
          </ListItem>
        );
      })}
    </>
  );
};
const SideNavAuth = ({ toggleSideNav, navState, dispatch }) => {
  return (
    <>
      {authLinks.map(obj => {
        return (
          <ListItem
            key={obj.label}
            component={obj.link}
            onClick={toggleSideNav}
          >
            {obj.label}
          </ListItem>
        );
      })}
      <Divider />
      <SignOut Component={ListItem} navState={navState} dispatch={dispatch} />
    </>
  );
};
const SideNavAdmin = ({ toggleSideNav }) => {
  return (
    <>
      <Divider />
      {adminToolsMenuOptions.map(obj => {
        return (
          <ListItem
            key={obj.label}
            component={obj.link}
            onClick={toggleSideNav}
          >
            {obj.label}
          </ListItem>
        );
      })}
    </>
  );
};
