import React, { useState, createContext } from "react";

export const CurrentSectionContext = createContext();

export const CurrentSectionContextProvider = (props) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [isEditPersonSection, setIsEditPersonSection] = useState(false);
  return (
    <CurrentSectionContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        isEditPersonSection,
        setIsEditPersonSection,
      }}
    >
      {props.children}
    </CurrentSectionContext.Provider>
  );
};
