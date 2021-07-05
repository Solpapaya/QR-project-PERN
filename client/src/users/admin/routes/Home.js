import React, { useEffect, useContext, useState, useRef } from "react";
import { SearchContextProvider } from "../context/SearchContext";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import SearchSubsections from "../components/SearchSubsections";
import { SearchSubsectionContext } from "../context/SearchSubsectionContext";
import { SearchTaxReceiptsContextProvider } from "../context/SearchTaxReceiptsContext";
import TaxReceipts from "../components/TaxReceipts";
import People from "../components/People";
import StatusLogs from "../components/StatusLogs";
import { SearchStatusLogsContextProvider } from "../context/SearchStatusLogsContext";
import { ExportBtnContext } from "../context/ExportBtnContext";
import { SearchUsersContextProvider } from "../context/SearchUsersContext";
import Users from "../components/Users";

const Home = () => {
  const { setCurrentSection, setIsEditPersonSection } = useContext(
    CurrentSectionContext
  );

  const { searchSection } = useContext(SearchSubsectionContext);
  const sections = [
    "Personas",
    "Comprobantes Fiscales",
    "Cambios de Estado",
    "Usuarios",
  ];
  const { exportBtn } = useContext(ExportBtnContext);

  useEffect(() => {
    setCurrentSection(1);
    setIsEditPersonSection(false);
  }, []);
  return (
    <>
      <div className="search-header">
        <h2>{`Lista de ${sections[searchSection - 1]}`}</h2>
        <button className="add-btn" ref={exportBtn}>
          Exportar Tabla
        </button>
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
      ) : searchSection === 3 ? (
        <SearchStatusLogsContextProvider>
          <StatusLogs />
        </SearchStatusLogsContextProvider>
      ) : (
        <SearchUsersContextProvider>
          <Users />
        </SearchUsersContextProvider>
      )}
    </>
  );
};

export default Home;
