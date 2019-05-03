import React, { useContext } from "react";
import { List, ListItem, Divider } from "@material-ui/core";
import { AppStateContext } from "../App";
import { authLinks, noAuthLinks, adminToolsMenuOptions } from "./navlinks";
import SignOut from "../SignOut";
// import {
//   link1,
//   signInLink,
//   accountPageLink,
//   usersPageLink
// } from "../../constants/navlinks";

const SideNav = () => {
  const dispatch = useContext(AppStateContext).dispatchActionFunctions;
  const authUser = useContext(AppStateContext).AppState.userState;

  const toggleSideNav = () => {
    dispatch({ type: "SIDENAVTOGGLE" });
  };

  return (
    <div className="list">
      <List>
        {authUser ? (
          <SideNavAuth toggleSideNav={toggleSideNav} />
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
      {/* <ListItem component={link1} onClick={toggleSideNav}>
        No Authentication Link 1
      </ListItem>

      <ListItem component={signInLink}>Sign In</ListItem> */}
    </>
  );
};
const SideNavAuth = ({ toggleSideNav }) => {
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
      <SignOut Component={ListItem} />

      {/* <ListItem component={link1} onClick={toggleSideNav}>
        With Authentication Link 1
      </ListItem>
      <ListItem component={accountPageLink}>Account</ListItem> */}
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

      {/* <ListItem component={link1} onClick={toggleSideNav}>
        No Authentication and Admin Role Link 1
      </ListItem>
      <ListItem component={usersPageLink}>Admin</ListItem> */}
    </>
  );
};
