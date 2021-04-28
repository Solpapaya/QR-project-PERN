import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import PeopleFinder from "../apis/PeopleFinder";

const UpdatePerson = () => {
  const rfcParam = useParams().rfc;
  let history = useHistory();
  const [person, setPerson] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    rfc: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await PeopleFinder.get(`/people/${rfcParam}`);
      const foundPerson = response.data.data.person;
      if (foundPerson.segundo_nombre) {
        setPerson({ ...foundPerson });
      } else {
        setPerson({ ...foundPerson, segundo_nombre: "" });
      }
    };

    fetchData();
  }, []);

  const changePerson = (e) => {
    const attribute = e.target.id;
    const value = e.target.value;
    setPerson({ ...person, [attribute]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await PeopleFinder.put(`/people/${rfcParam}`, {
      firstName: person.primer_nombre,
      secondName: person.segundo_nombre,
      surname: person.primer_apellido,
      secondSurname: person.segundo_apellido,
      rfc: person.rfc,
    });
    history.push("/");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="primer_nombre">Primer Nombre : </label>
          <input
            type="text"
            className="form-control"
            id="primer_nombre"
            value={person.primer_nombre}
            onChange={changePerson}
          />
        </div>
        <div className="form-group">
          <label htmlFor="segundo_nombre">Segundo Nombre : </label>
          <input
            type="text"
            className="form-control"
            id="segundo_nombre"
            value={person.segundo_nombre}
            onChange={changePerson}
          />
        </div>
        <div className="form-group">
          <label htmlFor="primer_apellido">Primer Apellido : </label>
          <input
            type="text"
            className="form-control"
            id="primer_apellido"
            value={person.primer_apellido}
            onChange={changePerson}
          />
        </div>
        <div className="form-group">
          <label htmlFor="segundo_apellido">Segundo Apellido : </label>
          <input
            type="text"
            className="form-control"
            id="segundo_apellido"
            value={person.segundo_apellido}
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
