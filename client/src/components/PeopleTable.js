import React, { useContext } from "react";
import { PeopleContext } from "../context/PeopleContext";
import { useHistory } from "react-router-dom";
import { fetchData } from "../functions/fetchData";

const PeopleTable = () => {
  const { people, setPeople, filteredPeople } = useContext(PeopleContext);

  let history = useHistory();

  const disableHandler = async (e, person) => {
    e.stopPropagation();
    const { rfc } = person;
    const newPerson = { ...person, active: !person.active };
    try {
      const response = await fetchData("put", `/people/${rfc}`, newPerson);
      console.log(response);
      const newPeople = people.map((person) => {
        if (person.rfc === rfc) {
          return { ...person, active: !person.active };
        }
        return person;
      });
      setPeople(newPeople);
    } catch (err) {
      // Create Alert
      console.log(err);
    }
  };

  const updateHandler = (e, rfc) => {
    e.stopPropagation();
    history.push(`/people/${rfc}/update`);
  };

  const personSelectHandler = (rfc) => {
    history.push(`/people/${rfc}`);
  };

  return (
    <table className="table table-hover table-dark">
      <thead>
        <tr className="bg-primary">
          <th scope="col">Primer Nombre</th>
          <th scope="col">Segundo Nombre</th>
          <th scope="col">Primer Apellido</th>
          <th scope="col">Segundo Apellido</th>
          <th scope="col">RFC</th>
          <th scope="col">Activo</th>
          <th scope="col">Editar</th>
          <th scope="col">Deshabilitar</th>
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
                  Deshabilitar
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
