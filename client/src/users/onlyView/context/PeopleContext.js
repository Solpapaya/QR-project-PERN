import React, { useState, createContext } from "react";

export const PeopleContext = createContext();

export const PeopleContextProvider = (props) => {
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState(people);
  return (
    <PeopleContext.Provider
      value={{
        people,
        setPeople,
        filteredPeople,
        setFilteredPeople,
      }}
    >
      {props.children}
    </PeopleContext.Provider>
  );
};
