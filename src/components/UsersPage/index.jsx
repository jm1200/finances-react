import React, { useState, useContext, useEffect } from "react";
import { FirebaseContext } from "../Firebase";
//import { Switch, Route, Link } from "react-router-dom";
//import * as ROUTES from "../../constants/routes";
import UserList from "./UserList";
//import UserDetails from "./UserDetails";

const UsersPage = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    setLoading(true);
    const listener = firebase.users().onSnapshot(snapshot => {
      let users = [];
      snapshot.forEach(doc => {
        users.push({ ...doc.data(), uid: doc.id });
      });
      setUsers(users);
      setLoading(false);
    });
    return () => listener();
  }, []);

  return (
    <div>
      <h1>User Page</h1>
      <p>This page is available to every signed in Admin only</p>

      {loading && <div>Loading ...</div>}

      {users && <UserList users={users} />}
    </div>
  );
};

export default UsersPage;
