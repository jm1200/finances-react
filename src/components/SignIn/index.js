import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";
import { Typography, TextField, Paper, Button } from "@material-ui/core";
import * as ROUTES from "../../constants/routes";
import { useInput } from "../../custom-hooks";
import { useSubmit } from "../../custom-hooks";
import { validations } from "../../constants/validation-regex";
import { FirebaseContext } from "../Firebase";

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
    },
    signup: {
      marginTop: 15,
      textAlign: "center"
    },
    forgotPassword: {
      textAlign: "center"
    }
  };
});
//Input states are managed inside useInput hooks.
const SignIn = props => {
  const classes = useStyles();
  const firebase = useContext(FirebaseContext);
  const [signInError, setSignInError] = useState(null);

  const handleSubmit = data => {
    const { email, password } = data;
    firebase
      .doSignInWithEmailAndPassword(email, password)

      .catch(err => setSignInError(err));
  };

  //Custom hooks
  const email = useInput("email", "", validations.EMAIL);
  const password = useInput("password", "", validations.ANY);
  const submit = useSubmit([email, password], handleSubmit);

  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h4" className={classes.title}>
          Log In
        </Typography>
        <form className={classes.form} {...submit.props}>
          <TextField label="Email" {...email.props} fullWidth />
          {email.props.error && (
            <Typography color="error" variant="body1">
              Invalid Email
            </Typography>
          )}
          <TextField
            type="password"
            label="Password"
            {...password.props}
            fullWidth
          />
          {password.props.error && (
            <Typography color="error" variant="body1">
              Invalid Password
            </Typography>
          )}

          <Button
            className={classes.submit}
            //disabled={isInvalid}
            color="primary"
            variant="contained"
            type="submit"
          >
            Submit
          </Button>
          {signInError && (
            <Typography variant="body1" color="error">
              {signInError.message}
            </Typography>
          )}
          {submit.errorItems && submit.errorItems.length > 0 && (
            <Typography variant="body1" color="error">
              {`Please fix ${submit.errorItems && submit.errorItems.length} form
           field error(s)`}
            </Typography>
          )}
        </form>
        <Typography className={classes.forgotPassword} component="p">
          <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
        </Typography>
      </Paper>
      <Typography className={classes.signup} component="p">
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
      </Typography>
    </React.Fragment>
  );
};

export default SignIn;
