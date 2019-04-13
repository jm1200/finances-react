import React from "react";
import { makeStyles } from "@material-ui/styles";
import { TextField, Paper, Button, Typography } from "@material-ui/core";
import { useInput, useSubmit } from "../../custom-hooks";
import { validations } from "../../constants/validation-regex";

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
const PasswordForget = () => {
  const classes = useStyles();

  const handleSubmit = data => {
    console.log("Forget password submit not connected, ", data);
  };

  const email = useInput("email", "", validations.EMAIL);
  const submit = useSubmit([email], handleSubmit);
  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h4" className={classes.title}>
          Forgot Password
        </Typography>

        <form className={classes.form} {...submit.props}>
          <TextField {...email.props} label="Email" fullWidth />
          {email.error && (
            <Typography variant="body1" color="error">
              {email.error}
            </Typography>
          )}

          <Button
            className={classes.submit}
            color="primary"
            variant="contained"
            type="submit"
          >
            Reset My Password
          </Button>
          {submit.errorItems && submit.errorItems.length > 0 && (
            <Typography
              variant="body1"
              color="error"
            >{`Please enter valid email address`}</Typography>
          )}
        </form>
      </Paper>
    </React.Fragment>
  );
};

export default PasswordForget;
