import React, { useContext } from "react";
import { PersonSubsectionContext } from "../context/PersonSubsectionContext";

const PersonSubsections = () => {
  const { personSection, setPersonSection } = useContext(
    PersonSubsectionContext
  );
  return (
    <div className="subsection-container">
      <div
        onClick={() => {
          localStorage.setItem("personSubsection", 1);
          setPersonSection(1);
        }}
        className={personSection === 1 ? "subsection selected" : "subsection"}
      >
        Comprobantes Fiscales
      </div>
      <div
        onClick={() => {
          localStorage.setItem("personSubsection", 2);
          setPersonSection(2);
        }}
        className={personSection === 2 ? "subsection selected" : "subsection"}
      >
        Cambios de Estado
      </div>
    </div>
  );
};

export default PersonSubsections;
