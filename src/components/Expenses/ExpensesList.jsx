import React, { useEffect, useContext, useState } from "react";
import { FirebaseContext } from "../Firebase";
import { AppStateContext } from "../App";

// import { makeStyles } from "@material-ui/styles";
import CustomMaterialTable from "./CustomMaterialTable";

const uuid = require("uuid/v4");

// const testData = {
//   "0078d3de-6688-45f8-b2b3-43b50183128a": {
//     categorized: false,
//     category: "",
//     subCategory: "",
//     date: "06/15/2018",
//     description: "PAYROLL DEPOSIT AIR CANADA",
//     withdrawl: "",
//     deposit: "863.88",
//     id: "0078d3de-6688-45f8-b2b3-43b50183128a"
//   },
//   "1078d3de-6688-45f8-b2b3-43b50183128a": {
//     categorized: false,
//     category: "",
//     subCategory: "",
//     date: "06/15/2017",
//     description: "PAYROLL DEPOSIT AIR CANADA",
//     withdrawl: "",
//     deposit: "200.88",
//     id: "1078d3de-6688-45f8-b2b3-43b50183128a"
//   },
//   "1375b4fc-297b-4898-bc4f-7bbea0e203d5": {
//     categorized: false,
//     category: "",
//     subCategory: "",
//     date: "06/18/2018",
//     description: "EFT CREDIT CLAIMSECURE INC",
//     withdrawl: "",
//     deposit: "182.00",
//     id: "1375b4fc-297b-4898-bc4f-7bbea0e203d5"
//   },
//   "240492e8-3619-4d9c-94a7-0432a2efd355": {
//     categorized: false,
//     category: "",
//     subCategory: "",
//     date: "06/13/2018",
//     description: "INTERAC E-TRANSFER SEND Jennifer Cross",
//     withdrawl: "85.00",
//     deposit: "",
//     id: "240492e8-3619-4d9c-94a7-0432a2efd355"
//   },
//   "694b1664-0356-4f2b-8f97-57215fca6fbe": {
//     categorized: false,
//     category: "",
//     subCategory: "",
//     date: "06/14/2018",
//     description: "ABM DEPOSIT",
//     withdrawl: "",
//     deposit: "1640.00",
//     id: "694b1664-0356-4f2b-8f97-57215fca6fbe"
//   }
// };

// const testCategories = {
//   income: ["John", "Meghan", "Rental"],
//   rental: ["hydro", "rental mortgage", "cable"],
//   utilities: ["hydro", "cable"]
// };

const ExpensesList = () => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AppStateContext).AppState.userState;
  const [categories, setCategories] = useState(null);
  const [transactions, setTransactions] = useState({});
  const [loading, setLoading] = useState(false);
  const docRef = firebase.db.collection("transactions").doc(authUser.uid);

  useEffect(() => {
    setLoading(true);

    //GET TRANSACTIONS, CATEGORIES

    docRef.get().then(doc => {
      if (doc.exists) {
        const data = doc.data();

        const fixDate = {};
        Object.keys(data.transactions).forEach(transKey => {
          let newObj = { ...data.transactions[transKey] };
          newObj.date = newObj.date.toDate();
          fixDate[transKey] = newObj;
        });
        setCategories(data.categories);
        setTransactions(fixDate);
      }
      setLoading(false);
    });
  }, []);

  const updateTransaction = newData => {
    let newTransactions = Object.assign(
      {},
      { ...transactions },
      { [newData.id]: newData }
    );
    saveTransactions(newTransactions);
  };

  const deleteTransaction = newData => {
    docRef.update({
      ["transactions." + newData.id]: firebase.firestore.FieldValue.delete()
    });
  };

  const addTransaction = newData => {
    let id = uuid();
    let newTransaction = Object.assign({}, { ...newData }, { id: id });
    let newTransactions = Object.assign(
      {},
      { ...transactions },
      { [id]: newTransaction }
    );
    saveTransactions(newTransactions);
  };

  const saveTransactions = data => {
    docRef.set({ transactions: data }, { merge: true });
  };

  const matchCategories = (event, rowData) => {
    let { description, category, subCategory } = rowData;
    let newTransactions = {};

    Object.keys(transactions).forEach(transKey => {
      if (transactions[transKey].description === description) {
        let newObj = Object.assign(
          {},
          { ...transactions[transKey] },
          { category, subCategory }
        );
        newTransactions[transKey] = newObj;
      } else {
        newTransactions[transKey] = transactions[transKey];
      }
    });
    const nt = deleteTableData(newTransactions);
    setTransactions(nt);
    saveTransactions(nt);
  };

  const unMatchCategories = (event, rowData) => {
    console.log("write code to un-match all categories", event, rowData);
  };

  return (
    <>
      <h3>Expenses List</h3>
      {loading ? (
        <p>Loading...</p>
      ) : Object.keys(transactions).length > 0 ? (
        <div style={{ maxWidth: "100%" }}>
          <CustomMaterialTable
            updateTransaction={updateTransaction}
            addTransaction={addTransaction}
            deleteTransaction={deleteTransaction}
            matchCategories={matchCategories}
            unMatchCategories={unMatchCategories}
            transactions={transactions}
            categories={categories}
          />
        </div>
      ) : (
        <p>
          You have no transactions to show. Go to Import Expenses to import your
          first transactions.
        </p>
      )}
    </>
  );
};

export default ExpensesList;

function deleteTableData(transObj) {
  let newObj = {};
  Object.keys(transObj).forEach(transKey => {
    let obj = { ...transObj[transKey] };
    if (transObj[transKey].tableData) {
      delete obj.tableData;
      newObj[transKey] = obj;
    } else {
      newObj[transKey] = obj;
    }
  });
  return newObj;
}
