import React, { useState, useContext, useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { AppStateContext } from "../App";

const Admin = () => (
  <>
    <h1>Admin</h1>
    <p>
      This is the admin page. It is only available to users with the ADMIN role.
    </p>
    <Switch>
      <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
      <Route exact path={ROUTES.ADMIN} component={UserList} />
    </Switch>
  </>
);

export default Admin;

const UserList = () => {
  let [loading, setLoading] = useState(false);
  let [users, setUsers] = useState([]);
  const firebase = useContext(AppStateContext).firebase;

  useEffect(() => {
    setLoading(true);
    const listener = firebase.users().onSnapshot(snapshot => {
      let users = [];
      snapshot.forEach(doc => users.push({ ...doc.data(), uid: doc.id }));
      setUsers(users);
      setLoading(false);
    });

    return () => listener();
  }, []);

  return (
    <div>
      <h2>Users</h2>
      {loading && <div>Loading ...</div>}
      <ul>
        {users.map(user => (
          <li key={user.uid}>
            <span>
              <strong>ID:</strong> {user.uid}
            </span>
            <span>
              <strong>E-Mail:</strong> {user.email}
            </span>
            <span>
              <strong>Name: </strong> {user.firstName + " " + user.lastName}
            </span>
            <span>
              <Link
                to={{
                  pathname: `${ROUTES.ADMIN}/${user.uid}`,
                  state: { user }
                }}
              >
                Details
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const UserItem = ({ match }) => {
  let [loading, setLoading] = useState(false);
  let [user, setUser] = useState({});
  const firebase = useContext(AppStateContext).firebase;

  useEffect(() => {
    setLoading(true);
    const listener = firebase.user(match.params.id).onSnapshot(snapshot => {
      console.log(snapshot.data());
      setUser(snapshot.data());
    });
    console.log(user);
    setLoading(false);

    return () => {
      listener();
    };
  }, []);

  return (
    <div>
      <Link to={ROUTES.ADMIN}>Return to user list</Link>
      <h2>User ({match.params.id})</h2>
      {loading && <div>Loading ...</div>}

      {user && (
        <div>
          <span>
            <strong>ID:</strong> {user.uid}
          </span>
          <span>
            <strong>E-Mail:</strong> {user.email}
          </span>
          <span>
            <strong>Name: </strong> {user.firstName + " " + user.lastName}
          </span>
        </div>
      )}
    </div>
  );
};
