import React, { useContext, useEffect } from "react";
import { PeopleContext } from "../context/PeopleContext";
import { SearchContext } from "../context/SearchContext";
import PeopleTable from "./PeopleTable";

const PeopleList = () => {
  const { isSearchSuccessful, filter, setIsSearchSuccessful } = useContext(
    SearchContext
  );
  const { people, setFilteredPeople } = useContext(PeopleContext);

  const filterPeople = () => {
    let newPeople;
    switch (filter) {
      case "active":
        newPeople = people.filter((person) => person.active === true);
        break;
      case "inactive":
        newPeople = people.filter((person) => person.active === false);
        break;
      default:
        newPeople = [...people];
        break;
    }
    if (newPeople.length === 0) setIsSearchSuccessful(false);
    else setIsSearchSuccessful(true);

    setFilteredPeople(newPeople);
  };

  useEffect(() => {
    filterPeople();
  }, [people, filter]);

  // useEffect(() => {
  //   console.count("PeopleList rendered");
  // });

  return (
    <div className="table-container">
      {isSearchSuccessful ? <PeopleTable /> : "No Matches"}
    </div>
  );
};

export default PeopleList;
