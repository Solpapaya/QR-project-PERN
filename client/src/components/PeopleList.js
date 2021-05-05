import React, { useContext, useEffect } from "react";
import { PeopleContext } from "../context/PeopleContext";
import { SearchContext } from "../context/SearchContext";
import PeopleTable from "./PeopleTable";

const PeopleList = () => {
  const {
    isSearchSuccessful,
    statusFilter,
    departmentFilter,
    setIsSearchSuccessful,
  } = useContext(SearchContext);
  const { people, setFilteredPeople } = useContext(PeopleContext);

  const filterPeople = () => {
    let newPeople;
    switch (statusFilter) {
      case "active":
        newPeople = people.filter((person) => person.active === true);
        break;
      case "disabled":
        newPeople = people.filter((person) => person.active === false);
        break;
      default:
        newPeople = [...people];
        break;
    }
    if (departmentFilter === "all_areas") {
      newPeople = [...newPeople];
    } else {
      newPeople = newPeople.filter(
        (person) => person.department_name === departmentFilter
      );
    }
    if (newPeople.length === 0) setIsSearchSuccessful(false);
    else setIsSearchSuccessful(true);

    setFilteredPeople(newPeople);
  };

  useEffect(() => {
    filterPeople();
  }, [people, statusFilter, departmentFilter]);

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
