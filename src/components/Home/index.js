import React, { useContext } from "react";
import { AppStateContext } from "../App";

const Home = () => {
  const authUser = useContext(AppStateContext).AppState.userState;

  return (
    <div>
      <h1>Home</h1>
      <p>This page is availble to every signed in user</p>
      <p>{`Welcome ${authUser.firstName}`}</p>
    </div>
  );
};

export default Home;
