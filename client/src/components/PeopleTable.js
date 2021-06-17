import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { fetchData } from "../functions/fetchData";
import { compareValues } from "../functions/compareValues";
import { ReactComponent as Pencil } from "../icons/pencil.svg";
import { ReactComponent as Switch } from "../icons/switch.svg";
import { SearchContext } from "../context/SearchContext";
import { MonthsContext } from "../context/MonthsContext";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import { AlertContext } from "../context/AlertContext";

const PeopleTable = () => {
  const [person, setPerson] = useState({});
  const { sort, people, setPeople, filteredPeople } = useContext(SearchContext);
  const { months } = useContext(MonthsContext);
  const { setIsEditPersonSection } = useContext(CurrentSectionContext);
  const { setAlert, setShowAlert } = useContext(AlertContext);
  const {
    showWarning,
    setShowWarning,
    warning,
    setWarning,
    // setWarningFunction,
    warningOk,
    setWarningOk,
  } = useContext(AlertContext);

  let history = useHistory();

  const changePersonStatus = async () => {
    const { rfc } = person;
    const newActive = { active: !person.active };
    try {
      const response = await fetchData(
        "put",
        `/people/${rfc}?field=active`,
        newActive
      );
      setAlert({
        success: true,
        msg: "Se ha cambiado correctamente el estado de la persona",
      });
      setShowAlert(true);
      const newPeople = people.map((person) => {
        if (person.rfc === rfc) {
          return { ...person, active: !person.active };
        }
        return person;
      });
      setPeople(newPeople);
    } catch (err) {
      // Create Alert
      setAlert({ success: false, msg: err.data.msg });
      setShowAlert(true);
    }
    setWarningOk(false);
  };

  const changeStatusHandler = async (e, person) => {
    e.stopPropagation();
    setPerson(person);
    let personNextStatus;
    if (person.active) personNextStatus = "Desactivar";
    else personNextStatus = "Activar";
    let personName = `${person.first_name}`;
    if (person.second_name) personName += ` ${person.second_name}`;
    personName += ` ${person.surname} ${person.second_surname}`;
    const msg = `¿Estás seguro de que quieres ${personNextStatus} a ${personName}`;
    // setWarningFunction({ fun: changePersonStatus, params: person });
    setWarning(msg);
    setShowWarning(true);
  };

  const updateHandler = (e, rfc) => {
    e.stopPropagation();
    setIsEditPersonSection(true);
    history.push(`/people/${rfc}/update`);
  };

  const personSelectHandler = (rfc) => {
    history.push(`/people/${rfc}`);
  };

  const sortPeople = () => {
    let sortedPeople = [];
    sortedPeople = [...people].sort(compareValues(sort));
    setPeople(sortedPeople);
  };

  useEffect(() => {
    sortPeople();
  }, [sort]);

  useEffect(() => {
    warningOk && changePersonStatus();
  }, [warningOk]);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>
            <div className="flex-column">
              <span>Primer </span> <span>Nombre</span>
            </div>
          </th>
          <th>
            <div className="flex-column">
              <span>Segundo </span> <span>Nombre</span>
            </div>
          </th>
          <th>
            <div className="flex-column">
              <span>Primer </span> <span>Apellido</span>
            </div>
          </th>
          <th>
            <div className="flex-column">
              <span>Segundo </span> <span>Apellido</span>
            </div>
          </th>
          <th className="center-column">RFC</th>
          <th className="center-column">Area</th>
          <th className="center-column">
            <div className="flex-column">
              <span>Fecha</span> <span>de Alta</span>
            </div>
          </th>
          <th className="center-column">Estado</th>
          <th className="center-column">Editar</th>
          <th className="center-column">
            <div className="flex-column">
              <span>Activar </span> <span>Desactivar</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredPeople.map((person) => {
          const {
            id,
            first_name,
            second_name,
            surname,
            second_surname,
            rfc,
            active,
            department_name,
            creation_date,
          } = person;
          const splittedDate = creation_date.split("/");
          const formattedDate = `${months[parseInt(splittedDate[1]) - 1]} ${
            splittedDate[0]
          }, ${splittedDate[2]}`;
          return (
            <tr
              key={id}
              className="person-row"
              onClick={() => personSelectHandler(rfc)}
            >
              <td>{first_name}</td>
              <td>{second_name}</td>
              <td>{surname}</td>
              <td>{second_surname}</td>
              <td className="center-column">{rfc}</td>
              <td className="center-column">
                <div className="flex-column">
                  {department_name ? (
                    department_name
                      .split(" ")
                      .map((name, index) => <span key={index}>{name}</span>)
                  ) : (
                    <>
                      <span>Sin</span>
                      <span>Asignar</span>
                    </>
                  )}
                </div>
              </td>
              <td className="center-column">{formattedDate}</td>
              <td>
                <div className="person-status">
                  {active ? (
                    <>
                      <span className="icon active"></span>
                      <span className="status-text">Activo</span>
                    </>
                  ) : (
                    <>
                      <span className="icon disabled"></span>
                      <span className="status-text">Inactivo</span>
                    </>
                  )}
                </div>
              </td>
              <td>
                <div className="center-container">
                  <button
                    className="table-btn edit-btn"
                    onClick={(e) => updateHandler(e, rfc)}
                  >
                    <Pencil />
                  </button>
                </div>
              </td>
              <td>
                <div className="center-container">
                  <button
                    onClick={(e) => changeStatusHandler(e, { ...person })}
                    className="table-btn switch-btn"
                  >
                    <Switch />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PeopleTable;
