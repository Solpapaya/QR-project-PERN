import React, { useEffect, useContext } from "react";
import { MonthsContext } from "../context/MonthsContext";
import { SearchStatusLogsContext } from "../context/SearchStatusLogsContext";
import StatusLogsTable from "./StatusLogsTable";

const StatusLogsList = () => {
  const {
    statusLogs,
    isSearchSuccessful,
    setIsSearchSuccessful,
    yearFilter,
    monthFilter,
    statusFilter,
    setFilteredStatusLogs,
  } = useContext(SearchStatusLogsContext);

  const { months } = useContext(MonthsContext);

  const filterStatusLogs = () => {
    let newStatusLogs = [];
    if (monthFilter === "all") {
      newStatusLogs = [...statusLogs];
    } else {
      const month = months.indexOf(monthFilter) + 1;
      newStatusLogs = statusLogs.filter(
        (log) => parseInt(log.date.split("/")[1]) === month
      );
    }
    if (yearFilter === "all") {
      newStatusLogs = [...newStatusLogs];
    } else {
      newStatusLogs = newStatusLogs.filter((log) => {
        return parseInt(log.date.split("/")[2]) === yearFilter;
      });
    }
    if (statusFilter === "all") {
      newStatusLogs = [...newStatusLogs];
    } else if (statusFilter === "active") {
      newStatusLogs = newStatusLogs.filter((log) => log.new_status);
    } else {
      newStatusLogs = newStatusLogs.filter((log) => !log.new_status);
    }
    setFilteredStatusLogs(newStatusLogs);
    if (newStatusLogs.length === 0) setIsSearchSuccessful(false);
    else setIsSearchSuccessful(true);
  };

  useEffect(() => {
    filterStatusLogs();
  }, [yearFilter, monthFilter, statusFilter, statusLogs]);

  return (
    <div className="table-container">
      {isSearchSuccessful ? <StatusLogsTable /> : "No Matches"}
    </div>
  );
};

export default StatusLogsList;
