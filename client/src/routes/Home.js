import React, { useEffect, useContext, useState } from "react";
import Header from "../components/Header";
import PeopleList from "../components/PeopleList";
import { SearchContextProvider } from "../context/SearchContext";
import PeopleFinder from "../apis/PeopleFinder";
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
    <div>
      <Header />
      <SearchContextProvider>
        <SearchForm />
        {isInitialSearch && <PeopleList />}
      </SearchContextProvider>
    </div>
  );
};

export default Home;
