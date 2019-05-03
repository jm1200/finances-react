import React from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

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
        <span>
          <Link to={{ pathname: ROUTES.USER_DETAILS, state: user }}>
            Details
          </Link>
        </span>
      </li>
    ))}
  </ul>
);

export default UserList;
