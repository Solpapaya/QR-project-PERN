import React, { useContext } from "react";
import { AddPersonSubsectionContext } from "../context/AddPersonSubsectionContext";

const AddPersonSubsections = () => {
  const { addPersonSection, setAddPersonSection } = useContext(
    AddPersonSubsectionContext
  );
  return (
    <div className="subsection-container">
      <div
        onClick={() => {
          localStorage.setItem("addPersonSubsection", 1);
          setAddPersonSection(1);
        }}
        className={
          addPersonSection === 1 ? "subsection selected" : "subsection"
        }
      >
        Agregar Persona
      </div>
      <div
        onClick={() => {
          localStorage.setItem("addPersonSubsection", 2);
          setAddPersonSection(2);
        }}
        className={
          addPersonSection === 2 ? "subsection selected" : "subsection"
        }
      >
        Agregar Usuario
      </div>
    </div>
  );
};

export default AddPersonSubsections;
