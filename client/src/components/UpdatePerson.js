import React, { useContext, useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import PeopleFinder from "../apis/PeopleFinder";
import { fetchData } from "../functions/fetchData";

const UpdatePerson = () => {
  const rfcParam = useParams().rfc;
  let history = useHistory();
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
  });

  const [ref, setRef] = useState({
    first_name: useRef(null),
    surname: useRef(null),
    second_surname: useRef(null),
    rfc: useRef(null),
  });

  const getPerson = async () => {
    const response = await fetchData("get", `/people/${rfcParam}`);

    const foundPerson = response.data.person;
    if (foundPerson.second_name) {
      setPerson({ ...foundPerson });
    } else {
      setPerson({ ...foundPerson, second_name: "" });
    }
  };

  const getDepartments = async () => {
    const response = await fetchData("get", "/departments");
    setDepartments(response.data.departments);
  };

  useEffect(() => {
    getPerson();
    getDepartments();
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
      if (!person[prop] && prop !== "second_name") {
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
    // try {
    //   const response = await PeopleFinder.put(`/people/${rfcParam}`, person);
    //   // Show message that informs the user the person has been updated successfully
    // } catch (error) {
    //   // Show alert the person couldn't have been updated
    // }
    // // history.push("/");
  };

  return (
    <div>
      <form className="form update" onSubmit={handleSubmit}>
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
                ? "add-input-container selected empty"
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
            isFilterDepartmentExpanded
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
                  ? {
                      minHeight: `${departments.length * 3.5}rem`,
                    }
                  : {}
              }
              onClick={() => {
                setIsFilterDepartmentExpanded(!isFilterDepartmentExpanded);
              }}
            >
              <li
                className="selected"
                onClick={(e) => {
                  setIsFilterDepartmentExpanded(!isFilterDepartmentExpanded);
                  setPerson({
                    ...person,
                    department_name: person.department_name,
                  });
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
          Actualizar
        </button>
      </form>
    </div>
  );
};

export default UpdatePerson;
