import React, { useState, createContext } from "react";

export const CurrentSectionContext = createContext();

export const CurrentSectionContextProvider = (props) => {
  const [currentSection, setCurrentSection] = useState(1);
  return (
    <CurrentSectionContext.Provider
      value={{
        currentSection,
        setCurrentSection,
      }}
    >
      {props.children}
    </CurrentSectionContext.Provider>
  );
};
