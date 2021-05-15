import React, { useState, createContext } from "react";

export const SearchSubsectionContext = createContext();

export const SearchSubsectionContextProvider = (props) => {
  const [searchSection, setSearchSection] = useState(
    parseInt(localStorage.getItem("searchSubsection")) || 1
  );

  return (
    <SearchSubsectionContext.Provider
      value={{ searchSection, setSearchSection }}
    >
      {props.children}
    </SearchSubsectionContext.Provider>
  );
};
