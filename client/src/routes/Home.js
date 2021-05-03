import React, { useEffect, useContext, useState } from "react";
import PeopleList from "../components/PeopleList";
import { SearchContextProvider } from "../context/SearchContext";
import { PeopleContext } from "../context/PeopleContext";
import SearchForm from "../components/SearchForm";
import { fetchData } from "../functions/fetchData";

const Home = ({ isInitialSearch, setIsInitialSearch }) => {
  const { setPeople } = useContext(PeopleContext);
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

  useEffect(async () => {
    getAllPeople();
  }, []);
  return (
    <>
      <div className="search-header">
        <h2>Lista de Personas</h2>
        <button className="add-btn">Agregar Nueva Persona</button>
      </div>
      <SearchContextProvider>
        <SearchForm />
        {isInitialSearch && <PeopleList />}
      </SearchContextProvider>
    </>
  );
};

export default Home;
