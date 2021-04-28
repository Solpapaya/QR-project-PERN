import React, { useState, createContext } from "react";

export const SearchContext = createContext();

export const SearchContextProvider = (props) => {
  const [isSearchSuccessful, setIsSearchSuccessful] = useState(true);
  const [filter, setFilter] = useState("all");

  return (
    <SearchContext.Provider
      value={{ isSearchSuccessful, setIsSearchSuccessful, filter, setFilter }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};
