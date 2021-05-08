import React, { useEffect, useContext, useState } from "react";
import { PersonStatusLogsContext } from "../context/PersonStatusLogsContext";
import { PersonDetailFilterContext } from "../context/PersonDetailFilterContext";
import PersonTaxReceiptsTable from "./PersonTaxReceiptsTable";
import { MonthsContext } from "../context/MonthsContext";
import PersonStatusLogsTable from "./PersonStatusLogsTable";

const PersonStatusLogsContainer = () => {
  const { statusLogs, setGotLogs, gotLogs, setFilteredStatusLogs } = useContext(
    PersonStatusLogsContext
  );
  const { yearStatusLogFilter, monthStatusLogFilter } = useContext(
    PersonDetailFilterContext
  );
  const { months } = useContext(MonthsContext);

  const filterStatusLogs = () => {
    let newStatusLogs = [];
    if (monthStatusLogFilter === "all") {
      newStatusLogs = [...statusLogs];
    } else {
      const month = months.indexOf(monthStatusLogFilter) + 1;
      newStatusLogs = statusLogs.filter((log) => log.month === month);
    }
    // if (yearStatusLogFilter === "all") {
    //   newStatusLogs = [...newStatusLogs];
    // } else {
    //   newStatusLogs = newStatusLogs.filter(
    //     (log) => log.year === yearStatusLogFilter
    //   );
    // }
    if (newStatusLogs.length === 0) {
      setGotLogs(false);
    } else {
      setFilteredStatusLogs(newStatusLogs);
      setGotLogs(true);
    }
  };

  useEffect(() => {
    filterStatusLogs();
  }, [yearStatusLogFilter, monthStatusLogFilter, statusLogs]);

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

export default PersonStatusLogsContainer;
