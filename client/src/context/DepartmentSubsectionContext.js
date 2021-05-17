import React, { useState, createContext } from "react";

export const DepartmentSubsectionContext = createContext();

export const DepartmentSubsectionContextProvider = (props) => {
  const [departmentSection, setDepartmentSection] = useState(
    parseInt(localStorage.getItem("departmentSubsection")) || 1
  );

  return (
    <DepartmentSubsectionContext.Provider
      value={{ departmentSection, setDepartmentSection }}
    >
      {props.children}
    </DepartmentSubsectionContext.Provider>
  );
};
