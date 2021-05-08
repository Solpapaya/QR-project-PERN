import React, { useEffect, useContext, useState } from "react";
import PeopleList from "../components/PeopleList";
import { SearchContextProvider } from "../context/SearchContext";
import { PeopleContext } from "../context/PeopleContext";
import SearchForm from "../components/SearchForm";
import { fetchData } from "../functions/fetchData";
import { CurrentSectionContext } from "../context/CurrentSectionContext";
import SearchSubsections from "../components/SearchSubsections";
import { SearchSubsectionContext } from "../context/SearchSubsectionContext";
import { SearchTaxReceiptsContextProvider } from "../context/SearchTaxReceiptsContext";
import TaxReceipts from "../components/TaxReceipts";

const Home = ({ isInitialSearch, setIsInitialSearch }) => {
  const { setPeople } = useContext(PeopleContext);
  const { setCurrentSection } = useContext(CurrentSectionContext);
  const { searchSection, setSearchSection } = useContext(
    SearchSubsectionContext
  );
  const sections = ["Personas", "Comprobantes Fiscales", "Cambios de Estado"];

  const getAllPeople = async () => {
    // console.count("Fetching Data");
    try {
      const response = await fetchData("get", "/people");
      setPeople(response.data.people);
      setIsInitialSearch(true);
    } catch (err) {
      // No users in database alert
    }
  };

  useEffect(() => {
    setCurrentSection(1);
    getAllPeople();
  }, []);
  return (
    <>
      <div className="search-header">
        <h2>{`Lista de ${sections[searchSection - 1]}`}</h2>
        <button className="add-btn">Generar archivo</button>
      </div>
      <SearchSubsections />
      {searchSection === 1 ? (
        <SearchContextProvider>
          <SearchForm />
          {isInitialSearch && <PeopleList />}
        </SearchContextProvider>
      ) : searchSection === 2 ? (
        <SearchTaxReceiptsContextProvider>
          <TaxReceipts />
        </SearchTaxReceiptsContextProvider>
      ) : (
        "Status Logs"
      )}
    </>
  );
};

export default Home;
