import React, { useContext } from "react";
import { SearchSubsectionContext } from "../context/SearchSubsectionContext";

const SearchSubsections = () => {
  const { searchSection, setSearchSection } = useContext(
    SearchSubsectionContext
  );
  return (
    <div className="subsection-container">
      <div
        onClick={() => setSearchSection(1)}
        className={searchSection === 1 ? "subsection selected" : "subsection"}
      >
        Personas
      </div>
      <div
        onClick={() => setSearchSection(2)}
        className={searchSection === 2 ? "subsection selected" : "subsection"}
      >
        Comprobantes Fiscales
      </div>
    </div>
  );
};

export default SearchSubsections;
