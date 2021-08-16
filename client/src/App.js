import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { AlertContextProvider } from "./global/context/AlertContext";

import { AuthContext } from "./global/context/AuthContext";
import { fetchData } from "./global/functions/fetchData";

// pages
import Login from "./global/routes/Login";
import NotFound from "./global/routes/NotFound";
import QRSystem from "./global/routes/QRSystem";

function App() {
  const { user, setUser, authIsDone, setAuthIsDone } = useContext(AuthContext);

  const isAuth = async () => {
    try {
      const headers = { token: localStorage.token };
      const response = await fetchData("get", "/auth", { headers });
      setUser({ isAuth: response.isAuth, type: response.userType });
    } catch (err) {
      setUser({ isAuth: false, type: "" });
    }
    setAuthIsDone(true);
  };

  const askIsAuth = (time) => {
    const newTime = time + 10; // Adds 10s more
    const timeInterval = parseInt(newTime + "000");
    setInterval(() => {
      isAuth();
    }, timeInterval);
  };

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <Router>
      {authIsDone ? (
        <Switch>
          <Route exact path="/login">
            <AlertContextProvider>
              {user.isAuth ? (
                <Redirect to="/" />
              ) : (
                <Login
                  setUser={setUser}
                  user={user}
                  setAuthIsDone={setAuthIsDone}
                  askIsAuth={askIsAuth}
                />
              )}
            </AlertContextProvider>
          </Route>
          <Route
            exact
            path={[
              "/",
              "/taxreceipt",
              "/taxreceipt/:id/update",
              "/people/:rfc",
              "/people/:rfc/update",
              "/create/people",
              "/departments",
              "/departments/:id/update",
              "/deleted",
            ]}
          >
            {user.isAuth ? (
              <AlertContextProvider>
                <QRSystem />
              </AlertContextProvider>
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route exact path="*">
            <NotFound />
          </Route>
        </Switch>
      ) : (
        ""
      )}
    </Router>
  );
}

export default App;
