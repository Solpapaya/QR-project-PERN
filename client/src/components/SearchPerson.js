import React, { useState, useContext } from "react";
import { PeopleContext } from "../context/PeopleContext";
import { SearchContext } from "../context/SearchContext";
import { fetchData } from "../functions/fetchData";

const SearchPerson = () => {
  const [search, setSearch] = useState("");
  const { setIsSearchSuccessful } = useContext(SearchContext);
  const { setPeople } = useContext(PeopleContext);

  const onChangeHandler = async (e) => {
    setSearch(e.target.value);
    let url = `/people?search=${e.target.value}`;
    try {
      const response = await fetchData("get", url);
      setPeople(response.data.people);
      setIsSearchSuccessful(true);
    } catch (err) {
      setPeople([]);
      setIsSearchSuccessful(false);
    }
  };

  return (
    <div className="mb-4 text-center">
      <input
        type="text"
        value={search}
        onChange={onChangeHandler}
        placeholder="Nombre o RFC"
      />
    </div>
  );
};

export default SearchPerson;
