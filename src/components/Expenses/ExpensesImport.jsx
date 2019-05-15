import React, { useState, useContext, useEffect } from "react";
import { TextField, Button } from "@material-ui/core";
import MaterialTable from "material-table";
import { FirebaseContext } from "../Firebase";

const uuid = require("uuid/v4");

const ExpensesImport = props => {
  const authUser = props.location.state.authUser;
  const firebase = useContext(FirebaseContext);
  const transRef = firebase.userTransactions(authUser.uid);
  const [input, setInput] = useState("");
  const [transactions, setTransactions] = useState(null);

  const onInputChange = e => {
    setInput(e.target.value);
  };

  const onHandleSubmit = e => {
    e.preventDefault();
    const emptyArray = [];
    const newInput = input.split("\n");
    newInput.forEach(line => {
      let lineObj = {};

      let splitLine = line.split(",");

      lineObj["id"] = uuid();
      lineObj["date"] = splitLine[0];
      lineObj["description"] = splitLine[1];
      lineObj["deposit"] = splitLine[3];
      lineObj["withdrawl"] = splitLine[2];
      lineObj["category"] = "";
      lineObj["sub-category"] = "";
      lineObj["catagorized"] = false;

      emptyArray.push(lineObj);
    });

    setTransactions(emptyArray);
    setInput("");
  };

  const importTransactionsHelper = transactions => {
    let newDescriptions = transactions.map(
      transaction => transaction.description
    );

    transRef.onSnapshot(snapshot => {
      let data = snapshot.data();
      //no transactions in DB, make new collection. Else update
      if (!data) {
        transRef.set({
          transactions: transactions,
          transactionTypeList: newDescriptions
        });
      } else {
        transRef.update({
          transactions: firebase.firestore.FieldValue.arrayUnion.apply(
            null,
            transactions
          ),
          transactionTypeList: firebase.firestore.FieldValue.arrayUnion.apply(
            null,
            newDescriptions
          )
        });
      }
    });
  };

  useEffect(() => {
    if (transactions) {
      importTransactionsHelper(transactions);
    }
  }, [transactions]);

  return (
    <>
      <h3>Import Expenses</h3>
      <form onSubmit={onHandleSubmit}>
        <TextField
          onChange={onInputChange}
          id="input"
          fullWidth
          value={input}
          label="Expenses -- Copy and paste expenses here:"
          multiline
          rows="4"
          //className={classes.textField}
          margin="normal"
        />
        <Button
          //className={classes.submit}
          //disabled={isInvalid}
          color="primary"
          variant="contained"
          type="submit"
        >
          Submit
        </Button>
      </form>
      <hr />

      {/* TODO: Don't need search functionality or the Known column button. just leaving it so I remember how to do it later. */}
      {transactions && (
        <MaterialTable
          data={transactions}
          columns={[
            {
              title: "Date",
              field: "date",
              render: rowData => <p>{rowData.date}</p>
            },
            { title: "Description", field: "description" },
            { title: "Depost", field: "deposit", type: "numeric" },
            {
              title: "Withdrawl",
              field: "withdrawl",
              type: "numeric"
            },
            {
              title: "Known",
              field: "known",
              render: rowData => (
                <Button onClick={e => console.log("test", e.target, rowData)}>
                  Test
                </Button>
              )
            }
          ]}
          title="The following transactions have been added:"
          onRowClick={(event, rowData) => console.log(event, rowData)}
        />
      )}
    </>
  );
};

export default ExpensesImport;
