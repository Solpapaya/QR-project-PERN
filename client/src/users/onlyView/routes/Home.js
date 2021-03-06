import React, { useEffect, useContext, useState, useRef } from "react";
import { SearchContextProvider } from "../context/SearchContext";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import SearchSubsections from "../components/SearchSubsections";
import { SearchSubsectionContext } from "../context/SearchSubsectionContext";
import { SearchTaxReceiptsContextProvider } from "../context/SearchTaxReceiptsContext";
// import TaxReceipts from "../components/TaxReceipts";
// import People from "../components/People";
// import StatusLogs from "../components/StatusLogs";
import { SearchStatusLogsContextProvider } from "../context/SearchStatusLogsContext";
import { ExportBtnContext } from "../context/ExportBtnContext";
import People from "../components/People";
import TaxReceipts from "../components/TaxReceipts";
import StatusLogs from "../components/StatusLogs";

const Home = () => {
  const { setCurrentSection } = useContext(CurrentSectionContext);

  const { searchSection } = useContext(SearchSubsectionContext);
  const sections = ["Personas", "Comprobantes Fiscales", "Cambios de Estado"];

  useEffect(() => {
    setCurrentSection(1);
  }, []);
  return (
    <>
      <div className="search-header">
        <h2>{`Lista de ${sections[searchSection - 1]}`}</h2>
      </div>
      <SearchSubsections />
      {searchSection === 1 ? (
        <SearchContextProvider>
          <People />
        </SearchContextProvider>
      ) : searchSection === 2 ? (
        <SearchTaxReceiptsContextProvider>
          <TaxReceipts />
        </SearchTaxReceiptsContextProvider>
      ) : (
        <SearchStatusLogsContextProvider>
          <StatusLogs />
        </SearchStatusLogsContextProvider>
      )}
    </>
  );
};

export default Home;
