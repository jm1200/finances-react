import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import ExpensesList from "./ExpensesList";
import ExpensesImport from "./ExpensesImport";

const Expenses = props => {
  const authUser = props.location.state.authUser;
  return (
    <>
      <h3>Expenses</h3>
      <ul>
        <li>
          <Link
            to={{
              pathname: ROUTES.EXPENSES_LIST,
              state: { authUser: authUser }
            }}
          >
            Expenses List
          </Link>
        </li>
        <li>
          <Link
            to={{
              pathname: ROUTES.EXPENSES_IMPORT,
              state: { authUser: authUser }
            }}
          >
            Import Expenses
          </Link>
        </li>
      </ul>

      <Switch>
        <Route exact path={ROUTES.EXPENSES_LIST} component={ExpensesList} />
        <Route exact path={ROUTES.EXPENSES_IMPORT} component={ExpensesImport} />
      </Switch>
    </>
  );
};

export default Expenses;
