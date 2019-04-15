import React from "react";
import { NavLink } from "react-router-dom";
import * as ROUTES from "./routes";

export const signUpLink = props => {
  return <NavLink to="/SignUp" {...props} />;
};
export const signInLink = props => {
  return <NavLink to="/SignIn" {...props} />;
};
export const landingPageLink = props => {
  return <NavLink to={ROUTES.LANDING} {...props} />;
};
export const homePageLink = props => {
  return <NavLink to={ROUTES.HOME} {...props} />;
};
export const accountPageLink = props => {
  return <NavLink to={ROUTES.ACCOUNT} {...props} />;
};
export const link1 = props => {
  return <NavLink to={"/link1"} {...props} />;
};
export const link2 = props => {
  return <NavLink to="/Link2Component" {...props} />;
};
export const link3 = props => {
  return <NavLink to="/Link3Component" {...props} />;
};
export const usersPageLink = props => {
  return <NavLink to="/Users" {...props} />;
};

// export const browseArticlesLink = props => {
//   return <NavLink to="/BrowseArticles" {...props} />;
// };
// export const addEditArticleLink = props => {
//   return <NavLink to="/AddEditArticle" {...props} />;
// };
// export const themesLink = props => {
//   return <NavLink to="/Themes" {...props} />;
// };
// export const profileLink = props => {
//   return <NavLink to="/Profile" {...props} />;
// };
// export const usersLink = props => {
//   return <NavLink to="/Users" {...props} />;
// };
// export const addThemeLink = props => {
//   return <NavLink to="/AddTheme" {...props} />;
// };
