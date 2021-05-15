import React, { useState, createContext } from "react";

export const PersonStatusLogsContext = createContext();

export const PersonStatusLogsContextProvider = (props) => {
  const [logInitialSearch, setLogInitialSearch] = useState(false);
  const [statusLogs, setStatusLogs] = useState([]);
  const [filteredStatusLogs, setFilteredStatusLogs] = useState([]);
  const [gotLogs, setGotLogs] = useState(false);
  const [yearStatusLogFilter, setYearStatusLogFilter] = useState("all");
  const [monthStatusLogFilter, setMonthStatusLogFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <PersonStatusLogsContext.Provider
      value={{
        statusLogs,
        setStatusLogs,
        gotLogs,
        setGotLogs,
        logInitialSearch,
        setLogInitialSearch,
        filteredStatusLogs,
        setFilteredStatusLogs,
        yearStatusLogFilter,
        setYearStatusLogFilter,
        monthStatusLogFilter,
        setMonthStatusLogFilter,
        statusFilter,
        setStatusFilter,
      }}
    >
      {props.children}
    </PersonStatusLogsContext.Provider>
  );
};
