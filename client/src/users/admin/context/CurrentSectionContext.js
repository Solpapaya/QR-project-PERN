import React, { useState, createContext } from "react";

export const CurrentSectionContext = createContext();

export const CurrentSectionContextProvider = (props) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [isEditPersonSection, setIsEditPersonSection] = useState(false);
  const [isSpecificPerson, setIsSpecificPerson] = useState(false);
  return (
    <CurrentSectionContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        isEditPersonSection,
        setIsEditPersonSection,
        isSpecificPerson,
        setIsSpecificPerson,
      }}
    >
      {props.children}
    </CurrentSectionContext.Provider>
  );
};
