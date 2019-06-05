import React from "react";
import MaterialTable from "material-table";
const uuid = require("uuid/v4");

class BasicTreeData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: "Adı", field: "name" },
        { title: "Soyadı", field: "surname" },
        { title: "Cinsiyet", field: "sex" },
        { title: "Tipi", field: "type", removable: false },
        { title: "Doğum Yılı", field: "birthYear", type: "numeric" },
        {
          title: "Doğum Yeri",
          field: "birthCity",
          lookup: { 34: "İstanbul", 63: "Şanlıurfa" }
        }
      ],
      data: [
        {
          id: 1,
          name: "a",
          surname: "Baran",
          birthYear: 1987,
          birthCity: 63,
          sex: "Male",
          type: "adult"
        },
        {
          id: 2,
          name: "b",
          surname: "Baran",
          birthYear: 1987,
          birthCity: 34,
          sex: "Female",
          type: "adult",
          parentId: 1
        },
        {
          id: 3,
          name: "c",
          surname: "Baran",
          birthYear: 1987,
          birthCity: 34,
          sex: "Female",
          type: "child",
          parentId: 1
        },
        {
          id: 4,
          name: "d",
          surname: "Baran",
          birthYear: 1987,
          birthCity: 34,
          sex: "Female",
          type: "child",
          parentId: 3
        },
        {
          id: 5,
          name: "e",
          surname: "Baran",
          birthYear: 1987,
          birthCity: 34,
          sex: "Female",
          type: "child"
        },
        {
          id: 6,
          name: "f",
          surname: "Baran",
          birthYear: 1987,
          birthCity: 34,
          sex: "Female",
          type: "child",
          parentId: 5
        }
      ]
    };
  }
  render() {
    return (
      <MaterialTable
        title="Basic Tree Data Preview"
        data={this.state.data}
        columns={this.state.columns}
        parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
        options={{
          filtering: true
        }}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  const data = this.state.data;
                  newData["id"] = uuid();
                  data.push(newData);
                  console.log(newData);
                  this.setState({ data }, () => resolve());
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
                  data[index] = newData;
                  this.setState({ data }, () => resolve());
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
                  this.setState({ data }, () => resolve());
                }
                resolve();
              }, 1000);
            })
        }}
      />
    );
  }
}

export default BasicTreeData;
