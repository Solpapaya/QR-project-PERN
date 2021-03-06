import React, { useRef, useState, useEffect, useContext } from "react";
import { CSSTransition } from "react-transition-group";
import Notification from "../components/Notification";
import { AlertContext } from "../context/AlertContext";
import { fetchData } from "../functions/fetchData";
import { Link } from "react-router-dom";

const Login = (props) => {
  const { alert, setAlert, showAlert, setShowAlert } = useContext(AlertContext);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [focus, setFocus] = useState({
    email: false,
    password: false,
  });

  const [isEmpty, setIsEmpty] = useState({
    email: false,
    password: false,
  });

  const [isInvalid, setIsInvalid] = useState({
    email: false,
    password: false,
  });

  const [ref, setRef] = useState({
    email: useRef(null),
    password: useRef(null),
  });

  const changePerson = (e) => {
    setShowAlert(false);
    const attribute = e.target.id;
    let value = e.target.value;

    // Prevent inserting only blank spaces
    value = value.trimStart();

    // No blank spaces allowed
    if (value[value.length - 1] === " ") {
      value = value.slice(0, -1);
    }

    if (attribute === "email") {
      // Email must be in Lowercase
      value = value.toLowerCase();
    }

    // If the value is not Empty
    if (value) {
      // Tell that this input is not empty
      setIsEmpty({ ...isEmpty, [attribute]: false });
    }
    setIsInvalid({
      email: false,
      password: false,
    });
    setShowAlert(false);
    setUser({ ...user, [attribute]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If there is a field empty, the field gets focused and tells the user to fill the field
    for (const prop in user) {
      if (!user[prop]) {
        setIsEmpty({
          ...isEmpty,
          [prop]: true,
        });

        setTimeout(() => {
          ref[prop].current.focus();
        }, 100);
        return;
      }
    }

    // Send User Credentials
    try {
      const response = await fetchData("post", "/login", user);
      const { token, expires, userType } = response;
      localStorage.setItem("token", token);
      props.setUser({ isAuth: true, type: userType });
      props.askIsAuth(expires);
    } catch (err) {
      // Show alert credentials are invalid
      setFocus({ email: true, password: true });
      setIsInvalid({ email: true, password: true });
      setAlert({ success: false, msg: [err.data.msg], removeOnEnter: false });
      // setAlert({ ...alert, msg: [err.data.msg] });
      setShowAlert(true);
    }
    props.setAuthIsDone(true);
  };

  const removeNotification = () => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  useEffect(() => {
    ref.email.current.focus();
  }, []);
  return (
    // <div className="login">
    <form className="form login-form" onSubmit={handleSubmit}>
      <div className="login-logo">
        <i className="fas fa-qrcode login-icon"></i>
      </div>
      <div className="login-heading">
        <h3>Inicia Sesi??n</h3>
      </div>
      <div className="login-inputs">
        <div
          className={
            isInvalid.email
              ? "add-input-container selected invalid"
              : focus.email
              ? isEmpty.email
                ? "add-input-container selected empty"
                : "add-input-container selected"
              : "add-input-container"
          }
        >
          <span className={user.email ? "" : "hide"}>Email</span>
          <input
            className="input-login"
            ref={ref.email}
            type="text"
            id="email"
            value={user.email}
            onChange={changePerson}
            onFocus={() =>
              setFocus({
                ...focus,
                email: true,
              })
            }
            onBlur={() =>
              setFocus({
                ...focus,
                email: false,
              })
            }
          />
        </div>
        <div
          className={
            isInvalid.password
              ? "add-input-container selected invalid"
              : focus.password
              ? isEmpty.password
                ? "add-input-container selected empty"
                : "add-input-container selected"
              : "add-input-container"
          }
        >
          <span className={user.password ? "" : "hide"}>Contrase??a</span>
          <input
            className="input-login"
            ref={ref.password}
            type="password"
            id="password"
            value={user.password}
            onChange={changePerson}
            onFocus={() =>
              setFocus({
                ...focus,
                password: true,
              })
            }
            onBlur={() =>
              setFocus({
                ...focus,
                password: false,
              })
            }
          />
        </div>
      </div>
      <button type="submit" className="login-btn">
        Iniciar Sesi??n
      </button>
      <Link className="forgot-password--text" to="/forgot-password">
        ??Olvidaste tu contrase??a?
      </Link>
    </form>
    // <CSSTransition
    //   in={showAlert}
    //   timeout={300}
    //   classNames="alert"
    //   unmountOnExit
    //   onEnter={alert.removeOnEnter ? () => removeNotification() : ""}
    // >
    //   {alert.success ? (
    //     <Notification header="Operaci??n Exitosa" success={true} />
    //   ) : (
    //     <Notification header="Error" success={false} />
    //   )}
    // </CSSTransition>
    // </div>
  );
};

export default Login;
