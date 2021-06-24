import React, { useEffect, useContext } from "react";
import SearchForm from "./SearchForm";
import PeopleList from "./PeopleList";
import { fetchData } from "../../../global/functions/fetchData";
import { SearchContext } from "../context/SearchContext";

const People = () => {
  const { initialSearch, setInitialSearch, setPeople, setIsSearchSuccessful } =
    useContext(SearchContext);

  const getAllPeople = async () => {
    try {
      const response = await fetchData("get", "/people");
      setPeople(response.data.people);
      setIsSearchSuccessful(true);
    } catch (err) {
      // No users in database alert
      setIsSearchSuccessful(false);
    }
    setInitialSearch(true);
  };

  useEffect(() => {
    getAllPeople();
  }, []);

  return (
    <>
      {initialSearch && (
        <>
          <SearchForm />
          <PeopleList />
        </>
      )}
    </>
  );
};

export default People;
