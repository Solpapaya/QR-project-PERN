import React, { useContext } from "react";
import { DeletedSubsectionContext } from "../context/DeletedSubsectionContext";

const DeletedSubsections = () => {
  const { deletedSection, setDeletedSection } = useContext(
    DeletedSubsectionContext
  );
  return (
    <div className="subsection-container">
      <div
        onClick={() => {
          localStorage.setItem("deletedSubsection", 1);
          setDeletedSection(1);
        }}
        className={deletedSection === 1 ? "subsection selected" : "subsection"}
      >
        Comprobantes Fiscales
      </div>
      <div
        onClick={() => {
          localStorage.setItem("deletedSubsection", 2);
          setDeletedSection(2);
        }}
        className={deletedSection === 2 ? "subsection selected" : "subsection"}
      >
        Usuarios
      </div>
    </div>
  );
};

export default DeletedSubsections;
