import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import PersonSubsections from "../components/PersonSubsections";
import { PersonSubsectionContext } from "../context/PersonSubsectionContext";
import { fetchData } from "../../../global/functions/fetchData";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import PersonTaxReceipt from "../components/PersonTaxReceipt";
import { PersonTaxReceiptsContextProvider } from "../context/PersonTaxReceiptsContext";
import { PersonStatusLogsContextProvider } from "../context/PersonStatusLogsContext";
import PersonStatusLog from "../components/PersonStatusLog";
import { ExportBtnContext } from "../context/ExportBtnContext";
import { PersonDetailContext } from "../context/PersonDetailsContext";

const PersonDetailPage = () => {
  const { setCurrentSection, setIsSpecificPerson } = useContext(
    CurrentSectionContext
  );
  const { personSection } = useContext(PersonSubsectionContext);
  const { exportBtn } = useContext(ExportBtnContext);
  const { person, setPerson } = useContext(PersonDetailContext);

  const rfcParam = useParams().rfc;

  const getPerson = async () => {
    const response = await fetchData("get", `/people/${rfcParam}`);
    const foundPerson = response.data.person;
    if (foundPerson.second_name) setPerson({ ...foundPerson });
    else setPerson({ ...foundPerson, second_name: "" });
  };

  useEffect(() => {
    setCurrentSection(1);
    setIsSpecificPerson(true);
    getPerson();
  }, []);
  return (
    <div>
      <div className="search-header">
        <div>
          <h2>{`${person.first_name} ${person.second_name} ${person.surname} ${person.second_surname}`}</h2>
          <h4>{person.rfc}</h4>
        </div>
        <button className="add-btn" ref={exportBtn}>
          Exportar Tabla
        </button>
      </div>
      <PersonSubsections />
      {personSection === 1 ? (
        <PersonTaxReceiptsContextProvider>
          <PersonTaxReceipt />
        </PersonTaxReceiptsContextProvider>
      ) : (
        <PersonStatusLogsContextProvider>
          <PersonStatusLog />
        </PersonStatusLogsContextProvider>
      )}
    </div>
  );
};

export default PersonDetailPage;
