import React from "react";
import MaterialTable from "material-table";
import { makeStyles } from "@material-ui/styles";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import { makeTableData } from "./ExpensesHelpers";
import NumberFormat from "react-number-format";
const uuid = require("uuid/v4");

class CustomMaterialTable extends React.Component {
  constructor(props) {
    super(props);
    //console.log("TD2: ", props.tableData);
    this.categories = props.categories;
    this.state = {
      selectedCategory: false,
      columns: [
        {
          title: "Date",
          field: "date",
          render: rowData => {
            //Convert data to string or, if no rowData (adding row) make a new Date object
            if (rowData) {
              return <p>{rowData.date.toDateString()}</p>;
            } else {
              let rowData = {};
              rowData.date = new Date();
              return <p>{rowData.date.toDateString()}</p>;
            }
          }
        },
        { title: "Account", field: "account" },
        { title: "Card", field: "card" },
        { title: "Description", field: "description" },
        // {
        //   title: "Withdrawl",
        //   field: "withdrawl",
        //   type: "numeric",
        //   render: rowData => (
        //     <NumberFormat
        //       value={rowData.withdrawl}
        //       prefix={"$"}
        //       thousandSeparator={true}
        //       displayType={"text"}
        //       fixedDecimalScale={true}
        //       decimalScale={2}
        //     />
        //   )
        // },
        // {
        //   title: "Deposit",
        //   field: "deposit",
        //   type: "numeric",
        //   customSort: (a, b) => {
        //     console.log()
        //   },
        //   render: rowData => (
        //     <NumberFormat
        //       value={rowData.deposit}
        //       prefix={"$"}
        //       thousandSeparator={true}
        //       displayType={"text"}
        //       fixedDecimalScale={true}
        //       decimalScale={2}
        //     />
        //   )
        // },
        {
          title: "Value",
          field: "value",
          type: "numeric",
          render: rowData => (
            <NumberFormat
              value={rowData.value}
              prefix={"$"}
              thousandSeparator={true}
              displayType={"text"}
              fixedDecimalScale={true}
              decimalScale={2}
            />
          )
        },
        {
          title: "Category",
          field: "category",
          render: rowData => {
            return <p>{rowData.category.name || ""}</p>;
          },
          editComponent: props => {
            //If rowData exists, a row is being edited. The value should be first, the newly selected
            //category and second the original category received from the database. If either of those
            //are blank, the value needs to be "none" to be accepted by the CustomSelect component
            let val;
            if (props.rowData) {
              val = this.state.selectedCategory || props.rowData.category;
              if (val === "") {
                val = "none";
              }
            } else {
              //rowData does not exist so a row is being added. The value should be, first, the selected
              //category and second, if nothing is selected "none".
              val = this.state.selectedCategory || "none";
            }

            return (
              <CustomSelect
                //the categories are easy. They are always just the categories from props.categories
                categories={makeCategoriesArray(this.categories)}
                value={val}
                onChange={e => {
                  this.setState({
                    selectedCategory:
                      //If e.target.value is "", don't try to parse it.
                      e.target.value === "none"
                        ? "none"
                        : JSON.parse(e.target.value)
                  });
                  return props.onChange(
                    e.target.value === "none"
                      ? "none"
                      : JSON.parse(e.target.value)
                  );
                }}
              />
            );
          }
        },
        {
          title: "Sub-Category",
          field: "subCategory",
          render: rowData => {
            return <p>{rowData.subCategory.name || ""}</p>;
          },
          editComponent: props => {
            const { selectedCategory } = this.state;
            let displaySubCategories = false;

            //Two conditions to cover for: Editmode and Addmode.
            //In Edit mode we need to check that rowData exists so that if there is a category set already, we can access
            //props.rowData.category.subCategories to display those subCategories. We also need the selectedCategory to not
            //be None. If it is we don't want to display subCategories until a category is selected.
            //if there is a selectedCategory, display those first. If there is an original category already in rowData
            //display those.
            if (props.rowData && !(selectedCategory === "none")) {
              displaySubCategories =
                selectedCategory.subCategories ||
                props.rowData.category.subCategories;
            }
            //In Add mode, check first to make sure there is now rowData. Then let displaySubCategories equal
            //the current selectedCategory.
            else if (!props.rowData && !(selectedCategory === "none")) {
              displaySubCategories = selectedCategory.subCategories;
            }
            if (!displaySubCategories) {
              return <p>Select a category first</p>;
            } else {
              return (
                <CustomSelect
                  categories={makeCategoriesArray(displaySubCategories)}
                  //If there is rowData, we are editing a row, so if a change has been made pass in props.value
                  //and if no change has been made yet pass in the original subcategory. If no rowData, we are adding
                  //a row. If a change has been made, pass in the changed value, otherwise set a default value to none.
                  //If a category has not been selected yet, this component doesn't render.
                  value={
                    props.rowData
                      ? props.value || props.rowData.subCategory
                      : props.value || "none"
                  }
                  onChange={e => {
                    return props.onChange(
                      e.target.value === "none"
                        ? "none"
                        : JSON.parse(e.target.value)
                    );
                  }}
                />
              );
            }
          }
        }
      ],
      data: makeTableData(props.transactions, props.categories)
    };
  }

  // handleClick = () => {
  //   this.props.saveTransactions();
  // };

  componentWillReceiveProps = nextProps => {
    //console.log(nextProps);
    this.setState({
      data: makeTableData(nextProps.transactions, nextProps.categories)
    });
  };

  render() {
    return (
      <>
        <MaterialTable
          title="Custom Edit Component Preview"
          columns={this.state.columns}
          data={this.state.data}
          actions={[
            {
              icon: "add_circle",
              tooltip: "Match all descriptions",
              onClick: (event, rowData) =>
                this.props.matchCategories(event, rowData)
            }
          ]}
          options={{
            actionsColumnIndex: -1,
            filtering: true,
            rowStyle: rowData => ({
              backgroundColor: rowColor(rowData)
            })
          }}
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    //clone old data and mutate
                    let data = this.state.data.slice();
                    let clonedNewData = { ...newData };
                    clonedNewData.date = new Date(newData.date);
                    clonedNewData.id = uuid();
                    clonedNewData.categorized = newData.category ? true : false;

                    if (!newData.category) {
                      clonedNewData["category"] = {};
                    }
                    if (!newData.subCategory) {
                      clonedNewData["subCategory"] = {};
                    }
                    if (!newData.withdrawl) {
                      clonedNewData["withdrawl"] = "";
                    }
                    if (!newData.deposit) {
                      clonedNewData["deposit"] = "";
                    }
                    data.push(clonedNewData);
                    this.setState({ data, selectedCategory: false }, () =>
                      resolve()
                    );
                  }
                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    const data = this.state.data.slice();
                    const index = data.indexOf(oldData);
                    newData.date = new Date(newData.date);
                    if (newData.category === "none") {
                      newData.category = "";
                      newData.subCategory = "";
                    }
                    if (newData.subCategory === "none") {
                      newData.subCategory = "";
                    }
                    //make sure that subCategory is actually a subCategory of category
                    if (newData.category) {
                      let subCategoryIds = Object.keys(
                        newData.category.subCategories
                      );
                      if (
                        newData.subCategory &&
                        !subCategoryIds.includes(newData.subCategory.id)
                      ) {
                        newData.subCategory = "";
                      }
                    }
                    data[index] = newData;
                    this.setState({ data, selectedCategory: false }, () =>
                      resolve()
                    );
                    this.props.saveTransactions({
                      type: "update",
                      payload: newData
                    });
                  }
                  resolve();
                }, 1000);
              }),
            onRowDelete: oldData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    let data = this.state.data;
                    const index = data.indexOf(oldData);
                    data.splice(index, 1);
                    this.props.saveTransactions({
                      type: "delete",
                      payload: oldData
                    });
                    this.setState({ data }, () => resolve());
                  }
                  resolve();
                }, 1000);
              })
          }}
        />
      </>
    );
  }
}

export default CustomMaterialTable;

const CustomSelect = ({ value, onChange, categories }) => {
  const useStyles = makeStyles(theme => ({
    root: {
      display: "flex",
      flexWrap: "wrap"
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 120
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2
    }
  }));
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        {/* if the category is "" don't try to stringify it */}
        <NativeSelect
          value={value === "none" ? "none" : JSON.stringify(value)}
          onChange={onChange}
          className={classes.selectEmpty}
        >
          <option value="none">None</option>
          {categories.map(cat => (
            //if the category is "" don't try to stringify it
            <option
              key={cat.id}
              value={cat === "none" ? "none" : JSON.stringify(cat)}
            >
              {cat.name}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    </div>
  );
};

const makeCategoriesArray = categories => {
  return Object.keys(categories).map(categoryKey => categories[categoryKey]);
};

const rowColor = rowData => {
  let x;
  if (rowData.value > 5000 || rowData.value < -5000) {
    x = 30;
  } else {
    x = Math.round(Math.abs(rowData.value / 5000) * 60);
  }
  if (rowData.value > 0) return "hsl(120,60%," + (100 - x) + "%)";
  return "hsl(0,60%," + (90 - x) + "%)";
};
