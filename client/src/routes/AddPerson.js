import React, { useRef } from "react";
import { useHistory } from "react-router";
import PeopleFinder from "../apis/PeopleFinder";

const AddPerson = () => {
  const firstNameRef = useRef(null);
  const secondNameRef = useRef(null);
  const surnameRef = useRef(null);
  const secondSurnameRef = useRef(null);
  const rfcRef = useRef(null);

  let history = useHistory();

  const sumbitHandler = async (e) => {
    e.preventDefault();
    // console.log(firstNameRef.current.value);
    if (
      firstNameRef.current.value &&
      surnameRef.current.value &&
      secondSurnameRef.current.value &&
      rfcRef.current.value
    ) {
      await PeopleFinder.post("/people", {
        firstName: firstNameRef.current.value,
        secondName: secondNameRef.current.value,
        surname: surnameRef.current.value,
        secondSurname: secondSurnameRef.current.value,
        rfc: rfcRef.current.value,
      });
      // console.log(response);
      history.push("/");
    }
  };
  return (
    <div className="mt-4">
      <form onSubmit={sumbitHandler}>
        <div className="form-row">
          <div className="col mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Primer Nombre"
              ref={firstNameRef}
            />
          </div>
          <div className="col mt-2">
            <input
              type="text"
              className="form-control"
              placeholder="Segundo Nombre"
              ref={secondNameRef}
            />
          </div>
          <div className="col mt-2">
            <input
              type="text"
              className="form-control"
              placeholder="Primer Apellido"
              ref={surnameRef}
            />
          </div>
          <div className="col mt-2">
            <input
              type="text"
              className="form-control"
              placeholder="Segundo Apellido"
              ref={secondSurnameRef}
            />
          </div>
          <div className="col mt-2">
            <input
              type="text"
              className="form-control"
              placeholder="RFC"
              ref={rfcRef}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          Agregar
        </button>
      </form>
    </div>
  );
};

export default AddPerson;
