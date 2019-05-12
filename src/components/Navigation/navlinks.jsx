import React from "react";
import { NavLink } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

//Helper function to create a NavLink component to insert in Button and MenuItem components
//so that the links work with Material-UI

function createLinkComponent(route) {
  return props => <NavLink to={route} {...props} />;
}

//Component links for navbar title

export const landingPageLink = createLinkComponent(ROUTES.LANDING);
export const homePageLink = createLinkComponent(ROUTES.HOME);

//Admin Tools Menu Options////////////////////////////////////////////////////////////////////////////////////

// const usersPageMenuItem = {
//   link: createLinkComponent(ROUTES.USERS),
//   label: "Users"
// };
const adminMenuItem1 = {
  link: createLinkComponent("/Link2Component"),
  label: "Admin Link 2"
};
const adminMenuItem2 = {
  link: createLinkComponent("/Link3Component"),
  label: "Admin Link 3"
};
const admin = {
  link: createLinkComponent("/admin"),
  label: "Admin Page"
};

export const adminToolsMenuOptions = [
  // usersPageMenuItem,
  admin,
  adminMenuItem1,
  adminMenuItem2
];

//Public (no Auth) navbar links////////////////////////////////////////////////////////////////////////////////////

const signIn = {
  link: createLinkComponent(ROUTES.SIGN_IN),
  label: "Sign In"
};

const publicLink1 = {
  link: createLinkComponent("/public1"),
  label: "Public Link 1"
};

export const noAuthLinks = [publicLink1, signIn];

//Signed-In User (Auth) navbar Links////////////////////////////////////////////////////////////////////////////////////

const account = {
  link: createLinkComponent(ROUTES.ACCOUNT),
  label: "Account"
};

const expenses = {
  link: createLinkComponent("/expenses"),
  label: "Expenses"
};

const authLink1 = {
  link: createLinkComponent("/auth1"),
  label: "Signed-In User Link 1"
};

export const authLinks = [authLink1, expenses, account];
