import React, { useEffect, useContext } from "react";
import { PersonStatusLogsContext } from "../context/PersonStatusLogsContext";
import { MonthsContext } from "../../../global/context/MonthsContext";
import PersonStatusLogsTable from "./PersonStatusLogsTable";

const PersonStatusLogsList = () => {
  const {
    statusLogs,
    setGotLogs,
    gotLogs,
    setFilteredStatusLogs,
    yearStatusLogFilter,
    monthStatusLogFilter,
    statusFilter,
  } = useContext(PersonStatusLogsContext);

  const { months } = useContext(MonthsContext);

  const filterStatusLogs = () => {
    let newStatusLogs = [];
    if (monthStatusLogFilter === "all") {
      newStatusLogs = [...statusLogs];
    } else {
      const month = months.indexOf(monthStatusLogFilter) + 1;
      newStatusLogs = statusLogs.filter(
        (log) => parseInt(log.date.split("/")[1]) === month
      );
    }
    if (yearStatusLogFilter === "all") {
      newStatusLogs = [...newStatusLogs];
    } else {
      newStatusLogs = newStatusLogs.filter((log) => {
        return parseInt(log.date.split("/")[2]) === yearStatusLogFilter;
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
    if (newStatusLogs.length === 0) setGotLogs(false);
    else setGotLogs(true);
  };

  useEffect(() => {
    filterStatusLogs();
  }, [yearStatusLogFilter, monthStatusLogFilter, statusFilter, statusLogs]);

  return (
    <div>
      {gotLogs ? (
        <PersonStatusLogsTable />
      ) : (
        "Esta persona no tiene cambios de estado"
      )}
    </div>
  );
};

export default PersonStatusLogsList;
