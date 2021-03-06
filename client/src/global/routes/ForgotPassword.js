import React, { useRef, useState, useEffect, useContext } from "react";
// import { CSSTransition } from "react-transition-group";
// import Notification from "../components/Notification";
import { AlertContext } from "../context/AlertContext";
import { fetchData } from "../functions/fetchData";
import { Link, useHistory } from "react-router-dom";

const ForgotPassword = () => {
  const history = useHistory();
  const { alert, setAlert, showAlert, setShowAlert } = useContext(AlertContext);

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
    const regex =
      /^([a-z\d]+)([a-z\d\.-]*)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
    return regex.test(email);
  };

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

    if (!validateEmail(ref.email.current.value)) {
      setFocus({ email: true });
      setIsInvalid({ email: true });
      setAlert({
        success: false,
        msg: ["Ingresa un Email V??lido"],
        removeOnEnter: false,
      });
      setShowAlert(true);
      return;
    }

    setShowAlert(false);

    // Send User Credentials
    try {
      const response = await fetchData("post", "/forgot-password", {
        email: ref.email.current.value,
      });
      setAlert({
        success: true,
        msg: ["Te hemos enviado el link a tu Email ????"],
        removeOnEnter: false,
      });

      setUser({ email: "" });
      history.push("/login");
    } catch (err) {
      // Show alert credentials are invalid
      setFocus({ email: true, password: true });
      setIsInvalid({ email: true, password: true });
      setAlert({ success: false, msg: [err.data.msg], removeOnEnter: false });
      // setAlert({ ...alert, msg: [err.data.msg] });
    }
    setShowAlert(true);
  };

  // const removeNotification = () => {
  //   setTimeout(() => {
  //     setShowAlert(false);
  //   }, 3000);
  // };

  useEffect(() => {
    ref.email.current.focus();
  }, []);

  return (
    // <div className="login">
    <form className="form login-form" onSubmit={handleSubmit}>
      <div className="login-logo">
        <i className="fas fa-qrcode login-icon"></i>
      </div>
      <div className="login-heading forgot-password">
        <h3>??Problemas para iniciar sesi??n?</h3>
      </div>
      <div className="forgot-password-textinfo">
        <p>
          ??No te preocupes! Nosotros lo solucionaremos. Solo ingresa tu email y
          te enviaremos un link con el cual puedes restaurar tu contrase??a
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
        Iniciar Sesi??n
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

export default ForgotPassword;
