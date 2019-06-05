import React, { useReducer } from "react";
import { Button } from "@material-ui/core";

const uuid = require("uuid/v4");

//Initial States
const defaultCategories = {
  income: ["Myself", "My Partner", "Rental"],
  rental: ["hydro", "rental mortgage", "cable"],
  utilities: ["hydro", "cable"]
};

const objectStructure = {};
Object.keys(defaultCategories).forEach(category => {
  let catId = uuid();
  let subCategories = {};
  defaultCategories[category].forEach(subCategory => {
    let subId = uuid();
    subCategories[subId] = {
      id: subId,
      name: subCategory
    };
  });
  objectStructure[catId] = {
    id: catId,
    name: category,
    subCategories: { ...subCategories }
  };
});

const arrayStructure = [];
Object.keys(defaultCategories).forEach(category => {
  let subCategories = [];
  defaultCategories[category].forEach(subCategory => {
    subCategories.push({ id: uuid(), name: subCategory });
  });
  arrayStructure.push({
    id: uuid(),
    name: category,
    subCategories: subCategories
  });
});

//OBJECT STRUCTURE
const objectCategoriesReducer = (state, action) => {
  switch (action.type) {
    /////////////////////////////   ADD CATEGORY OR SUB-CATEGORY //////////////////////////////////////////////
    case "addCategory": {
      console.log("Old ", state);
      const newId = uuid();
      //clone state and mutate
      const newState = JSON.parse(JSON.stringify(state));
      //if creating sub-category, else create category
      if (action.payload.objectCategoryKey) {
        let newSubCategoryObject = {
          id: newId,
          name: action.payload.newSubCategory
        };
        newState[action.payload.objectCategoryKey].subCategories[
          newId
        ] = newSubCategoryObject;
        console.log("Updated key: ", action.payload.objectCategoryKey);
        console.log("New ADD SUB-CATEGORY ", newState);
        return newState;
      } else {
        let newCategoryObject = {
          id: newId,
          name: action.payload,
          subCategories: []
        };
        newState[newId] = newCategoryObject;
        console.log("New ADD CATEGORY ", newState);
        return newState;
      }
    }
    /////////////////////////////   READ ONE CATEGORY OR SUB-CATEGORY //////////////////////////////////////////////
    case "readOneCategory": {
      if (action.payload.objectSubCategoryKey) {
        console.log(
          state[action.payload.objectCategoryKey].subCategories[
            action.payload.objectSubCategoryKey
          ]
        );
        return state;
      } else {
        console.log(state[action.payload.objectCategoryKey]);
        return state;
      }
    }
    /////////////////////////////   UPDATE CATEGORY OR SUB-CATEGORY //////////////////////////////////////////////
    case "updateCategory": {
      console.log("Old  UPDATE CATEGORY OR SUB-CATEGORY: ", state);
      //clone state and mutate
      const newState = JSON.parse(JSON.stringify(state));
      if (action.payload.objectSubCategoryKey) {
        const {
          objectCategoryKey,
          objectSubCategoryKey,
          updateCategoryObject
        } = action.payload;

        newState[objectCategoryKey].subCategories[
          objectSubCategoryKey
        ] = Object.assign(
          {},
          {
            ...newState[objectCategoryKey].subCategories[objectSubCategoryKey]
          },
          { ...updateCategoryObject }
        );
        console.log(
          "Update category: ",
          objectCategoryKey,
          " Sub Category: ",
          objectSubCategoryKey
        );
        console.log("New UPDATE SUB-CATEGORY: ", newState);
        return newState;
      } else {
        const { objectCategoryKey, updateCategoryObject } = action.payload;
        newState[objectCategoryKey] = Object.assign(
          {},
          { ...newState[objectCategoryKey] },
          { ...updateCategoryObject }
        );
        console.log("Update category: ", objectCategoryKey);
        console.log("New UPDATE CATEGORY: ", newState);
        return newState;
      }
    }
    /////////////////////////////   DELETE CATEGORY OR SUB-CATEGORY //////////////////////////////////////////////
    case "deleteCategory": {
      //clone state and mutate
      console.log("Old DELETE CATEGORY OR SUB-CATEGORY:", state);
      const newState = JSON.parse(JSON.stringify(state));

      if (action.payload.objectSubCategoryKey) {
        const { objectCategoryKey, objectSubCategoryKey } = action.payload;
        console.log(
          "deleting subCategory",
          objectSubCategoryKey,
          " from category: ",
          objectCategoryKey
        );
        let { [objectSubCategoryKey]: omit, ...rest } = state[
          objectCategoryKey
        ].subCategories;
        newState[objectCategoryKey].subCategories = rest;
        console.log("New DELETE SUB-CATEGORY: ", newState);
        return newState;
      } else {
        const { objectCategoryKey } = action.payload;
        console.log("deleting category", objectCategoryKey);
        let { [objectCategoryKey]: omit, ...newState } = state;
        console.log("New DELETE CATEGORY: ", newState);
        return newState;
      }
    }
    /////////////////////////////   ITERATE CATEGORY or SUB-CATEGORY //////////////////////////////////////////////
    // case "iterateCategories": {
    //   if (action.payload.objectCategoryKey) {
    //     let subCategories =
    //       state[action.payload.objectCategoryKey].subCategories;
    //     Object.keys(subCategories).forEach(subCategoryKey => {
    //       console.log(subCategories[subCategoryKey].name);
    //     });
    //   } else {
    //     Object.keys(state).forEach(categoryKey => {
    //       console.log(state[categoryKey].name);
    //     });
    //     return state;
    //   }
    // }
    default: {
      return state;
    }
  }
};
//ARRAY STRUCTURE**********************************************************************************************
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const arrayCategoriesReducer = (state, action) => {
  switch (action.type) {
    /////////////////////////////   ADD CATEGORY OR SUB-CATEGORY //////////////////////////////////////////////
    case "addCategory": {
      console.log("Old ", state);
      const newId = uuid();
      //clone state and mutate

      //if creating sub-category, else create category
      console.log(action);
      if (action.payload.arrayCategoryKey) {
        let { arrayCategoryKey, newSubCategory } = action.payload;
        //clone state
        const newState = JSON.parse(JSON.stringify(state));
        let newSubCategoryObject = {
          id: newId,
          name: newSubCategory
        };
        //Mutate newState
        newState.forEach(category => {
          console.log(category.id === arrayCategoryKey);
          if (category.id === arrayCategoryKey) {
            category.subCategories = [
              ...category.subCategories,
              newSubCategoryObject
            ];
          }
        });

        console.log("Updated key: ", action.payload.arrayCategoryKey);
        console.log("New ADD SUB-CATEGORY ", newState);
        return newState;
      } else {
        let newCategoryObject = {
          id: newId,
          name: action.payload,
          subCategories: []
        };
        let newState = [...state, newCategoryObject];
        console.log("New ADD CATEGORY ", newState);
        return newState;
      }
    }
    /////////////////////////////   READ ONE CATEGORY OR SUB-CATEGORY //////////////////////////////////////////////
    case "readOneCategory": {
      if (action.payload.arraySubCategoryKey) {
        state.forEach(category => {
          category.subCategories.forEach(subCategory => {
            if (subCategory.id === action.payload.arraySubCategoryKey) {
              console.log(subCategory);
            }
          });
        });

        return state;
      } else {
        state.forEach(category => {
          if (category.id === action.payload.arrayCategoryKey) {
            console.log(category);
          }
        });
        return state;
      }
    }
    /////////////////////////////   UPDATE CATEGORY OR SUB-CATEGORY //////////////////////////////////////////////
    case "updateCategory": {
      console.log("Old  UPDATE CATEGORY OR SUB-CATEGORY: ", state);
      //clone state and mutate
      const newState = JSON.parse(JSON.stringify(state));
      if (action.payload.arraySubCategoryKey) {
        const {
          arrayCategoryKey,
          arraySubCategoryKey
        } = action.payload;

        console.log(
          "Update category: ",
          arrayCategoryKey,
          " Sub Category: ",
          arraySubCategoryKey
        );
        console.log("New UPDATE SUB-CATEGORY: ", newState);
        return newState;
      } else {
        const { arrayCategoryKey, updateCategoryObject } = action.payload;
        newState[arrayCategoryKey] = Object.assign(
          {},
          { ...newState[arrayCategoryKey] },
          { ...updateCategoryObject }
        );
        console.log("Update category: ", arrayCategoryKey);
        console.log("New UPDATE CATEGORY: ", newState);
        return newState;
      }
    }
    /////////////////////////////   DELETE CATEGORY OR SUB-CATEGORY //////////////////////////////////////////////
    case "deleteCategory": {
      //clone state and mutate
      console.log("Old DELETE CATEGORY OR SUB-CATEGORY:", state);
      const newState = JSON.parse(JSON.stringify(state));

      if (action.payload.objectSubCategoryKey) {
        const { objectCategoryKey, objectSubCategoryKey } = action.payload;
        console.log(
          "deleting subCategory",
          objectSubCategoryKey,
          " from category: ",
          objectCategoryKey
        );
        let { [objectSubCategoryKey]: omit, ...rest } = state[
          objectCategoryKey
        ].subCategories;
        newState[objectCategoryKey].subCategories = rest;
        console.log("New DELETE SUB-CATEGORY: ", newState);
        return newState;
      } else {
        const { objectCategoryKey } = action.payload;
        console.log("deleting category", objectCategoryKey);
        let { [objectCategoryKey]: omit, ...newState } = state;
        console.log("New DELETE CATEGORY: ", newState);
        return newState;
      }
    }
    /////////////////////////////   ITERATE CATEGORY or SUB-CATEGORY //////////////////////////////////////////////
    // case "iterateCategories": {
    //   if (action.payload.objectCategoryKey) {
    //     let subCategories =
    //       state[action.payload.objectCategoryKey].subCategories;
    //     Object.keys(subCategories).forEach(subCategoryKey => {
    //       console.log(subCategories[subCategoryKey].name);
    //     });
    //   } else {
    //     Object.keys(state).forEach(categoryKey => {
    //       console.log(state[categoryKey].name);
    //     });
    //     return state;
    //   }
    // }
    default: {
      return state;
    }
  }
};

const Sandbox = () => {
  const [objectState, objectDispatchActions] = useReducer(
    objectCategoriesReducer,
    objectStructure
  );
  const [arrayState, arrayDispatchActions] = useReducer(
    arrayCategoriesReducer,
    arrayStructure
  );
  const objectCategoryKey = Object.keys(objectState)[0];
  const objectSubCategories = objectState[objectCategoryKey].subCategories;
  const objectSubCategoryKey = Object.keys(objectSubCategories)[0];
  //console.log("key", objectCategoryKey);

  const arrayCategoryKey = arrayState[0].id;
  const arraySubCategoryKey = arrayState[0].subCategories[0].id;
  //console.log(arrayCategoryKey, arraySubCategoryKey);

  return (
    <>
      <p>Code Sandbox</p>
      <p>Object structure</p>
      <Button
        onClick={event =>
          arrayDispatchActions({
            type: "addCategory",
            payload: "New Category"
          })
        }
        variant="contained"
        color="primary"
      >
        Create New Category
      </Button>
      <Button
        onClick={event =>
          arrayDispatchActions({
            type: "addCategory",
            payload: { arrayCategoryKey, newSubCategory: "New Sub-Category" }
          })
        }
        variant="contained"
        color="primary"
      >
        Create New Sub-Category
      </Button>
      <Button
        onClick={event =>
          objectDispatchActions({
            type: "readOneCategory",
            payload: { objectCategoryKey }
          })
        }
        variant="contained"
        color="primary"
      >
        Read One Category
      </Button>
      <Button
        onClick={event =>
          objectDispatchActions({
            type: "readOneCategory",
            payload: { objectCategoryKey, objectSubCategoryKey }
          })
        }
        variant="contained"
        color="primary"
      >
        Read One Sub-Category
      </Button>
      <Button
        onClick={event =>
          objectDispatchActions({
            type: "updateCategory",
            payload: {
              objectCategoryKey,
              updateCategoryObject: { name: "Updated Category" }
            }
          })
        }
        variant="contained"
        color="primary"
      >
        Update One Category
      </Button>
      <Button
        onClick={event =>
          objectDispatchActions({
            type: "updateCategory",
            payload: {
              objectCategoryKey,
              objectSubCategoryKey,
              updateCategoryObject: { name: "Updated Category" }
            }
          })
        }
        variant="contained"
        color="primary"
      >
        Update One Sub-Category
      </Button>
      <Button
        onClick={event =>
          objectDispatchActions({
            type: "deleteCategory",
            payload: { objectCategoryKey }
          })
        }
        variant="contained"
        color="primary"
      >
        Delete One Category
      </Button>
      <Button
        onClick={event =>
          objectDispatchActions({
            type: "deleteCategory",
            payload: { objectCategoryKey, objectSubCategoryKey }
          })
        }
        variant="contained"
        color="primary"
      >
        Delete One Sub-Category
      </Button>
      <Button
        onClick={event =>
          objectDispatchActions({
            type: "iterateCategories",
            payload: {}
          })
        }
        variant="contained"
        color="primary"
      >
        Iterate Through Categories:
      </Button>

      <Button
        onClick={event =>
          objectDispatchActions({
            type: "iterateCategories",
            payload: { objectCategoryKey }
          })
        }
        variant="contained"
        color="primary"
      >
        Iterate Threough Sub-Categories
      </Button>
      {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
      <p>Array structure</p>
      <Button
        onClick={event =>
          arrayDispatchActions({
            type: "addCategory",
            payload: "New Category"
          })
        }
        variant="contained"
        color="primary"
      >
        Create New Category
      </Button>
      <Button
        onClick={event =>
          arrayDispatchActions({
            type: "addCategory",
            payload: { arrayCategoryKey, newSubCategory: "New Sub-Category" }
          })
        }
        variant="contained"
        color="primary"
      >
        Create New Sub-Category
      </Button>
      <Button
        onClick={event =>
          arrayDispatchActions({
            type: "readOneCategory",
            payload: { arrayCategoryKey }
          })
        }
        variant="contained"
        color="primary"
      >
        Read One Category
      </Button>
      <Button
        onClick={event =>
          arrayDispatchActions({
            type: "readOneCategory",
            payload: { arrayCategoryKey, arraySubCategoryKey }
          })
        }
        variant="contained"
        color="primary"
      >
        Read One Sub-Category
      </Button>
      <Button
        onClick={event =>
          objectDispatchActions({
            type: "updateCategory",
            payload: {
              objectCategoryKey,
              updateCategoryObject: { name: "Updated Category" }
            }
          })
        }
        variant="contained"
        color="primary"
      >
        Update One Category
      </Button>
      <Button
        onClick={event =>
          objectDispatchActions({
            type: "updateCategory",
            payload: {
              objectCategoryKey,
              objectSubCategoryKey,
              updateCategoryObject: { name: "Updated Category" }
            }
          })
        }
        variant="contained"
        color="primary"
      >
        Update One Sub-Category
      </Button>
      <Button
        onClick={event =>
          objectDispatchActions({
            type: "deleteCategory",
            payload: { objectCategoryKey }
          })
        }
        variant="contained"
        color="primary"
      >
        Delete One Category
      </Button>
      <Button
        onClick={event =>
          objectDispatchActions({
            type: "deleteCategory",
            payload: { objectCategoryKey, objectSubCategoryKey }
          })
        }
        variant="contained"
        color="primary"
      >
        Delete One Sub-Category
      </Button>
      <Button
        onClick={event =>
          objectDispatchActions({
            type: "iterateCategories",
            payload: {}
          })
        }
        variant="contained"
        color="primary"
      >
        Iterate Through Categories:
      </Button>

      <Button
        onClick={event =>
          objectDispatchActions({
            type: "iterateCategories",
            payload: { objectCategoryKey }
          })
        }
        variant="contained"
        color="primary"
      >
        Iterate Threough Sub-Categories
      </Button>
    </>
  );
};

export default Sandbox;
