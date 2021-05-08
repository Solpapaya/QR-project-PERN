import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import PersonTaxReceiptFilter from "../components/PersonTaxReceiptFilter";
import PersonSubsections from "../components/PersonSubsections";
import PersonTaxReceiptsContainer from "../components/PersonTaxReceiptsContainer";
import { PersonDetailFilterContextProvider } from "../context/PersonDetailFilterContext";
import { PersonTaxReceiptsContext } from "../context/PersonTaxReceiptsContext";
import { PersonSubsectionContext } from "../context/PersonSubsectionContext";
import { PersonStatusLogsContext } from "../context/PersonStatusLogsContext";
import { fetchData } from "../functions/fetchData";
import PersonStatusLogFilter from "../components/PersonStatusLogFilter";
import PersonStatusLogsContainer from "../components/PersonStatusLogsContainer";
import { CurrentSectionContext } from "../context/CurrentSectionContext";

const PersonDetailPage = () => {
  const { setCurrentSection } = useContext(CurrentSectionContext);

  const {
    setTaxReceipts,
    taxInitialSearch,
    setTaxInitialSearch,
    setGotTaxes,
  } = useContext(PersonTaxReceiptsContext);

  const {
    setStatusLogs,
    logInitialSearch,
    setLogInitialSearch,
    setGotLogs,
  } = useContext(PersonStatusLogsContext);

  const { personSection } = useContext(PersonSubsectionContext);

  const [person, setPerson] = useState({
    first_name: "",
    second_name: "",
    surname: "",
    second_surname: "",
    rfc: "",
  });
  const rfcParam = useParams().rfc;

  const getPerson = async () => {
    const response = await fetchData("get", `/people/${rfcParam}`);
    const foundPerson = response.data.person;
    if (foundPerson.second_name) setPerson({ ...foundPerson });
    else setPerson({ ...foundPerson, second_name: "" });
  };

  const getAllTaxReceipts = async () => {
    try {
      const response = await fetchData("get", `/taxreceipts/${rfcParam}`);
      setTaxReceipts(response.data.tax_receipts);
      setGotTaxes(true);
      setTaxInitialSearch(true);
    } catch (err) {
      // No tax receipts for that person
      setGotTaxes(false);
      setTaxInitialSearch(true);
    }
  };

  const getAllStatusLogs = async () => {
    try {
      const response = await fetchData("get", `/statuslogs/${rfcParam}`);
      setStatusLogs(response.data.tax_receipts);
      setGotLogs(true);
      setLogInitialSearch(true);
    } catch (err) {
      // No tax receipts for that person
      setGotLogs(false);
      setLogInitialSearch(true);
    }
  };

  useEffect(() => {
    setCurrentSection(1);
    getPerson();
    getAllTaxReceipts();
    getAllStatusLogs();
  }, []);
  return (
    <div>
      <h2>{`${person.first_name} ${person.second_name} ${person.surname} ${person.second_surname}`}</h2>
      <h4>{person.rfc}</h4>
      <PersonSubsections />
      <PersonDetailFilterContextProvider>
        {personSection === 1 ? (
          <>
            <PersonTaxReceiptFilter />
            {taxInitialSearch && <PersonTaxReceiptsContainer />}
          </>
        ) : (
          <>
            <PersonStatusLogFilter />
            {logInitialSearch && <PersonStatusLogsContainer />}
          </>
        )}
      </PersonDetailFilterContextProvider>
    </div>
  );
};

export default PersonDetailPage;
