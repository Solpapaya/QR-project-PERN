import React, { useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import Notification from "../../../global/components/Notification";
import { AlertContext } from "../../../global/context/AlertContext";
import ChangePassword from "../../../global/routes/ChangePassword";
import ForgotPassword from "../../../global/routes/ForgotPassword";
import Login from "../../../global/routes/Login";

const LoginAspectRoutes = (props) => {
  const { user, setUser, askIsAuth, setAuthIsDone } = props;
  const { alert, setAlert, showAlert, setShowAlert } = useContext(AlertContext);

  const removeNotification = () => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <Switch>
      <div className="login">
        <Route exact path="/login">
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
        </Route>
        <Route exact path="/forgot-password">
          {user.isAuth ? <Redirect to="/" /> : <ForgotPassword />}
        </Route>
        <Route exact path="/change-password/:token">
          {user.isAuth ? <Redirect to="/" /> : <ChangePassword />}
        </Route>
        <CSSTransition
          in={showAlert}
          timeout={300}
          classNames="alert"
          unmountOnExit
          onEnter={alert.removeOnEnter ? () => removeNotification() : ""}
        >
          {alert.success ? (
            <Notification header="Operación Exitosa" success={true} />
          ) : (
            <Notification header="Error" success={false} />
          )}
        </CSSTransition>
      </div>
    </Switch>
  );
};

export default LoginAspectRoutes;
