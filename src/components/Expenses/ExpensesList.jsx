import React, { useEffect, useContext, useState } from "react";
import { FirebaseContext } from "../Firebase";
import { AppStateContext } from "../App";

// import { makeStyles } from "@material-ui/styles";
import CustomMaterialTable from "./CustomMaterialTable";

const ExpensesList = () => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AppStateContext).AppState.userState;
  const [categories, setCategories] = useState(null);
  const [transactions, setTransactions] = useState({});
  const [loading, setLoading] = useState(false);
  const transactionsRef = firebase.db
    .collection("userTransactions")
    .doc(authUser.uid);
  const categoriesRef = firebase.db.collection("categories").doc(authUser.uid);

  useEffect(() => {
    setLoading(true);
    //GET TRANSACTIONS, CATEGORIES

    categoriesRef.get().then(catDoc => {
      if (catDoc.exists) {
        const catData = catDoc.data();
        setCategories(catData);
      }
    });

    let unsubscribe = transactionsRef
      .collection("transactions")
      .onSnapshot(querySnapshot => {
        let firestoreTransactions = {};
        querySnapshot.forEach(doc => {
          //console.log("FS1", doc.data());
          let date = doc.data().date.toDate();
          let data = Object.assign({ ...doc.data() });
          data.date = date;
          firestoreTransactions[data.id] = data;
        });
        //console.log("FS2, transactions changed: ", firestoreTransactions);
        setTransactions({ ...firestoreTransactions });

        setLoading(false);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  const saveTransactions = ({ type, payload }) => {
    switch (type) {
      case "add": {
        payload.category = payload.category.id;
        payload.subCategory = payload.subCategory.id;
        //console.log("Added row:", payload);

        transactionsRef
          .collection("transactions")
          .doc(payload.id)
          .set(payload);

        break;
      }
      case "update": {
        //console.log("updating row:", JSON.parse(JSON.stringify(payload)));
        if (payload.category) {
          payload.category = payload.category.id;
        }
        if (payload.subCategory) {
          payload.subCategory = payload.subCategory.id;
        }
        //console.log("PAYLOAD ", payload);
        transactionsRef
          .collection("transactions")
          .doc(payload.id)
          .set(payload);
        break;
      }
      case "delete": {
        transactionsRef
          .collection("transactions")
          .doc(payload.id)
          .delete();
        break;
      }
      case "match": {
        let {
          newTransactions,
          categoryId,
          subCategoryId,
          description
        } = payload;
        if (!categoryId) {
          categoryId = "";
        }
        if (!subCategoryId) {
          subCategoryId = "";
        }
        //first update all previous transactions
        let batch = firebase.db.batch();
        newTransactions.forEach(transKey => {
          let objRef = transactionsRef.collection("transactions").doc(transKey);
          batch.update(objRef, {
            category: categoryId,
            subCategory: subCategoryId
          });
        });
        batch.commit();

        //second, update matchedCatgories for future transactions
        transactionsRef
          .collection("matchedCategories")
          .doc(description)
          .set(
            {
              description,
              categoryId,
              subCategoryId
            },
            { merge: true }
          );
        break;
      }
      default: {
        console.log("There was an error: ", type, payload);
      }
    }
  };

  const matchCategories = (event, rowData) => {
    let { description, category, subCategory } = rowData;

    let newTransactions = Object.keys(transactions).reduce((acc, next) => {
      if (transactions[next].description === description) {
        acc.push(transactions[next].id);
      }
      return acc;
    }, []);
    // setTransactions(newTransactions);
    saveTransactions({
      type: "match",
      payload: {
        newTransactions,
        categoryId: category.id,
        subCategoryId: subCategory.id,
        description
      }
    });
  };

  return (
    <>
      <h3>Expenses List</h3>
      {loading ? (
        <p>Loading...</p>
      ) : Object.keys(transactions).length > 0 && categories ? (
        <div style={{ maxWidth: "90%", margin: "auto" }}>
          <CustomMaterialTable
            saveTransactions={saveTransactions}
            matchCategories={matchCategories}
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
