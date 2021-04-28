import React from "react";
import SearchPerson from "../components/SearchPerson";
import PeopleFilter from "./PeopleFilter";

const SearchForm = () => {
  return (
    <div style={{ display: "flex" }}>
      <SearchPerson />
      <PeopleFilter />
    </div>
  );
};

export default SearchForm;
