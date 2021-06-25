import React, { useState, useEffect, useRef, useContext } from "react";
import { fetchData } from "../../../global/functions/fetchData";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import { AlertContext } from "../../../global/context/AlertContext";

const AddUser = () => {
  const { setCurrentSection } = useContext(CurrentSectionContext);
  const [userTypes, setUserTypes] = useState([]);
  const [isFilterUserTypeExpanded, setIsFilterUserTypeExpanded] =
    useState(false);
  const [user, setUser] = useState({
    first_name: "",
    second_name: "",
    surname: "",
    second_surname: "",
    email: "",
    password: "",
    user_type: "",
  });

  const [email, setEmail] = useState({
    alreadyExists: false,
    isValid: true,
  });
  const { setAlert, setShowAlert } = useContext(AlertContext);

  const [focus, setFocus] = useState({
    first_name: false,
    second_name: false,
    surname: false,
    second_surname: false,
    email: false,
    password: false,
  });

  const [isEmpty, setIsEmpty] = useState({
    first_name: false,
    second_name: false,
    surname: false,
    second_surname: false,
    email: false,
    password: false,
    user_type: false,
  });

  const [ref, setRef] = useState({
    first_name: useRef(null),
    surname: useRef(null),
    second_surname: useRef(null),
    email: useRef(null),
    password: useRef(null),
  });

  const getUserTypes = async () => {
    try {
      const headers = { token: localStorage.token };
      const response = await fetchData("get", "/users?types=true", { headers });
      setUserTypes(response.user_types);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setCurrentSection(3);
    getUserTypes();
    ref.first_name.current.focus();
  }, []);

  const changePerson = (e) => {
    const attribute = e.target.id;
    let value = e.target.value;
    // Prevent inserting only blank spaces
    value = value.trimStart();
    if (attribute === "email") {
      // No blank spaces allowed in Email
      if (value[value.length - 1] === " ") {
        value = value.slice(0, -1);
      }
      // Email must be in Lowercases
      value = value.toLowerCase();
    } else {
      // Prevent inserting double blank spaces after any word
      if (value[value.length - 1] === " " && value[value.length - 2] === " ") {
        value = value.slice(0, -1);
      }
    }
    // If the value is not Empty
    if (value) {
      if (attribute !== "email" && attribute !== "password") {
        const splitted = value.split(" ");
        // Convert to UpperCase the first letter of each word
        if (splitted.length > 1) {
          value = "";
          for (let i = 0; i < splitted.length; i++) {
            value +=
              " " + splitted[i].charAt(0).toUpperCase() + splitted[i].slice(1);
          }
          value = value.trimStart();
        } else value = value.charAt(0).toUpperCase() + value.slice(1);
      }
      // Tell that this input is not empty
      setIsEmpty({
        isEmpty,
        [attribute]: false,
      });
    }
    setUser({ ...user, [attribute]: value });
  };

  const cleanInputs = () => {
    for (let key in user) {
      user[key] = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If there is a field empty, the field gets focused and tells the user to fill the field
    for (const prop in user) {
      user[prop] = user[prop].trim();
      if (!user[prop] && prop !== "second_name") {
        if (prop === "email") {
          setEmail({ isValid: true, alreadyExists: false });
        }
        setIsEmpty({
          ...isEmpty,
          [prop]: true,
        });
        if (prop !== "user_type") {
          setTimeout(() => {
            ref[prop].current.focus();
          }, 100);
        }
        return;
      }
    }

    // Add User
    try {
      const response = await fetchData("post", "/users", user);
      // Show message that informs the user the user has been updated successfully
      setEmail({ ...email, alreadyExists: false });
      setAlert({
        success: true,
        msg: ["Se ha agregado correctamente el nuevo usuario"],
        removeOnEnter: true,
      });
      setShowAlert(true);
      cleanInputs();
      ref.first_name.current.focus();
    } catch (err) {
      // Show alert the user couldn't have been uploaded
      console.log(err);
      if (err.status === 400)
        setEmail({ alreadyExists: false, isValid: false });
      else if (err.status === 409)
        setEmail({ isValid: true, alreadyExists: true });
      setIsEmpty({ ...isEmpty, email: true });
      setAlert({ success: false, msg: [err.data.msg], removeOnEnter: true });
      setShowAlert(true);
      ref.email.current.focus();

      //   setRfcAlreadyExists(true);
      //   setIsEmpty({ ...isEmpty, rfc: true });
      //   setIsRfcLongEnough(true);
      //   setAlert({ success: false, msg: [err.data.msg], removeOnEnter: true });
      //   setShowAlert(true);
      //   ref.rfc.current.focus();
    }
  };

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <div
          className={
            focus.first_name
              ? isEmpty.first_name
                ? "add-input-container selected empty"
                : "add-input-container selected"
              : "add-input-container"
          }
        >
          <span className={user.first_name ? "" : "hide"}>Primer Nombre</span>
          <input
            type="text"
            id="first_name"
            value={user.first_name}
            ref={ref.first_name}
            onChange={changePerson}
            onFocus={() =>
              setFocus({
                ...focus,
                first_name: true,
              })
            }
            onBlur={() =>
              setFocus({
                ...focus,
                first_name: false,
              })
            }
          />
        </div>
        <div
          className={
            focus.second_name
              ? isEmpty.second_name
                ? "add-input-container selected empty"
                : "add-input-container selected"
              : "add-input-container"
          }
        >
          <span className={user.second_name ? "" : "hide"}>Segundo Nombre</span>
          <input
            type="text"
            id="second_name"
            value={user.second_name}
            onChange={changePerson}
            onFocus={() =>
              setFocus({
                ...focus,
                second_name: true,
              })
            }
            onBlur={() =>
              setFocus({
                ...focus,
                second_name: false,
              })
            }
          />
        </div>
        <div
          className={
            focus.surname
              ? isEmpty.surname
                ? "add-input-container selected empty"
                : "add-input-container selected"
              : "add-input-container"
          }
        >
          <span className={user.surname ? "" : "hide"}>Primer Apellido</span>
          <input
            type="text"
            id="surname"
            value={user.surname}
            ref={ref.surname}
            onChange={changePerson}
            onFocus={() =>
              setFocus({
                ...focus,
                surname: true,
              })
            }
            onBlur={() =>
              setFocus({
                ...focus,
                surname: false,
              })
            }
          />
        </div>
        <div
          className={
            focus.second_surname
              ? isEmpty.second_surname
                ? "add-input-container selected empty"
                : "add-input-container selected"
              : "add-input-container"
          }
        >
          <span className={user.second_surname ? "" : "hide"}>
            Segundo Apellido
          </span>
          <input
            type="text"
            id="second_surname"
            value={user.second_surname}
            ref={ref.second_surname}
            onChange={changePerson}
            onFocus={() =>
              setFocus({
                ...focus,
                second_surname: true,
              })
            }
            onBlur={() =>
              setFocus({
                ...focus,
                second_surname: false,
              })
            }
          />
        </div>
        <div
          className={
            focus.email
              ? isEmpty.email
                ? email.isValid
                  ? email.alreadyExists
                    ? "add-input-container selected duplicated-email"
                    : "add-input-container selected empty"
                  : "add-input-container selected wrong-email"
                : "add-input-container selected"
              : "add-input-container"
          }
        >
          <span className={user.email ? "" : "hide"}>Email</span>
          <input
            type="email"
            id="email"
            value={user.email}
            ref={ref.email}
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
            focus.password
              ? isEmpty.password
                ? "add-input-container selected empty"
                : "add-input-container selected"
              : "add-input-container"
          }
        >
          <span className={user.password ? "" : "hide"}>Password</span>
          <input
            type="password"
            id="password"
            value={user.password}
            ref={ref.password}
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
        <div
          className={
            isEmpty.user_type
              ? "add-input-container department empty"
              : isFilterUserTypeExpanded
              ? "add-input-container department expanded"
              : "add-input-container department"
          }
        >
          <span className={user.user_type ? "" : "hide"}>Tipo de Usuario</span>
          <div className="department-relative-container">
            <ul
              className="department-ul-container"
              style={
                isFilterUserTypeExpanded
                  ? user.user_type
                    ? {
                        minHeight: `${userTypes.length * 3.5}rem`,
                      }
                    : {
                        minHeight: `${(userTypes.length + 1) * 3.5}rem`,
                      }
                  : {}
              }
              onClick={() => {
                setIsFilterUserTypeExpanded(!isFilterUserTypeExpanded);
              }}
            >
              <li
                className="selected"
                id="user_type"
                onClick={(e) => {
                  setIsFilterUserTypeExpanded(!isFilterUserTypeExpanded);
                  setUser({
                    ...user,
                    user_type: user.user_type,
                  });
                  setIsEmpty({ ...isEmpty, user_type: false });
                }}
              >
                {user.user_type}
              </li>
              {userTypes.map((userType) => {
                const { id, type } = userType;
                if (type !== user.user_type) {
                  return (
                    <li
                      key={id}
                      id="user_type"
                      className={user.user_type === type ? "selected" : ""}
                      onClick={(e) => {
                        setIsFilterUserTypeExpanded(!isFilterUserTypeExpanded);

                        setUser({
                          ...user,
                          user_type: type,
                        });
                        setIsEmpty({ ...isEmpty, user_type: false });
                      }}
                    >
                      {type}
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        </div>

        <button type="submit" className="add-btn update">
          Agregar
        </button>
      </form>
    </div>
  );
};

export default AddUser;
