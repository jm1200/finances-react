import React, { useContext } from "react";
import AuthContext from "../Session";

const Home = () => {
  const authUser = useContext(AuthContext);

  return (
    <div>
      <h1>Home</h1>
      <p>This page is availble to every signed in user</p>
      <p>{`Welcome ${authUser.firstName}`}</p>
    </div>
  );
};

export default Home;
