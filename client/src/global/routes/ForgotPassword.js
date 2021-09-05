import React, { useRef, useState, useEffect, useContext } from "react";
import { CSSTransition } from "react-transition-group";
import Notification from "../components/Notification";
import { AlertContext } from "../context/AlertContext";
import { fetchData } from "../functions/fetchData";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const { setAlert, showAlert, setShowAlert } = useContext(AlertContext);

  const [user, setUser] = useState({
    email: "",
  });

  const [focus, setFocus] = useState({
    email: false,
  });

  const [isEmpty, setIsEmpty] = useState({
    email: false,
  });

  const [isInvalid, setIsInvalid] = useState({
    email: false,
  });

  const [ref, setRef] = useState({
    email: useRef(null),
  });

  const validateEmail = (email) => {
    // const regex = new RegExp(
    //   "/^([a-zd.-]+)@([a-zd-]+).([a-z]{2,8})(.[a-z]{2,8})?$/"
    // );
    const regex = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
    return regex.test(email);
  };

  const changePerson = (e) => {
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
    // setShowAlert(false);
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

    console.log(validateEmail(ref.email.current.value));

    // Send User Credentials
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
      //   setShowAlert(false);
    }, 3000);
  };

  useEffect(() => {
    ref.email.current.focus();
  }, []);

  return (
    <div className="login">
      <form className="form login-form" onSubmit={handleSubmit}>
        <div className="login-logo">
          <i className="fas fa-qrcode login-icon"></i>
        </div>
        <div className="login-heading forgot-password">
          <h3>¿Problemas para iniciar sesión?</h3>
        </div>
        <div className="forgot-password-textinfo">
          <p>
            ¡No te preocupes! Nosotros lo solucionaremos. Solo ingresa tu email
            y te enviaremos un link con el cual puedes restaurar tu contraseña
          </p>
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
        </div>
        <button type="submit" className="login-btn">
          Enviar
        </button>
        <Link className="forgot-password--text" to="/login">
          Iniciar Sesión
        </Link>
      </form>
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
  );
};

export default ForgotPassword;
