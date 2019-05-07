import React, { useState, useContext } from "react";
import { Typography, Paper, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useInput, useSubmit } from "../../custom-hooks";
import { validations } from "../../constants/validation-regex";
import { FirebaseContext } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const useStyles = makeStyles(theme => {
  return {
    paper: {
      width: "95%",
      margin: "20px auto",
      paddingBottom: 20,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      [theme.breakpoints.up("sm")]: {
        width: 400
      }
    },
    title: {
      margin: "25px auto 10px auto"
    },
    form: {
      width: "95%", // Fix IE 11 issue.
      margin: "auto"
    },
    submit: {
      marginTop: theme.spacing.unit * 3,
      marginBottom: theme.spacing.unit * 3,
      width: "100%"
    }
  };
});

const SignUp = props => {
  const classes = useStyles();
  const firebase = useContext(FirebaseContext);

  const [signInError, setSignInError] = useState(null);

  const handleSubmit = data => {
    const { firstName, lastName, email, password } = data;

    firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        //Did not return a value here as shown in tutorial. May introduce a bug later?
        firebase
          .user(authUser.user.uid)
          .set(
            {
              firstName,
              lastName,
              email,
              uid: authUser.user.uid,
              roles: ["USER"]
            },
            { merge: true }
          )
          .then(() => {
            props.history.push(ROUTES.HOME);
            console.log("added user to database");
          })
          .catch(err => console.log(err));
      })
      .catch(err => setSignInError(err));
  };

  //Inputs
  const firstName = useInput("firstName", "", validations.ANY);
  const lastName = useInput("lastName", "", validations.ANY);
  const email = useInput("email", "", validations.EMAIL);
  const password = useInput("password", "", validations.ANY);
  const password2 = useInput("password2", "", validations.ANY);
  const submit = useSubmit(
    [firstName, lastName, email, password, password2],
    handleSubmit
  );
  const isInvalid = Boolean(
    !password.props.value ||
      !password2.props.value ||
      password.props.value !== password2.props.value
  );

  const noMatch = password.props.value !== password2.props.value;
  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h4" className={classes.title}>
          Sign Up
        </Typography>

        <form className={classes.form} {...submit.props}>
          <TextField {...firstName.props} label="First Name" fullWidth />
          {firstName.props.error && (
            <Typography variant="body1" color="error">
              Invalid First Name
            </Typography>
          )}
          <TextField {...lastName.props} label="Last Name" fullWidth />
          {lastName.props.error && (
            <Typography variant="body1" color="error">
              Invalid Last Name
            </Typography>
          )}
          <TextField {...email.props} label="Email" fullWidth />
          {email.props.error && (
            <Typography variant="body1" color="error">
              Invalid Email
            </Typography>
          )}
          <TextField
            {...password.props}
            type="password"
            label="Password"
            fullWidth
          />
          {password.props.error && (
            <Typography variant="body1" color="error">
              Invalid Password
            </Typography>
          )}
          <TextField
            {...password2.props}
            type="password"
            label="Re-enter Password"
            fullWidth
          />
          {password2.props.error && (
            <Typography variant="body1" color="error">
              Invalid Password
            </Typography>
          )}

          <Button
            className={classes.submit}
            disabled={isInvalid}
            color="primary"
            variant="contained"
            type="submit"
          >
            Submit
          </Button>
          {noMatch && (
            <Typography
              variant="body1"
              color="error"
            >{`Your passwords don't match`}</Typography>
          )}
          {signInError && (
            <Typography variant="body1" color="error">
              {signInError.message}
            </Typography>
          )}

          {submit.errorItems && submit.errorItems.length > 0 && (
            <Typography
              variant="body1"
              color="error"
            >{`Please fix ${submit.errorItems && submit.errorItems.length} form
           field error(s)`}</Typography>
          )}
        </form>
      </Paper>
    </React.Fragment>
  );
};

export default SignUp;
