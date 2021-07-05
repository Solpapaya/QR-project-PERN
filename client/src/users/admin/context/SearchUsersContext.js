import React, { useState, createContext } from "react";

export const SearchUsersContext = createContext();

export const SearchUsersContextProvider = (props) => {
  const [isSearchSuccessful, setIsSearchSuccessful] = useState(true);
  const [initialSearch, setInitialSearch] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeOfUserFilter, setTypeOfUserFilter] = useState("all_areas");
  const [sort, setSort] = useState("surname");

  return (
    <SearchUsersContext.Provider
      value={{
        isSearchSuccessful,
        setIsSearchSuccessful,
        initialSearch,
        setInitialSearch,
        users,
        setUsers,
        filteredUsers,
        setFilteredUsers,
        statusFilter,
        setStatusFilter,
        typeOfUserFilter,
        setTypeOfUserFilter,
        sort,
        setSort,
      }}
    >
      {props.children}
    </SearchUsersContext.Provider>
  );
};
