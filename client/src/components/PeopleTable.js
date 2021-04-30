import React, { useContext, useState } from "react";
import { PeopleContext } from "../context/PeopleContext";
import { useHistory } from "react-router-dom";
import { fetchData } from "../functions/fetchData";
import { compareValues } from "../functions/compareValues";

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
    <table className="table table-hover table-dark">
      <thead>
        <tr className="bg-primary">
          <th onClick={sort} scope="col">
            Primer Nombre
          </th>
          <th onClick={sort} scope="col">
            Segundo Nombre
          </th>
          <th onClick={sort} scope="col">
            Primer Apellido
          </th>
          <th onClick={sort} scope="col">
            Segundo Apellido
          </th>
          <th onClick={sort} scope="col">
            RFC
          </th>
          <th scope="col">Activo</th>
          <th scope="col">Editar</th>
          <th scope="col">Habilitar / Deshabilitar</th>
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
              <td>{rfc}</td>
              <td>{active ? "1" : "0"}</td>
              <td>
                <button
                  onClick={(e) => updateHandler(e, rfc)}
                  className="btn btn-warning"
                >
                  Editar
                </button>
              </td>
              <td>
                <button
                  onClick={(e) => disableHandler(e, { ...person })}
                  className="btn btn-danger"
                >
                  {active ? "Deshabilitar" : "Habilitar"}
                </button>
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
