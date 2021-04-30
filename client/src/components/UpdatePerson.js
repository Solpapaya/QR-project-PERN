import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import PeopleFinder from "../apis/PeopleFinder";
import { fetchData } from "../functions/fetchData";

const UpdatePerson = () => {
  const rfcParam = useParams().rfc;
  let history = useHistory();
  const [person, setPerson] = useState({
    first_name: "",
    second_name: "",
    surname: "",
    second_surname: "",
    rfc: "",
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

  useEffect(() => {
    getPerson();
  }, []);

  const changePerson = (e) => {
    const attribute = e.target.id;
    const value = e.target.value;
    setPerson({ ...person, [attribute]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await PeopleFinder.put(`/people/${rfcParam}`, person);
      // Show message that informs the user the person has been updated successfully
    } catch (error) {
      // Show alert the person couldn't have been updated
    }
    // history.push("/");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">Primer Nombre : </label>
          <input
            type="text"
            className="form-control"
            id="first_name"
            value={person.first_name}
            onChange={changePerson}
          />
        </div>
        <div className="form-group">
          <label htmlFor="second_name">Segundo Nombre : </label>
          <input
            type="text"
            className="form-control"
            id="second_name"
            value={person.second_name}
            onChange={changePerson}
          />
        </div>
        <div className="form-group">
          <label htmlFor="surname">Primer Apellido : </label>
          <input
            type="text"
            className="form-control"
            id="surname"
            value={person.surname}
            onChange={changePerson}
          />
        </div>
        <div className="form-group">
          <label htmlFor="second_surname">Segundo Apellido : </label>
          <input
            type="text"
            className="form-control"
            id="second_surname"
            value={person.second_surname}
            onChange={changePerson}
          />
        </div>
        <div className="form-group">
          <label htmlFor="rfc">RFC : </label>
          <input
            type="text"
            className="form-control"
            id="rfc"
            value={person.rfc}
            onChange={changePerson}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          Agregar
        </button>
      </form>
    </div>
  );
};

export default UpdatePerson;
