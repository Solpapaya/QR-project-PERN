import React, { useContext } from "react";
import { SearchSubsectionContext } from "../context/SearchSubsectionContext";

const SearchSubsections = () => {
  const { searchSection, setSearchSection } = useContext(
    SearchSubsectionContext
  );
  return (
    <div className="subsection-container">
      <div
        onClick={() => {
          localStorage.setItem("searchSubsection", 1);
          setSearchSection(1);
        }}
        className={searchSection === 1 ? "subsection selected" : "subsection"}
      >
        Personas
      </div>
      <div
        onClick={() => {
          localStorage.setItem("searchSubsection", 2);
          setSearchSection(2);
        }}
        className={searchSection === 2 ? "subsection selected" : "subsection"}
      >
        Comprobantes Fiscales
      </div>
      <div
        onClick={() => {
          localStorage.setItem("searchSubsection", 3);
          setSearchSection(3);
        }}
        className={searchSection === 3 ? "subsection selected" : "subsection"}
      >
        Cambios de Estado
      </div>
    </div>
  );
};

export default SearchSubsections;
