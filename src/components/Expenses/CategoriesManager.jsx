import React, {useState, useReducer} from 'react';
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
import {Tooltip, Typography, TextField} from '@material-ui/core';

const cats = {
    income: ["John", "Meghan", "Rental"],
    rental: ["hydro", "rental mortgage", "cable"],
    utilities: ["hydro", "cable"]
  };

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
  }
}));

function NestedList() {
  const classes = useStyles();
  const [openMenus, setOpenMenus] = useState({});
  const initialState = {
      categories: cats,
      editMode: false,
      deleteMode: false,
      addMode: false,
      addSubMode: false,
      editCategoryInput: "",
  }
  const optionsReducer = (state, action)=>{
      let category;
      let subCategory;
      if(action.payload){
        category = action.payload.category;
        subCategory = action.payload.subCategory;
      }
      
    switch (action.type) {
        case "close": { 
            return Object.assign({}, {...state}, 
                {deleteMode:false, editMode:false, addMode: false, addSubMode: false});
        }
        case "add": {
            return Object.assign({}, {...state}, {addMode:true});
        }
        case "addSub": {
            return Object.assign({}, {...state}, {addSubMode:category});
        }
        case "addCategoryDone": {
            let nCats = {...state.categories}
            if(!category){
                nCats[state.editCategoryInput] = [];
                return Object.assign({}, {...state}, {categories: nCats, addMode: false, editCategoryInput: ""})
            } else {
                nCats[category] = [...nCats[category], state.editCategoryInput]
                return Object.assign({}, {...state}, {categories: nCats, addSubMode: false, editCategoryInput: ""})
            }
        }
        case "edit" : { 
            return Object.assign({}, {...state}, 
                {editCategoryInput:subCategory?subCategory:category, 
                 editMode:subCategory?category+subCategory:category});
        }
        
        case "delete"  : { 
            return Object.assign({}, {...state}, {deleteMode: subCategory?category+subCategory:category});
        }
        case "editCategoryDone" : {
            let nCats = { ...state.categories }
            if(!subCategory){
                let oldSubCats = nCats[category]
                delete nCats[category];
                nCats[state.editCategoryInput] = oldSubCats;
                return Object.assign({}, {...state}, {categories: nCats, editMode: false, editCategoryInput: ""})
            } else {
                let filteredNCats = nCats[category].filter(sub=>sub!==subCategory);
                filteredNCats = [...filteredNCats, state.editCategoryInput];
                nCats[category] = filteredNCats;
                return Object.assign({}, {...state},{categories: nCats, editMode: false, editCategoryInput: ""} )
                
            }
        }
        case "deleteCategoryDone" : {
            let nCats = { ...state.categories }
            if(!subCategory){
                delete nCats[category]
                return Object.assign({},{...state}, {categories: nCats, deleteMode: false});
            } else {
                nCats[category] = nCats[category].filter(sub=>sub!==subCategory);
                return Object.assign({}, {...state},{categories: nCats, deleteMode: false} );
                
            }
        }
        case "inputChange" : {
            return Object.assign({}, {...state}, {editCategoryInput: action.payload.change})
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

const handleAdd = (event)=>{
    dispatch({type:"add"})
}
const handleAddSub= (event, category)=>{
    dispatch({type:"addSub", payload:{category:category}})
}
//category and subcategory input changes
  const handleCategoryChange= (event)=>{
      dispatch({type: "inputChange", payload: {change: event.target.value}})
  }
//focuses on input after edit click
  const editCatInput = input=>input&&input.focus();

  const toggleOptionMode = (event, action, category, subCategory)=>{
    event.stopPropagation();
    dispatch({type: action, payload:{category, subCategory}})
  }

  return (
    <List
    
      component="nav"
      subheader={
        <div className={classes.listSubheaderContainer}>
            <ListSubheader className={classes.listSubheader} component="div">Categories Manager</ListSubheader>
            
            <div onClick={handleAdd} className={classes.listSubheaderRight}>
                {state.addMode ? (<>
                    <TextField inputRef={editCatInput} value={state.editCategoryInput} onChange={handleCategoryChange}/>
                    <DoneIcon onClick={(event)=>toggleOptionMode(event, "addCategoryDone")}/>
                    <CloseIcon onClick={(event)=>toggleOptionMode(event, "close")}/>
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
      {Object.keys(state.categories).sort().map(category=>{
          return(
          <div key={category}>
              <ListItem  button onClick={(event)=>handleClick(event, category)}>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    {(state.editMode && state.editMode === category) ? (<TextField inputRef={editCatInput} value={state.editCategoryInput} onChange={handleCategoryChange}/>):
                    (<ListItemText inset primary={category} /> )}

                    {(state.editMode && state.editMode === category) && <DoneIcon onClick={(event)=>toggleOptionMode(event, "editCategoryDone", category, undefined)}/>}

                    {(state.deleteMode && state.deleteMode === category) && <>
                    <Typography className={classes.red}>Delete?</Typography>
                    <DoneIcon onClick={(event)=>toggleOptionMode(event, "deleteCategoryDone", category, undefined)}/>
                    </>} 

                    {((state.editMode && state.editMode === category) || (state.deleteMode && state.deleteMode === category)) && <CloseIcon onClick={(event)=>toggleOptionMode(event, "close", category, undefined)}/>}   
                    
                    {(!state.editMode && !state.deleteMode) && <>
                            <EditIcon className={classes.icons} onClick={(event)=>toggleOptionMode(event, "edit", category, undefined)}/>
                            <DeleteIcon className={classes.icons} onClick={(event)=>toggleOptionMode(event, "delete", category, undefined)}/>
                        </>}
              
                    {openMenus[category] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                 
            <Collapse  in={openMenus[category]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <div onClick= {(event)=>handleAddSub(event, category)}className={classes.addSubCategoryContainer}>
                        {state.addSubMode ===  category? (<>
                        <TextField inputRef={editCatInput} value={state.editCategoryInput} onChange={handleCategoryChange}/>
                        <DoneIcon onClick={(event)=>toggleOptionMode(event, "addCategoryDone", category)}/>
                        <CloseIcon onClick={(event)=>toggleOptionMode(event, "close")}/>
                    </>)
                    
                    :(<>
                        <Typography className={classes.listSubheaderRightText}>Add Sub-Category</Typography>
                        <Tooltip title="Add Sub-Category">
                                <AddCircleOutlineIcon  />
                        </Tooltip>
                </>)}
                    </div>
                    {state.categories[category].sort().map(subCategory=>{
                        return(
                            <ListItem key={subCategory} button className={classes.nested}>
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                {(state.editMode && state.editMode === category+subCategory) ? (<TextField inputRef={editCatInput} value={state.editCategoryInput} onChange={handleCategoryChange}/>):
                                 (<ListItemText inset primary={subCategory} /> )}

                                 {(state.editMode && state.editMode === category+subCategory) && <DoneIcon onClick={(event)=>toggleOptionMode(event, "editCategoryDone", category, subCategory)}/>}

                                 {(state.deleteMode && state.deleteMode === category+subCategory) && <>
                                    <Typography className={classes.red}>Delete?</Typography>
                                     <DoneIcon onClick={(event)=>toggleOptionMode(event, "deleteCategoryDone", category, subCategory)}/>
                                </>}
                                {((state.editMode && state.editMode === category+subCategory) || (state.deleteMode && state.deleteMode === category+subCategory)) && <CloseIcon onClick={(event)=>toggleOptionMode(event, "close", category, undefined)}/>}   

                                {(!state.editMode && !state.deleteMode) && <>
                                        <EditIcon className={classes.icons} onClick={(event)=>toggleOptionMode(event, "edit", category, subCategory)}/>
                                        <DeleteIcon className={classes.icons} onClick={(event)=>toggleOptionMode(event, "delete", category,subCategory)}/>
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
  );
}

export default NestedList;
