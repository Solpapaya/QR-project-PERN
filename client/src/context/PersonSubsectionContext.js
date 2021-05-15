import React, { useState, createContext } from "react";

export const PersonSubsectionContext = createContext();

export const PersonSubsectionContextProvider = (props) => {
  const [personSection, setPersonSection] = useState(
    parseInt(localStorage.getItem("personSubsection")) || 1
  );

  return (
    <PersonSubsectionContext.Provider
      value={{ personSection, setPersonSection }}
    >
      {props.children}
    </PersonSubsectionContext.Provider>
  );
};
