import React, { useContext, useState } from "react";
import { PeopleContext } from "../context/PeopleContext";
import { useHistory } from "react-router-dom";
import { fetchData } from "../functions/fetchData";
import { compareValues } from "../functions/compareValues";
import { ReactComponent as Pencil } from "../icons/pencil.svg";
import { ReactComponent as Switch } from "../icons/switch.svg";

const PeopleTable = () => {
  const { people, setPeople, filteredPeople } = useContext(PeopleContext);
  const [lastSort, setLastSort] = useState("Primer Apellido");

  let history = useHistory();

  const disableHandler = async (e, person) => {
    e.stopPropagation();
    const { rfc } = person;
    const newPerson = { ...person, active: !person.active };
    try {
      const response = await fetchData("put", `/people/${rfc}`, newPerson);
      // console.log(response);
      const newPeople = people.map((person) => {
        if (person.rfc === rfc) {
          return { ...person, active: !person.active };
        }
        return person;
      });
      setPeople(newPeople);
    } catch (err) {
      // Create Alert
      // console.log(err);
    }
  };

  const updateHandler = (e, rfc) => {
    e.stopPropagation();
    history.push(`/people/${rfc}/update`);
  };

  const personSelectHandler = (rfc) => {
    history.push(`/people/${rfc}`);
  };

  const sort = (e) => {
    const sortBy = e.target.textContent;
    if (sortBy !== lastSort) {
      let sortedPeople = [];
      switch (sortBy) {
        case "Primer Nombre":
          sortedPeople = [...people].sort(compareValues("first_name"));
          break;
        case "Segundo Nombre":
          sortedPeople = [...people].sort(compareValues("second_name"));
          break;
        case "Primer Apellido":
          sortedPeople = [...people].sort(compareValues("surname"));
          break;
        case "Segundo Apellido":
          sortedPeople = [...people].sort(compareValues("second_surname"));
          break;
        case "RFC":
          sortedPeople = [...people].sort(compareValues("rfc"));
          break;
      }
      setLastSort(sortBy);
      setPeople(sortedPeople);
    }
  };

  return (
    <table className="table">
      <thead>
        <tr className="bg-primary">
          <th onClick={sort}>
            <div className="column-title-container">
              <span>Primer </span> <span>Nombre</span>
            </div>
          </th>
          <th onClick={sort}>
            <div className="column-title-container">
              <span>Segundo </span> <span>Nombre</span>
            </div>
          </th>
          <th onClick={sort}>
            <div className="column-title-container">
              <span>Primer </span> <span>Apellido</span>
            </div>
          </th>
          <th onClick={sort}>
            <div className="column-title-container">
              <span>Segundo </span> <span>Apellido</span>
            </div>
          </th>
          <th className="center-column" onClick={sort}>
            RFC
          </th>
          <th>Estado</th>
          <th className="center-column">Editar</th>
          <th className="center-column">
            <div className="column-title-container">
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
          } = person;
          return (
            <tr onClick={() => personSelectHandler(rfc)} key={id}>
              <td>{first_name}</td>
              <td>{second_name}</td>
              <td>{surname}</td>
              <td>{second_surname}</td>
              <td className="center-column">{rfc}</td>
              <td className="person-status">
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
                    onClick={(e) => disableHandler(e, { ...person })}
                    className="table-btn switch-btn"
                  >
                    <Switch />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
        {/* <tr>
            <td>Daniel</td>
            <td>Rafael</td>
            <td>Solorio</td>
            <td>Paredes</td>
            <td>SOPD970125HDF</td>
            <td>
              <button className="btn btn-warning">Update</button>
            </td>
            <td>
              <button className="btn btn-danger">Delete</button>
            </td>
          </tr>
          <tr>
            <td>Daniel</td>
            <td>Rafael</td>
            <td>Solorio</td>
            <td>Paredes</td>
            <td>SOPD970125HDF</td>
            <td>
              <button className="btn btn-warning">Update</button>
            </td>
            <td>
              <button className="btn btn-danger">Delete</button>
            </td>
          </tr> */}
      </tbody>
    </table>
  );
};

export default PeopleTable;
