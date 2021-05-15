import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { fetchData } from "../functions/fetchData";
import PersonStatusLogsList from "./PersonStatusLogsList";
import PersonStatusLogFilter from "./PersonStatusLogFilter";
import { PersonStatusLogsContext } from "../context/PersonStatusLogsContext";

const PersonStatusLog = () => {
  const { setStatusLogs, logInitialSearch, setLogInitialSearch, setGotLogs } =
    useContext(PersonStatusLogsContext);

  const rfcParam = useParams().rfc;

  const getAllStatusLogs = async () => {
    try {
      const response = await fetchData("get", `/statuslogs/${rfcParam}`);
      setStatusLogs(response.data.tax_receipts);
      setGotLogs(true);
    } catch (err) {
      // No tax receipts for that person
      setGotLogs(false);
    }
    setLogInitialSearch(true);
  };

  useEffect(() => {
    getAllStatusLogs();
  }, []);
  return (
    <>
      <PersonStatusLogFilter />
      {logInitialSearch && <PersonStatusLogsList />}
    </>
  );
};

export default PersonStatusLog;
