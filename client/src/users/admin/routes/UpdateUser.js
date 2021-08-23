import React, { useState, useEffect, useRef, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { AlertContext } from "../../../global/context/AlertContext";
import { fetchData } from "../../../global/functions/fetchData";
import { CurrentSectionContext } from "../context/CurrentSectionContext";

const UpdateUser = () => {
  const userID = useParams().id;
  let history = useHistory();
  const { setIsEditPersonSection } = useContext(CurrentSectionContext);
  const [type, setType] = useState([]);
  const [isFilterTypeExpanded, setIsFilterTypeExpanded] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const [person, setPerson] = useState({
    first_name: "",
    second_name: "",
    surname: "",
    second_surname: "",
    email: "",
    type: "",
  });

  const { setAlert, setShowAlert } = useContext(AlertContext);

  const [focus, setFocus] = useState({
    first_name: false,
    second_name: false,
    surname: false,
    second_surname: false,
  });

  const [isEmpty, setIsEmpty] = useState({
    first_name: false,
    second_name: false,
    surname: false,
    second_surname: false,
  });

  const [ref, setRef] = useState({
    first_name: useRef(null),
    surname: useRef(null),
    second_surname: useRef(null),
  });

  const getPerson = async () => {
    try {
      const headers = { token: localStorage.token };
      const response = await fetchData("get", `/users/${userID}`, { headers });

      const foundPerson = response.data.person;
      if (foundPerson.second_name) {
        setPerson({ ...foundPerson });
      } else {
        setPerson({ ...foundPerson, second_name: "" });
      }

      setIsAuth(true);
    } catch (err) {
      if (err.status === 401) {
        // Error page telling the user doesn't have the
        // permissions to access that source
        history.push(`/unauthorized`);
      }
      // Error Page telling the Person doesn't exist
    }
  };

  const getType = async () => {
    const headers = { token: localStorage.token };
    const response = await fetchData("get", "/users?types=true", { headers });
    setType(response.user_types);
  };

  useEffect(() => {
    getPerson();
    getType();
  }, []);

  const changePerson = (e) => {
    const attribute = e.target.id;
    let value = e.target.value;
    // Prevent inserting only blank spaces
    value = value.trimStart();

    // Prevent inserting double blank spaces after any word
    if (value[value.length - 1] === " " && value[value.length - 2] === " ") {
      value = value.slice(0, -1);
    }
    // If the value is not Empty
    if (value) {
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
      // Tell that this input is not empty
      setIsEmpty({
        isEmpty,
        [attribute]: false,
      });
    }
    setPerson({ ...person, [attribute]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // If there is a field empty, the field gets focused and tells the user to fill the field
    for (const prop in person) {
      person[prop] = person[prop].trim();
      if (!person[prop] && prop !== "second_name") {
        console.log(`${prop} is empty`);
        setIsEmpty({
          ...isEmpty,
          [prop]: true,
        });
        if (prop !== "type") {
          setTimeout(() => {
            ref[prop].current.focus();
          }, 100);
        }
        return;
      }
    }

    // Update Person
    try {
      const response = await fetchData("put", `/users/${userID}`, person);
      // Show message that informs the user the person has been updated successfully
      setAlert({
        success: true,
        msg: ["Se ha modificado correctamente la persona"],
        removeOnEnter: true,
      });
      setShowAlert(true);
      history.push("/");
    } catch (err) {
      console.log({ err });
      // Show alert the person couldn't have been updated
      setAlert({ success: false, msg: [err.data.msg], removeOnEnter: true });
      setShowAlert(true);
    }
  };

  useEffect(() => {
    setIsEditPersonSection(true);
  }, []);

  return isAuth ? (
    <div>
      <h2>Actualizar Usuario</h2>
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
          <span className={person.first_name ? "" : "hide"}>Primer Nombre</span>
          <input
            type="text"
            id="first_name"
            value={person.first_name}
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
          <span className={person.second_name ? "" : "hide"}>
            Segundo Nombre
          </span>
          <input
            type="text"
            id="second_name"
            value={person.second_name}
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
          <span className={person.surname ? "" : "hide"}>Primer Apellido</span>
          <input
            type="text"
            id="surname"
            value={person.surname}
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
          <span className={person.second_surname ? "" : "hide"}>
            Segundo Apellido
          </span>
          <input
            type="text"
            id="second_surname"
            value={person.second_surname}
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

        <div className="add-input-container unselectable">
          <span className={person.email ? "" : "hide"}>Email</span>
          <input disabled type="text" id="email" value={person.email} />
        </div>
        <div
          className={
            isEmpty.type
              ? "add-input-container department empty"
              : isFilterTypeExpanded
              ? "add-input-container department expanded"
              : "add-input-container department"
          }
        >
          <span className={person.type ? "" : "hide"}>Tipo de Usuario</span>
          <div className="department-relative-container">
            <ul
              className="department-ul-container"
              style={
                isFilterTypeExpanded
                  ? person.type
                    ? {
                        minHeight: `${type.length * 3.5}rem`,
                      }
                    : {
                        minHeight: `${(type.length + 1) * 3.5}rem`,
                      }
                  : {}
              }
              onClick={() => {
                setIsFilterTypeExpanded(!isFilterTypeExpanded);
              }}
            >
              <li
                className="selected"
                id="type"
                onClick={(e) => {
                  setIsFilterTypeExpanded(!isFilterTypeExpanded);
                  setPerson({
                    ...person,
                    type: person.type,
                  });
                  setIsEmpty({ ...isEmpty, type: false });
                }}
              >
                {person.type}
              </li>
              {type.map((department) => {
                const { id, type } = department;
                if (type !== person.type) {
                  return (
                    <li
                      key={id}
                      id="type"
                      className={person.type === type ? "selected" : ""}
                      onClick={(e) => {
                        setIsFilterTypeExpanded(!isFilterTypeExpanded);
                        setPerson({
                          ...person,
                          type: type,
                        });
                        setIsEmpty({ ...isEmpty, type: false });
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
          Actualizar
        </button>
      </form>
    </div>
  ) : (
    ""
  );
};

export default UpdateUser;
