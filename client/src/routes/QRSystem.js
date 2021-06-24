import React from "react";
import { Route, Switch } from "react-router";
import NotFound from "./NotFound";

const QRSystem = () => {
  return (
    <>
      <Switch>
        <Route exact path={["/", "/people", "test"]}>
          <div className="container">
            <div>QR System</div>
            <div>Home</div>
          </div>
        </Route>
        <Route exact path="*">
          <NotFound />
        </Route>
      </Switch>
    </>
  );
};

export default QRSystem;
