import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { TextField, Paper, Button, Typography } from "@material-ui/core";
import { useInput, useSubmit } from "../../custom-hooks";
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
    green: {
      color: "#388e3c"
    }
  };
});

const PasswordChange = () => {
  const classes = useStyles();
  const firebase = useContext(FirebaseContext);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = data => {
    const password = data.password;

    firebase
      .doPasswordUpdate(password)
      .then(() => {
        setSuccess(true);
      })
      .catch(error => {
        setError(error);
      });
  };

  const password = useInput("password", "", validations.ANY);
  const password2 = useInput("password2", "", validations.ANY);
  const submit = useSubmit([password, password2], handleSubmit, true);

  const isInvalid = Boolean(
    !password.props.value ||
      !password2.props.value ||
      password.props.value !== password2.props.value
  );

  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h4" className={classes.title}>
          Change Password
        </Typography>
        <form className={classes.form} {...submit.props}>
          <TextField
            {...password.props}
            type="password"
            label="Enter new password"
            fullWidth
          />
          {password.error && (
            <Typography variant="body1" color="error">
              {password.error}
            </Typography>
          )}
          <TextField
            type="password"
            {...password2.props}
            label="Re-enter new password"
            fullWidth
          />
          {password2.error && (
            <Typography variant="body1" color="error">
              {password2.error}
            </Typography>
          )}

          <Button
            className={classes.submit}
            color="primary"
            variant="contained"
            type="submit"
            disabled={isInvalid}
          >
            Change My Password
          </Button>
          {submit.errorItems && submit.errorItems.length > 0 && (
            <Typography
              variant="body1"
              color="error"
            >{`Please enter valid email address`}</Typography>
          )}
          {error && (
            <Typography variant="body1" color="error">
              {error.message}
            </Typography>
          )}
          {success && (
            <Typography variant="body1" className={classes.green}>
              You have succesfully changed your password
            </Typography>
          )}
        </form>
      </Paper>
    </React.Fragment>
  );
};

export default PasswordChange;
