import React from "react";
import MaterialTable from "material-table";
import { makeStyles } from "@material-ui/styles";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
const uuidv4 = require("uuid/v4");

class CustomMaterialTable extends React.Component {
  constructor(props) {
    super(props);
    this.categories = props.categories;
    this.state = {
      selectedCategory: "",
      columns: [
        {
          title: "Date",
          field: "date",
          render: rowData => {
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
        {
          title: "Withdrawl",
          field: "withdrawl",
          type: "numeric"
        },
        {
          title: "Deposit",
          field: "deposit",
          type: "numeric"
        },
        {
          title: "Category",
          field: "category",
          editComponent: props => {
            return (
              <CustomSelect
                categories={Object.keys(this.categories)}
                value={props.value}
                onChange={e => {
                  this.setState({ selectedCategory: e.target.value });
                  return props.onChange(e.target.value);
                }}
                subCategory={props.rowData.subCategory}
              />
            );
          }
        },
        {
          title: "Sub-Category",
          field: "subCategory",
          editComponent: props => {
            return (
              <>
                {this.state.selectedCategory ||
                (props.rowData && props.rowData.category) ? (
                  <CustomSelect
                    categories={
                      this.categories[
                        this.state.selectedCategory || props.rowData.category
                      ]
                    }
                    value={props.value}
                    onChange={e => {
                      return props.onChange(e.target.value);
                    }}
                  />
                ) : (
                  <p>Select a category first</p>
                )}
              </>
            );
          }
        }
      ],
      data: Object.keys(props.transactions).map(
        transKey => props.transactions[transKey]
      )
    };
  }

  handleClick = () => {
    this.props.saveTransactions();
  };

  componentWillReceiveProps = nextProps => {
    const newData = Object.keys(nextProps.transactions).map(
      transKey => nextProps.transactions[transKey]
    );
    this.setState({ data: newData });
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
            filtering: true
          }}
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    const data = this.state.data;

                    const otherData = {
                      id: uuidv4(),
                      date: new Date(newData.date)
                    };
                    console.log(otherData);
                    if (!newData.deposit) {
                      otherData["deposit"] = "";
                    }
                    if (!newData.withdrawl) {
                      otherData["withdrawl"] = "";
                    }
                    const nd = Object.assign(
                      {},
                      { ...newData },
                      { ...otherData }
                    );
                    data.push(nd);
                    console.log("newData", nd);
                    this.setState({ data, selectedCategory: "" }, () =>
                      resolve()
                    );
                    this.props.addTransaction(nd);
                  }
                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    const data = this.state.data;
                    const index = data.indexOf(oldData);
                    newData.date = new Date(newData.date);
                    data[index] = newData;
                    this.props.updateTransaction(newData);
                    this.setState({ data, selectedCategory: "" }, () =>
                      resolve()
                    );
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
                    this.setState({ data, selectedCategory: "" }, () =>
                      resolve()
                    );
                    this.props.deleteTransaction(oldData);
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

const CustomSelect = ({ value, onChange, categories, subCategory }) => {
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
  let disabled;
  if (subCategory) {
    disabled = true;
  } else {
    disabled = false;
  }
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <NativeSelect
          value={value}
          onChange={onChange}
          className={classes.selectEmpty}
        >
          <option value="">None</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    </div>
  );
};
