import React, {useState, useContext, useReducer, useEffect} from 'react';
import { makeStyles } from '@material-ui/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {Tooltip, Typography, TextField, Button} from '@material-ui/core';
import {FirebaseContext} from '../Firebase';
import {AppStateContext} from '../App';
import {defaultCategories} from '../../constants/defaultData';

const uuid = require('uuid/v4');



const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
    margin: "auto",
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  listSubheaderContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  listSubheader: {
      fontSize: 20
  },
  listSubheaderRight : {
    marginRight: 20,
    display: "flex",
    alignItems: "center"
  },
  listSubheaderRightText : {
      marginRight: 10,
      fontSize: 18,
      fontWeight: "bold",
      color: "darkGrey"
  },
  addSubCategoryContainer: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center"
  },
  red: {
      color: "red",
      marginRight: 15,
      fontSize: 18,
      fontWeight: "bold"
  },
  icons: {
      color: "darkGrey"
  },
  saveModeContainer: {
      display: "flex",
      width: "95%",
      justifyContent: "flex-end"
  }
}));

function CategoriesManager() {
  const classes = useStyles();
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AppStateContext).AppState.userState;
  const [openMenus, setOpenMenus] = useState({});
  const [categories, setCategories] = useState({});

  const initialState = {
      categories: {},
      editMode: false,
      deleteMode: false,
      addMode: false,
      addSubMode: false,
      editCategoryInput: "",
      saveMode: false
  }
  const optionsReducer = (state, action)=>{ 
    switch (action.type) {
        case "setCategories": {
            return Object.assign({},{...state}, {categories: action.payload.categories})
        }
        case "saveMode": {
            return Object.assign({}, {...state}, {saveMode:!state.saveMode});
        }
        case "addMode": {
            return Object.assign({}, {...state}, {addMode:true});
        }
        case "addSubMode": {
            let {category} = action.payload;
            return Object.assign({}, {...state}, {addSubMode:category});
        }
        case "editMode" : { 
            let {category, subCategory} = action.payload;
            return Object.assign({}, {...state}, 
                {editCategoryInput:subCategory?subCategory:category, 
                 editMode:subCategory?category+subCategory:category});
        }
        case "delete"  : { 
            let {category, subCategory} = action.payload;
            return Object.assign({}, {...state}, {deleteMode: subCategory?category+subCategory:category});
        }
        case "close": { 
            
            return Object.assign({}, {...state}, 
                {deleteMode:false, editCategoryInput:"", editMode:false, addMode: false, addSubMode: false});
        }
        case "inputChange" : {
            return Object.assign({}, {...state}, {editCategoryInput: action.payload})
        }
        case "addCategoryDone": {
            let newId = uuid()
            let oldCategories = JSON.parse(JSON.stringify(state.categories))
            if(action.payload.subCategory){
                let {category, subCategory} = action.payload;
                oldCategories[category.id].subCategories[newId]={id:newId, name:subCategory}
                //console.log(Object.assign({}, {...state}, {categories: oldCategories, saveMode: true}))
                return Object.assign({}, {...state}, {categories: oldCategories, saveMode: true});
            }else{
                let newCategory = {
                    name: action.payload.category,
                    id: newId,
                    subCategories:{}
                }
                const newCategories = Object.assign({}, {...oldCategories}, {[newId]:newCategory});
                return Object.assign({}, {...state}, {saveMode: true, categories: newCategories })
            }
        }
        case "editCategoryDone" : {
            const {categoryId, subCategoryId, edit} = action.payload;
            let newState = JSON.parse(JSON.stringify(state.categories))
            if(!subCategoryId){
               newState[categoryId].name = edit;
                return Object.assign({}, {...state}, {categories: newState, saveMode: true});
            } else {
                newState[categoryId].subCategories[subCategoryId].name = edit;
                return Object.assign({}, {...state}, {categories: newState, saveMode: true});
            }
        }
        case "deleteCategoryDone" : {
            let {categoryId, subCategoryId} = action.payload;
            let newState = JSON.parse(JSON.stringify(state.categories))
            if(!subCategoryId){
                delete newState[categoryId];
                return Object.assign({}, {...state}, {categories:newState, saveMode:true});
            } else {
                delete newState[categoryId].subCategories[subCategoryId];
                return Object.assign({}, {...state}, {categories:newState, saveMode: true});
            }
        }
        default: {
           return state;
        }
    }
  }

  const [state, dispatch] = useReducer(optionsReducer, initialState)
  
 

   //opens and closes list menues
   function handleClick(event, category) {
       setOpenMenus({...openMenus, [category]: !openMenus[category]});
   }

//focuses on input after edit click
  const editCatInput = input=>input&&input.focus();

  const saveToFirestore = ()=>{
    let docRef = firebase.db.collection("categories").doc(authUser.uid)
    docRef.set(state.categories)
    setCategories(state.categories);
    dispatch({type: "saveMode"})
    //dispatch({type: "setCategories", payload: {categories:state.categories}});
  }

  const getCategoriesArray = (categories)=>{
      return Object.keys(categories).map(categoryKey=>categories[categoryKey]);
  }
  const dispatchHelper = (event, type, payload=undefined, close=false)=>{
    event.stopPropagation();
    dispatch({type, payload})
    if(close){
        dispatch({type:"close"})
    }
  }

  useEffect(()=>{
    
    const defaultCategoriesFirestore = {};
    Object.keys(defaultCategories).forEach(category=>{
        let catId = uuid();
        let subCategories = {}
        defaultCategories[category].forEach(subCategory=>{
            let subId = uuid();
            subCategories[subId] = {
                id: subId,
                name: subCategory
            }
        })
        defaultCategoriesFirestore[catId]={
            id:catId,
            name: category,
            subCategories: {...subCategories}
        }
    })

      let docRef = firebase.db.collection("categories").doc(authUser.uid)
        docRef.get().then(doc=>{
            if(doc.exists){
                if(Object.keys(doc.data()).length === 0){
                    setCategories(defaultCategoriesFirestore)
                    dispatch({type: "setCategories", payload: {categories:defaultCategoriesFirestore}});
                }else {
                    setCategories(doc.data().categories)
                    dispatch({type: "setCategories", payload: {categories:doc.data()}});
                }
                
            } else {
                setCategories(defaultCategoriesFirestore)
                dispatch({type: "setCategories", payload: {categories:defaultCategoriesFirestore}});
            }   
        })
        
   
     
  },[])

  return (
      <>
      {/* {console.log("state: ",state)} */}
      
    <List
      component="nav"
      subheader={
        <div className={classes.listSubheaderContainer}>
            <ListSubheader className={classes.listSubheader} component="div">Categories Manager</ListSubheader>
            
            <div onClick={(e)=>dispatchHelper(e, "addMode")} className={classes.listSubheaderRight}>
                {state.addMode ? (<>
                    <TextField 
                        inputRef={editCatInput} 
                        value={state.editCategoryInput} 
                        onChange={(e)=>dispatchHelper(e, "inputChange", e.target.value)}
                    />
                    <DoneIcon onClick={(e)=> 
                        dispatchHelper(e, "addCategoryDone", {category:state.editCategoryInput, subCategory:undefined}, true)}/>
                    <CloseIcon onClick={(e)=>dispatchHelper(e, "close")}/>
                </>)
                
                :(<>
                    <Typography className={classes.listSubheaderRightText}>Add Category</Typography>
                    <Tooltip title="Add Category">
                            <AddCircleOutlineIcon  />
                    </Tooltip>
                </>)}
                
            </div>
            
        </div>}
      className={classes.root}
    >
      {state.categories && getCategoriesArray(state.categories)
        .sort((a,b)=>{var x = a.name.toLowerCase();
            var y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;})
        .map(category=>{
          return(
          <div key={category.name}>
              <ListItem  button onClick={(event)=>handleClick(event, category.name)}>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    {(state.editMode && state.editMode === category.name) ? (
                        <TextField 
                            inputRef={editCatInput} 
                            value={state.editCategoryInput} 
                            onChange={(e)=>dispatchHelper(e, "inputChange", e.target.value)}
                        />):
                    (<ListItemText inset primary={category.name} /> )}

                    {(state.editMode && state.editMode === category.name) && 
                        <DoneIcon onClick={(e)=>dispatchHelper(
                            e, 
                            "editCategoryDone", 
                            {categoryId:category.id, subCategoryId:undefined, edit: state.editCategoryInput}, 
                            true
                        )}/>
                    }

                    {(state.deleteMode && state.deleteMode === category.name) && 
                    <>
                        <Typography className={classes.red}>Delete?</Typography>
                        <DoneIcon onClick={(e)=>dispatchHelper(
                            e,
                            "deleteCategoryDone", 
                            {categoryId: category.id, subCategoryId:undefined},
                            true
                            )}/>
                    </>} 

                    {((state.editMode && state.editMode === category.name) || (state.deleteMode && state.deleteMode === category.name)) && 
                        <CloseIcon onClick={(e)=>dispatchHelper(e, "close")}/>}   
                    
                    {(!state.editMode && !state.deleteMode) && <>
                            <EditIcon className={classes.icons} onClick={(e)=>dispatchHelper(
                                e,
                                "editMode", 
                                {category:category.name, subCategory:undefined}
                                )}/>
                            <DeleteIcon className={classes.icons} onClick={(e)=>dispatchHelper(
                                e,
                                "delete", 
                                {category:category.name, subCategory:undefined}
                                )}/>
                        </>}
              
                    {openMenus[category.name] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                 
            <Collapse  in={openMenus[category.name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <div onClick={(e)=>dispatchHelper(
                        e,
                        "addSubMode", 
                        {category: category.name}
                        )} 
                        className={classes.addSubCategoryContainer}>
                        {state.addSubMode ===  category.name? (<>
                        <TextField 
                            inputRef={editCatInput} 
                            value={state.editCategoryInput} 
                            onChange={(e)=>dispatchHelper(
                                e,
                                "inputChange", 
                                e.target.value)}/>
                        <DoneIcon onClick={(e)=>dispatchHelper(
                            e,
                            "addCategoryDone", 
                            {category:category, subCategory:state.editCategoryInput},
                            true
                            )}/>
                        <CloseIcon onClick={(e)=>dispatchHelper(
                            e,
                            "close")}/>
                    </>)
                    
                    :(<>
                        <Typography className={classes.listSubheaderRightText}>Add Sub-Category</Typography>
                        <Tooltip title="Add Sub-Category">
                                <AddCircleOutlineIcon  />
                        </Tooltip>
                </>)}
                    </div>
                    
                    {getCategoriesArray(state.categories[category.id].subCategories)
                        .sort((a,b)=>{var x = a.name.toLowerCase();
                            var y = b.name.toLowerCase();
                            if (x < y) {return -1;}
                            if (x > y) {return 1;}
                            return 0;})
                        .map(subCategory=>{
                        return(
                            <ListItem key={subCategory.name} button className={classes.nested}>
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                {(state.editMode && state.editMode === category.name+subCategory.name) ? (
                                    <TextField 
                                    inputRef={editCatInput} 
                                    value={state.editCategoryInput} 
                                    onChange={(e)=>dispatchHelper(
                                        e,
                                        "inputChange", 
                                        e.target.value)}/>
                                        ):(<ListItemText inset primary={subCategory.name} /> )}

                                    {(state.editMode && state.editMode === category.name+subCategory.name) && <DoneIcon onClick={(e)=>dispatchHelper(
                                        e,
                                        "editCategoryDone", 
                                        {categoryId: category.id, subCategoryId:subCategory.id, edit: state.editCategoryInput},
                                        true
                                        )}
                                    />}

                                    {(state.deleteMode && state.deleteMode === category.name+subCategory.name) && <>
                                    <Typography className={classes.red}>Delete?</Typography>
                                        <DoneIcon onClick={(e)=>dispatchHelper(
                                            e,
                                            "deleteCategoryDone", 
                                            {categoryId: category.id, subCategoryId: subCategory.id},
                                            true
                                            )}/>
                                </>}
                                {((state.editMode && state.editMode === category.name+subCategory.name) || (state.deleteMode && state.deleteMode === category.name+subCategory.name)) 
                                    && <CloseIcon onClick={(e)=>dispatchHelper(e, "close")}/>}   

                                {(!state.editMode && !state.deleteMode) && <>
                                        <EditIcon className={classes.icons} onClick={(e)=>dispatchHelper(
                                            e,
                                            "editMode", 
                                            {category: category.name, subCategory: subCategory.name}
                                            )}/>
                                        <DeleteIcon className={classes.icons} onClick={(e)=>dispatchHelper(
                                            e,
                                            "delete", 
                                            {category: category.name,subCategory: subCategory.name}
                                            )}/>
                                </>}

                                
                            </ListItem>
                        )

                    })}
                    
                </List>
            </Collapse>
          </div>
          )
       
      })}
      
    </List>
    {state.saveMode && <div className={classes.saveModeContainer}>
        <Button onClick={saveToFirestore} color="primary" variant="contained">Save Changes</Button>
        <Button onClick={(event)=>dispatch({type:"setCategories", payload:{categories:categories}})} color="primary" variant="contained">Reset Categories</Button>
        </div>}
    
    </>
  );
}

export default CategoriesManager;
