import React, { useState, createContext } from "react";

export const SearchContext = createContext();

export const SearchContextProvider = (props) => {
  const [isSearchSuccessful, setIsSearchSuccessful] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all_areas");
  const [sort, setSort] = useState("surname");

  return (
    <SearchContext.Provider
      value={{
        isSearchSuccessful,
        setIsSearchSuccessful,
        statusFilter,
        setStatusFilter,
        departmentFilter,
        setDepartmentFilter,
        sort,
        setSort,
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};
