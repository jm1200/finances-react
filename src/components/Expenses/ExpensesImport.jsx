import React, { useState, useContext, useEffect } from "react";
import { TextField, Button } from "@material-ui/core";
import MaterialTable from "material-table";
import { FirebaseContext } from "../Firebase";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => {
  return {
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 300
    }
  };
});

const uuid = require("uuid/v4");

const defaultCategories = {
  income: ["Myself", "My Partner", "Rental"],
  rental: ["hydro", "rental mortgage", "cable"],
  utilities: ["hydro", "cable"]
};

const ExpensesImport = props => {
  const authUser = props.location.state.authUser;
  const firebase = useContext(FirebaseContext);
  const transRef = firebase.userTransactions(authUser.uid);
  const [input, setInput] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [transactions, setTransactions] = useState(null);
  const classes = useStyles();

  //INPUTS
  const onInputChange = e => {
    setInput(e.target.value);
  };
  const handleselectChange = event => {
    setSelectedAccount(event.target.value);
  };
  //SUBMIT
  //onHandleSubmit sets transactions. Whenever transactions changes useEffect updates Firestore.
  const onHandleSubmit = e => {
    e.preventDefault();
    const emptyArray = [];
    const newInput = input
      .trim()
      .split("\n")
      .slice(1);
    newInput.forEach(line => {
      let lineObj = {};
      lineObj["category"] = "";
      lineObj["subCategory"] = "";
      lineObj["catagorized"] = false;
      lineObj["matchCategory"] = false;
      lineObj["account"] = selectedAccount;
      lineObj["id"] = uuid();

      //check for comma's in descriptions
      const commaCheck = (splitLine, length) => {
        if (splitLine.length === length) {
          return splitLine;
        } else {
          let newSplitLine = [
            splitLine[0] + splitLine[1],
            ...splitLine.slice(2)
          ];
          return newSplitLine;
        }
      };

      let splitLine = line.split(",");
      if (selectedAccount === "Joint Chequing") {
        const newSplitLine = commaCheck(splitLine, 4);
        lineObj["date"] = new Date(newSplitLine[0]);
        lineObj["description"] = newSplitLine[1];
        lineObj["withdrawl"] = newSplitLine[2];
        lineObj["deposit"] = newSplitLine[3];
        lineObj["card"] = "Joint";
      } else if (selectedAccount === "Joint Mastercard") {
        const newSplitLine = commaCheck(splitLine, 5);
        lineObj["date"] = new Date(newSplitLine[2]);
        lineObj["description"] = newSplitLine[0];

        let amount = newSplitLine[4];
        if (amount < 0) {
          lineObj["deposit"] = amount * -1;
        } else {
          lineObj["withdrawl"] = amount;
        }
        let card = newSplitLine[1];
        if (card === "**** 6412") {
          lineObj["card"] = "John";
        } else if (card === "**** 1893") {
          lineObj["card"] = "Meghan";
        } else {
          lineObj["card"] = "Joint";
        }
      }

      emptyArray.push(lineObj);
    });
    //console.log(emptyArray);

    setTransactions(emptyArray);
    setInput("");
  };

  const importTransactionsHelper = transactions => {
    let transObj = {};
    transactions.forEach(trans => {
      transObj[trans.id] = trans;
    });
    transRef.onSnapshot(snapshot => {
      let data = snapshot.data();
      //no transactions in DB, make new collection. Else update
      if (!data) {
        transRef.set({
          transactions: transObj,
          categories: defaultCategories
        });
      } else {
        transRef.set(
          {
            transactions: transObj
          },
          { merge: true }
        );
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
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="account">Account Select</InputLabel>
          <Select
            value={selectedAccount}
            onChange={handleselectChange}
            inputProps={{
              name: "account",
              id: "account"
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"Joint Chequing"}>Joint Chequing</MenuItem>
            <MenuItem value={"Joint Mastercard"}>Joint Mastercard</MenuItem>
          </Select>
        </FormControl>
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
          disabled={selectedAccount === ""}
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
              render: rowData => {
                return <p>{rowData.date.toDateString()}</p>;
              }
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
