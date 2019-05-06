import React from "react";
import { Button } from "@material-ui/core";
import { noAuthLinks } from "./navlinks";

const NavigationNoAuth = () => (
  <>
    {noAuthLinks.map(obj => {
      return (
        <Button key={obj.label} color="inherit" component={obj.link}>
          {obj.label}
        </Button>
      );
    })}
  </>
);

export default NavigationNoAuth;
