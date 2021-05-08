import React, { useRef, useEffect, useState, useContext } from "react";
import { useHistory } from "react-router";
import PeopleFinder from "../apis/PeopleFinder";
import InputEmpty from "../components/InputEmpty";
import { CurrentSectionContext } from "../context/CurrentSectionContext";

const AddPerson = () => {
  const { setCurrentSection } = useContext(CurrentSectionContext);
  const firstNameRef = useRef(null);
  const secondNameRef = useRef(null);
  const surnameRef = useRef(null);
  const secondSurnameRef = useRef(null);
  const rfcRef = useRef(null);
  const [rfcErrorMessage, setRfcErrorMessage] = useState("");
  const [isEmpty, setIsEmpty] = useState({
    first_name: false,
    surname: false,
    second_surname: false,
    rfc: false,
  });
  const [isCorrect, setIsCorrect] = useState({
    first_name: false,
    second_name: false,
    surname: false,
    second_surname: false,
    rfc: false,
  });

  let history = useHistory();

  const sumbitHandler = async (e) => {
    e.preventDefault();
    if (
      isCorrect.first_name &&
      isCorrect.second_name &&
      isCorrect.surname &&
      isCorrect.second_surname &&
      isCorrect.rfc
    ) {
      let second_name = "";
      if (secondNameRef.current.value === "") second_name = null;
      else second_name = secondNameRef.current.value;
      await PeopleFinder.post("/people", {
        first_name: firstNameRef.current.value,
        second_name,
        surname: surnameRef.current.value,
        second_surname: secondSurnameRef.current.value,
        rfc: rfcRef.current.value,
      });
      // console.log(response);
      setCurrentSection(1);
      history.push("/");
    } else {
      for (let prop in isCorrect) {
        if (isCorrect[prop] === false && prop !== "second_name") {
          const input = document.querySelector(`input[name=${prop}]`);
          setIsEmpty({ ...isEmpty, [prop]: true });
          input.focus();
          return;
        }
      }
    }
  };

  const checkInput = (e) => {
    const value = e.target.value;
    const input = e.target.name;

    if (input !== "second_name") {
      // if input is empty
      if (!value) {
        // Indicate user that the input can't be empty
        setIsEmpty({ ...isEmpty, [input]: true });
        setRfcErrorMessage("Necesitas Ingresar el RFC");
      } else {
        setIsEmpty({ ...isEmpty, [input]: false });
        setIsCorrect({ ...isCorrect, [input]: false });
      }
    }
    if (e.type === "blur") {
      if (value) {
        if (input === "rfc") {
          e.target.value = value.toUpperCase().trim();
        } else {
          e.target.value = value[0].toUpperCase() + value.slice(1);
          e.target.value = e.target.value.trim();
        }
      }
      if (input === "second_name") {
        setIsCorrect({ ...isCorrect, [input]: true });
      } else if (input !== "second_name" && value) {
        if (input === "rfc" && !(value.length <= 13 && value.length >= 12)) {
          setRfcErrorMessage("El RFC debe contener 12 o 13 caracteres");
          setIsEmpty({ ...isEmpty, [input]: true });
        } else {
          setIsCorrect({ ...isCorrect, [input]: true });
        }
      } else {
        setIsCorrect({ ...isCorrect, [input]: false });
      }
    }
  };

  useEffect(() => {
    setCurrentSection(3);
    firstNameRef.current.focus();
  }, []);

  return (
    <div className="add-person-container">
      <h2>Agregar Nueva Persona</h2>
      <form className="form" onSubmit={sumbitHandler}>
        <div
          className={
            isEmpty.first_name
              ? "add-input-container input-empty"
              : isCorrect.first_name
              ? "add-input-container input-correct"
              : "add-input-container"
          }
        >
          <input
            type="text"
            placeholder="Primer Nombre"
            ref={firstNameRef}
            name="first_name"
            onBlur={checkInput}
            onChange={checkInput}
          />
          <InputEmpty
            msg="Necesitas Ingresar el Primer Nombre"
            className={isEmpty.first_name ? "show" : "hide"}
          />
        </div>
        <div
          className={
            isCorrect.second_name
              ? "add-input-container input-correct"
              : "add-input-container"
          }
        >
          <input
            type="text"
            placeholder="Segundo Nombre"
            name="second_name"
            ref={secondNameRef}
            onBlur={checkInput}
          />
        </div>
        <div
          className={
            isEmpty.surname
              ? "add-input-container input-empty"
              : isCorrect.surname
              ? "add-input-container input-correct"
              : "add-input-container"
          }
        >
          <input
            type="text"
            placeholder="Primer Apellido"
            ref={surnameRef}
            name="surname"
            onBlur={checkInput}
            onChange={checkInput}
          />
          <InputEmpty
            msg="Necesitas Ingresar el Primer Apellido"
            className={isEmpty.surname ? "show" : "hide"}
          />
        </div>
        <div
          className={
            isEmpty.second_surname
              ? "add-input-container input-empty"
              : isCorrect.second_surname
              ? "add-input-container input-correct"
              : "add-input-container"
          }
        >
          <input
            type="text"
            placeholder="Segundo Apellido"
            ref={secondSurnameRef}
            name="second_surname"
            onBlur={checkInput}
            onChange={checkInput}
          />
          <InputEmpty
            msg="Necesitas Ingresar el Segundo Apellido"
            className={isEmpty.second_surname ? "show" : "hide"}
          />
        </div>
        <div
          className={
            isEmpty.rfc
              ? "add-input-container input-empty"
              : isCorrect.rfc
              ? "add-input-container input-correct"
              : "add-input-container"
          }
        >
          <input
            type="text"
            placeholder="RFC"
            ref={rfcRef}
            name="rfc"
            onBlur={checkInput}
            onChange={checkInput}
          />
          <InputEmpty
            msg={rfcErrorMessage}
            className={isEmpty.rfc ? "show" : "hide"}
          />
        </div>
        <button type="submit" className="add-btn">
          Agregar
        </button>
      </form>
    </div>
  );
};

export default AddPerson;
