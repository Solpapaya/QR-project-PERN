import React, { useRef, useState, useEffect, useContext } from "react";
import { CSSTransition } from "react-transition-group";
import Notification from "../components/Notification";
import { AlertContext } from "../context/AlertContext";
import { fetchData } from "../functions/fetchData";
import { Link } from "react-router-dom";

const ChangePasswordForm = (props) => {
  const { alert, setAlert, showAlert, setShowAlert } = useContext(AlertContext);
  const { isValidLink } = props;

  const [user, setUser] = useState({
    password1: "",
    password2: "",
  });

  const [focus, setFocus] = useState({
    password1: false,
    password2: false,
  });

  const [isEmpty, setIsEmpty] = useState({
    password1: false,
    password2: false,
  });

  const [isInvalid, setIsInvalid] = useState({
    password1: false,
    password2: false,
  });

  const [ref, setRef] = useState({
    password1: useRef(null),
    password2: useRef(null),
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

    // If the value is not Empty
    if (value) {
      // Tell that this input is not empty
      setIsEmpty({ ...isEmpty, [attribute]: false });
    }
    setIsInvalid({
      password1: false,
      password2: false,
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

    if (ref.password1.current.value !== ref.password2.current.value) {
      setFocus({ password1: true, password2: true });
      setIsInvalid({ password1: true, password2: true });
      setAlert({
        success: false,
        msg: ["Ambas contraseñas deben ser iguales"],
        removeOnEnter: false,
      });
      setShowAlert(true);
      return;
    }
    setFocus({ password1: false, password2: false });
    setIsEmpty({ password1: false, password2: false });

    // Send New Password
    // try {
    //   const response = await fetchData("post", "/login", user);
    //   const { token, expires, userType } = response;
    //   localStorage.setItem("token", token);
    //   props.setUser({ isAuth: true, type: userType });
    //   props.askIsAuth(expires);
    // } catch (err) {
    //   // Show alert credentials are invalid
    //   setFocus({ email: true, password: true });
    //   setIsInvalid({ email: true, password: true });
    //   setAlert({ success: false, msg: [err.data.msg], removeOnEnter: false });
    //   // setAlert({ ...alert, msg: [err.data.msg] });
    //   setShowAlert(true);
    // }
  };

  const removeNotification = () => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  useEffect(() => {
    ref.password1.current.focus();
    setTimeout(() => {
      isValidLink();
    }, 5000);
  }, []);
  return (
    // <div className="login">
    <form className="form login-form" onSubmit={handleSubmit}>
      <div className="login-logo">
        <i className="fas fa-qrcode login-icon"></i>
      </div>
      <div className="login-heading">
        <h3>Crea una nueva contraseña</h3>
      </div>
      <div className="login-inputs">
        <div
          className={
            isInvalid.password1
              ? "add-input-container selected invalid"
              : focus.password1
              ? isEmpty.password1
                ? "add-input-container selected empty"
                : "add-input-container selected"
              : "add-input-container"
          }
        >
          <span className={user.password1 ? "" : "hide"}>Contraseña</span>
          <input
            className="input-login"
            ref={ref.password1}
            type="password"
            id="password1"
            value={user.password1}
            onChange={changePerson}
            onFocus={() =>
              setFocus({
                ...focus,
                password1: true,
              })
            }
            onBlur={() =>
              setFocus({
                ...focus,
                password1: false,
              })
            }
          />
        </div>
        <div
          className={
            isInvalid.password2
              ? "add-input-container selected invalid"
              : focus.password2
              ? isEmpty.password2
                ? "add-input-container selected empty"
                : "add-input-container selected"
              : "add-input-container"
          }
        >
          <span className={user.password2 ? "" : "hide"}>
            Repite tu Contraseña
          </span>
          <input
            className="input-login"
            ref={ref.password2}
            type="password"
            id="password2"
            value={user.password2}
            onChange={changePerson}
            onFocus={() =>
              setFocus({
                ...focus,
                password2: true,
              })
            }
            onBlur={() =>
              setFocus({
                ...focus,
                password2: false,
              })
            }
          />
        </div>
      </div>
      <button type="submit" className="login-btn">
        Cambiar Contraseña
      </button>
    </form>
  );
};

export default ChangePasswordForm;
