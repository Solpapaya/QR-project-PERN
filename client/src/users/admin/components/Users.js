import React, { useEffect, useContext } from "react";
import SearchForm from "./SearchForm";
import UserList from "./UserList";
import { fetchData } from "../../../global/functions/fetchData";
import { SearchUsersContext } from "../context/SearchUsersContext";

const Users = () => {
  const { initialSearch, setInitialSearch, setUsers, setIsSearchSuccessful } =
    useContext(SearchUsersContext);

  const getAllUsers = async () => {
    try {
      const headers = { token: localStorage.token };
      const response = await fetchData("get", "/users", { headers });
      console.log({ response });
      setUsers(response.users);
      setIsSearchSuccessful(true);
    } catch (err) {
      console.log(err);
      // No users in database alert
      setIsSearchSuccessful(false);
    }
    setInitialSearch(true);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      {initialSearch && (
        <>
          {/* <SearchForm /> */}
          <UserList />
        </>
      )}
    </>
  );
};

export default Users;
