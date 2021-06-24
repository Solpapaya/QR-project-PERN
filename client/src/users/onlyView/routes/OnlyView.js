import React from "react";
import { Route, Switch } from "react-router";

const OnlyView = () => {
  // <Routes />
  return (
    <Switch>
      <Route exact path="/">
        <div>Home Only View</div>
      </Route>
    </Switch>
  );
};

export default OnlyView;
