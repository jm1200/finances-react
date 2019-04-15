import React, { useState, useContext, useEffect } from "react";
import { FirebaseContext } from "../Firebase";

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

const UserList = ({ users }) => (
  <ul>
    {users.map(user => (
      <li key={user.uid}>
        <span>
          <strong> ID: </strong> {user.uid}
        </span>
        <span>
          <strong> E-Mail: </strong> {user.email}
        </span>
        <span>
          <strong> First Name: </strong> {user.firstName}
        </span>
        <span>
          <strong> Last Name: </strong> {user.lastName}
        </span>
      </li>
    ))}
  </ul>
);
