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
    </div>
  );
};

export default DeletedSubsections;
