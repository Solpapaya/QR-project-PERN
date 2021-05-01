import React from "react";
import SearchPerson from "../components/SearchPerson";
import PeopleFilter from "./PeopleFilter";

const SearchForm = () => {
  return (
    <div className="search-inputs">
      <SearchPerson />
      <PeopleFilter />
    </div>
  );
};

export default SearchForm;
