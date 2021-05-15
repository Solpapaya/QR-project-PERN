import React, { useState, useEffect, useRef, useContext } from "react";
import { fetchData } from "../functions/fetchData";
import { CurrentSectionContext } from "../context/CurrentSectionContext";

const AddPerson = () => {
  const { setCurrentSection } = useContext(CurrentSectionContext);
  const [departments, setDepartments] = useState([]);
  const [isFilterDepartmentExpanded, setIsFilterDepartmentExpanded] =
    useState(false);
  const [person, setPerson] = useState({
    first_name: "",
    second_name: "",
    surname: "",
    second_surname: "",
    rfc: "",
    department_name: "",
  });

  const [isRfcLongEnough, setIsRfcLongEnough] = useState(true);

  const [focus, setFocus] = useState({
    first_name: false,
    second_name: false,
    surname: false,
    second_surname: false,
    rfc: false,
  });

  const [isEmpty, setIsEmpty] = useState({
    first_name: false,
    second_name: false,
    surname: false,
    second_surname: false,
    rfc: false,
    department_name: false,
  });

  const [ref, setRef] = useState({
    first_name: useRef(null),
    surname: useRef(null),
    second_surname: useRef(null),
    rfc: useRef(null),
  });

  const getDepartments = async () => {
    const response = await fetchData("get", "/departments");
    setDepartments(response.data.departments);
  };

  useEffect(() => {
    setCurrentSection(3);
    getDepartments();
    ref.first_name.current.focus();
  }, []);

  const changePerson = (e) => {
    const attribute = e.target.id;
    let value = e.target.value;
    // Prevent inserting only blank spaces
    value = value.trimStart();
    if (attribute === "rfc") {
      // No blank spaces allowed in RFC
      if (value[value.length - 1] === " ") {
        value = value.slice(0, -1);
      }
      // RFC must be in Uppercases
      value = value.toUpperCase();
    } else {
      // Prevent inserting double blank spaces after any word
      if (value[value.length - 1] === " " && value[value.length - 2] === " ") {
        value = value.slice(0, -1);
      }
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
        if (prop === "rfc") setIsRfcLongEnough(true);
        setIsEmpty({
          ...isEmpty,
          [prop]: true,
        });
        if (prop !== "department_name") {
          setTimeout(() => {
            ref[prop].current.focus();
          }, 100);
        }
        return;
      }
    }
    // Check if RFC has 12 or 13 characters
    if (!(person.rfc.length <= 13 && person.rfc.length >= 12)) {
      setIsRfcLongEnough(false);
      setIsEmpty({
        ...isEmpty,
        rfc: true,
      });
      setTimeout(() => {
        ref.rfc.current.focus();
      }, 100);
    }
    // Add person
    try {
      const response = await fetchData("post", "/people", person);
      // Show message that informs the user the person has been updated successfully
    } catch (error) {
      // Show alert the person couldn't have been updated
    }
    // history.push("/");
  };
  return (
    <div>
      <h2>Agregar Persona</h2>
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
        <div
          className={
            focus.rfc
              ? isEmpty.rfc
                ? isRfcLongEnough
                  ? "add-input-container selected empty"
                  : "add-input-container selected wrong-rfc"
                : "add-input-container selected"
              : "add-input-container"
          }
        >
          <span className={person.rfc ? "" : "hide"}>RFC</span>
          <input
            type="text"
            id="rfc"
            value={person.rfc}
            ref={ref.rfc}
            onChange={changePerson}
            onFocus={() =>
              setFocus({
                ...focus,
                rfc: true,
              })
            }
            onBlur={() =>
              setFocus({
                ...focus,
                rfc: false,
              })
            }
          />
        </div>
        <div
          className={
            isEmpty.department_name
              ? "add-input-container department empty"
              : isFilterDepartmentExpanded
              ? "add-input-container department expanded"
              : "add-input-container department"
          }
        >
          <span className={person.department_name ? "" : "hide"}>Area</span>
          <div className="department-relative-container">
            <ul
              className="department-ul-container"
              style={
                isFilterDepartmentExpanded
                  ? person.department_name
                    ? {
                        minHeight: `${departments.length * 3.5}rem`,
                      }
                    : {
                        minHeight: `${(departments.length + 1) * 3.5}rem`,
                      }
                  : {}
              }
              onClick={() => {
                setIsFilterDepartmentExpanded(!isFilterDepartmentExpanded);
              }}
            >
              <li
                className="selected"
                id="department_name"
                onClick={(e) => {
                  setIsFilterDepartmentExpanded(!isFilterDepartmentExpanded);
                  setPerson({
                    ...person,
                    department_name: person.department_name,
                  });
                  setIsEmpty({ ...isEmpty, department_name: false });
                }}
              >
                {person.department_name}
              </li>
              {departments.map((department) => {
                const { id, department_name } = department;
                if (department_name !== person.department_name) {
                  return (
                    <li
                      key={id}
                      id="department_name"
                      className={
                        person.department_name === department_name
                          ? "selected"
                          : ""
                      }
                      onClick={(e) => {
                        setIsFilterDepartmentExpanded(
                          !isFilterDepartmentExpanded
                        );
                        setPerson({
                          ...person,
                          department_name: department_name,
                        });
                        setIsEmpty({ ...isEmpty, department_name: false });
                      }}
                    >
                      {department_name}
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        </div>

        <button type="submit" className="add-btn">
          Agregar
        </button>
      </form>
    </div>
  );
};

export default AddPerson;
