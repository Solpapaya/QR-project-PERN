import React from "react";
import { Route, Switch } from "react-router";

const Master = () => {
  return (
    <Switch>
      <Route exact path="/master">
        <div>Home Master</div>
      </Route>
    </Switch>
  );
};

export default Master;
