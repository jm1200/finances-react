export function deleteTableData(transObj) {
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

export const makeTableData = (trans, cats) => {
  //console.log("FS3 ", trans);
  const transClone = { ...deleteTableData(trans) };

  let tableData1 = [];
  Object.keys(transClone).forEach(transactionKey => {
    //console.log(transClone[transactionKey]);
    let categoryId = transClone[transactionKey].category;
    let subCategoryId = transClone[transactionKey].subCategory;
    //console.log(categoryId, subCategoryId)
    let row = { ...transClone[transactionKey] };
    if (row.category) {
      row.category = cats[categoryId];
    }
    if (row.subCategory) {
      row.subCategory = cats[categoryId].subCategories[subCategoryId];
    }

    tableData1.push(row);
  });
  //console.log("TD1 Table data:", tableData1);
  return tableData1;
};
