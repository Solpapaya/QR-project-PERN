import React, { useState, createContext } from "react";

export const AddPersonSubsectionContext = createContext();

export const AddPersonSubsectionContextProvider = (props) => {
  const [addPersonSection, setAddPersonSection] = useState(
    parseInt(localStorage.getItem("addPersonSubsection")) || 1
  );

  return (
    <AddPersonSubsectionContext.Provider
      value={{ addPersonSection, setAddPersonSection }}
    >
      {props.children}
    </AddPersonSubsectionContext.Provider>
  );
};
