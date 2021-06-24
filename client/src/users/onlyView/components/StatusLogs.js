import React, { useContext, useEffect } from "react";
import { SearchStatusLogsContext } from "../context/SearchStatusLogsContext";
import { fetchData } from "../../../global/functions/fetchData";
import SearchStatusLogFilter from "./SearchStatusLogFilter";
import StatusLogsList from "./StatusLogsList";

const StatusLogs = () => {
  const {
    initialSearch,
    setInitialSearch,
    setStatusLogs,
    setIsSearchSuccessful,
  } = useContext(SearchStatusLogsContext);

  const getAllStatusLogs = async () => {
    try {
      const response = await fetchData("get", "/statuslogs");
      setStatusLogs(response.data.status_logs);
      setIsSearchSuccessful(true);
    } catch (err) {
      setIsSearchSuccessful(false);
    }
    setInitialSearch(true);
  };

  useEffect(() => {
    getAllStatusLogs();
  }, []);

  return (
    <>
      {initialSearch && (
        <>
          <SearchStatusLogFilter />
          <StatusLogsList />
        </>
      )}
    </>
  );
};

export default StatusLogs;
