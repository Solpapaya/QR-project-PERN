import React, { useState, createContext } from "react";

export const DeletedSubsectionContext = createContext();

export const DeletedSubsectionContextProvider = (props) => {
  const [deletedSection, setDeletedSection] = useState(
    parseInt(localStorage.getItem("deletedSubsection")) || 1
  );

  return (
    <DeletedSubsectionContext.Provider
      value={{ deletedSection, setDeletedSection }}
    >
      {props.children}
    </DeletedSubsectionContext.Provider>
  );
};
