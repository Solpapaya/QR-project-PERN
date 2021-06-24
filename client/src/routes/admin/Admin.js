import React from "react";
import { Route, Switch } from "react-router";

const Admin = () => {
  return (
    <Switch>
      <Route exact path="/">
        <div>Home Admin</div>
      </Route>
    </Switch>
  );
};

export default Admin;
