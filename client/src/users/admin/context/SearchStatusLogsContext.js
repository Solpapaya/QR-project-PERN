import React, { useState, createContext } from "react";

export const SearchStatusLogsContext = createContext();

export const SearchStatusLogsContextProvider = (props) => {
  const [isSearchSuccessful, setIsSearchSuccessful] = useState(true);
  const [initialSearch, setInitialSearch] = useState(false);
  const [yearFilter, setYearFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusLogs, setStatusLogs] = useState([]);
  const [filteredStatusLogs, setFilteredStatusLogs] = useState(statusLogs);
  //   const [sort, setSort] = useState("surname");

  return (
    <SearchStatusLogsContext.Provider
      value={{
        isSearchSuccessful,
        setIsSearchSuccessful,
        initialSearch,
        setInitialSearch,
        yearFilter,
        setYearFilter,
        monthFilter,
        setMonthFilter,
        statusFilter,
        setStatusFilter,
        statusLogs,
        setStatusLogs,
        filteredStatusLogs,
        setFilteredStatusLogs,
        // sort,
        // setSort,
      }}
    >
      {props.children}
    </SearchStatusLogsContext.Provider>
  );
};
