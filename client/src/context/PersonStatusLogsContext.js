import React, { useState, createContext } from "react";

export const PersonStatusLogsContext = createContext();

export const PersonStatusLogsContextProvider = (props) => {
  const [logInitialSearch, setLogInitialSearch] = useState(false);
  const [statusLogs, setStatusLogs] = useState([]);
  const [filteredStatusLogs, setFilteredStatusLogs] = useState([]);
  const [gotLogs, setGotLogs] = useState(false);

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
      }}
    >
      {props.children}
    </PersonStatusLogsContext.Provider>
  );
};
