import React, { useContext } from "react";
import { DepartmentSubsectionContext } from "../context/DepartmentSubsectionContext";

const DepartmentSubsections = () => {
  const { departmentSection, setDepartmentSection } = useContext(
    DepartmentSubsectionContext
  );
  return (
    <div className="subsection-container">
      <div
        onClick={() => {
          localStorage.setItem("departmentSubsection", 1);
          setDepartmentSection(1);
        }}
        className={
          departmentSection === 1 ? "subsection selected" : "subsection"
        }
      >
        Agregar Area
      </div>
      <div
        onClick={() => {
          localStorage.setItem("departmentSubsection", 2);
          setDepartmentSection(2);
        }}
        className={
          departmentSection === 2 ? "subsection selected" : "subsection"
        }
      >
        Editar Areas
      </div>
    </div>
  );
};

export default DepartmentSubsections;
